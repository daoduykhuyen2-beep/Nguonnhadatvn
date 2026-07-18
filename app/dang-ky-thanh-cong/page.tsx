import Link from "next/link";

export const metadata = { title: "Đăng ký thành công | Nhà Đất Việt Nam" };

export default function DangKyThanhCong() {
  return (
    <div className="container-app flex min-h-[70vh] items-center justify-center py-12">
      <div className="card w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-3xl text-brand-dark">✓</div>
        <h1 className="text-2xl font-extrabold text-ink">Đăng ký thành công!</h1>
        <p className="mt-2 text-ink-muted">Email của bạn đã được xác nhận và tài khoản đã được kích hoạt. Bạn có thể bắt đầu sử dụng Nhà Đất Việt Nam ngay bây giờ.</p>
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/tai-khoan" className="btn-primary">Vào tài khoản của tôi</Link>
          <Link href="/tin-dang" className="btn-soft">Xem danh sách nhà</Link>
        </div>
      </div>
    </div>
  );
}
