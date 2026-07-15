"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isStaff } from "@/lib/roles";

export type VideoState = { ok?: boolean; error?: string };

async function guard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, allowed: false };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).maybeSingle();
  return { supabase, allowed: isStaff(profile) };
}

export async function saveHomeVideo(_prev: VideoState, formData: FormData): Promise<VideoState> {
  const { supabase, allowed } = await guard();
  if (!allowed) return { error: "Không có quyền." };
  const id = String(formData.get("id") || "").trim();
  const payload = {
    title: (formData.get("title") as string)?.trim() || null,
    tiktok_url: (formData.get("tiktok_url") as string)?.trim() || "",
    sort_order: Number(formData.get("sort_order") || 0),
    active: formData.get("active") === "on" || formData.get("active") === "true",
  };
  if (!payload.tiktok_url) return { error: "Vui lòng nhập link video." };
  const q = id ? supabase.from("home_videos").update(payload).eq("id", Number(id)) : supabase.from("home_videos").insert(payload);
  const { error } = await q;
  if (error) return { error: error.message };
  revalidatePath("/admin/quan-ly-video");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteHomeVideo(formData: FormData): Promise<void> {
  const { supabase, allowed } = await guard();
  if (!allowed) return;
  await supabase.from("home_videos").delete().eq("id", Number(formData.get("id")));
  revalidatePath("/admin/quan-ly-video");
  revalidatePath("/");
}
