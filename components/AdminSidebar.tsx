"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Tổng quan", exact: true },
  { href: "/admin/bai-dang", label: "Duyệt tin đăng" },
  { href: "/admin/thanh-vien", label: "Thành viên" },
  { href: "/admin/phan-quyen", label: "Phân quyền", adminOnly: true },
  { href: "/admin/nap-tien", label: "Nạp tiền thủ công" },
  { href: "/admin/bang-gia", label: "Bảng giá" },
  { href: "/admin/banner", label: "Banner" },
  { href: "/admin/tin-tuc", label: "Tin tức" },
  { href: "/admin/quan-ly-video", label: "Video trang chủ" },
  { href: "/admin/thong-bao", label: "Thông báo" },
];

export default function AdminSidebar({ isAdmin }: { isAdmin: boolean }) {
  const path = usePathname();
  return (
    <nav className="space-y-0.5">
      {ITEMS.filter((i) => !i.adminOnly || isAdmin).map((it) => {
        const active = it.exact ? path === it.href : path.startsWith(it.href);
        return (
          <Link key={it.href} href={it.href}
            className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${active ? "bg-brand text-white" : "text-neutral-600 hover:bg-neutral-100"}`}>
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
