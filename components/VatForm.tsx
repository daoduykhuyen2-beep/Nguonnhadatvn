"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateVat } from "@/app/actions/account";
import type { Profile } from "@/lib/types";

const inputCls = "w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";
const labelCls = "mb-1.5 block text-sm font-medium text-neutral-700";
function Save() { const { pending } = useFormStatus(); return <button disabled={pending} className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60">{pending ? "Đang lưu…" : "Lưu thông tin"}</button>; }

export default function VatForm({ profile }: { profile: Profile }) {
  const [state, action] = useActionState(updateVat, {} as any);
  return (
    <form action={action} className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
      {state?.error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>}
      {state?.ok && <div className="mb-4 rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-brand-dark">Đã lưu thông tin xuất hóa đơn.</div>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><label className={labelCls}>Tên công ty</label><input name="vat_company" defaultValue={profile.vat_company || ""} className={inputCls} /></div>
        <div><label className={labelCls}>Mã số thuế</label><input name="vat_tax_code" defaultValue={profile.vat_tax_code || ""} className={inputCls} /></div>
        <div><label className={labelCls}>Email nhận hóa đơn</label><input name="vat_email" defaultValue={profile.vat_email || ""} className={inputCls} /></div>
        <div className="sm:col-span-2"><label className={labelCls}>Địa chỉ</label><input name="vat_address" defaultValue={profile.vat_address || ""} className={inputCls} /></div>
      </div>
      <div className="mt-5"><Save /></div>
    </form>
  );
}
