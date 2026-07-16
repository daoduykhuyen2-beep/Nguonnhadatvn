import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import WalletCard from "@/components/WalletCard";
import { createTopup } from "@/app/actions/payment";
export const metadata = { title: "Nạp tiền | Tài khoản" };

const QUICK = [50000, 100000, 200000, 500000, 1000000, 2000000];
const fmt = (n: number) => n.toLocaleString("vi-VN");

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: p } = await supabase.from("profiles").select("so_du, tong_nap, da_su_dung, membership_tier, membership_expires_at").eq("id", user!.id).maybeSingle();
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-900">Nạp tiền</h1>
      <WalletCard soDu={p?.so_du || 0} tongNap={p?.tong_nap || 0} daSuDung={p?.da_su_dung || 0} tier={p?.membership_tier} expires={p?.membership_expires_at} />

      <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-neutral-900">Nạp tiền vào ví qua chuyển khoản</h2>
        <p className="mt-1 text-sm text-neutral-500">Chọn nhanh mệnh giá hoặc nhập số tiền (tối thiểu 10.000đ). Thanh toán tự động qua SePay.</p>
        {sp?.error === "amount" && (
          <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">Số tiền tối thiểu là 10.000đ.</p>
        )}
        {sp?.error === "order" && (
          <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">Không tạo được đơn nạp. Vui lòng thử lại.</p>
        )}
        <form action={createTopup} className="mt-4 space-y-4">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {QUICK.map((v) => (
              <button key={v} type="submit" name="amount" value={v} className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm font-semibold text-neutral-800 transition hover:border-brand hover:bg-brand/5 hover:text-brand">
                {fmt(v)}đ
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input name="amount" type="number" min={10000} step={10000} placeholder="Nhập số tiền khác..." className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand" />
            <button type="submit" className="shrink-0 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark">Nạp tiền</button>
          </div>
        </form>
        <Link href="/bang-gia" className="mt-4 inline-block text-sm font-semibold text-brand hover:underline">Hoặc xem bảng giá gói dịch vụ &rarr;</Link>
      </div>
    </div>
  );
}
