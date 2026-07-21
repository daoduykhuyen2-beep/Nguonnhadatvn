"use client";
import Link from "next/link";
import { useState } from "react";
import NotificationBell from "@/components/NotificationBell";

type Props = {
  user: { email?: string | null } | null;
  profile: { full_name?: string | null; avatar_url?: string | null; role?: string | null; is_admin?: boolean | null; so_du?: number | null } | null;
};

export default function HeaderActions({ user, profile }: Props) {
  const [open, setOpen] = useState(false);
  const [appOpen, setAppOpen] = useState(false);
  const isStaff = profile?.role === "admin" || profile?.role === "pho_cong_dong" || profile?.is_admin;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/dang-nhap" className="btn-ghost hidden sm:inline-flex">
          Đăng nhập
        </Link>
        <div className="relative">
                  <button
                    type="button"
                    onClick={() => setAppOpen((o) => !o)}
                    aria-label="Tải ứng dụng di động"
                    title="Tải app - Sắp ra mắt"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-paper-line bg-paper-soft text-ink-soft transition hover:bg-brand-50 hover:text-brand-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                      <line x1="12" y1="18" x2="12" y2="18"></line>
                    </svg>
                  </button>
                  {appOpen && (
                    <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-paper-line bg-white p-4 shadow-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-ink">Ứng dụng di động</h4>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Sắp ra mắt</span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                        Ứng dụng Nguồn Nhà Đất Việt Nam đang được phát triển và sẽ sớm có mặt trên App Store và CH Play.
                      </p>
                      <div className="mt-3 flex flex-col gap-2">
                        <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-paper-line bg-paper-soft px-3 py-2 text-xs font-medium text-ink-muted opacity-80">
                          App Store
                        </span>
                        <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-paper-line bg-paper-soft px-3 py-2 text-xs font-medium text-ink-muted opacity-80">
                          CH Play
                        </span>
                      </div>
                    </div>
                  )}
                </div>
        <Link href="/dang-tin" className="btn-primary">
          Đăng tin
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
        <div className="relative">
                  <button
                    type="button"
                    onClick={() => setAppOpen((o) => !o)}
                    aria-label="Tải ứng dụng di động"
                    title="Tải app - Sắp ra mắt"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-paper-line bg-paper-soft text-ink-soft transition hover:bg-brand-50 hover:text-brand-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                      <line x1="12" y1="18" x2="12" y2="18"></line>
                    </svg>
                  </button>
                  {appOpen && (
                    <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-paper-line bg-white p-4 shadow-lg">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-ink">Ứng dụng di động</h4>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Sắp ra mắt</span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                        Ứng dụng Nguồn Nhà Đất Việt Nam đang được phát triển và sẽ sớm có mặt trên App Store và CH Play.
                      </p>
                      <div className="mt-3 flex flex-col gap-2">
                        <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-paper-line bg-paper-soft px-3 py-2 text-xs font-medium text-ink-muted opacity-80">
                          App Store
                        </span>
                        <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-paper-line bg-paper-soft px-3 py-2 text-xs font-medium text-ink-muted opacity-80">
                          CH Play
                        </span>
                      </div>
                    </div>
                  )}
                </div>
      <Link href="/dang-tin" className="btn-primary">
        + Đăng tin
      </Link>
      <NotificationBell />
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-paper-line bg-brand-50 text-sm font-bold text-brand-700 ring-2 ring-brand-100 transition hover:ring-brand-200"
        >
          {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
        ) : (
          (profile?.full_name || user.email || "U").slice(0, 1).toUpperCase()
        )}
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-paper-line bg-white py-1 shadow-lift">
            <div className="border-b border-paper-line px-4 py-3">
              <Link href="/tai-khoan" onClick={() => setOpen(false)} className="group flex items-center gap-3 hover:opacity-90">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-paper-line bg-brand-50 text-sm font-bold text-brand-700">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  (profile?.full_name || user.email || "U").slice(0, 1).toUpperCase()
                )}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink group-hover:text-brand-700">{profile?.full_name || "Thành viên"}</span>
                <span className="block truncate text-xs text-ink-muted">{user.email}</span>
              </span>
            </Link>
                <p className="mt-1 text-xs font-semibold text-brand-700">
                Số dư: {new Intl.NumberFormat("vi-VN").format(profile?.so_du || 0)}đ
              </p>
            </div>
            <MenuLink href="/tai-khoan">Tài khoản</MenuLink>
            <MenuLink href="/tai-khoan/tin-cua-toi">Tin của tôi</MenuLink>
            <MenuLink href="/tai-khoan/nap-tien">Nạp tiền</MenuLink>
            <MenuLink href="/tai-khoan/tin-yeu-thich">Tin yêu thích</MenuLink>
            <MenuLink href="/thong-bao">Thông báo</MenuLink>
            {isStaff && <MenuLink href="/admin">Quản trị</MenuLink>}
            <div className="my-1 border-t border-paper-line" />
            <Link href="/dang-xuat" className="block px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
              Đăng xuất
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-brand-50 hover:text-brand-700">
      {children}
    </Link>
  );
}
