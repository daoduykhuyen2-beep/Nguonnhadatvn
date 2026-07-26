"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getEffectivePrice, SEPAY_PREFIX } from "@/lib/plans";
import { getPlanMerged, toDbCode } from "@/lib/plans-server";

export type ActionState = { error?: string; ok?: boolean; id?: number };

function collect(formData: FormData) {
  const anhRaw = formData.get("anh") as string;
  let anh: string[] = [];
  try { anh = anhRaw ? JSON.parse(anhRaw) : []; } catch { anh = []; }
  return {
    title: (formData.get("title") as string)?.trim() || "",
    loai: (formData.get("loai") as string) || "",
    giao_dich: (formData.get("giao_dich") as string) || "ban",
    quan: (formData.get("quan") as string)?.trim() || "",
    phuong: (formData.get("phuong") as string)?.trim() || "",
    duong: (formData.get("duong") as string)?.trim() || "",
    so_nha: (formData.get("so_nha") as string)?.trim() || "",
    gia: (formData.get("gia") as string)?.trim() || "",
    dien_tich: (formData.get("dien_tich") as string)?.trim() || "",
    chieu_ngang: (formData.get("chieu_ngang") as string)?.trim() || "",
    chieu_dai: (formData.get("chieu_dai") as string)?.trim() || "",
    so_tang: (formData.get("so_tang") as string)?.trim() || "",
    contact_name: (formData.get("contact_name") as string)?.trim() || "",
    contact_phone: (formData.get("contact_phone") as string)?.trim() || "",
    mota: (formData.get("mota") as string)?.trim() || "",
    video: (formData.get("video") as string)?.trim() || "",
    anh_bia: (formData.get("anh_bia") as string) || (anh[0] || ""),
    anh,
    nang_cap: (formData.get("nang_cap") as string) || "thuong",
  };
}

export async function createPost(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Vui lòng đăng nhập để đăng tin." };
  const d = collect(formData);
  if (!d.title) return { error: "Vui lòng nhập tiêu đề." };
  if (!d.contact_phone) return { error: "Vui lòng nhập số điện thoại liên hệ." };
  // Kiểm tra và trừ lượt đăng tin theo gói (admin được miễn). Hết lượt sẽ báo lỗi và không tạo tin.
  const { data: soNgay, error: quotaError } = await supabase.rpc("dung_kho_tin", { p_loai: "thuong" });
  if (quotaError) return { error: quotaError.message || "Bạn đã hết lượt đăng tin. Vui lòng mua thêm gói để tiếp tục." };
  const soNgayValid = Number(soNgay) || 15;
  const ngayHetHan = new Date(Date.now() + soNgayValid * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase.from("web_posts").insert({
    owner: user.id,
    title: d.title, loai: d.loai, giao_dich: d.giao_dich, quan: d.quan, phuong: d.phuong, duong: d.duong, so_nha: d.so_nha,
    gia: d.gia, dien_tich: d.dien_tich, chieu_ngang: d.chieu_ngang, chieu_dai: d.chieu_dai,
    so_tang: d.so_tang, contact_name: d.contact_name, contact_phone: d.contact_phone,
    mota: d.mota, video: d.video, anh: d.anh, anh_bia: d.anh_bia,
    status: "thuong", trang_thai: "duyet", ngay_het_han: ngayHetHan,
  }).select("id").single();
  if (error || !data) return { error: error?.message || "Không tạo được tin." };
  revalidatePath("/tai-khoan/tin-cua-toi");
  revalidatePath("/tin-dang");

  // Nếu khách chọn nâng cấp tin (VIP Vàng / Kim Cương) -> tạo đơn và chuyển tới thanh toán.
  const upgrade = d.nang_cap;
  if (upgrade === "tin_vip_49" || upgrade === "tin_kc_99") {
    const plan = await getPlanMerged(upgrade);
    const price = plan ? getEffectivePrice(plan) : 0;
    if (plan && price > 0) {
      const { data: pay } = await supabase.from("payments").insert({
        user_id: user.id,
        plan_code: toDbCode(plan.code),
        amount: price,
        status: "pending",
        post_id: data.id,
        transfer_content: SEPAY_PREFIX + "GOI",
      }).select("id").single();
      if (pay) {
        await supabase.from("payments").update({ transfer_content: SEPAY_PREFIX + "GOI" + pay.id }).eq("id", pay.id);
        redirect("/thanh-toan/" + pay.id);
      }
    }
  }

  redirect("/tai-khoan/tin-cua-toi?created=1");
}

export async function updatePost(id: number, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Vui lòng đăng nhập." };
  const d = collect(formData);
  if (!d.title) return { error: "Vui lòng nhập tiêu đề." };
  const { error } = await supabase.from("web_posts").update({
    title: d.title, loai: d.loai, giao_dich: d.giao_dich, quan: d.quan, phuong: d.phuong, duong: d.duong,
    gia: d.gia, dien_tich: d.dien_tich, chieu_ngang: d.chieu_ngang, chieu_dai: d.chieu_dai,
    so_tang: d.so_tang, contact_name: d.contact_name, contact_phone: d.contact_phone,
    mota: d.mota, video: d.video, anh: d.anh, anh_bia: d.anh_bia,
  }).eq("id", id).eq("owner", user.id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/tin-dang");
  revalidatePath("/tin-dang/" + id);
  revalidatePath("/tai-khoan/tin-cua-toi");
  redirect("/tai-khoan/tin-cua-toi?updated=1");
}

export async function deletePost(id: number): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Vui lòng đăng nhập." };
  const { error } = await supabase.from("web_posts").delete().eq("id", id).eq("owner", user.id);
  if (error) return { error: error.message };
  revalidatePath("/tai-khoan/tin-cua-toi");
  revalidatePath("/tin-dang");
  return { ok: true };
}
