import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-paper-line bg-paper-soft">
      <div className="container-app py-12">
        {/* Hàng trên: thương hiệu + liên hệ */}
        <div className="flex flex-col gap-6 border-b border-paper-line pb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Nguồn Nhà Đất Việt Nam" className="h-10 w-auto" />
            <span className="text-lg font-extrabold text-ink">Nguồn Nhà Đất Việt Nam</span>
          </div>
          <div className="text-sm text-ink-muted">
            Hỗ trợ:{" "}
            <a href="mailto:hotro.nguonnhadatvn@gmail.com" className="font-medium text-primary hover:underline">
              hotro.nguonnhadatvn@gmail.com
            </a>
          </div>
        </div>

        {/* Lưới liên kết hợp nhất */}
        <div className="grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-6">
          {/* Cột giới thiệu thương hiệu */}
          <div className="md:col-span-2 lg:col-span-1">
            <p className="text-sm leading-relaxed text-ink-muted">
              Sàn đăng tin bất động sản toàn quốc. Kết nối người mua và người bán nhanh chóng, minh bạch.
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

          <FooterCol
            title="Nhà đất bán"
            links={[
              { href: "/tin-dang?giao_dich=ban&loai=can_ho", label: "Bán căn hộ chung cư" },
              { href: "/tin-dang?giao_dich=ban&loai=nha_pho", label: "Bán nhà riêng" },
              { href: "/tin-dang?giao_dich=ban&loai=nha_pho", label: "Bán nhà mặt phố" },
              { href: "/tin-dang?giao_dich=ban&loai=dat_nen", label: "Bán đất nền" },
              { href: "/tin-dang?giao_dich=ban&loai=biet_thu", label: "Bán biệt thự, liền kề" },
            ]}
          />

          <FooterCol
            title="Nhà đất cho thuê"
            links={[
              { href: "/tin-dang?giao_dich=thue&loai=can_ho", label: "Thuê căn hộ chung cư" },
              { href: "/tin-dang?giao_dich=thue&loai=nha_pho", label: "Thuê nhà riêng" },
              { href: "/tin-dang?giao_dich=thue&q=phòng trọ", label: "Thuê phòng trọ" },
              { href: "/tin-dang?giao_dich=thue&q=văn phòng", label: "Thuê văn phòng" },
              { href: "/tin-dang?giao_dich=thue&q=mặt bằng", label: "Thuê mặt bằng kinh doanh" },
            ]}
          />

          <FooterCol
            title="Bất động sản theo tỉnh"
            links={[
              { href: "/tin-dang?tinh=Hồ Chí Minh", label: "Nhà đất TP. Hồ Chí Minh" },
              { href: "/tin-dang?tinh=Hà Nội", label: "Nhà đất Hà Nội" },
              { href: "/tin-dang?tinh=Đà Nẵng", label: "Nhà đất Đà Nẵng" },
              { href: "/tin-dang?tinh=Thanh Hóa", label: "Nhà đất Thanh Hóa" },
              { href: "/tin-dang?tinh=Quảng Nam", label: "Nhà đất Quảng Nam" },
              { href: "/tin-dang?tinh=Hưng Yên", label: "Nhà đất Hưng Yên" },
              { href: "/tin-dang?tinh=Thái Nguyên", label: "Nhà đất Thái Nguyên" },
              { href: "/tin-dang?tinh=Hòa Bình", label: "Nhà đất Hòa Bình" },
              { href: "/tin-dang?tinh=Bắc Ninh", label: "Nhà đất Bắc Ninh" },
            ]}
          />

          <FooterCol
            title="Hỗ trợ & tiện ích"
            links={[
              { href: "/tro-giup", label: "Câu hỏi thường gặp" },
              { href: "/bang-gia", label: "Bảng giá dịch vụ" },
              { href: "/dang-tin", label: "Hướng dẫn đăng tin" },
              { href: "/gioi-thieu", label: "Về chúng tôi" },
              { href: "/chinh-sach-bao-mat", label: "Chính sách bảo mật" },
              { href: "mailto:hotro.nguonnhadatvn@gmail.com", label: "Góp ý - Báo lỗi" },
            ]}
          />

          <FooterCol
            title="Khám phá"
            links={[
              { href: "/tin-dang", label: "Tin đăng" },
              { href: "/tin-tuc", label: "Tin tức" },
              { href: "/bang-gia", label: "Bảng giá" },
              { href: "/tuyen-dung", label: "Tuyển dụng" },
              { href: "/dang-nhap", label: "Đăng nhập" },
              { href: "/dang-ky", label: "Đăng ký" },
            ]}
          />
        </div>

      </div>

      {/* Dòng bản quyền */}
      <div className="border-t border-paper-line py-5">
        <div className="container-app flex flex-col items-center justify-between gap-2 text-xs text-ink-muted md:flex-row">
          <p>© {new Date().getFullYear()} Nguồn Nhà Đất Việt Nam. Bảo lưu mọi quyền.</p>
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
            <Link href={l.href} className="text-sm text-ink-muted transition hover:text-brand-700">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
