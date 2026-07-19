import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-paper-line bg-paper-soft">
      <div className="container-app grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Nguồn Nhà Đất Việt Nam" className="h-9 w-auto" />
            <span className="font-extrabold text-ink">Nguồn Nhà Đất Việt Nam</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Sàn đăng tin bất động sản toàn quốc. Kết nối người mua và người bán nhanh chóng, minh bạch.
          </p>
          <p className="mt-3 text-sm text-ink-muted">
            Email: <a href="mailto:hotro.nguonnhadatvn@gmail.com" className="text-primary hover:underline">hotro.nguonnhadatvn@gmail.com</a>
          </p>
        </div>

        <FooterCol title="Khám phá" links={[
          { href: "/tin-dang", label: "Tin đăng" },
          { href: "/tin-tuc", label: "Tin tức" },
      { href: "/bang-gia", label: "Bảng giá" },
