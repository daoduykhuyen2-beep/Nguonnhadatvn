import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-paper-line bg-paper-soft">
      <div className="container-app grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Nhà Đất Việt Nam" className="h-9 w-auto" />
            <span className="font-extrabold text-ink">Nhà Đất Việt Nam</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Sàn đăng tin bất động sản toàn quốc. Kết nối người mua và người bán nhanh chóng, minh bạch.
          </p>
        </div>

        <FooterCol title="Khám phá" links={[
          { href: "/tin-dang", label: "Tin đăng" },
          { href: "/tin-tuc", label: "Tin tức" },
          { href: "/goi-thanh-vien", label: "Bảng giá" },
        ]} />
        <FooterCol title="Về chúng tôi" links={[
          { href: "/gioi-thieu", label: "Giới thiệu" },
          { href: "/tuyen-dung", label: "Tuyển dụng" },
          { href: "/chinh-sach-bao-mat", label: "Chính sách bảo mật" },
        ]} />
        <FooterCol title="Tài khoản" links={[
          { href: "/dang-nhap", label: "Đăng nhập" },
          { href: "/dang-ky", label: "Đăng ký" },
          { href: "/dang-tin", label: "Đăng tin" },
        ]} />
      </div>
      <div className="border-t border-paper-line py-5">
        <div className="container-app flex flex-col items-center justify-between gap-2 text-xs text-ink-muted md:flex-row">
          <p>© {new Date().getFullYear()} Nhà Đất Việt Nam. Bảo lưu mọi quyền.</p>
          <p>Thiết kế hiện đại · Tối ưu SEO</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-bold text-ink">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-ink-muted transition hover:text-brand-700">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
