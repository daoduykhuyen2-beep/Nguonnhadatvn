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
  features?: string[];
};

// Chỉ còn 1 gói duy nhất: mua xong được xem toàn bộ danh sách nhà (kho nhà phố toàn quốc).
export const PLANS: Plan[] = [
  {
    code: "hv_xem_kho",
    group: "hoi_vien",
    name: "Gói Xem Kho Nhà Toàn Quốc",
    price: 1999999,
    marketPrice: 2999999,
    days: 30,
    tier: "vip",
    quota: 999999,
    desc: "Chỉ với 1 gói duy nhất, mở khóa TOÀN BỘ kho hơn 20.000 căn nhà phố đang bán trên khắp cả nước trong 30 ngày. Xem trực tiếp số điện thoại chính chủ, địa chỉ số nhà chi tiết, giá bán thật và hình ảnh – video thực tế để chốt được căn nhà ưng ý mà không mất phí môi giới.",
    features: [
      "Xem hơn 20.000 nhà phố đang bán trên toàn quốc – cập nhật liên tục mỗi ngày",
      "Mở khóa số điện thoại CHÍNH CHỦ, liên hệ trực tiếp – không qua trung gian, không phí môi giới",
      "Xem địa chỉ & số nhà chi tiết để đi khảo sát thực tế ngay",
      "Nắm giá bán thật, diện tích, chiều ngang, số tầng của từng căn để so sánh và trả giá",
      "Xem hình ảnh và video thực tế của bất động sản trước khi đi xem nhà",
      "Lọc nhanh theo tỉnh/thành, khu vực, tầm giá để tìm đúng căn phù hợp túi tiền",
      "Tiết kiệm hàng chục triệu tiền hoa hồng môi giới cho mỗi giao dịch",
      "Thời hạn sử dụng 30 ngày kể từ khi kích hoạt",
    ],
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
