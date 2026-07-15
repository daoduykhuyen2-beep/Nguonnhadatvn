"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { changePassword } from "@/app/actions/account";

const inputCls = "w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";
const labelCls = "mb-1.5 block text-sm font-medium text-neutral-700";
function Save() { const { pending } = useFormStatus(); return <button disabled={pending} className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60">{pending ? "Đang lưu…" : "Đổi mật khẩu"}</button>; }

export default function PasswordForm() {
  const [state, action] = useActionState(changePassword, {} as any);
  return (
    <form action={action} className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
      {state?.error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>}
      {state?.ok && <div className="mb-4 rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-brand-dark">Đổi mật khẩu thành công.</div>}
      <div className="grid gap-4 sm:max-w-md">
        <div><label className={labelCls}>Mật khẩu mới</label><input name="password" type="password" className={inputCls} /></div>
        <div><label className={labelCls}>Xác nhận mật khẩu</label><input name="confirm" type="password" className={inputCls} /></div>
      </div>
      <div className="mt-5"><Save /></div>
    </form>
  );
}
