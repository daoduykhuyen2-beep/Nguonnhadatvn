"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type AccountState = { ok?: boolean; error?: string };

export async function updateVat(_prev: AccountState, formData: FormData): Promise<AccountState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Vui lòng đăng nhập." };
  const { error } = await supabase.from("profiles").update({
    vat_company: (formData.get("vat_company") as string)?.trim() || null,
    vat_tax_code: (formData.get("vat_tax_code") as string)?.trim() || null,
    vat_address: (formData.get("vat_address") as string)?.trim() || null,
    vat_email: (formData.get("vat_email") as string)?.trim() || null,
  }).eq("id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/tai-khoan/hoa-don-vat");
  return { ok: true };
}

export async function changePassword(_prev: AccountState, formData: FormData): Promise<AccountState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Vui lòng đăng nhập." };
  const pw = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;
  if (!pw || pw.length < 6) return { error: "Mật khẩu phải có ít nhất 6 ký tự." };
  if (pw !== confirm) return { error: "Mật khẩu xác nhận không khớp." };
  const { error } = await supabase.auth.updateUser({ password: pw });
  if (error) return { error: error.message };
  return { ok: true };
}
