import { createClient } from "@/lib/supabase/server";
import AdminMemberRow from "@/components/AdminMemberRow";

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const sp = await searchParams;
  const search = (sp?.q || "").trim();
  const supabase = await createClient();
  let query = supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(200);
  if (search) query = query.or("full_name.ilike.%" + search + "%,email.ilike.%" + search + "%,phone.ilike.%" + search + "%");
  const { data: members } = await query;
  const list = members || [];
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <h1 className="text-xl font-bold text-neutral-900">Thành viên</h1>
        <form className="ml-auto"><input name="q" defaultValue={search} placeholder="Tìm theo tên / email / SĐT" className="w-64 rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand" /></form>
      </div>
      <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
            <tr><th className="px-3 py-3">Thành viên</th><th className="px-3 py-3">Hạng</th><th className="px-3 py-3">Số dư</th><th className="px-3 py-3"></th></tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">{list.map((m) => <AdminMemberRow key={m.id} member={m} />)}</tbody>
        </table>
      </div>
    </div>
  );
}
