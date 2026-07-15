import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import WalletCard from "@/components/WalletCard";
export const metadata = { title: "Nạp tiền | Tài khoản" };

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: p } = await supabase.from("profiles").select("so_du, tong_nap, da_su_dung, membership_tier, membership_expires_at").eq("id", user!.id).maybeSingle();
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-900">Nạp tiền</h1>
      <WalletCard soDu={p?.so_du || 0} tongNap={p?.tong_nap || 0} daSuDung={p?.da_su_dung || 0} tier={p?.membership_tier} expires={p?.membership_expires_at} />
      <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-neutral-900">Nạp tiền vào ví qua chuyển khoản</h2>
        <p className="mt-1 text-sm text-neutral-500">Chọn gói dịch vụ hoặc nạp tiền để sử dụng các tiện ích đăng tin. Thanh toán tự động qua SePay.</p>
        <Link href="/bang-gia" className="mt-4 inline-block rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark">Xem bảng giá & nạp tiền</Link>
      </div>
    </div>
  );
}
