"use client";
import { useState, useMemo } from "react";

function fmt(n: number) { return new Intl.NumberFormat("vi-VN").format(Math.round(n)); }

export default function LoanCalculator({ defaultPrice = 0 }: { defaultPrice?: number }) {
  const [price, setPrice] = useState(defaultPrice || 3000000000);
  const [percent, setPercent] = useState(70);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(11);

  const result = useMemo(() => {
    const loan = (price * percent) / 100;
    const months = years * 12;
    const monthlyRate = rate / 100 / 12;
    const monthlyPay = monthlyRate > 0
      ? (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
      : loan / months;
    return { loan, months, monthlyPay, own: price - loan };
  }, [price, percent, years, rate]);

  const field = "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-neutral-900">Công cụ tính khoản vay</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="mb-1 block text-xs text-neutral-500">Giá trị BĐS (đ)</label><input type="number" value={price} onChange={(e) => setPrice(+e.target.value)} className={field} /></div>
        <div><label className="mb-1 block text-xs text-neutral-500">Tỷ lệ vay ({percent}%)</label><input type="range" min={10} max={90} value={percent} onChange={(e) => setPercent(+e.target.value)} className="w-full accent-brand" /></div>
        <div><label className="mb-1 block text-xs text-neutral-500">Thời hạn (năm)</label><input type="number" value={years} onChange={(e) => setYears(+e.target.value)} className={field} /></div>
        <div><label className="mb-1 block text-xs text-neutral-500">Lãi suất (%/năm)</label><input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} className={field} /></div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-brand/5 p-4"><div className="text-xs text-neutral-500">Vốn tự có</div><div className="mt-1 text-lg font-bold text-neutral-900">{fmt(result.own)} đ</div></div>
        <div className="rounded-xl bg-brand/5 p-4"><div className="text-xs text-neutral-500">Số tiền vay</div><div className="mt-1 text-lg font-bold text-neutral-900">{fmt(result.loan)} đ</div></div>
        <div className="rounded-xl bg-brand p-4 text-white"><div className="text-xs opacity-90">Trả hàng tháng</div><div className="mt-1 text-lg font-bold">{fmt(result.monthlyPay)} đ</div></div>
      </div>
      <p className="mt-3 text-xs text-neutral-400">* Kết quả chỉ mang tính tham khảo theo phương pháp dư nợ giảm dần.</p>
    </div>
  );
}
