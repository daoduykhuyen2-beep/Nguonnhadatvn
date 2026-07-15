import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PostCard from "@/components/PostCard";
import PostFilter from "@/components/PostFilter";
import type { Post } from "@/lib/types";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("web_posts")
    .select("*")
    .eq("trang_thai", "duyet")
    .order("created_at", { ascending: false })
    .limit(12);
  const posts = (data || []) as Post[];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div className="container-app py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="chip mx-auto">Sàn bất động sản toàn quốc</span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-5xl">
              Tìm ngôi nhà mơ ước tại{" "}
              <span className="text-brand-600">Nguồn Nhà Đất Việt Nam</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-ink-muted md:text-lg">
              Hàng nghìn tin nhà phố, đất nền, căn hộ được cập nhật mỗi ngày. Đăng tin nhanh — tiếp cận khách mua thật.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-4xl">
            <PostFilter />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/dang-tin" className="btn-primary">Đăng tin miễn phí</Link>
            <Link href="/goi-thanh-vien" className="btn-ghost">Xem bảng giá</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container-app -mt-6">
        <div className="card grid grid-cols-2 divide-x divide-paper-line md:grid-cols-4">
          {[
            { n: "10.000+", l: "Tin đăng" },
            { n: "63", l: "Tỉnh thành" },
            { n: "5.000+", l: "Thành viên" },
            { n: "24/7", l: "Hỗ trợ" },
          ].map((s) => (
            <div key={s.l} className="p-5 text-center">
              <p className="text-2xl font-extrabold text-brand-700">{s.n}</p>
              <p className="text-sm text-ink-muted">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-app py-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="section-title">Tin đăng mới nhất</h2>
            <p className="mt-1 text-ink-muted">Bất động sản vừa được cập nhật</p>
          </div>
          <Link href="/tin-dang" className="btn-soft">Xem tất cả →</Link>
        </div>

        {posts.length === 0 ? (
          <div className="card p-12 text-center text-ink-muted">Chưa có tin đăng nào.</div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
