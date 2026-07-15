import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PLANS, formatVND, getEffectivePrice } from "@/lib/plans";
export const metadata = { title: "Gói hội viên | Tài khoản" };

const TIER_LABEL: Record<string, string> = { free: "Miễn phí", bac: "Bạc", vang: "Vàng", kim_cuong: "Kim cương" };

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: p } = await supabase.from("profiles").select("membership_tier, membership_expires_at").eq("id", user!.id).maybeSingle();
  const memberships = PLANS.filter((x) => x.group === "hoi_vien");
  const tier = p?.membership_tier || "free";
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-900">Gói hội viên</h1>
      <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
        <div className="text-sm text-neutral-500">Gói hiện tại</div>
        <div className="mt-1 flex items-center gap-3">
          <span className="text-2xl font-bold text-neutral-900">{TIER_LABEL[tier] || tier}</span>
          {p?.membership_expires_at && <span className="text-sm text-neutral-500">đến {new Date(p.membership_expires_at).toLocaleDateString("vi-VN")}</span>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {memberships.map((m) => {
          const eff = getEffectivePrice(m);
          return (
            <div key={m.code} className="flex flex-col rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
              <div className="text-base font-semibold text-neutral-900">{m.name}</div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-brand-dark">{formatVND(eff)}</span>
                {m.marketPrice > eff && <span className="text-sm text-neutral-400 line-through">{formatVND(m.marketPrice)}</span>}
              </div>
              <div className="mt-1 text-xs text-neutral-500">{m.days} ngày</div>
              <Link href={"/bang-gia?plan=" + m.code} className="mt-4 rounded-xl bg-brand px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-brand-dark">Đăng ký</Link>
            </div>
          );
        })}
      </div>
      {memberships.length === 0 && <p className="text-sm text-neutral-500">Xem đầy đủ các gói tại <Link href="/bang-gia" className="text-brand underline">Bảng giá</Link>.</p>}
    </div>
  );
}
