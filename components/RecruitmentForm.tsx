"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createRecruitmentLead } from "@/app/actions/leads";

const inputCls = "w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";
const labelCls = "mb-1.5 block text-sm font-medium text-neutral-700";

function Submit() {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60">{pending ? "Đang gửi…" : "Gửi thông tin"}</button>;
}

export default function RecruitmentForm() {
  const [state, action] = useActionState(createRecruitmentLead, {} as any);
  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-brand/30 bg-brand/5 p-6 text-center">
        <h3 className="text-lg font-bold text-brand-dark">Đã nhận thông tin của bạn!</h3>
        <p className="mt-2 text-sm text-neutral-600">Cảm ơn bạn đã quan tâm. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.</p>
      </div>
    );
  }
  return (
    <form action={action} className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-neutral-900">Để lại thông tin ứng tuyển</h3>
      <p className="mt-1 text-sm text-neutral-500">Điền thông tin bên dưới, đội ngũ tuyển dụng sẽ liên hệ với bạn.</p>
      {state?.error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div><label className={labelCls}>Họ tên *</label><input name="name" required className={inputCls} /></div>
        <div><label className={labelCls}>Số điện thoại *</label><input name="phone" required className={inputCls} /></div>
        <div><label className={labelCls}>Email</label><input name="email" type="email" className={inputCls} /></div>
        <div><label className={labelCls}>Khu vực mong muốn</label><input name="area" className={inputCls} placeholder="VD: TP. Hồ Chí Minh" /></div>
      </div>
      <div className="mt-4"><label className={labelCls}>Lời nhắn</label><textarea name="note" rows={3} className={inputCls} placeholder="Kinh nghiệm, mong muốn của bạn…" /></div>
      <div className="mt-5"><Submit /></div>
    </form>
  );
}
