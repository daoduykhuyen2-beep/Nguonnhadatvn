import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Video thị trường bất động sản" };
export const revalidate = 300;

type Vid = { id: number; title: string | null; tiktok_url: string | null; sort_order: number | null; active: boolean | null };

function toEmbed(url: string): string {
  if (!url) return "";
  // already an embed url
  if (url.includes("/embed")) return url;
  // youtu.be/ID
  const short = url.match(/youtu\.be\/([\w-]+)/);
  if (short) return "https://www.youtube.com/embed/" + short[1];
  // watch?v=ID
  const watch = url.match(/[?&]v=([\w-]+)/);
  if (watch) return "https://www.youtube.com/embed/" + watch[1];
  return url;
}

export default async function VideoPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("home_videos")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  const videos = (data || []) as Vid[];

  return (
    <div className="container-app py-8">
      <div className="mb-6">
        <h1 className="section-title">Video tin tức thị trường bất động sản</h1>
        <p className="mt-1 text-ink-muted">Cập nhật những tin tức, phân tích và dự báo nóng nhất về nhà đất trên cả nước.</p>
      </div>

      {videos.length === 0 ? (
        <div className="card p-10 text-center text-ink-muted">Chưa có video nào.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <div key={v.id} className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <div className="aspect-video w-full bg-neutral-100">
                <iframe
                  src={toEmbed(v.tiktok_url || "")}
                  title={v.title || "Video"}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {v.title && <div className="p-4 text-sm font-semibold text-ink line-clamp-2">{v.title}</div>}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/tin-tuc" className="btn-soft">Xem thêm tin tức &rarr;</Link>
      </div>
    </div>
  );
}
