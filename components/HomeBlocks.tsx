import Link from "next/link";
import NewsImage from "@/components/NewsImage";

type NewsItem = {
  id: string;
  tieu_de: string;
  mo_ta?: string | null;
  anh_bia?: string | null;
  loai?: string | null;
  created_at?: string | null;
};

export type LocationItem = {
  name: string;
  count: number;
  image: string;
  href: string;
};

function timeAgo(dateStr?: string | null) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d <= 0) return "Hôm nay";
  if (d === 1) return "Hôm qua";
  if (d < 30) return `${d} ngày trước`;
  const m = Math.floor(d / 30);
  if (m < 12) return `${m} tháng trước`;
  return `${Math.floor(m / 12)} năm trước`;
}
/* ---------- 1. TIN TUC BAT DONG SAN ---------- */
export function NewsSection({ news }: { news: NewsItem[] }) {
  if (!news?.length) return null;
  const [feature, ...rest] = news;
  const sideList = rest.slice(0, 5);

  return (
    <section className="container-app py-14">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="section-title">Tin tức bất động sản</h2>
        <Link href="/tin-tuc" className="btn-soft">
          Xem thêm →
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Link
          href={`/tin-tuc/${feature.id}`}
          className="group flex flex-col overflow-hidden rounded-2xl"
        >
          <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-neutral-100">
            <NewsImage
              src={feature.anh_bia || ""}
              alt={feature.tieu_de}
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          </div>
          <h3 className="mt-4 text-2xl font-bold text-ink line-clamp-2 transition group-hover:text-brand-700">
            {feature.tieu_de}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-ink-muted">
            <span>🕑</span> {timeAgo(feature.created_at)}
          </p>
        </Link>

        <div className="flex flex-col">
          {sideList.map((item) => (
            <Link
              key={item.id}
              href={`/tin-tuc/${item.id}`}
              className="group border-b border-neutral-100 py-4 first:pt-0 last:border-0"
            >
              <h4 className="text-base font-semibold text-ink line-clamp-2 transition group-hover:text-brand-700">
                {item.tieu_de}
              </h4>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
/* ---------- 2. BAT DONG SAN THEO DIA DIEM ---------- */
export function LocationSection({ locations }: { locations: LocationItem[] }) {
  if (!locations?.length) return null;
  const [big, ...others] = locations;

  return (
    <section className="container-app py-14">
      <h2 className="section-title mb-6">Bất động sản theo địa điểm</h2>

      <div className="grid gap-5 lg:grid-cols-3">
        <Link
          href={big.href}
          className="group relative col-span-1 overflow-hidden rounded-2xl lg:row-span-2"
        >
          <div className="aspect-[4/5] w-full overflow-hidden bg-neutral-200">
            <NewsImage
              src={big.image}
              alt={big.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute left-5 top-5 text-white">
            <div className="text-xl font-bold">{big.name}</div>
            <div className="text-sm opacity-90">
              {big.count.toLocaleString("vi-VN")} tin đăng
            </div>
          </div>
        </Link>

        <div className="col-span-1 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2">
          {others.slice(0, 4).map((loc) => (
            <Link
              key={loc.name}
              href={loc.href}
              className="group relative overflow-hidden rounded-2xl"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-200">
                <NewsImage
                  src={loc.image}
                  alt={loc.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute left-4 top-4 text-white">
                <div className="text-lg font-bold">{loc.name}</div>
                <div className="text-xs opacity-90">
                  {loc.count.toLocaleString("vi-VN")} tin đăng
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
/* ---------- 3. TIEU DIEM ---------- */
export function HighlightSection({ highlights }: { highlights: NewsItem[] }) {
  if (!highlights?.length) return null;
  const items = highlights.slice(0, 3);

  return (
    <section className="container-app py-14">
      <h2 className="section-title mb-6">Tiêu điểm</h2>

      <div className="grid gap-8 md:grid-cols-3">
        {items.map((item, i) => (
          <Link
            key={item.id}
            href={`/tin-tuc/${item.id}`}
            className="group flex flex-col"
          >
            <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-neutral-100">
              <NewsImage
                src={item.anh_bia || ""}
                alt={item.tieu_de}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="mt-4 flex gap-3">
              <span className="text-3xl font-black leading-none text-neutral-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-bold text-ink line-clamp-2 transition group-hover:text-brand-700">
                {item.tieu_de}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
