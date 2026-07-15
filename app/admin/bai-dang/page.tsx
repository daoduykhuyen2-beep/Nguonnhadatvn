import { createClient } from "@/lib/supabase/server";
import AdminPostRow from "@/components/AdminPostRow";

export default async function Page({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  const sp = await searchParams;
  const filter = sp?.f || "all";
  const supabase = await createClient();
  let q = supabase.from("web_posts").select("*").order("created_at", { ascending: false }).limit(200);
  if (filter === "pending") q = q.neq("trang_thai", "duyet");
  const { data: posts } = await q;
  const list = posts || [];
  const tabs = [{ v: "all", l: "Tất cả" }, { v: "pending", l: "Chờ duyệt" }];
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <h1 className="text-xl font-bold text-neutral-900">Duyệt tin đăng</h1>
        <div className="ml-auto flex gap-1 rounded-xl bg-neutral-100 p-1">
          {tabs.map((t) => (
            <a key={t.v} href={"/admin/bai-dang?f=" + t.v} className={"rounded-lg px-3 py-1.5 text-sm font-medium " + (filter === t.v ? "bg-white text-brand-dark shadow-sm" : "text-neutral-500")}>{t.l}</a>
          ))}
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
            <tr><th className="px-3 py-3">Tin đăng</th><th className="px-3 py-3">Hạng</th><th className="px-3 py-3">Trạng thái</th><th className="px-3 py-3">Thao tác</th></tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {list.map((p) => <AdminPostRow key={p.id} post={p} />)}
          </tbody>
        </table>
        {list.length === 0 && <div className="py-12 text-center text-sm text-neutral-400">Không có tin nào.</div>}
      </div>
    </div>
  );
}
