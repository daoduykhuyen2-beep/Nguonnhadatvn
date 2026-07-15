"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { adminSaveNews } from "@/app/actions/admin";

const inputCls = "w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand";
function Save() { const { pending } = useFormStatus(); return <button disabled={pending} className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">{pending ? "Đang lưu…" : "Đăng bài"}</button>; }

export default function AdminNewsForm() {
  const [state, action] = useActionState(adminSaveNews, {} as any);
  return (
    <form action={action} className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-neutral-900">Viết tin tức mới</h2>
      {state?.error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>}
      {state?.ok && <div className="mb-4 rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-brand-dark">Đã đăng bài viết.</div>}
      <div className="space-y-4">
        <div><label className="mb-1.5 block text-sm font-medium text-neutral-700">Tiêu đề *</label><input name="tieu_de" className={inputCls} required /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1.5 block text-sm font-medium text-neutral-700">Loại</label><select name="loai" className={inputCls}><option value="tin_tuc">Tin tức</option><option value="huong_dan">Hướng dẫn</option><option value="thi_truong">Thị trường</option></select></div>
          <div><label className="mb-1.5 block text-sm font-medium text-neutral-700">Ảnh bìa (URL)</label><input name="anh_bia" className={inputCls} /></div>
        </div>
        <div><label className="mb-1.5 block text-sm font-medium text-neutral-700">Mô tả ngắn</label><input name="mo_ta" className={inputCls} /></div>
        <div><label className="mb-1.5 block text-sm font-medium text-neutral-700">Video (URL)</label><input name="video_url" className={inputCls} /></div>
        <div><label className="mb-1.5 block text-sm font-medium text-neutral-700">Nội dung</label><textarea name="noi_dung" rows={8} className={inputCls} /></div>
      </div>
      <div className="mt-4"><Save /></div>
    </form>
  );
}
