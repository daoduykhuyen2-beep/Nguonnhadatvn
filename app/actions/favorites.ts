"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type FavoriteState = { active?: boolean; error?: string };

export async function toggleFavorite(postId: number): Promise<FavoriteState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Vui lòng đăng nhập để lưu tin." };
  const { data: existing } = await supabase.from("favorites")
    .select("id").eq("user_id", user.id).eq("post_id", postId).maybeSingle();
  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    revalidatePath("/tai-khoan/tin-yeu-thich");
    return { active: false };
  }
  const { error } = await supabase.from("favorites").insert({ user_id: user.id, post_id: postId });
  if (error) return { error: error.message };
  revalidatePath("/tai-khoan/tin-yeu-thich");
  return { active: true };
}
