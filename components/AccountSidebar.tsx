"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const GROUPS = [
  { label: "Tài khoản", items: [
    { href: "/tai-khoan/thong-tin", label: "Thông tin cá nhân" },
    { href: "/tai-khoan/doi-mat-khau", label: "Đổi mật khẩu" },
    { href: "/tai-khoan/hoa-don-vat", label: "Thông tin xuất hóa đơn" },
  ]},
  { label: "Tin đăng", items: [
    { href: "/tai-khoan/tin-cua-toi", label: "Tin của tôi" },
    { href: "/tai-khoan/tin-yeu-thich", label: "Tin yêu thích" },
    { href: "/tai-khoan/khach-hang", label: "Khách hàng liên hệ" },
  ]},
  { label: "Ví & Gói", items: [
    { href: "/tai-khoan/nap-tien", label: "Nạp tiền" },
    { href: "/tai-khoan/bien-dong", label: "Biến động số dư" },
    { href: "/tai-khoan/goi-hoi-vien", label: "Gói Đối tác" },
    { href: "/tai-khoan/nhat-ky", label: "Nhật ký sử dụng" },
  ]},
];

export default function AccountSidebar() {
  const path = usePathname();
  return (
    <nav className="space-y-6">
      {GROUPS.map((g) => (
        <div key={g.label}>
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">{g.label}</div>
          <div className="space-y-0.5">
            {g.items.map((it) => {
              const active = path === it.href;
              return (
                <Link key={it.href} href={it.href}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${active ? "bg-brand text-white" : "text-neutral-600 hover:bg-neutral-100"}`}>
                  {it.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
