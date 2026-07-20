"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import FavoriteButton from "@/components/FavoriteButton";
import { createLead } from "@/app/actions/leads";

function Send() { const { pending } = useFormStatus(); return <button disabled={pending} className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60">{pending ? "Đang gửi…" : "Gửi liên hệ"}</button>; }

export default function ContactBox({ postId, favorited = false }: { postId: number; contactName?: string | null; contactPhone?: string | null; favorited?: boolean; hasAccess?: boolean }) {
  const [state, action] = useActionState(createLead, {} as any);
  const inputCls = "w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";
  return (
    <div className="space-y-3">
    <div className="text-sm text-neutral-500">Để lại thông tin để được tư vấn</div>
    <div className="flex">
    <FavoriteButton postId={postId} initial={favorited} />
    </div>
      {state?.ok ? (
      <div className="rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-brand-dark">Đã gửi liên hệ! Chúng tôi sẽ liên hệ lại với bạn.</div>
      ) : (
      <form action={action} className="space-y-2 rounded-xl border border-neutral-100 bg-neutral-50 p-3">
      <input type="hidden" name="post_id" value={postId} />
        {state?.error && <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{state.error}</div>}
      <input name="name" placeholder="Họ tên của bạn" className={inputCls} />
      <input name="phone" placeholder="Số điện thoại *" className={inputCls} />
      <textarea name="message" rows={3} placeholder="Lời nhắn…" className={inputCls} />
      <Send />
      </form>
    )}
    <p className="text-xs text-neutral-400">Vui lòng nói bạn thấy tin trên Nguồn Nhà Đất Việt Nam.</p>
    </div>
    );
}
