import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

type News = {
  id: string;
  tieu_de: string;
  mo_ta: string | null;
  noi_dung: string | null;
  anh_bia: string | null;
  hinh_anh: string[] | null;
  loai: string | null;
  video_url: string | null;
  created_at: string;
};

const LOAI: Record<string, string> = { tin_tuc: "Tin tức", cam_nang: "Cẩm nang" };

async function getNews(id: string): Promise<News | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("news").select("*").eq("id", id).maybeSingle();
  return (data as News) || null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const n = await getNews(id);
  if (!n) return { title: "Không tìm thấy bài viết" };
  return { title: n.tieu_de, description: n.mo_ta || undefined };
}

function fmtDate(s: string) {
  try { return new Date(s).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }); } catch { return ""; }
}

export default async function NewsDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = await getNews(id);
  if (!n) notFound();

  const supabase = await createClient();
  const { data: related } = await supabase
    .from("news")
    .select("id, tieu_de, anh_bia, created_at")
    .neq("id", n.id)
    .order("created_at", { ascending: false })
    .limit(4);

  const paras = (n.noi_dung || "").split(/\n+/).filter(Boolean);

  return (
    <div className="container-app py-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/tin-tuc" className="text-sm text-ink-muted hover:text-brand">&larr; Quay lại Tin tức</Link>
        <span className="mt-4 block w-fit rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand-dark">{LOAI[n.loai || "tin_tuc"] || "Tin tức"}</span>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-ink">{n.tieu_de}</h1>
        <p className="mt-2 text-sm text-neutral-400">{fmtDate(n.created_at)}</p>

        {n.anh_bia && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={n.anh_bia} alt={n.tieu_de} className="mt-6 aspect-video w-full rounded-2xl object-cover" />
        )}

        {n.mo_ta && <p className="mt-6 text-lg font-medium text-ink">{n.mo_ta}</p>}

        <div className="mt-4 space-y-4 text-base leading-relaxed text-ink-muted">
          {paras.length ? paras.map((p, i) => <p key={i}>{p}</p>) : <p>{n.noi_dung}</p>}
        </div>
      </div>

      {related && related.length > 0 && (
        <section className="mx-auto mt-12 max-w-3xl">
          <h2 className="mb-4 text-lg font-bold text-ink">Bài viết liên quan</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(related as News[]).map((r) => (
              <Link key={r.id} href={"/tin-tuc/" + r.id} className="group">
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-neutral-100">
                  {r.anh_bia && /* eslint-disable-next-line @next/next/no-img-element */ (
                    <img src={r.anh_bia} alt={r.tieu_de} className="h-full w-full object-cover transition group-hover:scale-105" />
                  )}
                </div>
                <p className="mt-2 line-clamp-2 text-sm font-medium text-ink group-hover:text-brand">{r.tieu_de}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
