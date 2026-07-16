import { createClient } from "@/lib/supabase/server";
import { saveHomeVideo, deleteHomeVideo } from "@/app/actions/home-video";

const inputCls = "w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand";

export default async function Page() {
  const supabase = await createClient();
  const { data: videos } = await supabase.from("home_videos").select("*").order("sort_order", { ascending: true });
  const list = videos || [];
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-900">Video trang chủ (TikTok)</h1>
      <form
        action={async (formData: FormData) => {
          "use server";
          await saveHomeVideo({}, formData);
        }}
        className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1.5 block text-sm font-medium text-neutral-700">Tiêu đề</label><input name="title" className={inputCls} /></div>
          <div><label className="mb-1.5 block text-sm font-medium text-neutral-700">Link TikTok</label><input name="tiktok_url" className={inputCls} required /></div>
          <div><label className="mb-1.5 block text-sm font-medium text-neutral-700">Thứ tự</label><input name="sort_order" type="number" defaultValue={list.length} className={inputCls} /></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked className="accent-brand" /> Hiển thị</label>
        </div>
        <button className="mt-4 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">Thêm video</button>
      </form>
      <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500"><tr><th className="px-3 py-3">Tiêu đề</th><th className="px-3 py-3">Link</th><th className="px-3 py-3">Thứ tự</th><th className="px-3 py-3"></th></tr></thead>
          <tbody className="divide-y divide-neutral-100">
            {list.map((v) => (
              <tr key={v.id}><td className="px-3 py-3 font-medium text-neutral-900">{v.title || "—"}</td><td className="px-3 py-3 max-w-xs truncate text-neutral-500">{v.tiktok_url}</td><td className="px-3 py-3">{v.sort_order}</td><td className="px-3 py-3"><form action={deleteHomeVideo}><input type="hidden" name="id" value={v.id} /><button className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50">Xóa</button></form></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
