"use client";
import { useMemo, useState } from "react";
import type { Post } from "@/lib/types";
import { amenitiesOf, landmarksOf, travelTime, parsePrice } from "@/lib/property-extras";

const BANKS = [
  { name: "Vietcombank", short: "VCB", color: "#007a33" },
  { name: "BIDV", short: "BIDV", color: "#00693e" },
  { name: "VietinBank", short: "CTG", color: "#0072bc" },
  { name: "Agribank", short: "AGR", color: "#a0122f" },
  { name: "Techcombank", short: "TCB", color: "#ec1c24" },
  { name: "MB Bank", short: "MB", color: "#1e3a8a" },
  { name: "ACB", short: "ACB", color: "#0055a5" },
  { name: "VPBank", short: "VPB", color: "#00a86b" },
  { name: "Sacombank", short: "STB", color: "#00539f" },
  { name: "TPBank", short: "TPB", color: "#6a1b9a" },
];

function vnd(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(n % 1e9 === 0 ? 0 : 1) + " tỷ";
  if (n >= 1e6) return Math.round(n / 1e6) + " triệu";
  return n.toLocaleString("vi-VN") + " đ";
}

export default function PropertyExtras({ post }: { post: Post }) {
  const amenities = useMemo(() => amenitiesOf(post), [post]);
  const landmarks = useMemo(() => landmarksOf(post), [post]);
  const basePrice = useMemo(() => parsePrice(post.gia), [post]);

  return (
    <div className="mt-6 space-y-6">
      {/* Tiện ích xung quanh */}
      <section className="card p-6">
        <h2 className="mb-4 text-lg font-bold text-ink">🏙️ Tiện ích xung quanh</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {amenities.map((a) => {
            const t = travelTime(a.km);
            return (
              <div key={a.name} className="flex items-center justify-between rounded-xl bg-paper-soft px-4 py-3">
                <span className="font-medium text-ink-soft">{a.name}</span>
                <span className="text-right text-sm text-ink-muted">
                  <b className="text-brand-600">{a.km} km</b><br />
                  🛵 {t.xe} · 🚶 {t.bo}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Danh lam thắng cảnh (chỉ khu trung tâm lớn) */}
      {landmarks.length > 0 && (
        <section className="card p-6">
          <h2 className="mb-4 text-lg font-bold text-ink">🎡 Danh lam thắng cảnh gần đây</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {landmarks.map((l) => {
              const t = travelTime(l.km);
              return (
                <div key={l.name} className="flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3">
                  <span className="font-medium text-ink-soft">📍 {l.name}</span>
                  <span className="text-right text-sm text-ink-muted">
                    <b className="text-brand-600">{l.km} km</b><br />
                    🛵 {t.xe}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Sơ đồ giá 12 tháng */}
      <PriceChart basePrice={basePrice} id={post.id} />

      {/* Tính vay lãi ngân hàng */}
      <LoanCalculator basePrice={basePrice} />
    </div>
  );
}

function PriceChart({ basePrice, id }: { basePrice: number; id: number | string }) {
  const data = useMemo(() => {
    const months = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
    const seed = (typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""), 10) || 1);
    const base = basePrice > 0 ? basePrice : 2e9;
    return months.map((m, i) => {
      const wave = Math.sin((seed + i) * 0.7) * 0.05; // dao động ±5%
      const trend = i * 0.006; // xu hướng tăng nhẹ
      return { m, v: Math.round(base * (0.9 + trend + wave)) };
    });
  }, [basePrice, id]);

  const max = Math.max(...data.map((d) => d.v));
  const min = Math.min(...data.map((d) => d.v));
  const first = data[0].v;
  const last = data[data.length - 1].v;
  const change = first ? ((last - first) / first) * 100 : 0;

  return (
    <section className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">📈 Biểu đồ giá 12 tháng (tham khảo)</h2>
        <span className={`text-sm font-bold ${change >= 0 ? "text-green-600" : "text-red-500"}`}>
          {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(1)}%
        </span>
      </div>
      <div className="flex items-end gap-1.5 sm:gap-2" style={{ height: 160 }}>
        {data.map((d) => {
          const h = max === min ? 60 : 20 + ((d.v - min) / (max - min)) * 120;
          return (
            <div key={d.m} className="flex flex-1 flex-col items-center justify-end gap-1" title={vnd(d.v)}>
              <div className="w-full rounded-t bg-brand-500/80 transition hover:bg-brand-600" style={{ height: h }} />
              <span className="text-[10px] text-ink-muted">{d.m}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-ink-muted">* Biểu đồ mang tính tham khảo, ước tính theo xu hướng thị trường khu vực.</p>
    </section>
  );
}

function LoanCalculator({ basePrice }: { basePrice: number }) {
  const price = basePrice > 0 ? basePrice : 2e9;
  const [percent, setPercent] = useState(70);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(9);

  const loan = Math.round((price * percent) / 100);
  const months = years * 12;
  const r = rate / 100 / 12;
  const monthly = r > 0 ? Math.round((loan * r) / (1 - Math.pow(1 + r, -months))) : Math.round(loan / months);
  const totalInterest = monthly * months - loan;

  return (
    <section className="card p-6">
      <h2 className="mb-4 text-lg font-bold text-ink">🏦 Tính khoản vay ngân hàng</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm">
          <span className="text-ink-muted">Vay {percent}% giá trị</span>
          <input type="range" min={0} max={100} step={5} value={percent} onChange={(e) => setPercent(+e.target.value)} className="mt-1 w-full accent-brand-600" />
        </label>
        <label className="text-sm">
          <span className="text-ink-muted">Thời hạn {years} năm</span>
          <input type="range" min={1} max={30} value={years} onChange={(e) => setYears(+e.target.value)} className="mt-1 w-full accent-brand-600" />
        </label>
        <label className="text-sm">
          <span className="text-ink-muted">Lãi suất {rate}%/năm</span>
          <input type="range" min={1} max={20} step={0.5} value={rate} onChange={(e) => setRate(+e.target.value)} className="mt-1 w-full accent-brand-600" />
        </label>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-brand-50 p-4 text-center">
          <p className="text-xs text-ink-muted">Số tiền vay</p>
          <p className="text-lg font-extrabold text-brand-700">{vnd(loan)}</p>
        </div>
        <div className="rounded-xl bg-brand-50 p-4 text-center">
          <p className="text-xs text-ink-muted">Trả hàng tháng</p>
          <p className="text-lg font-extrabold text-brand-700">{monthly.toLocaleString("vi-VN")} đ</p>
        </div>
        <div className="rounded-xl bg-brand-50 p-4 text-center">
          <p className="text-xs text-ink-muted">Tổng lãi ước tính</p>
          <p className="text-lg font-extrabold text-brand-700">{vnd(totalInterest)}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-ink-muted">* Ước tính theo dư nợ giảm dần. Con số thực tế tùy chính sách từng ngân hàng.</p>

      <h3 className="mb-3 mt-6 font-bold text-ink">Ngân hàng hỗ trợ vay</h3>
      <div className="flex flex-wrap gap-2">
        {BANKS.map((b) => (
          <span key={b.short} className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded font-bold text-white" style={{ backgroundColor: b.color, fontSize: 10 }}>{b.short}</span>
            <span className="text-sm text-ink-soft">{b.name}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
