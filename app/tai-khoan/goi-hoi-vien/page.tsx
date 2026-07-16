import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PLANS, formatVND, getEffectivePrice } from "@/lib/plans";
export const metadata = { title: "Gói hội viên | Tài khoản" };

const TIER_LABEL: Record<string, string> = { free: "Miễn phí", bac: "Bạc", vang: "Vàng", vip: "VIP", kim_cuong: "Kim cương" };

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: p } = await supabase.from("profiles").select("membership_tier, membership_expires_at").eq("id", user!.id).maybeSingle();
  const memberships = PLANS.filter((x) => x.group === "hoi_vien");
  const tier = p?.membership_tier || "free";
  const active = p?.membership_expires_at ? new Date(p.membership_expires_at).getTime() > Date.now() : false;
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-900">Gói hội viên</h1>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="text-sm text-neutral-500">Gói hiện tại</div>
        <div className="mt-1 flex items-center gap-3">
          <span className="text-2xl font-bold text-neutral-900">{active ? (TIER_LABEL[tier] || tier) : "Miễn phí"}</span>
          {active && p?.membership_expires_at && <span className="text-sm text-neutral-500">còn hạn đến {new Date(p.membership_expires_at).toLocaleDateString("vi-VN")}</span>}
        </div>
      </div>

      {/* Banner đánh vào tâm lý người mua nhà */}
      <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5">
        <h2 className="text-lg font-bold text-neutral-900">Đang tìm nhà phố để mua? Đừng bỏ lỡ hơn 20.000 căn đang bán trên cả nước 🏡</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          Chỉ với <strong>một gói duy nhất</strong>, bạn mở khóa toàn bộ kho nhà phố toàn quốc: xem
          <strong> số điện thoại chính chủ</strong>, <strong>địa chỉ số nhà chi tiết</strong>, giá bán thật và hình ảnh – video thực tế.
          Liên hệ mua bán trực tiếp, <strong>không qua môi giới, không mất phí hoa hồng</strong>.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {memberships.map((m) => {
          const eff = getEffectivePrice(m);
          return (
            <div key={m.code} className="flex flex-col rounded-2xl border-2 border-brand/40 bg-white p-6 shadow-sm">
              <div className="text-lg font-bold text-neutral-900">{m.name}</div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-brand-dark">{formatVND(eff)}</span>
                {m.marketPrice && m.marketPrice > eff && <span className="text-sm text-neutral-400 line-through">{formatVND(m.marketPrice)}</span>}
              </div>
              <div className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-dark">⏳ Thời hạn {m.days} ngày</div>

              {m.desc && <p className="mt-3 text-sm leading-relaxed text-neutral-600">{m.desc}</p>}

              {m.features && m.features.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {m.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                      <span className="mt-0.5 text-brand">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}

              <Link href={"/bang-gia?plan=" + m.code} className="mt-6 rounded-xl bg-brand px-4 py-3 text-center text-base font-bold text-white transition hover:bg-brand-dark">Đăng ký ngay để xem kho nhà</Link>
              <p className="mt-2 text-center text-xs text-neutral-400">Kích hoạt tức thì sau khi thanh toán</p>
            </div>
          );
        })}
      </div>

      {memberships.length === 0 && <p className="text-sm text-neutral-500">Xem đầy đủ các gói tại <Link href="/bang-gia" className="text-brand underline">Bảng giá</Link>.</p>}
    </div>
  );
}
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
