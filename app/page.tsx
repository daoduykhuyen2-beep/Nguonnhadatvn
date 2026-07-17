import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import PostCard from "@/components/PostCard";
import type { Post } from "@/lib/types";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("web_posts")
    .select("*")
    .eq("trang_thai", "duyet")
    .order("created_at", { ascending: false })
    .limit(8);
  const posts = (data || []) as Post[];

  const { data: newsData } = await supabase
    .from("news")
    .select("id, tieu_de, mo_ta, anh_bia, loai, created_at")
    .order("created_at", { ascending: false })
    .limit(13);
  type NewsItem = { id: string; tieu_de: string; mo_ta: string | null; anh_bia: string | null; loai: string | null; created_at: string };
  const news = (newsData || []) as NewsItem[];

  type VideoItem = { id: string | number; title: string | null; embed: string };
  function ytEmbed(url: string | null): string {
    if (!url) return "";
    if (url.includes("/embed")) return url;
    const s = url.match(/youtu\.be\/([\w-]+)/);
    if (s) return "https://www.youtube.com/embed/" + s[1];
    const w = url.match(/[?&]v=([\w-]+)/);
    if (w) return "https://www.youtube.com/embed/" + w[1];
    return url;
  }
  let videos: VideoItem[] = [];
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    const proto = h.get("x-forwarded-proto") || "https";
    if (host) {
      const res = await fetch(proto + "://" + host + "/api/videos", { next: { revalidate: 3600 } });
      if (res.ok) {
        const j = (await res.json()) as { ok: boolean; videos?: { id: string; title: string }[] };
        if (j.ok && j.videos) {
          videos = j.videos.slice(0, 8).map((v) => ({ id: v.id, title: v.title, embed: "https://www.youtube.com/embed/" + v.id }));
        }
      }
    }
  } catch {}
  if (videos.length === 0) {
    const { data: videoData } = await supabase
      .from("home_videos")
      .select("id, title, tiktok_url")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .limit(8);
    videos = ((videoData || []) as { id: number; title: string | null; tiktok_url: string | null }[]).map((v) => ({
      id: v.id,
      title: v.title,
      embed: ytEmbed(v.tiktok_url),
    }));
  }
  type MarketNews = { title: string; link: string; image: string; source: string };
  let marketNews: MarketNews[] = [];
  try {
    const h2 = await headers();
    const host2 = h2.get("x-forwarded-host") || h2.get("host");
    const proto2 = h2.get("x-forwarded-proto") || "https";
    if (host2) {
      const r2 = await fetch(proto2 + "://" + host2 + "/api/tin-thi-truong", { next: { revalidate: 3600 } });
      if (r2.ok) {
        const j2 = (await r2.json()) as { ok: boolean; items?: MarketNews[] };
        if (j2.ok && j2.items) marketNews = j2.items.slice(0, 8);
      }
    }
  } catch {}
  const featured = news[0];
  const rest = news.slice(1);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-neutral-100 bg-gradient-to-b from-brand-50/60 to-white">
        <div className="container-app py-14 text-center">
          <span className="inline-block rounded-full bg-brand-100 px-4 py-1 text-sm font-semibold text-brand-700">Nguồn Nhà Đất Việt Nam</span>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">Tin tức &amp; kiến thức bất động sản cập nhật mỗi ngày</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-muted">Thị trường, pháp lý, kinh nghiệm mua bán và đầu tư nhà đất - tất cả trong một nơi.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/tin-tuc" className="btn-primary">Xem tin tức</Link>
            <Link href="/tin-dang" className="btn-soft">Xem tin đăng</Link>
          </div>
        </div>
      </section>

      {/* NEWS - main content */}
      <section className="container-app py-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="section-title">Tin tức &amp; Cẩm nang</h2>
            <p className="mt-1 text-ink-muted">Cập nhật thị trường bất động sản mới nhất</p>
          </div>
          <Link href="/tin-tuc" className="btn-soft">Xem tất cả &rarr;</Link>
        </div>

        {news.length === 0 ? (
          <div className="card p-12 text-center text-ink-muted">Chưa có bài viết nào.</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {featured && (
              <Link href={"/tin-tuc/" + featured.id} className="group col-span-1 flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition hover:shadow-md lg:col-span-2">
                <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-100">
                  {featured.anh_bia && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={featured.anh_bia} alt={featured.tieu_de} className="h-full w-full object-cover transition group-hover:scale-105" />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="mb-2 w-fit rounded-full bg-brand-100 px-3 py-0.5 text-xs font-semibold text-brand-700">{featured.loai === "cam_nang" ? "Cẩm nang" : "Tin tức"}</span>
                  <h3 className="text-2xl font-bold text-ink transition group-hover:text-brand-700">{featured.tieu_de}</h3>
                  <p className="mt-2 line-clamp-3 text-ink-muted">{featured.mo_ta}</p>
                </div>
              </Link>
            )}
            <div className="flex flex-col gap-4">
              {rest.slice(0, 4).map((n) => (
                <Link key={n.id} href={"/tin-tuc/" + n.id} className="group flex gap-4 rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm transition hover:shadow-md">
                  <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                    {n.anh_bia && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={n.anh_bia} alt={n.tieu_de} className="h-full w-full object-cover transition group-hover:scale-105" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <span className="text-xs font-semibold text-brand-700">{n.loai === "cam_nang" ? "Cẩm nang" : "Tin tức"}</span>
                    <h4 className="line-clamp-2 text-sm font-bold text-ink transition group-hover:text-brand-700">{n.tieu_de}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {rest.length > 4 && (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {rest.slice(4).map((n) => (
              <Link key={n.id} href={"/tin-tuc/" + n.id} className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition hover:shadow-md">
                <div className="aspect-video w-full overflow-hidden bg-neutral-100">
                  {n.anh_bia && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={n.anh_bia} alt={n.tieu_de} className="h-full w-full object-cover transition group-hover:scale-105" />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <span className="mb-1 text-xs font-semibold text-brand-700">{n.loai === "cam_nang" ? "Cẩm nang" : "Tin tức"}</span>
                  <h3 className="line-clamp-2 font-bold text-ink transition group-hover:text-brand-700">{n.tieu_de}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{n.mo_ta}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* VIDEO - market news */}
      {videos.length > 0 && (
        <section className="border-t border-neutral-100 bg-white">
          <div className="container-app py-14">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="section-title">Video tin tức thị trường</h2>
                <p className="mt-1 text-ink-muted">Cập nhật tự động tin nóng và phân tích bất động sản cả nước</p>
              </div>
              <Link href="/video" className="btn-soft">Xem tất cả &rarr;</Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {videos.map((v) => (
                <div key={v.id} className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                  <div className="aspect-[9/16] w-full bg-neutral-100">
                    <iframe
                      src={v.embed}
                      title={v.title || "Video"}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  {v.title && <div className="p-3 text-sm font-semibold text-ink line-clamp-2">{v.title}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MARKET NEWS - auto from RSS */}
      {marketNews.length > 0 && (
        <section className="border-t border-neutral-100 bg-neutral-50/50">
          <div className="container-app py-14">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="section-title">Tin thị trường mới nhất</h2>
                <p className="mt-1 text-ink-muted">Tự động cập nhật từ các báo lớn về bất động sản cả nước</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {marketNews.map((n, i) => (
                <a
                  key={i}
                  href={n.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="aspect-video w-full overflow-hidden bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={n.image} alt={n.title} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">{n.source}</span>
                    <span className="text-sm font-semibold text-ink line-clamp-3 group-hover:text-brand-700">{n.title}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LISTINGS - secondary */}
      <section className="border-t border-neutral-100 bg-neutral-50/50">
        <div className="container-app py-14">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="section-title">Tin đăng mới nhất</h2>
              <p className="mt-1 text-ink-muted">Bất động sản vừa được cập nhật</p>
            </div>
            <Link href="/tin-dang" className="btn-soft">Xem tất cả &rarr;</Link>
          </div>

          {posts.length === 0 ? (
            <div className="card p-12 text-center text-ink-muted">Chưa có tin đăng nào.</div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {posts.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
