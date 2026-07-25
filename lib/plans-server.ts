import { createClient } from "@/lib/supabase/server";
import { PLANS, getPlan, type Plan } from "@/lib/plans";

// Map mã gói ở UI (chữ thường) sang mã chuẩn mà các hàm DB (apply_post_plan/apply_membership) yêu cầu.
const DB_CODE: Record<string, string> = {
  tin_vip_49: "VIP_VANG",
  tin_kc_99: "VIP_KC",
  dt_thoai_mai: "DT_THOAIMAI",
  hv_xem_kho: "HV_XEM_KHO",
  naptien: "NAPTIEN",
};

export function toDbCode(code: string): string {
  return DB_CODE[code.toLowerCase()] || code.toUpperCase();
}

export function fromDbCode(dbCode: string): string | null {
  const entry = Object.entries(DB_CODE).find(([, v]) => v === dbCode);
  return entry ? entry[0] : null;
}

// Lấy plan và ghi đè giá theo bảng plan_overrides (nếu admin đã chỉnh).
export async function getPlanMerged(code: string): Promise<Plan | null> {
  const base = getPlan(code);
  if (!base) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("plan_overrides").select("*").eq("code", code).maybeSingle();
    if (data) {
      return {
        ...base,
        price: data.price ?? base.price,
        marketPrice: data.market_price ?? base.marketPrice,
        promoPrice: data.promo_price ?? base.promoPrice,
        promoLabel: data.promo_label ?? base.promoLabel,
        promoUntil: data.promo_until ?? base.promoUntil,
      } as Plan;
    }
  } catch {}
  return base;
}
