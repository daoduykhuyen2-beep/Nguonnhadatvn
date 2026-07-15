import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container-app flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-6xl font-black text-brand-600">404</p>
      <h1 className="mt-2 text-2xl font-bold text-ink">Không tìm thấy trang</h1>
      <p className="mt-2 text-ink-muted">Trang bạn tìm không tồn tại hoặc đã bị xóa.</p>
      <Link href="/" className="btn-primary mt-6">Về trang chủ</Link>
    </div>
  );
}
