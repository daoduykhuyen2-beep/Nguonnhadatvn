"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isStaff } from "@/lib/roles";

export type NapState = { ok?: boolean; error?: string };

// Admin cộng tiền / trừ tiền thủ công vào ví thành viên (đối soát tay).
export async function adminAdjustBalance(_prev: NapState, formData: FormData): Promise<NapState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Chưa đăng nhập." };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).maybeSingle();
  if (!isStaff(profile)) return { error: "Không có quyền." };

  const userId = String(formData.get("user_id") || "").trim();
  const amount = Number(formData.get("amount") || 0);
  if (!userId || !amount) return { error: "Thiếu thông tin." };

  const { data: target } = await supabase.from("profiles").select("so_du, tong_nap").eq("id", userId).maybeSingle();
  if (!target) return { error: "Không tìm thấy thành viên." };
  const newBalance = (target.so_du || 0) + amount;
  const update: Record<string, unknown> = { so_du: newBalance };
  if (amount > 0) update.tong_nap = (target.tong_nap || 0) + amount;
  const { error } = await supabase.from("profiles").update(update).eq("id", userId);
  if (error) return { error: error.message };

  await supabase.from("notifications").insert({
    target_user: userId,
    tieu_de: amount > 0 ? "Cộng tiền vào ví" : "Điều chỉnh số dư",
    noi_dung: (amount > 0 ? "Ví của bạn được cộng " : "Ví của bạn bị trừ ") + Math.abs(amount).toLocaleString("vi-VN") + "đ bởi quản trị viên.",
    loai: "tai_chinh",
  }).then(() => {}, () => {});

  revalidatePath("/admin/nap-tien");
  revalidatePath("/admin/thanh-vien");
  return { ok: true };
}
