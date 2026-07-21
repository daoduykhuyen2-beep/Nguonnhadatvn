import Link from "next/link";

export default function Footer() {
return (
<footer className="mt-16 border-t border-paper-line bg-paper-soft">
      <div className="border-t border-paper-line bg-paper-soft">
        <div className="container-app py-10">
          <div className="grid gap-8 md:grid-cols-4">
            <FooterCol
              title="Nhà đất bán"
              links={[
                    { href: "/tin-dang?loai=can_ho", label: "Bán căn hộ chung cư" },
                    { href: "/tin-dang?loai=nha_pho", label: "Bán nhà riêng" },
                    { href: "/tin-dang?loai=nha_pho", label: "Bán nhà mặt phố" },
                    { href: "/tin-dang?loai=dat_nen", label: "Bán đất nền" },
                    { href: "/tin-dang?loai=biet_thu", label: "Bán biệt thự, liền kề" },
              ]}
            />
            <FooterCol
              title="Nhà đất cho thuê"
              links={[
                    { href: "/tin-dang?loai=can_ho&q=cho thuê", label: "Thuê căn hộ chung cư" },
                    { href: "/tin-dang?loai=nha_pho&q=cho thuê", label: "Thuê nhà riêng" },
                    { href: "/tin-dang?q=phòng trọ", label: "Thuê phòng trọ" },
                    { href: "/tin-dang?q=văn phòng", label: "Thuê văn phòng" },
                    { href: "/tin-dang?q=mặt bằng", label: "Thuê mặt bằng kinh doanh" },
              ]}
            />
            <FooterCol
              title="Bất động sản theo tỉnh"
              links={[
                    { href: "/tin-dang?tinh=Hồ Chí Minh", label: "Nhà đất TP. Hồ Chí Minh" },
                    { href: "/tin-dang?tinh=Hà Nội", label: "Nhà đất Hà Nội" },
                    { href: "/tin-dang?tinh=Đà Nẵng", label: "Nhà đất Đà Nẵng" },
                    { href: "/tin-dang?tinh=Bình Dương", label: "Nhà đất Bình Dương" },
                    { href: "/tin-dang?tinh=Đồng Nai", label: "Nhà đất Đồng Nai" },
              ]}
            />
            <FooterCol
              title="Hỗ trợ & tiện ích"
              links={[
                { href: "/tro-giup", label: "Câu hỏi thường gặp" },
                { href: "/bang-gia", label: "Bảng giá dịch vụ" },
                { href: "/dang-tin", label: "Hướng dẫn đăng tin" },
                { href: "/gioi-thieu", label: "Về chúng tôi" },
                { href: "mailto:hotro.nguonnhadatvn@gmail.com", label: "Góp ý - Báo lỗi" },
              ]}
            />
          </div>

          <div className="mt-8 border-t border-paper-line pt-6 text-sm leading-relaxed text-ink-muted">
            <p>
              Nguồn Nhà Đất Việt Nam là sàn đăng tin bất động sản trực tuyến, nơi kết nối
              người mua, người bán và người thuê trên khắp cả nước. Chúng tôi mang đến kho tin
              rao đa dạng gồm bán căn hộ chung cư, nhà riêng, nhà mặt phố, đất nền, biệt thự
              cùng nhiều hình thức cho thuê như phòng trọ, văn phòng và mặt bằng kinh doanh.
            </p>
            <p className="mt-3">
              Với công cụ tìm kiếm theo khu vực, mức giá và loại hình, bạn dễ dàng chọn được
              bất động sản phù hợp với nhu cầu ở hoặc đầu tư. Người bán có thể đăng tin nhanh
              chóng, minh bạch và tiếp cận đúng khách hàng tiềm năng. Mọi thắc mắc vui lòng xem
              mục Trợ giúp hoặc liên hệ đội ngũ hỗ trợ để được giải đáp kịp thời.
            </p>
          </div>
        </div>
      </div>
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
{ href: "/tro-giup", label: "Trợ giúp" },
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
