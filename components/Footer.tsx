import Link from "next/link";

const banks = [
{ src: "/banks/vpbank.png", alt: "VPBank" },
{ src: "/banks/bidv.png", alt: "BIDV" },
{ src: "/banks/sacombank.png", alt: "Sacombank" },
{ src: "/banks/mb.png", alt: "MB Bank" },
];

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
<a
href="https://online.gov.vn/Home/WebDetails/5480"
target="_blank"
rel="noopener noreferrer"
title="Đã đăng ký Bộ Công Thương"
className="mt-4 inline-block"
>
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src="/bo-cong-thuong.png" alt="Đã đăng ký Bộ Công Thương" className="h-12 w-auto" />
</a>
</div>

<FooterCol title="Khám phá" links={[
{ href: "/tin-dang", label: "Tin đăng" },
{ href: "/tin-tuc", label: "Tin tức" },
{ href: "/bang-gia", label: "Bảng giá" },
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

<div className="border-t border-paper-line">
<div className="container-app py-8">
<h4 className="mb-4 text-center text-sm font-bold text-ink">Ngân hàng hỗ trợ</h4>
<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
{banks.map((b) => (
<div
key={b.alt}
className="flex h-16 items-center justify-center rounded-xl border border-paper-line bg-white px-4 shadow-sm transition hover:shadow-md"
>
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src={b.src} alt={b.alt} title={b.alt} className="max-h-9 w-auto object-contain" />
</div>
))}
</div>
</div>
</div>

<div className="border-t border-paper-line py-5">
<div className="container-app flex flex-col items-center justify-between gap-2 text-xs text-ink-muted md:flex-row">
<p>© {new Date().getFullYear()} Nguồn Nhà Đất Việt Nam. Bảo lưu mọi quyền.</p>
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
