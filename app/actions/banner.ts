"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isStaff } from "@/lib/roles";

export type BannerState = { ok?: boolean; error?: string };

async function guard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, allowed: false };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).maybeSingle();
  return { supabase, allowed: isStaff(profile) };
}

export async function saveBanner(_prev: BannerState, formData: FormData): Promise<BannerState> {
  const { supabase, allowed } = await guard();
  if (!allowed) return { error: "Không có quyền." };
  const id = String(formData.get("id") || "").trim();
  const payload = {
    image_url: ((formData.get("image_url") as string)?.trim() || (formData.get("image_url_manual") as string)?.trim() || ""),
    title: (formData.get("title") as string)?.trim() || null,
    subtitle: (formData.get("subtitle") as string)?.trim() || null,
    link_url: (formData.get("link_url") as string)?.trim() || null,
    sort_order: Number(formData.get("sort_order") || 0),
    active: formData.get("active") === "on" || formData.get("active") === "true",
  };
  if (!payload.image_url) return { error: "Vui lòng nhập ảnh banner." };
  const q = id ? supabase.from("banners").update(payload).eq("id", Number(id)) : supabase.from("banners").insert(payload);
  const { error } = await q;
  if (error) return { error: error.message };
  revalidatePath("/admin/banner");
  revalidatePath("/");
  return { ok: true };
}

export async function toggleBanner(formData: FormData): Promise<void> {
  const { supabase, allowed } = await guard();
  if (!allowed) return;
  const id = Number(formData.get("id"));
  const active = formData.get("active") === "true";
  await supabase.from("banners").update({ active: !active }).eq("id", id);
  revalidatePath("/admin/banner");
  revalidatePath("/");
}

export async function deleteBanner(formData: FormData): Promise<void> {
  const { supabase, allowed } = await guard();
  if (!allowed) return;
  await supabase.from("banners").delete().eq("id", Number(formData.get("id")));
  revalidatePath("/admin/banner");
  revalidatePath("/");
}
