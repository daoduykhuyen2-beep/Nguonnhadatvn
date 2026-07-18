import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HeaderActions from "./HeaderActions";
import MobileNav from "./MobileNav";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url, role, is_admin, so_du")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const nav = [
    { href: "/tin-dang", label: "Tin đăng" },
    { href: "/tin-tuc", label: "Tin tức" },
    { href: "/video", label: "Video" },
    { href: "/bang-gia", label: "Bảng giá" },
    { href: "/tuyen-dung", label: "Tuyển dụng" },
    { href: "/gioi-thieu", label: "Giới thiệu" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-paper-line bg-white/90 backdrop-blur relative">
      <div className="accent-line h-1 w-full" />
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Nguồn Nhà Đất Việt Nam" className="h-10 w-auto" />
          <span className="text-base font-extrabold tracking-tight text-ink">
            Nguồn Nhà Đất <span className="text-brand-600">Việt Nam</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition hover:bg-brand-50 hover:text-brand-700"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <MobileNav nav={nav} />
          <HeaderActions user={user ? { email: user.email } : null} profile={profile} />
      </div>
    </header>
  );
}
