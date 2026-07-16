import { createClient } from "@/lib/supabase/server";
import { saveBanner, toggleBanner, deleteBanner } from "@/app/actions/banner";

const inputCls = "w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand";

export default async function Page() {
  const supabase = await createClient();
  const { data: banners } = await supabase.from("banners").select("*").order("sort_order", { ascending: true });
  const list = banners || [];
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-900">Banner trang chủ</h1>
      <form
        action={async (formData: FormData) => {
          "use server";
          await saveBanner({}, formData);
        }}
        className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-neutral-900">Thêm banner mới</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><label className="mb-1.5 block text-sm font-medium text-neutral-700">Ảnh (URL)</label><input name="image_url" className={inputCls} required /></div>
          <div><label className="mb-1.5 block text-sm font-medium text-neutral-700">Tiêu đề</label><input name="title" className={inputCls} /></div>
          <div><label className="mb-1.5 block text-sm font-medium text-neutral-700">Phụ đề</label><input name="subtitle" className={inputCls} /></div>
          <div><label className="mb-1.5 block text-sm font-medium text-neutral-700">Link khi click</label><input name="link_url" className={inputCls} /></div>
          <div><label className="mb-1.5 block text-sm font-medium text-neutral-700">Thứ tự</label><input name="sort_order" type="number" defaultValue={list.length} className={inputCls} /></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked className="accent-brand" /> Hiển thị</label>
        </div>
        <button className="mt-4 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">Thêm banner</button>
      </form>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((b) => (
          <div key={b.id} className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.image_url} alt="" className="aspect-video w-full object-cover" />
            <div className="p-3">
              <div className="font-medium text-neutral-900">{b.title || "(không tiêu đề)"}</div>
              <div className="text-xs text-neutral-400">Thứ tự {b.sort_order} · {b.active ? "Đang hiển thị" : "Ẩn"}</div>
              <div className="mt-3 flex gap-2">
                <form action={toggleBanner}><input type="hidden" name="id" value={b.id} /><input type="hidden" name="active" value={String(b.active)} /><button className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50">{b.active ? "Ẩn" : "Hiện"}</button></form>
                <form action={deleteBanner}><input type="hidden" name="id" value={b.id} /><button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">Xóa</button></form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
