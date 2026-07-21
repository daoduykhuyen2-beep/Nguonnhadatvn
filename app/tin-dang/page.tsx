import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PostCard from "@/components/PostCard";
import PostFilter from "@/components/PostFilter";
import type { Post } from "@/lib/types";

export const metadata = { title: "Tin đăng bất động sản" };
export const revalidate = 60;

const PER_PAGE = 24;

export default async function TinDangPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; giao_dich?: string; loai?: string; tinh?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const from = (page - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;

  const supabase = await createClient();
  let query = supabase
    .from("web_posts")
    .select("*", { count: "estimated" })
    .eq("trang_thai", "duyet");

  if (sp.loai) query = query.ilike("loai", `%${sp.loai}%`);
  if (sp.giao_dich) query = query.eq("giao_dich", sp.giao_dich);
  // Lọc theo tỉnh/thành trên toàn quốc. Trường "quan" có dạng "Quận/Huyện - Tỉnh".
  if (sp.tinh) query = query.ilike("quan", `%- ${sp.tinh}`);
  if (sp.q) query = query.or(`title.ilike.%${sp.q}%,mota.ilike.%${sp.q}%,quan.ilike.%${sp.q}%`);

  const { data, count } = await query
    .order("rank_order", { ascending: true })
    .order("created_at", { ascending: false })
    .range(from, to);

  const posts = (data || []) as Post[];
  const total = count || 0;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (sp.q) params.set("q", sp.q);
    if (sp.loai) params.set("loai", sp.loai);
    if (sp.giao_dich) params.set("giao_dich", sp.giao_dich);
    if (sp.tinh) params.set("tinh", sp.tinh);
    params.set("page", String(p));
    return `/tin-dang?${params.toString()}`;
  }

  return (
    <div className="container-app py-8">
      <h1 className="section-title mb-4">Tin đăng bất động sản</h1>
      <PostFilter />

      <p className="mt-4 text-sm text-ink-muted">Tìm thấy {total.toLocaleString("vi-VN")} tin đăng trên toàn quốc{sp.tinh ? " tại " + sp.tinh : ""}.</p>

      {posts.length === 0 ? (
        <div className="card mt-4 p-10 text-center text-ink-muted">
          Không tìm thấy tin đăng phù hợp. Hãy thử bỏ bớt bộ lọc.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {pageNumbers(page, totalPages).map((p, i) =>
            p === -1 ? (
              <span key={`gap${i}`} className="px-2 py-1.5 text-ink-muted">…</span>
            ) : (
              <Link
                key={p}
                href={pageUrl(p)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium ${p === page ? "bg-brand text-white" : "border border-neutral-200 text-ink-soft hover:bg-neutral-50"}`}
              >
                {p}
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}

// Sinh danh sách trang gọn (đầu, cuối và quanh trang hiện tại) vì có rất nhiều trang.
function pageNumbers(current: number, totalPages: number): number[] {
  const pages: number[] = [];
  const add = (p: number) => { if (!pages.includes(p)) pages.push(p); };
  add(1);
  for (let p = current - 2; p <= current + 2; p++) {
    if (p > 1 && p < totalPages) add(p);
  }
  add(totalPages);
  const withGaps: number[] = [];
  let prev = 0;
  for (const p of pages.sort((a, b) => a - b)) {
    if (prev && p - prev > 1) withGaps.push(-1);
    withGaps.push(p);
    prev = p;
  }
  return withGaps;
}
