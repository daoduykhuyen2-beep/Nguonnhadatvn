"use client";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { changePassword } from "@/app/actions/account";

const inputCls = "w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";
const labelCls = "mb-1.5 block text-sm font-medium text-neutral-700";

function Save({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return <button disabled={pending || disabled} className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60">{pending ? "Đang lưu…" : "Đổi mật khẩu"}</button>;
}

export default function PasswordForm() {
  const [state, action] = useActionState(changePassword, {} as any);
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const mismatch = confirm.length > 0 && pw !== confirm;
  const tooShort = pw.length > 0 && pw.length < 6;

  return (
    <form action={action} className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
      {state?.error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>}
      {state?.ok && <div className="mb-4 rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-brand-dark">Đổi mật khẩu thành công.</div>}
      <div className="grid gap-4 sm:max-w-md">
        <div>
          <label className={labelCls}>Mật khẩu mới</label>
          <div className="relative">
            <input name="password" type={show ? "text" : "password"} required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} className={inputCls + " pr-16"} />
            <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-brand-700 hover:underline">{show ? "Ẩn" : "Hiện"}</button>
          </div>
          {tooShort && <p className="mt-1 text-xs text-red-600">Mật khẩu phải có ít nhất 6 ký tự.</p>}
        </div>
        <div>
          <label className={labelCls}>Xác nhận mật khẩu</label>
          <div className="relative">
            <input name="confirm" type={showConfirm ? "text" : "password"} required value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputCls + " pr-16"} />
            <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-brand-700 hover:underline">{showConfirm ? "Ẩn" : "Hiện"}</button>
          </div>
          {mismatch && <p className="mt-1 text-xs text-red-600">Mật khẩu xác nhận không khớp.</p>}
          {!mismatch && confirm.length > 0 && <p className="mt-1 text-xs text-green-600">Mật khẩu khớp.</p>}
        </div>
      </div>
      <div className="mt-5"><Save disabled={mismatch || tooShort} /></div>
    </form>
  );
}
