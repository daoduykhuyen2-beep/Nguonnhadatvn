import { createClient } from "@/lib/supabase/server";
import AdminNewsForm from "@/components/AdminNewsForm";
import AdminNewsDelete from "@/components/AdminNewsDelete";

export default async function Page() {
  const supabase = await createClient();
  const { data: news } = await supabase.from("news").select("*").order("created_at", { ascending: false }).limit(100);
  const list = news || [];
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-900">Tin tức</h1>
      <AdminNewsForm />
      <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500"><tr><th className="px-3 py-3">Tiêu đề</th><th className="px-3 py-3">Loại</th><th className="px-3 py-3">Ngày</th><th className="px-3 py-3"></th></tr></thead>
          <tbody className="divide-y divide-neutral-100">
            {list.map((n) => (
              <tr key={n.id}><td className="px-3 py-3 font-medium text-neutral-900">{n.tieu_de}</td><td className="px-3 py-3 text-neutral-500">{n.loai}</td><td className="px-3 py-3 text-neutral-400">{new Date(n.created_at).toLocaleDateString("vi-VN")}</td><td className="px-3 py-3"><AdminNewsDelete id={n.id} /></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
