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
  desc?: string;
};

// Chỉ còn 1 gói duy nhất: mua xong được xem toàn bộ danh sách nhà (kho nhà phố toàn quốc).
export const PLANS: Plan[] = [
  {
    code: "hv_xem_kho",
    group: "hoi_vien",
    name: "Gói Xem Kho Nhà Toàn Quốc",
    price: 299000,
    marketPrice: 499000,
    days: 30,
    tier: "vip",
    quota: 999999,
    desc: "Mở khóa xem toàn bộ danh sách nhà phố trên toàn quốc trong 30 ngày: xem thông tin liên hệ chính chủ, giá bán, địa chỉ, hình ảnh và video thực tế của từng bất động sản.",
  },
];

export function getPlan(code: string): Plan | undefined {
  return PLANS.find((p) => p.code === code);
}

export function formatVND(n: number): string {
  return new Intl.NumberFormat("vi-VN").format(Math.round(n)) + "đ";
}

// Prefix riêng cho website này để dùng chung tài khoản SePay với web khác
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
