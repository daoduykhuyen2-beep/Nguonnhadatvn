'use client';

import { useState } from 'react';
import type { Post } from '@/lib/types';
import { amenitiesOf, landmarksOf, travelTime, parsePrice } from '@/lib/property-extras';
import { areaPriceTrend, provinceOf, pricePerM2, formatVnd } from "@/lib/market-prices";
import type { PropertyMapData, NearbyPlace } from '@/lib/maps';

function vnd(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(n % 1e9 === 0 ? 0 : 2) + ' ty';
  if (n >= 1e6) return Math.round(n / 1e6) + ' trieu';
  return n.toLocaleString('vi-VN') + ' d';
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

export default function PropertyExtras({
  post,
  mapData,
}: {
  post: Post;
  mapData?: PropertyMapData | null;
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
          <span>📍</span> Tien ich & khoang cach xung quanh
        </h2>

        {mapData && mapKey ? (
          <div className="mb-5 overflow-hidden rounded-xl border border-emerald-100">
            <iframe
              title="Ban do vi tri"
              width="100%"
              height="280"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={
                'https://www.google.com/maps/embed/v1/place?key=' +
                mapKey +
                '&q=' +
                mapData.lat +
                ',' +
                mapData.lng +
                '&zoom=16'
              }
            />
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
                    Cach {p.km} km
                    {p.minutesDrive != null ? ' • xe may ~' + p.minutesDrive + ' phut' : ''}
                    {p.minutesWalk != null ? ' • di bo ~' + p.minutesWalk + ' phut' : ''}
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
                        Cach {p.km} km • xe may ~{t.xe} • di bo ~{t.bo}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-xs italic text-slate-400">
              * So lieu khoang cach mang tinh tham khao khi chua xac dinh duoc vi tri chinh xac.
            </p>
          </>
        )}
      </section>

      {/* Landmarks */}
      {landmarks.length > 0 ? (
        <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-emerald-800">
            <span>🏛️</span> Danh lam thang canh gan khu vuc
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
                      Cach {p.km} km • xe may ~{t.xe}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <PriceChart post={post} />
      <LoanCalculator post={post} />
    </div>
  );
}

function PriceChart({ post }: { post: Post }) {
  const trend = areaPriceTrend(post);
  const province = provinceOf(post) || 'khu vuc';
  const perM2 = pricePerM2(post);

  const area =
    typeof post.dien_tich === 'number'
      ? post.dien_tich
      : parseFloat(String(post.dien_tich || '').replace(/[^0-9.]/g, '')) || 0;
  const estValue = area > 0 ? perM2 * area : 0;
  const listPrice = parsePrice(post.gia);

  const values = trend.map((t) => t.pricePerM2);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const first = values[0];
  const last = values[values.length - 1];
  const changePct = Math.round(((last - first) / first) * 1000) / 10;

  return (
    <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-800">
          <span>📈</span> Biểu đồ giá thị trường khu vực
        </h2>
        <span
          className={
            'rounded-full px-3 py-1 text-sm font-semibold ' +
            (changePct >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700')
          }
        >
          {changePct >= 0 ? '▲ +' : '▼ '}
          {changePct}% / năm
        </span>
      </div>
      <p className="mb-4 text-sm text-slate-500">
        Giá tham khảo tại <span className="font-semibold text-slate-700">{province}</span>:{' '}
        <span className="font-bold text-emerald-700">{formatVnd(perM2)}/m²</span>
      </p>

      <div className="flex h-44 items-end gap-1.5">
        {trend.map((t, i) => {
          const h = max === min ? 100 : ((t.pricePerM2 - min) / (max - min)) * 80 + 20;
          return (
            <div key={i} className="group flex flex-1 flex-col items-center gap-1">
              <span className="mb-0.5 text-[9px] font-semibold text-emerald-700 opacity-0 group-hover:opacity-100">
                {Math.round(t.pricePerM2 / 1_000_000)}tr
              </span>
              <div
                className="w-full rounded-t bg-gradient-to-t from-emerald-500 to-emerald-300"
                style={{ height: h + '%' }}
                title={formatVnd(t.pricePerM2) + '/m²'}
              />
              <span className="text-[10px] text-slate-400">{t.month}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-emerald-50 p-3 text-center">
          <p className="text-xs text-slate-500">Giá TB khu vực</p>
          <p className="text-base font-bold text-emerald-700">{formatVnd(perM2)}/m²</p>
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
        * Giá thị trường mang tính tham khảo, tổng hợp từ mặt bằng giá rao bán trong khu vực.
      </p>
    </section>
  );
}

const BANKS = [
  { name: 'Vietcombank', short: 'VCB', color: '#007A33' },
  { name: 'BIDV', short: 'BIDV', color: '#00558C' },
  { name: 'VietinBank', short: 'CTG', color: '#0072BC' },
  { name: 'Agribank', short: 'AGR', color: '#8B1F24' },
  { name: 'Techcombank', short: 'TCB', color: '#EC1C24' },
  { name: 'MB Bank', short: 'MB', color: '#1E3A8A' },
  { name: 'ACB', short: 'ACB', color: '#00548F' },
  { name: 'VPBank', short: 'VPB', color: '#00A84F' },
  { name: 'Sacombank', short: 'STB', color: '#0056A3' },
  { name: 'TPBank', short: 'TPB', color: '#6C2E86' },
];

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
        <span>🧮</span> Tinh vay ngan hang
      </h2>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Ty le vay</span>
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
            <span className="text-slate-600">Thoi han</span>
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
            <span className="text-slate-600">Lai suat</span>
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
          <p className="text-xs text-slate-500">Tra moi thang (~)</p>
          <p className="text-lg font-bold text-emerald-700">{vnd(Math.round(monthly))}</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-4 text-center">
          <p className="text-xs text-slate-500">Tong lai phai tra</p>
          <p className="text-lg font-bold text-emerald-700">{vnd(Math.round(totalInterest))}</p>
        </div>
      </div>

      <p className="mt-5 mb-2 text-sm font-semibold text-slate-700">Ngan hang ho tro cho vay</p>
      <div className="flex flex-wrap gap-2">
        {BANKS.map((b) => (
          <span
            key={b.short}
            className="inline-flex h-9 items-center rounded-lg px-3 text-xs font-bold text-white shadow-sm"
            style={{ backgroundColor: b.color }}
            title={b.name}
          >
            {b.short}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs italic text-slate-400">
        * Ket qua uoc tinh theo phuong phap du no giam dan, chi mang tinh tham khao.
      </p>
    </section>
  );
}
