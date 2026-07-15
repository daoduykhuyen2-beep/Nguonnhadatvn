"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePost } from "@/app/actions/posts";

export default function DeletePostButton({ id }: { id: number }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const router = useRouter();

  function onConfirm() {
    start(async () => {
      const res = await deletePost(id);
      if (res?.error) { alert(res.error); return; }
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50">Xóa</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-neutral-900">Xóa tin đăng?</h3>
            <p className="mt-1 text-sm text-neutral-500">Hành động này không thể hoàn tác.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100">Hủy</button>
              <button onClick={onConfirm} disabled={pending} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">{pending ? "Đang xóa…" : "Xóa"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
