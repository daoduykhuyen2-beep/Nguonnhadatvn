import type { Post } from "@/lib/types";

export type PlaceItem = { name: string; type: string; km: number };

// Tiện ích phổ biến quanh mọi bất động sản (khoảng cách sinh theo id để ổn định)
const COMMON_AMENITIES: { name: string; type: string }[] = [
  { name: "Chợ / Siêu thị", type: "shopping" },
  { name: "Trường học", type: "school" },
  { name: "Bệnh viện / Phòng khám", type: "hospital" },
  { name: "Công viên", type: "park" },
  { name: "Ngân hàng / ATM", type: "bank" },
  { name: "Trạm xe buýt", type: "bus" },
  { name: "Nhà hàng / Quán cà phê", type: "food" },
  { name: "Cửa hàng tiện lợi", type: "store" },
];

// Danh lam thắng cảnh theo tỉnh/thành (khu trung tâm)
const LANDMARKS: Record<string, { name: string; type: string }[]> = {
  "Hồ Chí Minh": [
    { name: "Chợ Bến Thành", type: "landmark" },
    { name: "Nhà thờ Đức Bà", type: "landmark" },
    { name: "Bưu điện Thành phố", type: "landmark" },
    { name: "Phố đi bộ Nguyễn Huệ", type: "landmark" },
    { name: "Dinh Độc Lập", type: "landmark" },
    { name: "Bitexco Financial Tower", type: "landmark" },
    { name: "Landmark 81", type: "landmark" },
  ],
  "Hà Nội": [
    { name: "Hồ Hoàn Kiếm", type: "landmark" },
    { name: "Văn Miếu - Quốc Tử Giám", type: "landmark" },
    { name: "Lăng Chủ tịch Hồ Chí Minh", type: "landmark" },
    { name: "Nhà hát Lớn Hà Nội", type: "landmark" },
    { name: "Chùa Một Cột", type: "landmark" },
    { name: "Phố cổ Hà Nội", type: "landmark" },
    { name: "Hồ Tây", type: "landmark" },
  ],
  "Đà Nẵng": [
    { name: "Cầu Rồng", type: "landmark" },
    { name: "Bãi biển Mỹ Khê", type: "landmark" },
    { name: "Ngũ Hành Sơn", type: "landmark" },
    { name: "Cầu Sông Hàn", type: "landmark" },
    { name: "Bà Nà Hills", type: "landmark" },
  ],
};

function provinceOf(post: Post): string {
  const quan = post.quan || "";
  const parts = quan.split(" - ");
  return (parts[parts.length - 1] || "").trim();
}

// Sinh khoảng cách ổn định theo id + chỉ số (0.3 - 3.5 km)
function stableKm(id: number | string, i: number): number {
  const n = (typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""), 10) || 0) + i * 37;
  const v = 0.3 + ((n * 13) % 33) / 10; // 0.3 .. 3.5
  return Math.round(v * 10) / 10;
}

export function amenitiesOf(post: Post): PlaceItem[] {
  const id = post.id;
  return COMMON_AMENITIES.map((a, i) => ({ ...a, km: stableKm(id, i) })).sort((a, b) => a.km - b.km);
}

export function landmarksOf(post: Post): PlaceItem[] {
  const prov = provinceOf(post);
  const list = LANDMARKS[prov];
  if (!list) return [];
  return list.map((l, i) => ({ ...l, km: stableKm(post.id, i + 5) })).sort((a, b) => a.km - b.km);
}

// Ước tính thời gian đi xe máy (~25 km/h) và đi bộ (~5 km/h)
export function travelTime(km: number): { xe: string; bo: string } {
  const xeMin = Math.max(1, Math.round((km / 25) * 60));
  const boMin = Math.max(1, Math.round((km / 5) * 60));
  const fmt = (m: number) => (m >= 60 ? Math.floor(m / 60) + " giờ " + (m % 60) + " phút" : m + " phút");
  return { xe: fmt(xeMin), bo: fmt(boMin) };
}

// Chuyển chuỗi giá ("2.7 tỷ", "800 triệu") sang số VNĐ
export function parsePrice(gia: string | null | undefined): number {
  if (!gia) return 0;
  const s = gia.toLowerCase().replace(/,/g, ".");
  const num = parseFloat((s.match(/[0-9]+(\.[0-9]+)?/) || ["0"])[0]);
  if (!num) return 0;
  if (s.includes("tỷ") || s.includes("ty")) return Math.round(num * 1e9);
  if (s.includes("triệu") || s.includes("tr")) return Math.round(num * 1e6);
  return Math.round(num);
}
