"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isAdmin, isStaff } from "@/lib/roles";

export type AdminState = { ok?: boolean; error?: string };

async function guard(staffOnly = true) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, allowed: false, admin: false };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).maybeSingle();
  return { supabase, allowed: staffOnly ? isStaff(profile) : isAdmin(profile), admin: isAdmin(profile) };
}

// ---- Tin đăng ----
export async function adminSetPostState(id: number, trang_thai: string): Promise<AdminState> {
  const { supabase, allowed } = await guard();
  if (!allowed) return { error: "Không có quyền." };
  const { error } = await supabase.from("web_posts").update({ trang_thai }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/bai-dang");
  revalidatePath("/tin-dang");
  return { ok: true };
}

export async function adminSetPostTier(id: number, status: string): Promise<AdminState> {
  const { supabase, allowed } = await guard();
  if (!allowed) return { error: "Không có quyền." };
  const { error } = await supabase.from("web_posts").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/bai-dang");
  return { ok: true };
}

export async function adminDeletePost(id: number): Promise<AdminState> {
  const { supabase, allowed } = await guard();
  if (!allowed) return { error: "Không có quyền." };
  const { error } = await supabase.from("web_posts").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/bai-dang");
  return { ok: true };
}

// ---- Thành viên ----
export async function adminUpdateMember(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const { supabase, allowed } = await guard();
  if (!allowed) return { error: "Không có quyền." };
  const id = String(formData.get("id"));
  const payload: Record<string, unknown> = {};
  const tier = formData.get("membership_tier") as string;
  if (tier) payload.membership_tier = tier;
  const soDu = formData.get("so_du") as string;
  if (soDu !== null && soDu !== "") payload.so_du = Number(soDu);
  const giamGia = formData.get("giam_gia") as string;
  if (giamGia !== null && giamGia !== "") payload.giam_gia = Number(giamGia);
  const { error } = await supabase.from("profiles").update(payload).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/thanh-vien");
  return { ok: true };
}

export async function adminSetRole(userId: string, role: string): Promise<AdminState> {
  const { supabase, admin } = await guard(false);
  if (!admin) return { error: "Chỉ quản trị viên mới đổi được vai trò." };
  const { error } = await supabase.from("profiles").update({ role, is_admin: role === "admin" }).eq("id", userId);
  if (error) return { error: error.message };
  revalidatePath("/admin/phan-quyen");
  return { ok: true };
}

// ---- Tin tức ----
export async function adminSaveNews(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const { supabase, allowed } = await guard();
  if (!allowed) return { error: "Không có quyền." };
  const id = String(formData.get("id") || "").trim();
  const payload = {
    tieu_de: (formData.get("tieu_de") as string)?.trim() || "",
    mo_ta: (formData.get("mo_ta") as string)?.trim() || null,
    noi_dung: (formData.get("noi_dung") as string)?.trim() || null,
    anh_bia: (formData.get("anh_bia") as string)?.trim() || null,
    loai: (formData.get("loai") as string)?.trim() || "tin_tuc",
    video_url: (formData.get("video_url") as string)?.trim() || null,
  };
  if (!payload.tieu_de) return { error: "Vui lòng nhập tiêu đề." };
  const q = id ? supabase.from("news").update(payload).eq("id", id) : supabase.from("news").insert(payload);
  const { error } = await q;
  if (error) return { error: error.message };
  revalidatePath("/admin/tin-tuc");
  revalidatePath("/tin-tuc");
  return { ok: true };
}

export async function adminDeleteNews(id: string): Promise<AdminState> {
  const { supabase, allowed } = await guard();
  if (!allowed) return { error: "Không có quyền." };
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/tin-tuc");
  return { ok: true };
}

// ---- Thông báo ----
export async function adminSendNotification(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const { supabase, allowed } = await guard();
  if (!allowed) return { error: "Không có quyền." };
  const target = String(formData.get("target_user") || "").trim();
  const payload = {
    tieu_de: (formData.get("tieu_de") as string)?.trim() || "",
    noi_dung: (formData.get("noi_dung") as string)?.trim() || "",
    loai: (formData.get("loai") as string)?.trim() || "he_thong",
    link: (formData.get("link") as string)?.trim() || null,
    target_user: target || null,
  };
  if (!payload.tieu_de) return { error: "Vui lòng nhập tiêu đề." };
  const { error } = await supabase.from("notifications").insert(payload);
  if (error) return { error: error.message };
  revalidatePath("/admin/thong-bao");
  return { ok: true };
}

// ---- Hỗ trợ tài khoản thành viên (khóa/mở khóa + gửi email đặt lại mật khẩu) ----
export async function adminLockMember(userId: string, locked: boolean): Promise<AdminState> {
  const { supabase, allowed } = await guard();
  if (!allowed) return { error: "Không có quyền." };
  const { error } = await supabase.from("profiles").update({ locked }).eq("id", userId);
  if (error) return { error: error.message };
  revalidatePath("/admin/thanh-vien");
  return { ok: true };
}

export async function adminSendPasswordReset(email: string): Promise<AdminState> {
  const { supabase, allowed } = await guard();
  if (!allowed) return { error: "Không có quyền." };
  const clean = (email || "").trim();
  if (!clean) return { error: "Thành viên chưa có email." };
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nguonnhadatvn.vn";
  const { error } = await supabase.auth.resetPasswordForEmail(clean, {
    redirectTo: origin + "/auth/callback?next=/dat-lai-mat-khau",
  });
  if (error) return { error: error.message };
  return { ok: true };
}
