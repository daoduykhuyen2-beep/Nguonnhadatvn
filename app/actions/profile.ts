"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ProfileState = { ok?: boolean; error?: string };

export async function updateProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Vui lòng đăng nhập." };
  const payload: Record<string, unknown> = {
    full_name: (formData.get("full_name") as string)?.trim() || null,
    phone: (formData.get("phone") as string)?.trim() || null,
    address: (formData.get("address") as string)?.trim() || null,
    bio: (formData.get("bio") as string)?.trim() || null,
  };
  const gender = formData.get("gender") as string;
  if (gender) payload.gender = gender;
  const age = formData.get("age") as string;
  if (age) payload.age = Number(age) || null;
  const { error } = await supabase.from("profiles").update(payload).eq("id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/tai-khoan");
  revalidatePath("/tai-khoan/thong-tin");
  return { ok: true };
}

export async function updateAvatar(avatarUrl: string): Promise<ProfileState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Vui lòng đăng nhập." };
  const { error } = await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/tai-khoan/thong-tin");
  return { ok: true };
}
