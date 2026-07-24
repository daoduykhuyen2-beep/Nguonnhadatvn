'use client';

import { useState } from 'react';
import type { Post } from '@/lib/types';
import { amenitiesOf, landmarksOf, travelTime, parsePrice } from '@/lib/property-extras';
import { provinceOf, pricePerM2, formatVnd } from '@/lib/market-prices';
import type { AreaPriceStats } from '@/lib/market-prices';
import type { PropertyMapData, NearbyPlace } from '@/lib/maps';

function vnd(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(n % 1e9 === 0 ? 0 : 2) + ' tỷ';
  if (n >= 1e6) return Math.round(n / 1e6) + ' triệu';
  return n.toLocaleString('vi-VN') + ' đ';
}

const AMENITY_ICON: Record<string, string> = {
  school: '🏫',
  hospital: '🏥',
  supermarket: '🛒',
  shopping: '🛒',
  bank: '🏦',
  bus_station: '🚌',
  restaurant: '🍜',
  pharmacy: '💊',
  park: '🌳',
  market: '🏬',
  default: '📍',
};

const BANKS: { short: string; name: string; color: string; logo?: string }[] = [
  { short: 'VCB', name: 'Vietcombank', color: '#0a8f4e', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Vietcombank_logo_fixed.svg' },
  { short: 'BIDV', name: 'BIDV', color: '#00693e', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Logo_BIDV.svg' },
  { short: 'VTB', name: 'VietinBank', color: '#0b57a4', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Vietinbank.png' },
  { short: 'AGR', name: 'Agribank', color: '#a51c30', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/AgriBank-logo.png' },
  { short: 'TCB', name: 'Techcombank', color: '#e11a2c', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Techcombank_logo.png' },
  { short: 'MB', name: 'MB Bank', color: '#1e3a8a', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Logo_MB_new.png' },
  { short: 'ACB', name: 'ACB', color: '#0057a8', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Asia_Commercial_Bank_logo.svg' },
  { short: 'VPB', name: 'VPBank', color: '#00a86b', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/VPBank_logo.svg' },
  { short: 'TPB', name: 'TPBank', color: '#5b2d90', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Logo_TPBank.svg' },
];

export default function PropertyExtras({
  post,
  mapData,
  address,
  priceStats,
}: {
  post: Post;
  mapData?: PropertyMapData | null;
  address?: string;
  priceStats?: AreaPriceStats | null;
}) {
  const mapKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const useReal = !!(mapData && mapData.places && mapData.places.length);

  // Real amenities from Google, or reference estimates as fallback.
  const realPlaces: NearbyPlace[] = useReal ? mapData!.places : [];
  const estAmenities = !useReal ? amenitiesOf(post) : [];
  const landmarks = landmarksOf(post);

  return (
    <div className="mt-8 space-y-8">
      {/* Map + nearby amenities */}
      <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-emerald-800">
          <span>📍</span> Tiện ích & khoảng cách xung quanh
        </h2>

        {mapData && mapKey ? (
                  <div className="mb-5 overflow-hidden rounded-xl border border-emerald-100">
                    <iframe
                      title="Bản đồ vị trí"
                      width="100%"
                      height="280"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={
                        "https://www.google.com/maps/embed/v1/place?key=" +
                        mapKey +
                        "&q=" +
                        mapData.lat +
                        "," +
                        mapData.lng +
                        "&zoom=16"
                      }
                    />
                  </div>
                ) : address ? (
                  <div className="mb-5 overflow-hidden rounded-xl border border-emerald-100">
                    <iframe
                      title="Bản đồ vị trí"
                      width="100%"
                      height="280"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={
                        "https://maps.google.com/maps?q=" +
                        encodeURIComponent(address) +
                        "&z=16&output=embed"
                      }
                    />
                    <p className="bg-emerald-50 px-3 py-2 text-xs text-slate-500">
                      📍 Vị trí tương đối theo địa chỉ: {address}
                    </p>
                  </div>
                ) : null}

        {useReal ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {realPlaces.map((p, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl bg-emerald-50/60 p-3"
              >
                <span className="text-xl">
                  {AMENITY_ICON[p.type] || AMENITY_ICON.default}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {p.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    Cách {p.km} km
                    {p.minutesDrive != null ? ' • xe máy ~' + p.minutesDrive + ' phút' : ''}
                    {p.minutesWalk != null ? ' • đi bộ ~' + p.minutesWalk + ' phút' : ''}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <ul className="grid gap-3 sm:grid-cols-2">
              {estAmenities.map((p, i) => {
                const t = travelTime(p.km);
                return (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-xl bg-emerald-50/60 p-3"
                  >
                    <span className="text-xl">
                      {AMENITY_ICON[p.type] || AMENITY_ICON.default}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {p.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Cách {p.km} km • xe máy ~{t.xe} • đi bộ ~{t.bo}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-xs italic text-slate-400">
              * Số liệu khoảng cách mang tính tham khảo khi chưa xác định được vị trí chinh xac.
            </p>
          </>
        )}
      </section>

      {/* Landmarks */}
      {landmarks.length > 0 ? (
        <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-emerald-800">
            <span>🏛️</span> Danh lam thắng cảnh gần khu vực
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {landmarks.map((p, i) => {
              const t = travelTime(p.km);
              return (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl bg-amber-50 p-3"
                >
                  <span className="text-xl">✨</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {p.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Cách {p.km} km • xe máy ~{t.xe}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {/* Da bo phan Gia tham khao thi truong khu vuc theo yeu cau */}
      <LoanCalculator post={post} />
    </div>
  );
}

function PriceChart({
  post,
  priceStats,
}: {
  post: Post;
  priceStats?: AreaPriceStats | null;
}) {
  const province = provinceOf(post) || "khu vực";
  const ref = pricePerM2(post);
  const stats: AreaPriceStats =
    priceStats ?? {
      count: 0,
      avgPerM2: ref,
      minPerM2: Math.round(ref * 0.85),
      maxPerM2: Math.round(ref * 1.15),
      source: "reference",
    };
  const isReal = stats.source === "listings";
  // Chi hien thi khi co du lieu that (tu tin dang thuc te), an uoc tinh tham khao
  if (!isReal || stats.count < 3) return null;

  const area =
    typeof post.dien_tich === "number"
      ? post.dien_tich
      : parseFloat(String(post.dien_tich || "").replace(/[^0-9.]/g, "")) || 0;
  const estValue = area > 0 ? stats.avgPerM2 * area : 0;
  const listPrice = parsePrice(post.gia);

  const span = stats.maxPerM2 - stats.minPerM2;
  const avgPos = span > 0 ? ((stats.avgPerM2 - stats.minPerM2) / span) * 100 : 50;
  const listPerM2 = area > 0 && listPrice > 0 ? Math.round(listPrice / area) : 0;
  const listPos =
    span > 0 && listPerM2 > 0
      ? Math.min(100, Math.max(0, ((listPerM2 - stats.minPerM2) / span) * 100))
      : null;

  return (
    <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-800">
          <span>📈</span> Giá tham khảo thị trường khu vực
        </h2>
        <span
          className={
            "rounded-full px-3 py-1 text-xs font-semibold " +
            (isReal ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600")
          }
        >
          {isReal ? "Từ " + stats.count + " tin đăng thực tế" : "Ước tính tham khảo"}
        </span>
      </div>
      <p className="mb-4 text-sm text-slate-500">
        Giá trung bình tại <span className="font-semibold text-slate-700">{province}</span>:{" "}
        <span className="font-bold text-emerald-700">{formatVnd(stats.avgPerM2)}/m²</span>
      </p>

      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
        <span>Thấp: {formatVnd(stats.minPerM2)}/m²</span>
        <span>Cao: {formatVnd(stats.maxPerM2)}/m²</span>
      </div>
      <div className="relative h-3 rounded-full bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-600">
        <div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-emerald-700 shadow"
          style={{ left: avgPos + "%" }}
          title={"Giá TB: " + formatVnd(stats.avgPerM2) + "/m²"}
        />
        {listPos !== null ? (
          <div
            className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-amber-500 shadow"
            style={{ left: listPos + "%" }}
            title={"Tin này: " + formatVnd(listPerM2) + "/m²"}
          />
        ) : null}
      </div>
      <div className="mt-1 flex items-center justify-center gap-4 text-[11px] text-slate-500">
        <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-700" /> Giá TB khu vực</span>
        {listPos !== null ? (
          <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" /> Tin này</span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-emerald-50 p-3 text-center">
          <p className="text-xs text-slate-500">Giá TB khu vực</p>
          <p className="text-base font-bold text-emerald-700">{formatVnd(stats.avgPerM2)}/m²</p>
        </div>
        {area > 0 ? (
          <div className="rounded-xl bg-emerald-50 p-3 text-center">
            <p className="text-xs text-slate-500">Định giá tham khảo ({area} m²)</p>
            <p className="text-base font-bold text-emerald-700">{formatVnd(estValue)}</p>
          </div>
        ) : null}
        {listPrice ? (
          <div className="rounded-xl bg-amber-50 p-3 text-center">
            <p className="text-xs text-slate-500">Giá rao bán</p>
            <p className="text-base font-bold text-amber-700">{formatVnd(listPrice)}</p>
          </div>
        ) : null}
      </div>

      <p className="mt-3 text-xs italic text-slate-400">
        {isReal
          ? "* Giá trung bình được tính từ " + stats.count + " tin đăng đã duyệt cùng khu vực, chỉ mang tính tham khảo."
          : "* Chưa đủ dữ liệu tin đăng trong khu vực; số liệu là giá tham khảo ước tính."}
      </p>
    </section>
  );
}
function LoanCalculator({ post }: { post: Post }) {
  const price = parsePrice(post.gia);
  const [pct, setPct] = useState(70);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(11);

  if (!price) return null;

  const loan = price * (pct / 100);
  const months = years * 12;
  const r = rate / 100 / 12;
  const monthly =
    r === 0 ? loan / months : (loan * r) / (1 - Math.pow(1 + r, -months));
  const totalInterest = monthly * months - loan;

  return (
    <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-emerald-800">
        <span>🧮</span> Tính vay ngân hàng
      </h2>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Tỷ lệ vay</span>
            <span className="font-semibold text-emerald-700">{pct}% ({vnd(loan)})</span>
          </div>
          <input
            type="range"
            min={10}
            max={90}
            step={5}
            value={pct}
            onChange={(e) => setPct(Number(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Thời hạn</span>
            <span className="font-semibold text-emerald-700">{years} nam</span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Lãi suất</span>
            <span className="font-semibold text-emerald-700">{rate}%/nam</span>
          </div>
          <input
            type="range"
            min={5}
            max={16}
            step={0.5}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-50 p-4 text-center">
          <p className="text-xs text-slate-500">Trả mỗi tháng (~)</p>
          <p className="text-lg font-bold text-emerald-700">{vnd(Math.round(monthly))}</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-4 text-center">
          <p className="text-xs text-slate-500">Tổng lãi phải trả</p>
          <p className="text-lg font-bold text-emerald-700">{vnd(Math.round(totalInterest))}</p>
        </div>
      </div>

      <p className="mt-5 mb-2 text-sm font-semibold text-slate-700">Ngân hàng hỗ trợ cho vay</p>
      <div className="flex flex-wrap gap-2">
        {BANKS.map((b) => (
            b.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={b.short} src={b.logo} alt={b.name} title={b.name} className="h-9 w-auto max-w-[96px] rounded-lg border border-slate-200 bg-white object-contain p-1 shadow-sm" />
            ) : (
              <span key={b.short} className="inline-flex h-9 items-center rounded-lg px-3 text-xs font-bold text-white shadow-sm" style={{ backgroundColor: b.color }} title={b.name}>{b.short}</span>
            )
          ))}
      </div>
      <p className="mt-3 text-xs italic text-slate-400">
        * Kết quả ước tính theo phương pháp dư nợ giảm dần, chỉ mang tính tham khảo.
      </p>
    </section>
  );
}
