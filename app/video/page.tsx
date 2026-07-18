import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export const metadata: Metadata = { title: "Video thị trường bất động sản" };
export const revalidate = 300;

type Vid = { id: string | number; title: string | null; embed: string };

function toEmbed(url: string): string {
  if (!url) return "";
  if (url.includes("/embed")) return url;
  const short = url.match(/youtu\.be\/([\w-]+)/);
  if (short) return "https://www.youtube.com/embed/" + short[1];
  const watch = url.match(/[?&]v=([\w-]+)/);
  if (watch) return "https://www.youtube.com/embed/" + watch[1];
  return url;
}

async function getYoutubeVideos(): Promise<Vid[]> {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    const proto = h.get("x-forwarded-proto") || "https";
    if (!host) return [];
    const res = await fetch(proto + "://" + host + "/api/videos", { cache: "no-store" });
    if (!res.ok) return [];
    const json = (await res.json()) as { ok: boolean; videos?: { id: string; title: string }[] };
    if (!json.ok || !json.videos) return [];
    return json.videos.map((v) => ({ id: v.id, title: v.title, embed: "https://www.youtube.com/embed/" + v.id }));
  } catch {
    return [];
  }
}

async function getDbVideos(): Promise<Vid[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("home_videos")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  return (data || []).map((v: { id: number; title: string | null; tiktok_url: string | null }) => ({
    id: v.id,
    title: v.title,
    embed: toEmbed(v.tiktok_url || ""),
  }));
}

export default async function VideoPage() {
  let videos = await getYoutubeVideos();
  if (videos.length === 0) {
    videos = await getDbVideos();
  }

  return (
    <div className="container-app py-8">
      <div className="mb-6">
        <h1 className="section-title">Video tin tức thị trường bất động sản</h1>
        <p className="mt-2 text-ink-muted">Cập nhật tự động những tin tức, phân tích và dự báo nóng nhất về nhà đất trên cả nước.</p>
      </div>

      {videos.length === 0 ? (
        <div className="card p-10 text-center text-ink-muted">Chưa có video nào.</div>
      ) : (
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
      )}

      <div className="mt-8 text-center">
        <Link href="/tin-dang" className="btn-soft">Xem tin đăng bất động sản &rarr;</Link>
      </div>
    </div>
  );
}
