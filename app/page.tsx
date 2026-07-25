import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import PostCard from "@/components/PostCard";
import HeroBanner from "@/components/HeroBanner";
import type { Post } from "@/lib/types";
import NewsImage from "@/components/NewsImage";
import { SpotlightSection, PillarsSection, TestimonialsSection } from "@/components/HomeSections";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  // Xoay vong tin noi bat: lay mot nhom lon roi chon cua so 8 tin thay doi theo thoi gian.
  const { data } = await supabase
    .from("web_posts_public")
    .select("*")
    .eq("trang_thai", "duyet")
    .order("rank_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(64);
  const _poolAll = (data || []) as Post[];
  const _vip = _poolAll.slice(0, 3);
    const _rest = _poolAll.slice(3);
    // Xao tron ngau nhien danh sach con lai moi lan truy cap de trang khong bi tinh.
    const _shuffled = [..._rest];
    for (let i = _shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [_shuffled[i], _shuffled[j]] = [_shuffled[j], _shuffled[i]];
    }
    const posts = _vip.concat(_shuffled).slice(0, 8);

  const { count: soCanRaw } = await supabase
    .from("web_posts_public")
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

  // Mục cảnh báo: ưu tiên bài thuộc chuyên mục "Cảnh báo lừa đảo" (canh_bao), sau đó tới bài hướng dẫn/pháp lý, cuối cùng mới bổ sung bài khác để mục không bao giờ trống. Tối đa 4 bài cho gọn gàng, chuyên nghiệp.
  const warnItems = [
    ...news.filter((n) => n.loai === "canh_bao"),
    ...news.filter((n) => n.loai === "huong_dan"),
    ...news.filter((n) => n.loai !== "canh_bao" && n.loai !== "huong_dan"),
  ].slice(0, 4);

  
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
  // Xao tron tin tuc moi lan truy cap
    const _newsShuffled = [...news];
    for (let i = _newsShuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [_newsShuffled[i], _newsShuffled[j]] = [_newsShuffled[j], _newsShuffled[i]];
    }
    const featured = _newsShuffled[0];
    const rest = _newsShuffled.slice(1);

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
          <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-semibold text-white backdrop-blur">Nguồn Nhà Đất Việt Nam</span>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-white drop-shadow sm:text-5xl">Tin tức &amp; kiến thức bất động sản cập nhật mỗi ngày</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90 drop-shadow">Thị trường, pháp lý, kinh nghiệm mua bán và đầu tư nhà đất - tất cả trong một nơi.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/tin-tuc" className="btn-primary">Xem tin tức</Link>
            <Link href="/tin-dang" className="rounded-full bg-white/15 px-6 py-3 font-semibold text-white ring-1 ring-white/40 backdrop-blur transition hover:bg-white/25">Xem tin đăng</Link>
          </div>
        </div>
      </section>

      {/* CAM KẾT NHÀ THẬT */}
      <section className="border-t border-neutral-100 bg-white">
        <div className="container-app py-14">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="mt-4 text-2xl font-bold text-neutral-900 sm:text-3xl">{soCanText} bất động sản đang được rao bán trên toàn quốc</h2>
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

      <SpotlightSection />

      <PillarsSection />


      <TestimonialsSection />

      {/* CANH BAO RUI RO & LUA DAO */}
      {warnItems.length > 0 && (
        <section className="border-t border-neutral-100 bg-white">
          <div className="container-app py-16">
            <div className="overflow-hidden rounded-3xl border border-red-100 bg-gradient-to-br from-red-50 via-white to-white shadow-soft">
              <div className="flex flex-col gap-6 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-red-600/10 text-2xl">
                    <span aria-hidden>⚠️</span>
                  </span>
                  <div>
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-700">
                      An toàn giao dịch
                    </span>
                    <h2 className="mt-3 text-2xl font-extrabold text-neutral-900 sm:text-3xl">
                      Cảnh báo rủi ro &amp; lừa đảo
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-neutral-500">
                      Kiến thức pháp lý giúp bạn mua nhà an toàn, nhận diện dấu hiệu lừa đảo và tránh mất tiền oan.
                    </p>
                  </div>
                </div>
                <Link
                  href="/tin-tuc"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-red-200 bg-white px-5 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-600 hover:text-white"
                >
                  Xem tất cả cảnh báo
                  <span aria-hidden>&rarr;</span>
                </Link>
              </div>

              <div className="grid gap-px bg-red-100 sm:grid-cols-2">
                {warnItems.map((n, i) => (
                  <Link
                    key={n.id}
                    href={"/tin-tuc/" + n.id}
                    className="group flex gap-4 bg-white p-6 transition hover:bg-red-50/50"
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div className="flex flex-col">
                      <h3 className="font-bold leading-snug text-neutral-900 transition group-hover:text-red-700">
                        {n.tieu_de}
                      </h3>
                      {n.mo_ta && (
                        <p className="mt-1.5 line-clamp-2 text-sm text-neutral-500">{n.mo_ta}</p>
                      )}
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-red-600 opacity-0 transition group-hover:opacity-100">
                        Đọc hướng dẫn <span aria-hidden>&rarr;</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
