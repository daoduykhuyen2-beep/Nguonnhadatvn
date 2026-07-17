import { NextResponse } from "next/server";

export const revalidate = 3600; // cache 1 hour

type YtItem = {
  id: { videoId?: string };
  snippet: { title: string; channelTitle: string; publishedAt: string; thumbnails?: { medium?: { url: string } } };
};

const QUERIES = [
  "shorts thị trường bất động sản Việt Nam",
  "shorts tin tức nhà đất Việt Nam",
  "shorts tin bất động sản hôm nay",
  "shorts giá nhà đất Việt Nam",
  "shorts quy hoạch bất động sản Việt Nam",
  "shorts tin tức kinh tế Việt Nam",
  "shorts thị trường nhà đất mới nhất",
];

export async function GET() {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    return NextResponse.json({ ok: false, reason: "no-key", videos: [] }, { status: 200 });
  }

  try {
    const collected: Record<string, { id: string; title: string; channel: string; publishedAt: string; thumb: string }> = {};
    for (const q of QUERIES) {
      const url =
        "https://www.googleapis.com/youtube/v3/search" +
        "?part=snippet&type=video&videoDuration=short&maxResults=12&order=date&regionCode=VN&relevanceLanguage=vi" +
        "&q=" + encodeURIComponent(q) + "&key=" + key;
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) continue;
      const json = (await res.json()) as { items?: YtItem[] };
      for (const it of json.items || []) {
        const vid = it.id?.videoId;
        if (!vid || collected[vid]) continue;
        collected[vid] = {
          id: vid,
          title: it.snippet?.title || "",
          channel: it.snippet?.channelTitle || "",
          publishedAt: it.snippet?.publishedAt || "",
          thumb: it.snippet?.thumbnails?.medium?.url || "",
        };
      }
    }
    const videos = Object.values(collected)
      .sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""))
      .slice(0, 50);
    return NextResponse.json({ ok: true, vertical: true, videos }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false, reason: "error", videos: [] }, { status: 200 });
  }
}
