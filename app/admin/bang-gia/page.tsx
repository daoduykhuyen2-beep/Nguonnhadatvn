import { createClient } from "@/lib/supabase/server";
import { PLANS } from "@/lib/plans";
import AdminPlanRow from "@/components/AdminPlanRow";

export default async function Page() {
  const supabase = await createClient();
  const { data: overrides } = await supabase.from("plan_overrides").select("*");
  const byCode = Object.fromEntries((overrides || []).map((o) => [o.code, o]));
  const groups = [{ k: "hoi_vien", t: "Gói hội viên" }, { k: "tin", t: "Đăng tin lẻ" }, { k: "day", t: "Đẩy tin" }];
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-900">Bảng giá (ghi đè)</h1>
      <p className="text-sm text-neutral-500">Chỉnh giá tại đây sẽ ghi đè giá gốc trên trang Bảng giá. Để trống ô sẽ dùng giá mặc định.</p>
      {groups.map((g) => (
        <div key={g.k}>
          <h2 className="mb-2 text-base font-semibold text-neutral-900">{g.t}</h2>
          <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
            <table className="w-full text-sm"><tbody className="divide-y divide-neutral-100">
              {PLANS.filter((p) => p.group === g.k).map((p) => <AdminPlanRow key={p.code} plan={p} override={byCode[p.code]} />)}
            </tbody></table>
          </div>
        </div>
      ))}
    </div>
  );
}
