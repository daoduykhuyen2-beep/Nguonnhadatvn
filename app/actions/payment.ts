"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEffectivePrice, SEPAY_PREFIX } from "@/lib/plans";
import { getPlanMerged, toDbCode } from "@/lib/plans-server";

// Tạo đơn mua gói / đẩy tin (pending) rồi chuyển tới trang thanh toán.
export async function createOrder(formData: FormData): Promise<void> {
  const planCode = String(formData.get("plan") || "").toLowerCase();
  const postIdRaw = String(formData.get("post_id") || "").trim();
  const postId = postIdRaw ? Number(postIdRaw) : null;

  const plan = await getPlanMerged(planCode);
  const price = plan ? getEffectivePrice(plan) : 0;
  if (!plan || price <= 0) redirect("/bang-gia?error=plan");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/bang-gia");

  const { data, error } = await supabase.from("payments").insert({
    user_id: user!.id,
    plan_code: toDbCode(plan!.code),
    amount: price,
    status: "pending",
    post_id: postId,
    transfer_content: SEPAY_PREFIX + "GOI",
  }).select("id").single();
  if (error || !data) redirect("/bang-gia?error=order");

  // Nội dung chuyển khoản gắn mã đơn để đối soát chắc chắn.
  const content = SEPAY_PREFIX + "GOI" + data.id;
  await supabase.from("payments").update({ transfer_content: content }).eq("id", data.id);
  redirect("/thanh-toan/" + data.id);
}

// Tạo đơn nạp tiền vào ví.
export async function createTopup(formData: FormData): Promise<void> {
  const amount = Number(String(formData.get("amount") || "0").replace(/[^0-9]/g, ""));
  if (!amount || amount < 10000) redirect("/tai-khoan/nap-tien?error=amount");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/tai-khoan/nap-tien");

  const { data, error } = await supabase.from("payments").insert({
    user_id: user!.id,
    plan_code: "NAPTIEN",
    amount,
    status: "pending",
    transfer_content: SEPAY_PREFIX + "NAP",
  }).select("id").single();
  if (error || !data) redirect("/tai-khoan/nap-tien?error=order");

  const content = SEPAY_PREFIX + "NAP" + data.id;
  await supabase.from("payments").update({ transfer_content: content }).eq("id", data.id);
  redirect("/thanh-toan/" + data.id);
}


// Thanh toan don hang bang so du tai khoan (uu tien so du truoc).
export async function payFromWallet(formData: FormData): Promise<void> {
  const id = Number(String(formData.get("id") || "0"));
  if (!id) redirect("/tai-khoan");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap");
  const { data, error } = await supabase.rpc("pay_from_wallet", { p_payment_id: id });
  if (error) redirect("/thanh-toan/" + id + "?vi=loi");
  const res = data as { ok?: boolean; reason?: string } | null;
  if (!res || !res.ok) {
    if (res && res.reason === "insufficient") redirect("/thanh-toan/" + id + "?vi=thieu");
    redirect("/thanh-toan/" + id + "?vi=loi");
  }
  redirect("/thanh-toan/" + id + "?vi=ok");
}
