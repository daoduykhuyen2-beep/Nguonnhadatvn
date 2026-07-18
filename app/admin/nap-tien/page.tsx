import { createClient } from "@/lib/supabase/server";
import AdminTopupForm from "@/components/AdminTopupForm";
import { formatVND } from "@/lib/plans";

export default async function Page() {
  const supabase = await createClient();
  const { data: payments } = await supabase.from("payments").select("*").order("created_at", { ascending: false }).limit(100);
  const list = payments || [];

  // Lay thong tin nguoi nap (join thu cong qua user_id -> profiles)
  const userIds = Array.from(new Set(list.map((t: any) => t.user_id).filter(Boolean)));
  const profileMap: Record<string, { full_name: string | null; email: string | null; phone: string | null }> = {};
  if (userIds.length > 0) {
    const { data: profs } = await supabase.from("profiles").select("id, full_name, email, phone").in("id", userIds);
    (profs || []).forEach((p: any) => {
      profileMap[p.id] = { full_name: p.full_name, email: p.email, phone: p.phone };
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-900">Nạp tiền thủ công</h1>
      <AdminTopupForm />
      <div>
        <h2 className="mb-3 text-base font-semibold text-neutral-900">Giao dịch gần đây</h2>
        <div className="overflow-x-auto rounded-2xl border border-neutral-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-3 py-3">Người nạp</th>
                <th className="px-3 py-3">Nội dung</th>
                <th className="px-3 py-3">Số tiền</th>
                <th className="px-3 py-3">Trạng thái</th>
                <th className="px-3 py-3">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {list.map((t: any) => {
                const prof = profileMap[t.user_id];
                return (
                  <tr key={t.id}>
                    <td className="px-3 py-3">
                      <div className="font-semibold text-neutral-900">{prof?.full_name || "(Chưa có tên)"}</div>
                      <div className="text-xs text-neutral-500">{prof?.email || "—"}</div>
                      <div className="text-xs text-neutral-500">{prof?.phone || "—"}</div>
                    </td>
                    <td className="px-3 py-3">{t.transfer_content || t.plan_code}</td>
                    <td className="px-3 py-3 font-semibold text-brand-dark">{formatVND(t.amount || 0)}</td>
                    <td className="px-3 py-3">{t.status === "paid" ? "Thành công" : t.status === "cancelled" ? "Đã huỷ" : "Chờ"}</td>
                    <td className="px-3 py-3 text-neutral-400">{new Date(t.created_at).toLocaleString("vi-VN")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
