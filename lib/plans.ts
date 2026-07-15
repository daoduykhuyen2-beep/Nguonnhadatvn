export type PlanGroup = "tin" | "day" | "hoi_vien";

export type Plan = {
  code: string;
  group: PlanGroup;
  name: string;
  price: number;
  marketPrice?: number;
  promoPrice?: number;
  promoLabel?: string;
  promoUntil?: string;
  days?: number;
  quota?: number;
  pushCredits?: number;
  tier?: string;
};

// Bang gia goc (co the ghi de qua bang plan_overrides trong Supabase)
export const PLANS: Plan[] = [
  // Goi dang 1 tin le
  { code: "tin_thuong_15", group: "tin", name: "1 tin thường 15 ngày", price: 28500, marketPrice: 40500, days: 15, quota: 1, tier: "thuong" },
  { code: "tin_vang_15", group: "tin", name: "1 tin VIP Vàng 15 ngày", price: 539000, marketPrice: 770000, days: 15, quota: 1, tier: "vang" },
  { code: "tin_kc_15", group: "tin", name: "1 tin VIP Kim Cương 15 ngày", price: 1540000, marketPrice: 2205000, days: 15, quota: 1, tier: "kim_cuong" },
  // Goi day tin
  { code: "day_1", group: "day", name: "Đẩy tin 1 lượt", price: 28000, pushCredits: 1 },
  { code: "day_3", group: "day", name: "Đẩy tin 3 lượt", price: 75000, marketPrice: 84000, pushCredits: 3 },
  { code: "day_6", group: "day", name: "Đẩy tin 6 lượt", price: 134000, marketPrice: 168000, pushCredits: 6 },
  // Goi hoi vien
  { code: "hv_co_ban", group: "hoi_vien", name: "Gói Cơ bản", price: 299000, marketPrice: 425000, days: 30, tier: "co_ban", quota: 10 },
  { code: "hv_chuyen_nghiep", group: "hoi_vien", name: "Gói Chuyên nghiệp", price: 2490000, marketPrice: 3685000, days: 30, tier: "chuyen_nghiep", quota: 60 },
  { code: "hv_vip", group: "hoi_vien", name: "Gói VIP Toàn diện", price: 7490000, marketPrice: 11705000, days: 30, tier: "vip", quota: 200 },
];

export function getPlan(code: string): Plan | undefined {
  return PLANS.find((p) => p.code === code);
}

export function formatVND(n: number): string {
  return new Intl.NumberFormat("vi-VN").format(Math.round(n)) + "đ";
}

// Prefix rieng cho website nay de dung chung tai khoan SePay voi web khac
export const SEPAY_PREFIX = "NDV";

export function buildTransferContent(kind: "NAP" | "GOI", id: string | number): string {
  return `${SEPAY_PREFIX}${kind}${id}`;
}

export function isPromoActive(plan: Plan): boolean {
  if (!plan.promoPrice) return false;
  if (!plan.promoUntil) return true;
  return new Date(plan.promoUntil).getTime() > Date.now();
}

export function getEffectivePrice(plan: Plan): number {
  return isPromoActive(plan) && plan.promoPrice ? plan.promoPrice : plan.price;
}

export function getDiscountPercent(plan: Plan): number {
  const base = plan.marketPrice ?? plan.price;
  const eff = getEffectivePrice(plan);
  if (!base || base <= eff) return 0;
  return Math.round(((base - eff) / base) * 100);
}
