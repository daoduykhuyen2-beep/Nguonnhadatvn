import { createClient } from "@/lib/supabase/server";
import LeadRow from "@/components/LeadRow";
export const metadata = { title: "Khách hàng liên hệ | Tài khoản" };

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: leads } = await supabase.from("web_post_leads").select("*").eq("owner", user!.id).order("created_at", { ascending: false });
  const list = leads || [];
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-neutral-900">Khách hàng liên hệ <span className="text-sm font-normal text-neutral-400">({list.length})</span></h1>
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white py-16 text-center text-sm text-neutral-500">Chưa có khách hàng nào liên hệ.</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr><th className="px-4 py-3">Khách hàng</th><th className="px-4 py-3">SĐT</th><th className="px-4 py-3">Nội dung</th><th className="px-4 py-3">Thời gian</th><th className="px-4 py-3"></th></tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {list.map((l) => <LeadRow key={l.id} lead={l} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
