'use client';

import { useState } from 'react';
import type { Post } from '@/lib/types';
import { amenitiesOf, landmarksOf, travelTime, parsePrice } from '@/lib/property-extras';
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
                'https://www.google.com/maps/embed/v1/view?key=' +
                mapKey +
                '&center=' +
                mapData.lat +
                ',' +
                mapData.lng +
                '&zoom=15&maptype=roadmap'
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
                        Cach {p.km} km • xe may ~{t.drive} phut • di bo ~{t.walk} phut
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
                      Cach {p.km} km • xe may ~{t.drive} phut
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
  const price = parsePrice(post.gia);
  if (!price) return null;
  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
  // Deterministic pseudo trend around current price (reference only).
  const seed = (post.id || 1) % 97;
  const series = months.map((m, i) => {
    const wave = Math.sin((i + seed) / 2) * 0.04 + (i / 11) * 0.06;
    return { m, v: Math.round(price * (0.9 + wave) * 100) / 100 };
  });
  series[11].v = price;
  const max = Math.max(...series.map((s) => s.v));
  const min = Math.min(...series.map((s) => s.v));
  const first = series[0].v;
  const changePct = Math.round(((price - first) / first) * 1000) / 10;

  return (
    <section className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-800">
          <span>📈</span> So do gia 12 thang
        </h2>
        <span
          className={
            'rounded-full px-3 py-1 text-sm font-semibold ' +
            (changePct >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700')
          }
        >
          {changePct >= 0 ? '▲ +' : '▼ '}
          {changePct}%
        </span>
      </div>
      <div className="flex h-40 items-end gap-1.5">
        {series.map((s, i) => {
          const h = max === min ? 100 : ((s.v - min) / (max - min)) * 85 + 15;
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-gradient-to-t from-emerald-500 to-emerald-300"
                style={{ height: h + '%' }}
                title={vnd(s.v)}
              />
              <span className="text-[10px] text-slate-400">{s.m}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs italic text-slate-400">
        * Bieu do gia mang tinh tham khao, khong phai gia giao dich thuc te.
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
