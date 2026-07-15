"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type LeadState = { ok?: boolean; error?: string };

export async function createLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const supabase = await createClient();
  const postId = Number(formData.get("post_id"));
  const name = (formData.get("name") as string)?.trim() || "";
  const phone = (formData.get("phone") as string)?.trim() || "";
  const message = (formData.get("message") as string)?.trim() || "";
  if (!postId) return { error: "Thiếu thông tin tin đăng." };
  if (!phone) return { error: "Vui lòng nhập số điện thoại." };
  const { data: post } = await supabase.from("web_posts").select("id, owner").eq("id", postId).maybeSingle();
  if (!post) return { error: "Tin đăng không tồn tại." };
  const { error } = await supabase.from("web_post_leads").insert({
    post_id: postId, owner: post.owner, name, phone, message, da_doc: false,
  });
  if (error) return { error: error.message };
  return { ok: true };
}

export async function markLeadRead(id: number): Promise<LeadState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Vui lòng đăng nhập." };
  const { error } = await supabase.from("web_post_leads").update({ da_doc: true }).eq("id", id).eq("owner", user.id);
  if (error) return { error: error.message };
  revalidatePath("/tai-khoan/khach-hang");
  return { ok: true };
}
