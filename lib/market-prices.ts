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

// 12-month reference trend of the area's average price/m2.
// Deterministic gentle uptrend so numbers are stable per area.
export function areaPriceTrend(post: Post): { month: string; pricePerM2: number }[] {
  const base = pricePerM2(post);
  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
  // seed from province name so each area has its own shape
  const p = provinceOf(post);
  let seed = 0;
  for (let i = 0; i < p.length; i++) seed = (seed + p.charCodeAt(i)) % 100;
  return months.map((m, i) => {
    const wave = Math.sin((i + seed) / 3) * 0.02;
    const drift = (i / 11) * 0.05; // ~5% annual reference growth
    const v = Math.round((base * (0.97 + drift + wave)) / 1_000_000) * 1_000_000;
    return { month: m, pricePerM2: v };
  });
}

export function formatVnd(n: number): string {
  if (n >= 1_000_000_000) {
    const t = n / 1_000_000_000;
    return (Number.isInteger(t) ? t : t.toFixed(2)) + ' tỷ';
  }
  if (n >= 1_000_000) return Math.round(n / 1_000_000) + ' triệu';
  return n.toLocaleString('vi-VN') + ' đ';
}
