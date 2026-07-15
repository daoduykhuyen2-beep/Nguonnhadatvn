"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isStaff } from "@/lib/roles";

export type PlanState = { ok?: boolean; error?: string };

export async function adminSavePlanOverride(_prev: PlanState, formData: FormData): Promise<PlanState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Chưa đăng nhập." };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).maybeSingle();
  if (!isStaff(profile)) return { error: "Không có quyền." };

  const code = String(formData.get("code") || "").trim();
  if (!code) return { error: "Thiếu mã gói." };
  const num = (k: string) => { const v = formData.get(k) as string; return v === null || v === "" ? null : Number(v); };
  const payload = {
    code,
    name: (formData.get("name") as string)?.trim() || null,
    price: num("price"),
    market_price: num("market_price"),
    promo_price: num("promo_price"),
    promo_label: (formData.get("promo_label") as string)?.trim() || null,
    promo_until: (formData.get("promo_until") as string)?.trim() || null,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("plan_overrides").upsert(payload, { onConflict: "code" });
  if (error) return { error: error.message };
  revalidatePath("/admin/bang-gia");
  revalidatePath("/bang-gia");
  return { ok: true };
}
