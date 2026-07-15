import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isStaff, isAdmin as checkAdmin } from "@/lib/roles";
import AdminSidebar from "@/components/AdminSidebar";

export const metadata = { title: "Quản trị | Nguồn Nhà Đất Việt Nam" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/admin");
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!isStaff(profile)) redirect("/");
  const admin = checkAdmin(profile);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Bảng điều khiển quản trị</h1>
          <p className="text-sm text-neutral-500">Xin chào, {profile?.full_name || user.email}</p>
        </div>
        <Link href="/" className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50">← Về trang chủ</Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start"><AdminSidebar isAdmin={admin} /></aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
