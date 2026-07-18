import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

import type { Metadata } from "next";
export const metadata: Metadata = { title: "Video" };
export const revalidate = 300;

type Vid = { id: string | number; title: string | null; search: string };

async function getDbVideos(): Promise<Vid[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("home_videos")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  return (data || []).map((v: { id: number; title: string | null }) => ({
    id: v.id,
    title: v.title,
    search:
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent((v.title || "bat dong san") + " nha dat"),
  }));
}

export default async function VideoPage() {
  const videos = await getDbVideos();

  return (
    <div className="container-app py-8">
      <div className="mb-6">
        <h1 className="section-title">Video</h1>
        <p className="mt-2 text-ink-muted">
          Tuyen tap video bat dong san, ban co the xem tren YouTube.
        </p>
      </div>

      {videos.length === 0 ? (
        <div className="card p-10 text-center text-ink-muted">Chua co video nao.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {videos.map((v) => (
            <a
              key={v.id}
              href={v.search}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-lift"
            >
              <div className="relative flex aspect-video w-full items-center justify-center bg-gradient-to-br from-brand-50 to-emerald-100">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-md transition group-hover:scale-110">
                  <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-brand-600" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </div>
              {v.title && (
                <div className="p-3 text-sm font-semibold text-ink line-clamp-2">
                  {v.title}
                </div>
              )}
            </a>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/tin-dang" className="btn-soft">Xem tin dang &rarr;</Link>
      </div>
    </div>
  );
}
