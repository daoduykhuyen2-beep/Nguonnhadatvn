import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Tin tức & Cẩm nang bất động sản" };
export const revalidate = 60;

type News = {
  id: string;
  tieu_de: string;
  mo_ta: string | null;
  anh_bia: string | null;
  loai: string | null;
  created_at: string;
};

const LOAI: Record<string, string> = {
  tin_tuc: "Tin tức",
  cam_nang: "Cẩm nang",
};

function fmtDate(s: string) {
  try { return new Date(s).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }); } catch { return ""; }
}

export default async function TinTucPage({ searchParams }: { searchParams: Promise<{ loai?: string }> }) {
  const sp = await searchParams;
  const supabase = await createClient();
  let query = supabase.from("news").select("*").order("created_at", { ascending: false });
  if (sp.loai) query = query.eq("loai", sp.loai);
  const { data } = await query;
  const list = (data || []) as News[];
  const featured = list[0];
  const rest = list.slice(1);

  return (
    <div className="container-app py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Tin tức &amp; Cẩm nang</h1>
          <p className="mt-1 text-sm text-ink-muted">Cập nhật thị trường, kinh nghiệm mua bán và đầu tư bất động sản.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tin-tuc" className={"rounded-full border px-4 py-1.5 text-sm font-medium transition " + (!sp.loai ? "border-brand bg-brand text-white" : "border-neutral-200 text-neutral-700 hover:border-brand hover:text-brand")}>Tất cả</Link>
          <Link href="/tin-tuc?loai=tin_tuc" className={"rounded-full border px-4 py-1.5 text-sm font-medium transition " + (sp.loai === "tin_tuc" ? "border-brand bg-brand text-white" : "border-neutral-200 text-neutral-700 hover:border-brand hover:text-brand")}>Tin tức</Link>
          <Link href="/tin-tuc?loai=cam_nang" className={"rounded-full border px-4 py-1.5 text-sm font-medium transition " + (sp.loai === "cam_nang" ? "border-brand bg-brand text-white" : "border-neutral-200 text-neutral-700 hover:border-brand hover:text-brand")}>Cẩm nang</Link>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white py-16 text-center text-sm text-neutral-500">Chưa có bài viết nào.</div>
      ) : (
        <>
          {featured && (
            <Link href={"/tin-tuc/" + featured.id} className="group mb-8 grid overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition hover:shadow-md md:grid-cols-2">
              <div className="aspect-video w-full overflow-hidden bg-neutral-100 md:aspect-auto">
                {featured.anh_bia && /* eslint-disable-next-line @next/next/no-img-element */ (
                  <img src={featured.anh_bia} alt={featured.tieu_de} className="h-full w-full object-cover transition group-hover:scale-105" />
                )}
              </div>
              <div className="flex flex-col justify-center p-6">
                <span className="w-fit rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand-dark">{LOAI[featured.loai || "tin_tuc"] || "Tin tức"}</span>
                <h2 className="mt-3 text-xl font-bold text-ink group-hover:text-brand">{featured.tieu_de}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-ink-muted">{featured.mo_ta}</p>
                <span className="mt-3 text-xs text-neutral-400">{fmtDate(featured.created_at)}</span>
              </div>
            </Link>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((n) => (
              <Link key={n.id} href={"/tin-tuc/" + n.id} className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition hover:shadow-md">
                <div className="aspect-video w-full overflow-hidden bg-neutral-100">
                  {n.anh_bia && /* eslint-disable-next-line @next/next/no-img-element */ (
                    <img src={n.anh_bia} alt={n.tieu_de} className="h-full w-full object-cover transition group-hover:scale-105" />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <span className="w-fit rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand-dark">{LOAI[n.loai || "tin_tuc"] || "Tin tức"}</span>
                  <h3 className="mt-2 line-clamp-2 font-semibold text-ink group-hover:text-brand">{n.tieu_de}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{n.mo_ta}</p>
                  <span className="mt-auto pt-3 text-xs text-neutral-400">{fmtDate(n.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
