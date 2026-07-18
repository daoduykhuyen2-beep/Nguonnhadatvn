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

// Gói hội viên: mua xong được xem toàn bộ danh sách nhà (kho nhà phố toàn quốc).
// Gói đăng tin: mua để đăng / nâng cấp tin (VIP, Kim cương) — KHÔNG mở quyền xem kho nhà.
export const PLANS: Plan[] = [
  {
    code: "hv_xem_kho",
    group: "hoi_vien",
    name: "Gói Xem Kho Nhà Toàn Quốc",
    price: 1999000,
    marketPrice: 2999000,
    days: 30,
    tier: "vip",
    quota: 999999,
    desc: "Chỉ với 1 gói duy nhất, mở khóa TOÀN BỘ kho hơn 20.000 căn nhà phố đang bán trên khắp cả nước trong 30 ngày. Xem đầy đủ địa chỉ, thông tin chi tiết, giá bán thật và hình ảnh – video thực tế của từng căn. Ưng căn nào, bạn chỉ cần để lại thông tin – chúng tôi sẽ liên hệ và tư vấn trực tiếp để bạn chốt được căn nhà ưng ý.",
    features: [
      "Xem hơn 20.000 nhà phố đang bán trên toàn quốc – cập nhật liên tục mỗi ngày",
      "Xem địa chỉ & số nhà chi tiết để đi khảo sát thực tế ngay",
      "Nắm giá bán thật, diện tích, chiều ngang, số tầng của từng căn để so sánh và trả giá",
      "Xem hình ảnh và video thực tế của bất động sản trước khi đi xem nhà",
      "Lọc nhanh theo tỉnh/thành, khu vực, tầm giá để tìm đúng căn phù hợp tiết kiệm thời gian",
      "Tiết kiệm hàng chục triệu tiền hoa hồng môi giới cho mỗi giao dịch",
      "Thời hạn sử dụng 30 ngày kể từ khi kích hoạt",
    ],
  },
  // ===== Gói đăng tin lẻ / VIP =====
  {
    code: "dt_thoai_mai",
    group: "tin",
    name: "Gói Đăng Tin Thoải Mái",
    price: 199000,
    marketPrice: 399000,
    days: 30,
    quota: 999999,
    pushCredits: 30,
    desc: "Đăng tin bất động sản THOẢI MÁI không giới hạn trong 30 ngày. Dành cho môi giới và chủ nhà đăng nhiều tin, kèm lượt đẩy tin lên đầu danh sách mỗi ngày.",
    features: [
      "Đăng tin không giới hạn số lượng trong 30 ngày",
      "Tặng 30 lượt đẩy tin lên đầu danh sách",
      "Tin hiển thị ngay sau khi đăng, không chờ duyệt",
      "Quản lý toàn bộ tin đã đăng trong tài khoản",
    ],
  },
  {
    code: "tin_vip_49",
    group: "tin",
    name: "Tin VIP",
    price: 49000,
    tier: "vang",
    desc: "Nâng 1 tin lên hạng VIP Vàng trong 15 ngày: nổi bật hơn, hiển thị ưu tiên phía trên tin thường, thu hút nhiều khách xem hơn.",
    features: [
      "Nâng 1 tin lên hạng VIP Vàng",
      "Hiển thị ưu tiên phía trên tin thường",
      "Gắn nhãn nổi bật thu hút khách xem",
      "Thời hạn nổi bật 15 ngày",
    ],
  },
  {
    code: "tin_kc_99",
    group: "tin",
    name: "Tin Kim Cương",
    price: 99000,
    tier: "kim_cuong",
    desc: "Nâng 1 tin lên hạng Kim Cương trong 15 ngày: vị trí cao nhất, khung nổi bật cao cấp, tiếp cận tối đa khách hàng tiềm năng.",
    features: [
      "Nâng 1 tin lên hạng Kim Cương – hạng cao nhất",
      "Vị trí hiển thị cao nhất, trên cả tin VIP Vàng",
      "Khung nổi bật cao cấp, gắn nhãn Kim Cương",
      "Thời hạn nổi bật 15 ngày",
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
