import type { Post } from '@/lib/types';

// Reference average street-house prices per province (VND per m2).
// These are approximate market reference figures for display only,
// NOT official valuations. Source: aggregated public listing averages.

const PROVINCE_PRICE_PER_M2: Record<string, number> = {
  'Hà Nội': 168_000_000,
  'Hồ Chí Minh': 205_000_000,
  'Đà Nẵng': 96_000_000,
  'Hải Phòng': 62_000_000,
  'Bình Dương': 58_000_000,
  'Đồng Nai': 52_000_000,
  'Khánh Hòa': 70_000_000,
  'Bà Rịa': 48_000_000,
  'Quảng Ninh': 66_000_000,
  'Bắc Ninh': 60_000_000,
  'Hưng Yên': 45_000_000,
  'Hải Dương': 40_000_000,
  'Thanh Hóa': 34_000_000,
  'Nghệ An': 33_000_000,
  'Quảng Nam': 38_000_000,
  'Thái Nguyên': 36_000_000,
  'Hòa Bình': 22_000_000,
  'Phú Thọ': 24_000_000,
  'Hà Nam': 30_000_000,
  'Long An': 32_000_000,
  'Lâm Đồng': 42_000_000,
};

const DEFAULT_PRICE_PER_M2 = 35_000_000;

export function provinceOf(post: Post): string {
  const q = post.quan || '';
  const parts = q.split(' - ');
  return (parts[1] || parts[0] || '').trim();
}

export function pricePerM2(post: Post): number {
  const p = provinceOf(post);
  return PROVINCE_PRICE_PER_M2[p] ?? DEFAULT_PRICE_PER_M2;
}

// Parse dien_tich (area in m2) from the free-text field, e.g. "80 m2", "80m2", "80".
export function parseArea(dienTich: string | null | undefined): number {
  if (!dienTich) return 0;
  const m = String(dienTich).replace(/,/g, ".").match(/[0-9]+(\.[0-9]+)?/);
  const num = m ? parseFloat(m[0]) : 0;
  return num > 0 ? num : 0;
}

export type AreaPriceStats = {
  count: number;
  avgPerM2: number;
  minPerM2: number;
  maxPerM2: number;
  source: "listings" | "reference";
};

// Compute REAL average price per m2 from actual approved listings in the same area.
// Only counts listings that have both a parseable price and a parseable area.
// Falls back to the province reference figure when there is not enough data.
export function computeAreaStats(current: Post, listings: Post[]): AreaPriceStats {
  const prov = provinceOf(current);
  const perM2List: number[] = [];
  for (const p of listings) {
    if (provinceOf(p) !== prov) continue;
    const price = parsePriceRaw(p.gia);
    const area = parseArea(p.dien_tich);
    if (price > 0 && area > 0) {
      const v = price / area;
      if (v >= 1_000_000 && v <= 2_000_000_000) perM2List.push(v);
    }
  }
  if (perM2List.length >= 3) {
    perM2List.sort((a, b) => a - b);
    const sum = perM2List.reduce((s, v) => s + v, 0);
    const avg = Math.round(sum / perM2List.length);
    return {
      count: perM2List.length,
      avgPerM2: avg,
      minPerM2: Math.round(perM2List[0]),
      maxPerM2: Math.round(perM2List[perM2List.length - 1]),
      source: "listings",
    };
  }
  const ref = pricePerM2(current);
  return { count: perM2List.length, avgPerM2: ref, minPerM2: Math.round(ref * 0.85), maxPerM2: Math.round(ref * 1.15), source: "reference" };
}

// Lightweight price parser (VND) used by the stats above.
function parsePriceRaw(gia: string | null | undefined): number {
  if (!gia) return 0;
  const s = String(gia).toLowerCase().replace(/,/g, ".");
  const m = s.match(/[0-9]+(\.[0-9]+)?/);
  const num = m ? parseFloat(m[0]) : 0;
  if (!num) return 0;
  if (s.includes("tỷ") || s.includes("ty")) return Math.round(num * 1e9);
  if (s.includes("triệu") || s.includes("tr")) return Math.round(num * 1e6);
  return Math.round(num);
}
export function formatVnd(n: number): string {
  if (n >= 1_000_000_000) {
    const t = n / 1_000_000_000;
    return (Number.isInteger(t) ? t : t.toFixed(2)) + ' tỷ';
  }
  if (n >= 1_000_000) return Math.round(n / 1_000_000) + ' triệu';
  return n.toLocaleString('vi-VN') + ' đ';
}
