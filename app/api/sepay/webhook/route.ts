import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getPlan, SEPAY_PREFIX } from "@/lib/plans";
import { fromDbCode } from "@/lib/plans-server";

// SePay gọi webhook này mỗi khi có tiền vào tài khoản.
// Xác thực bằng header "Authorization: Apikey <key>".
// Dùng SERVICE ROLE để bỏ qua RLS.
export const dynamic = "force-dynamic";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

const norm = (s: string) => s.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

export async function POST(req: NextRequest) {
  // 1) Xác thực API key
  const auth = (req.headers.get("authorization") || "").trim();
  const key = (process.env.SEPAY_WEBHOOK_API_KEY || "").trim();
  const provided = auth.replace(/^Apikey\s+/i, "").trim();
  if (!key || provided !== key) {
    return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const transferType = body.transferType || body.transfer_type;
  if (transferType && transferType !== "in") {
    return NextResponse.json({ success: true, skipped: "not incoming" });
  }

  const content: string = String(body.content || body.description || "");
  const amount: number = Number(body.transferAmount || body.amount || body.transfer_amount || 0);
  const sepayRef: string = String(body.referenceCode || body.id || body.reference_number || "");
  const supabase = admin();

  // 2) Lưu giao dịch thô để đối soát
  await supabase.from("sepay_transactions").insert({
    sepay_id: Number(body.id) || null,
    gateway: body.gateway || null,
    transaction_date: body.transactionDate || body.transaction_date || null,
    account_number: body.accountNumber || body.account_number || null,
    sub_account: body.subAccount || body.sub_account || null,
    code: body.code || null,
    content,
    transfer_type: transferType || null,
    transfer_amount: amount || null,
    accumulated: Number(body.accumulated) || null,
    reference_code: sepayRef || null,
    description: body.description || null,
    raw: body,
  }).then(() => {}, () => {});

  // 3) Tìm đơn: nội dung có dạng NDVGOI<id> hoặc NDVNAP<id>
  const c = norm(content);
  const prefix = norm(SEPAY_PREFIX);
  const m = c.match(new RegExp(prefix + "(GOI|NAP)(\\d+)"));
  let order: any = null;
  if (m) {
    const { data } = await supabase.from("payments").select("*").eq("id", Number(m[2])).maybeSingle();
    order = data;
  }
  if (!order) {
    // Dự phòng: khớp theo transfer_content của các đơn pending
    const { data: pendings } = await supabase.from("payments").select("*")
      .eq("status", "pending").order("created_at", { ascending: false }).limit(200);
    order = (pendings || []).find((p: any) => p.transfer_content && c.includes(norm(p.transfer_content)));
  }
  if (!order) {
    return NextResponse.json({ success: true, matched: false });
  }

  // 4) Đủ tiền?
  if (amount < order.amount) {
    return NextResponse.json({ success: true, matched: true, paid: false });
  }

  // 5) Đánh dấu paid (idempotent: chỉ đơn đang pending mới cập nhật được)
  const { data: paidRows, error: payErr } = await supabase.from("payments")
    .update({ status: "paid", paid_at: new Date().toISOString(), sepay_ref: sepayRef })
    .eq("id", order.id).eq("status", "pending").select("id");
  if (payErr) return NextResponse.json({ success: false, error: "db update failed" }, { status: 500 });
  if (!paidRows || paidRows.length === 0) {
    return NextResponse.json({ success: true, matched: true, alreadyProcessed: true });
  }

  // 6) Áp dụng theo loại đơn
  if (order.plan_code === "NAPTIEN") {
    const { error } = await supabase.rpc("apply_topup", { p_payment_id: order.id });
    if (error) return NextResponse.json({ success: false, error: "topup failed" }, { status: 500 });
    await supabase.from("notifications").insert({
      user_id: order.user_id,
      tieu_de: "Nạp tiền thành công",
      noi_dung: "Bạn đã nạp thành công " + Number(order.amount).toLocaleString("vi-VN") + "đ vào ví.",
      loai: "tai_chinh",
    }).then(() => {}, () => {});
    return NextResponse.json({ success: true, matched: true, paid: true });
  }

  const uiCode = fromDbCode(order.plan_code) || "";
  const plan = getPlan(uiCode);
  const isMembership = plan?.group === "hoi_vien";

  if (isMembership) {
    const { error } = await supabase.rpc("apply_membership", {
      p_user_id: order.user_id, p_plan_code: order.plan_code, p_days: plan?.days || 30,
    });
    if (error) return NextResponse.json({ success: false, error: "membership failed" }, { status: 500 });
  } else if (order.post_id) {
    const { error } = await supabase.rpc("apply_post_plan", { p_payment_id: order.id });
    if (error) return NextResponse.json({ success: false, error: "post plan failed" }, { status: 500 });
  }

  await supabase.from("notifications").insert({
    user_id: order.user_id,
    tieu_de: "Đăng ký gói thành công",
    noi_dung: "Đơn " + order.plan_code + " đã được kích hoạt. Cảm ơn bạn!",
    loai: "goi_dich_vu",
  }).then(() => {}, () => {});

  return NextResponse.json({ success: true, matched: true, paid: true });
}
