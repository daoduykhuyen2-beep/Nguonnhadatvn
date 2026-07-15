"use client";
import Link from "next/link";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-app flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold text-ink">Đã có lỗi xảy ra</h1>
      <p className="mt-2 text-ink-muted">Vui lòng thử lại.</p>
      <div className="mt-6 flex gap-3">
        <button onClick={reset} className="btn-primary">Thử lại</button>
        <Link href="/" className="btn-ghost">Về trang chủ</Link>
      </div>
    </div>
  );
}
