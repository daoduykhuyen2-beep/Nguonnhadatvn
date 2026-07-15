"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { adminAdjustBalance } from "@/app/actions/admin-nap";

function Save() { const { pending } = useFormStatus(); return <button disabled={pending} className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">{pending ? "Đang xử lý…" : "Điều chỉnh số dư"}</button>; }

export default function AdminTopupForm() {
  const [state, action] = useActionState(adminAdjustBalance, {} as any);
  const inputCls = "w-full rounded-xl border border-neutral-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand";
  return (
    <form action={action} className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
      {state?.error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>}
      {state?.ok && <div className="mb-4 rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-brand-dark">Đã điều chỉnh số dư.</div>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="mb-1.5 block text-sm font-medium text-neutral-700">User ID thành viên</label><input name="user_id" className={inputCls} placeholder="UUID của thành viên" /></div>
        <div><label className="mb-1.5 block text-sm font-medium text-neutral-700">Số tiền (âm để trừ)</label><input name="amount" type="number" className={inputCls} placeholder="VD: 100000" /></div>
      </div>
      <div className="mt-4"><Save /></div>
      <p className="mt-2 text-xs text-neutral-400">Lấy User ID ở trang Thành viên. Dùng số âm để trừ tiền.</p>
    </form>
  );
}
