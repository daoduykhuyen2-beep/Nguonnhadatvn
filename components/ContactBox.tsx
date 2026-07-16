"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import FavoriteButton from "@/components/FavoriteButton";
import { createLead } from "@/app/actions/leads";

function Send() { const { pending } = useFormStatus(); return <button disabled={pending} className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60">{pending ? "Đang gửi…" : "Gửi liên hệ"}</button>; }

export default function ContactBox({ postId, contactName, contactPhone, favorited = false, hasAccess = false }: { postId: number; contactName?: string | null; contactPhone?: string | null; favorited?: boolean; hasAccess?: boolean }) {
  const [state, action] = useActionState(createLead, {} as any);
  const [open, setOpen] = useState(false);
  const inputCls = "w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";
  return (
    <div className="space-y-3">
      <div className="text-sm text-neutral-500">Liên hệ người đăng</div>
      <div className="text-lg font-bold text-neutral-900">{contactName || "Chủ nhà"}</div>
      {hasAccess ? (
        contactPhone ? (
          <a href={"tel:" + contactPhone} className="block w-full rounded-xl bg-brand px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-dark">📞 {contactPhone}</a>
        ) : (
          <div className="rounded-xl bg-paper-soft px-4 py-3 text-center text-sm text-neutral-500">Chưa có số điện thoại</div>
        )
      ) : (
        <div className="space-y-2 rounded-xl border border-brand/30 bg-brand/5 px-4 py-4 text-center">
          <div className="text-sm font-semibold text-neutral-700">🔒 Thông tin liên hệ chỉ dành cho thành viên</div>
          <p className="text-xs text-neutral-500">Đăng ký Gói Xem Kho Nhà Toàn Quốc để xem số điện thoại chính chủ và toàn bộ danh sách nhà trên cả nước.</p>
          <Link href="/tai-khoan/goi-hoi-vien" className="block w-full rounded-xl bg-brand px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-dark">Đăng ký để xem</Link>
        </div>
      )}
      <div className="flex gap-2">
        <FavoriteButton postId={postId} initial={favorited} />
        <button onClick={() => setOpen((v) => !v)} className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-600 transition hover:border-brand hover:text-brand">Để lại lời nhắn</button>
      </div>
      {open && (
        state?.ok ? (
          <div className="rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-brand-dark">Đã gửi liên hệ! Người đăng sẽ liên hệ lại với bạn.</div>
        ) : (
          <form action={action} className="space-y-2 rounded-xl border border-neutral-100 bg-neutral-50 p-3">
            <input type="hidden" name="post_id" value={postId} />
            {state?.error && <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{state.error}</div>}
            <input name="name" placeholder="Họ tên của bạn" className={inputCls} />
            <input name="phone" placeholder="Số điện thoại *" className={inputCls} />
            <textarea name="message" rows={2} placeholder="Lời nhắn…" className={inputCls} />
            <Send />
          </form>
        )
      )}
      <p className="text-xs text-neutral-400">Vui lòng nói bạn thấy tin trên Nguồn Nhà Đất Việt Nam.</p>
    </div>
  );
}
