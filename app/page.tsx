import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import PostCard from "@/components/PostCard";
import HeroBanner from "@/components/HeroBanner";
import type { Post } from "@/lib/types";
import NewsImage from "@/components/NewsImage";
import { SpotlightSection, PillarsSection, TestimonialsSection } from "@/components/HomeSections";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("web_posts")
    .select("*")
    .eq("trang_thai", "duyet")
    .order("rank_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(8);
  const posts = (data || []) as Post[];

  const { count: soCanRaw } = await supabase
    .from("web_posts")
    .select("id", { count: "estimated", head: true })
    .eq("trang_thai", "duyet");
  const soCan = soCanRaw ?? 0;
  const soCanText = new Intl.NumberFormat("vi-VN").format(soCan);

  const { data: newsData } = await supabase
    .from("news")
    .select("id, tieu_de, mo_ta, anh_bia, loai, created_at")
    .order("created_at", { ascending: false })
    .limit(13);
  type NewsItem = { id: string; tieu_de: string; mo_ta: string | null; anh_bia: string | null; loai: string | null; created_at: string };
  const news = (newsData || []) as NewsItem[];

  // Video trang chủ: lấy từ bảng home_videos (ổn định, admin tự quản lý, không phụ thuộc API YouTube).
  const { data: vidData } = await supabase
    .from("home_videos")
    .select("id, title, tiktok_url")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .limit(6);
  type HomeVid = { id: number; title: string | null; search: string };
  const homeVideos: HomeVid[] = (vidData || []).map((v: { id: number; title: string | null }) => ({
    id: v.id,
    title: v.title,
    search:
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent((v.title || "bat dong san") + " nha dat"),
  }));

  type MarketNews = { title: string; link: string; image: string; source: string };
  let marketNews: MarketNews[] = [];
  try {
    const h2 = await headers();
    const host2 = h2.get("x-forwarded-host") || h2.get("host");
    const proto2 = h2.get("x-forwarded-proto") || "https";
    if (host2) {
      const r2 = await fetch(proto2 + "://" + host2 + "/api/tin-thi-truong", { next: { revalidate: 60 } });
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
      <section className="relative overflow-hidden border-b border-neutral-200">
        {/* Moving banner behind the text */}
        <div className="absolute inset-0 -z-10">
          <HeroBanner background />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-900/70 via-brand-800/60 to-brand-900/75"></div>
        </div>
        <div className="container-app relative z-10 py-24 text-center">
          <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-semibold text-white backdrop-blur">Nhà Đất Việt Nam</span>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-white drop-shadow sm:text-5xl">Tin tức &amp; kiến thức bất động sản cập nhật mỗi ngày</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90 drop-shadow">Thị trường, pháp lý, kinh nghiệm mua bán và đầu tư nhà đất - tất cả trong một nơi.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/tin-tuc" className="btn-primary">Xem tin tức</Link>
            <Link href="/tin-dang" className="rounded-full bg-white/15 px-6 py-3 font-semibold text-white ring-1 ring-white/40 backdrop-blur transition hover:bg-white/25">Xem tin đăng</Link>
          </div>
        </div>
      </section>

      {/* CAM KET */}
      <section className="border-b border-brand-100 bg-brand-50">
        <div className="container-app flex flex-col items-center gap-3 py-6 text-center sm:flex-row sm:justify-center sm:gap-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-1.5 text-sm font-bold text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" /></svg>
            CAM KẾT
          </span>
          <p className="text-base font-semibold text-brand-900">
            Nhà tại Nhà Đất Việt Nam cam kết 100% nhà thật, địa chỉ thật khi khách hàng mua gói.
          </p>
        </div>
      </section>
      <SpotlightSection />

      {/* CAM KẾT NHÀ THẬT */}
      <section className="border-t border-neutral-100 bg-white">
        <div className="container-app py-14">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-1.5 text-sm font-bold text-brand-dark">Hơn {soCanText} căn nhà đang bán</span>
              <h2 className="mt-4 text-2xl font-bold text-neutral-900 sm:text-3xl">{soCanText} căn nhà — <span className="text-brand-dark">100% là nhà thật</span></h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-neutral-600">
                <p>Toàn bộ <strong className="font-semibold text-brand-dark">{soCanText} căn</strong> đang đăng trên website đều là bất động sản có thật, được đội ngũ kiểm duyệt trước khi hiển thị. Bạn ưng căn nào, chỉ cần để lại số điện thoại — chúng tôi liên hệ ngay và gửi đúng căn đó với đúng vị trí, đúng diện tích như mô tả.</p>
                <p>Với số lượng tin cực lớn nên một vài căn tạm dùng ảnh minh họa, nhưng <strong className="font-semibold text-neutral-800">vị trí và diện tích luôn chính xác 100%</strong>. Nhân viên sẽ tư vấn trực tiếp, dẫn bạn xem đúng căn bạn quan tâm — cam kết không tin ảo, không mất thời gian.</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/tin-dang" className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark">Xem danh sách nhà</Link>
                <Link href="/tin-dang" className="rounded-xl border border-brand px-6 py-3 text-sm font-semibold text-brand-dark transition hover:bg-brand/10">Để lại nhu cầu của bạn</Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50/60 p-5 text-center">
                <div className="text-2xl font-bold text-brand-dark">{soCanText}</div>
                <div className="mt-1 text-xs text-neutral-500">Căn nhà thật</div>
              </div>
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50/60 p-5 text-center">
                <div className="text-2xl font-bold text-brand-dark">100%</div>
                <div className="mt-1 text-xs text-neutral-500">Đúng vị trí, diện tích</div>
              </div>
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50/60 p-5 text-center">
                <div className="text-2xl font-bold text-brand-dark">1-1</div>
                <div className="mt-1 text-xs text-neutral-500">Nhân viên tư vấn</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <PillarsSection />

      {/* NEWS & CAM NANG */}
      <section className="container-app py-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="section-title">Tin tức &amp; Cẩm nang</h2>
            <p className="mt-1 text-ink-muted">Cập nhật thị trường bất động sản mới nhất</p>
          </div>
          <Link href="/tin-tuc" className="btn-soft">Xem tất cả &rarr;</Link>
        </div>

        {/* MARKET NEWS - moved to top of Tin tuc & Cam nang */}
        {marketNews.length > 0 && (
          <div className="mb-10 border-b border-neutral-100 pb-8">
            <h3 className="mb-5 text-lg font-bold text-ink">Tin thị trường mới nhất</h3>
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
                    <NewsImage src={n.image} alt={n.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <span className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-600">{n.source}</span>
                    <span className="text-sm font-semibold text-ink line-clamp-3 group-hover:text-brand-700">{n.title}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
        {news.length === 0 ? (
          <div className="card p-12 text-center text-ink-muted">Chưa có bài viết nào.</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {featured && (
              <Link href={"/tin-tuc/" + featured.id} className="group col-span-1 flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition hover:shadow-md lg:col-span-2">
                <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-100">
                  {featured.anh_bia && (
                    <NewsImage src={featured.anh_bia} alt={featured.tieu_de} className="h-full w-full object-cover transition group-hover:scale-105" />
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
                      <NewsImage src={n.anh_bia} alt={n.tieu_de} className="h-full w-full object-cover transition group-hover:scale-105" />
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
                    <NewsImage src={n.anh_bia} alt={n.tieu_de} className="h-full w-full object-cover transition group-hover:scale-105" />
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

      {/* VIDEO - nguồn ổn định từ home_videos, không tự cập nhật từ API */}
      {homeVideos.length > 0 && (
      <section className="border-t border-neutral-100 bg-white">
        <div className="container-app py-14">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="section-title">Video tin tức thị trường</h2>
              <p className="mt-1 text-ink-muted">Tin tức, phân tích và pháp lý bất động sản</p>
            </div>
            <Link href="/video" className="btn-soft">Xem tất cả &rarr;</Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {homeVideos.map((v) => (
              <a
                key={v.id}
                href={v.search}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-lift"
              >
                <div className="relative flex aspect-video w-full items-center justify-center bg-gradient-to-br from-brand-50 to-emerald-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.png"
                    alt="Nha Dat Viet Nam"
                    className="absolute left-3 top-3 h-8 w-auto opacity-80"
                  />
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-md transition group-hover:scale-110">
                    <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-brand-600" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
                {v.title && (
                  <div className="p-3 text-sm font-semibold text-ink line-clamp-2">{v.title}</div>
                )}
              </a>
            ))}
          </div>
        </div>
      </section>
      <TestimonialsSection />
      )}
    </div>
  );
}
