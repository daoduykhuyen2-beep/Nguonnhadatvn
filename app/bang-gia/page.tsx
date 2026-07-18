import { createClient } from "@/lib/supabase/server";
import { PLANS, formatVND, getEffectivePrice, getDiscountPercent, isPromoActive, type Plan } from "@/lib/plans";
import { getPlanMerged } from "@/lib/plans-server";
import { createOrder } from "@/app/actions/payment";

export const metadata = { title: "Bảng giá dịch vụ", description: "Bảng giá đăng tin, đẩy tin và gói hội viên." };

const GROUPS: { key: string; title: string; desc: string }[] = [
  { key: "tin", title: "Gói dành cho môi giới", desc: "Mua từng tin, phù hợp nhu cầu ít" },
  { key: "day", title: "Đẩy tin", desc: "Đưa tin của bạn lên đầu danh sách" },
  { key: "hoi_vien", title: "Gói Đối tác", desc: "Tiết kiệm nhất cho môi giới đăng tin thường xuyên" },
];

function PlanCard({ plan, highlight, postId }: { plan: any; highlight?: boolean; postId?: string }) {
  const eff = getEffectivePrice(plan);
  const promo = isPromoActive(plan);
  const disc = getDiscountPercent(plan);
  return (
    <div className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md ${highlight ? "border-brand ring-1 ring-brand" : "border-neutral-100"}`}>
      {highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">Phổ biến</span>}
      <div className="text-base font-semibold text-neutral-900">{plan.name}</div>
      {plan.desc && <p className="mt-2 text-sm leading-relaxed text-neutral-500">{plan.desc}</p>}
      <div className="mt-3 flex items-end gap-2">
        <span className="text-3xl font-bold text-brand-dark">{formatVND(eff)}</span>
        {plan.marketPrice > eff && <span className="mb-1 text-sm text-neutral-400 line-through">{formatVND(plan.marketPrice)}</span>}
      </div>
      {disc > 0 && <span className="mt-1 inline-block w-fit rounded-md bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">-{disc}%{promo && plan.promoLabel ? " · " + plan.promoLabel : ""}</span>}
      <ul className="mt-4 flex-1 space-y-2 text-sm text-neutral-600">
        {plan.days && <li className="flex gap-2"><span className="text-brand">✓</span> Thời hạn {plan.days} ngày</li>}
        {plan.quota && <li className="flex gap-2"><span className="text-brand">✓</span> {plan.quota >= 999999 ? "Đăng tin không giới hạn" : plan.quota + " tin đăng"}</li>}
        {plan.pushCredits && <li className="flex gap-2"><span className="text-brand">✓</span> {plan.pushCredits} lượt đẩy tin</li>}
        {plan.tier && plan.group !== "hoi_vien" && <li className="flex gap-2"><span className="text-brand">✓</span> Hiển thị {plan.tier === "kim_cuong" ? "VIP Kim cương" : plan.tier === "vang" ? "VIP Vàng" : "tin thường"}</li>}
        {plan.features && plan.features.map((f: string, idx: number) => (
          <li key={idx} className="flex gap-2"><span className="text-brand">✓</span> {f}</li>
        ))}
      </ul>
      <form action={createOrder} className="mt-5">
        <input type="hidden" name="plan" value={plan.code} />
        {postId && <input type="hidden" name="post_id" value={postId} />}
        <button className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark">Chọn gói</button>
      </form>
    </div>
  );
}

export default async function Page({ searchParams }: { searchParams: Promise<{ post?: string }> }) {
  const sp = await searchParams;
  const postId = sp?.post;
  const supabase = await createClient();
  await supabase.auth.getUser();
  // Ghi đè giá theo bảng plan_overrides (đồng bộ với giá admin đã chỉnh).
  const merged = await Promise.all(PLANS.map((p) => getPlanMerged(p.code)));
  const mergedPlans: Plan[] = merged.map((m, i) => m || PLANS[i]);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900">Bảng giá dịch vụ</h1>
        <p className="mt-2 text-neutral-500">Chọn gói phù hợp — thanh toán nhanh qua chuyển khoản, kích hoạt tự động.</p>
      </div>
      {GROUPS.map((g) => {
        if (postId && g.key === "hoi_vien") return null;
        const plans = mergedPlans.filter((p) => p.group === g.key);
        if (!plans.length) return null;
        return (
          <section key={g.key} className="mt-12">
            <div className="mb-5"><h2 className="text-xl font-bold text-neutral-900">{g.title}</h2><p className="text-sm text-neutral-500">{g.desc}</p></div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((p, i) => <PlanCard key={p.code} plan={p} highlight={g.key === "tin" && i === 1} postId={postId} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
