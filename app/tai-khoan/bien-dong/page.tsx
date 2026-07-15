import { createClient } from "@/lib/supabase/server";
import { formatVND } from "@/lib/plans";
export const metadata = { title: "Biến động số dư | Tài khoản" };

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: payments } = await supabase.from("payments").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(100);
  const list = payments || [];
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-neutral-900">Biến động số dư</h1>
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white py-16 text-center text-sm text-neutral-500">Chưa có giao dịch nào.</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr><th className="px-4 py-3">Nội dung</th><th className="px-4 py-3">Số tiền</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3">Thời gian</th></tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {list.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-3 font-medium text-neutral-800">{t.transfer_content || t.plan_code || "Giao dịch"}</td>
                  <td className="px-4 py-3 font-semibold text-brand-dark">{formatVND(t.amount || 0)}</td>
                  <td className="px-4 py-3">
                    <span className={"rounded-full border px-2.5 py-0.5 text-xs font-medium " + (t.status === "paid" || t.status === "success" ? "border-brand/30 bg-brand/10 text-brand-dark" : "border-amber-200 bg-amber-50 text-amber-700")}>{t.status === "paid" || t.status === "success" ? "Thành công" : "Chờ thanh toán"}</span>
                  </td>
                  <td className="px-4 py-3 text-neutral-400">{new Date(t.created_at).toLocaleString("vi-VN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
