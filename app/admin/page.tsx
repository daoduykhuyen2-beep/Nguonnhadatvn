import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatVND } from "@/lib/plans";

function Stat({ label, value, href }: { label: string; value: string | number; href?: string }) {
  const inner = (
    <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="text-sm text-neutral-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-neutral-900">{value}</div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [posts, pending, members, revenue, balances, visits] = await Promise.all([
    supabase.from("web_posts").select("id", { count: "exact", head: true }),
    supabase.from("web_posts").select("id", { count: "exact", head: true }).neq("trang_thai", "duyet"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("payments").select("amount").eq("status", "paid"),
    supabase.from("profiles").select("so_du"),
    supabase.from("site_stats").select("count").eq("id", "visits").maybeSingle(),
  ]);
  const total = (revenue.data || []).reduce((s, r) => s + (r.amount || 0), 0);
  const totalBalance = (balances.data || []).reduce((s, r) => s + (r.so_du || 0), 0);
  const visitCount = visits.data?.count ?? 0;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Tổng tin đăng" value={posts.count ?? 0} href="/admin/bai-dang" />
        <Stat label="Tin chờ duyệt" value={pending.count ?? 0} href="/admin/bai-dang" />
        <Stat label="Thành viên" value={members.count ?? 0} href="/admin/thanh-vien" />
        <Stat label="Doanh thu (đã TT)" value={formatVND(total)} />
        <Stat label="Số dư ví thành viên" value={formatVND(totalBalance)} href="/admin/thanh-vien" />
        <Stat label="Lượt truy cập" value={visitCount} />
      </div>
      <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-neutral-900">Lối tắt</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/admin/bai-dang" className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">Duyệt tin</Link>
          <Link href="/admin/tin-tuc" className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">Viết tin tức</Link>
          <Link href="/admin/thong-bao" className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">Gửi thông báo</Link>
          <Link href="/admin/banner" className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">Quản lý banner</Link>
        </div>
      </div>
    </div>
  );
}
