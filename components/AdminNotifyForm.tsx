"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { adminSendNotification } from "@/app/actions/admin";

const inputCls = "w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand";
function Save() { const { pending } = useFormStatus(); return <button disabled={pending} className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">{pending ? "Đang gửi…" : "Gửi thông báo"}</button>; }

export default function AdminNotifyForm() {
  const [state, action] = useActionState(adminSendNotification, {} as any);
  return (
    <form action={action} className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
      {state?.error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>}
      {state?.ok && <div className="mb-4 rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-brand-dark">Đã gửi thông báo.</div>}
      <div className="space-y-4">
        <div><label className="mb-1.5 block text-sm font-medium text-neutral-700">Tiêu đề *</label><input name="tieu_de" className={inputCls} required /></div>
        <div><label className="mb-1.5 block text-sm font-medium text-neutral-700">Nội dung</label><textarea name="noi_dung" rows={4} className={inputCls} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1.5 block text-sm font-medium text-neutral-700">Loại</label><select name="loai" className={inputCls}><option value="he_thong">Hệ thống</option><option value="khuyen_mai">Khuyến mãi</option><option value="tai_chinh">Tài chính</option></select></div>
          <div><label className="mb-1.5 block text-sm font-medium text-neutral-700">Gửi riêng (User ID, để trống = tất cả)</label><input name="target_user" className={inputCls} /></div>
        </div>
      </div>
      <div className="mt-4"><Save /></div>
    </form>
  );
}
