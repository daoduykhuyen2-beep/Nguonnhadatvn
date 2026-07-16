"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionState = { error?: string; ok?: boolean; id?: number };

function collect(formData: FormData) {
  const anhRaw = formData.get("anh") as string;
  let anh: string[] = [];
  try { anh = anhRaw ? JSON.parse(anhRaw) : []; } catch { anh = []; }
  return {
    title: (formData.get("title") as string)?.trim() || "",
    loai: (formData.get("loai") as string) || "",
    quan: (formData.get("quan") as string)?.trim() || "",
    phuong: (formData.get("phuong") as string)?.trim() || "",
    duong: (formData.get("duong") as string)?.trim() || "",
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
  };
}

export async function createPost(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Vui lòng đăng nhập để đăng tin." };
  const d = collect(formData);
  if (!d.title) return { error: "Vui lòng nhập tiêu đề." };
  if (!d.contact_phone) return { error: "Vui lòng nhập số điện thoại liên hệ." };
  const { data, error } = await supabase.from("web_posts").insert({
    owner: user.id,
    title: d.title, loai: d.loai, quan: d.quan, phuong: d.phuong, duong: d.duong,
    gia: d.gia, dien_tich: d.dien_tich, chieu_ngang: d.chieu_ngang, chieu_dai: d.chieu_dai,
    so_tang: d.so_tang, contact_name: d.contact_name, contact_phone: d.contact_phone,
    mota: d.mota, video: d.video, anh: d.anh, anh_bia: d.anh_bia,
    status: "thuong", trang_thai: "duyet",
  }).select("id").single();
  if (error) return { error: error.message };
  revalidatePath("/tai-khoan/tin-cua-toi");
  revalidatePath("/tin-dang");
  redirect("/tai-khoan/tin-cua-toi?created=1");
}

export async function updatePost(id: number, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Vui lòng đăng nhập." };
  const d = collect(formData);
  if (!d.title) return { error: "Vui lòng nhập tiêu đề." };
  const { error } = await supabase.from("web_posts").update({
    title: d.title, loai: d.loai, quan: d.quan, phuong: d.phuong, duong: d.duong,
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
