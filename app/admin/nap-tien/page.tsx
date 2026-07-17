import { createClient } from "@/lib/supabase/server";
import AdminTopupForm from "@/components/AdminTopupForm";
import { formatVND } from "@/lib/plans";

export default async function Page() {
  const supabase = await createClient();
  const { data: payments } = await supabase.from("payments").select("*").order("created_at", { ascending: false }).limit(50);
  const list = payments || [];
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-900">Nạp tiền thủ công</h1>
      <AdminTopupForm />
      <div>
        <h2 className="mb-3 text-base font-semibold text-neutral-900">Giao dịch gần đây</h2>
        <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500"><tr><th className="px-3 py-3">Nội dung</th><th className="px-3 py-3">Số tiền</th><th className="px-3 py-3">Trạng thái</th><th className="px-3 py-3">Thời gian</th></tr></thead>
            <tbody className="divide-y divide-neutral-100">
              {list.map((t) => (
                <tr key={t.id}><td className="px-3 py-3">{t.transfer_content || t.plan_code}</td><td className="px-3 py-3 font-semibold text-brand-dark">{formatVND(t.amount || 0)}</td><td className="px-3 py-3">{t.status === "paid" ? "Thành công" : t.status === "cancelled" ? "Đã huỷ" : "Chờ"}</td><td className="px-3 py-3 text-neutral-400">{new Date(t.created_at).toLocaleString("vi-VN")}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
