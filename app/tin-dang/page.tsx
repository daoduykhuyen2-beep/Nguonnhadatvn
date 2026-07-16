import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PostCard from "@/components/PostCard";
import PostFilter from "@/components/PostFilter";
import type { Post } from "@/lib/types";

export const metadata = { title: "Tin đăng bất động sản" };
export const revalidate = 30;

const PER_PAGE = 12;

export default async function TinDangPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; loai?: string; quan?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const from = (page - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;

  const supabase = await createClient();
  let query = supabase
    .from("web_posts")
    .select("*", { count: "exact" })
    .eq("trang_thai", "duyet");

  if (sp.loai) query = query.ilike("loai", `%${sp.loai}%`);
  if (sp.quan) query = query.eq("quan", sp.quan);
  if (sp.q) query = query.or(`title.ilike.%${sp.q}%,mota.ilike.%${sp.q}%,duong.ilike.%${sp.q}%`);

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  const posts = (data || []) as Post[];
  const total = count || 0;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (sp.q) params.set("q", sp.q);
    if (sp.loai) params.set("loai", sp.loai);
    if (sp.quan) params.set("quan", sp.quan);
    params.set("page", String(p));
    return `/tin-dang?${params.toString()}`;
  }

  return (
    <div className="container-app py-8">
      <h1 className="section-title mb-4">Tin đăng bất động sản</h1>
      <PostFilter />

      <p className="mt-4 text-sm text-ink-muted">Tìm thấy {total} tin đăng{sp.quan ? " tại " + sp.quan : ""}.</p>

      {posts.length === 0 ? (
        <div className="card mt-4 p-10 text-center text-ink-muted">
          Không tìm thấy tin đăng phù hợp. Hãy thử bỏ bớt bộ lọc.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {posts.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={pageUrl(p)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${p === page ? "bg-brand text-white" : "border border-neutral-200 text-ink-soft hover:bg-neutral-50"}`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
