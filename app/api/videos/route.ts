import { NextResponse } from "next/server";

export const revalidate = 3600; // cache 1 hour

// Kênh YouTube của luật sư Hà (video các vụ việc lừa đảo nhà đất)
const LAWYER_HANDLE = "LuậtSưHà-d5u";

type YtItem = {
  id: { videoId?: string };
  snippet: { title: string; channelTitle: string; publishedAt: string; thumbnails?: { medium?: { url: string } } };
};

type Vid = { id: string; title: string; channel: string; publishedAt: string; thumb: string; lawyer: boolean };

// Video tin tức thị trường nhà đất Việt Nam (làm nền, đan xen)
const NEWS_QUERIES = [
  "shorts thị trường bất động sản Việt Nam",
  "shorts tin tức nhà đất Việt Nam",
  "shorts tin bất động sản hôm nay",
  "shorts giá nhà đất Việt Nam",
  "shorts quy hoạch bất động sản Việt Nam",
];

async function resolveChannelId(handle: string, key: string): Promise<string | null> {
  const url =
    "https://www.googleapis.com/youtube/v3/channels" +
    "?part=id&forHandle=" + encodeURIComponent(handle) + "&key=" + key;
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) return null;
  const json = (await res.json()) as { items?: { id?: string }[] };
  return json.items?.[0]?.id || null;
}

async function searchByChannel(channelId: string, key: string): Promise<YtItem[]> {
  const url =
    "https://www.googleapis.com/youtube/v3/search" +
    "?part=snippet&type=video&maxResults=50&order=date&channelId=" +
    encodeURIComponent(channelId) + "&key=" + key;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const json = (await res.json()) as { items?: YtItem[] };
  return json.items || [];
}

async function searchByQuery(q: string, key: string): Promise<YtItem[]> {
  const url =
    "https://www.googleapis.com/youtube/v3/search" +
    "?part=snippet&type=video&videoDuration=short&maxResults=10&order=date&regionCode=VN&relevanceLanguage=vi" +
    "&q=" + encodeURIComponent(q) + "&key=" + key;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const json = (await res.json()) as { items?: YtItem[] };
  return json.items || [];
}

export async function GET() {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    return NextResponse.json({ ok: false, reason: "no-key", videos: [] }, { status: 200 });
  }

  try {
    const seen: Record<string, boolean> = {};
    const lawyer: Vid[] = [];
    const news: Vid[] = [];

    const push = (items: YtItem[], isLawyer: boolean) => {
      for (const it of items) {
        const vid = it.id?.videoId;
        if (!vid || seen[vid]) continue;
        seen[vid] = true;
        const entry: Vid = {
          id: vid,
          title: it.snippet?.title || "",
          channel: it.snippet?.channelTitle || "",
          publishedAt: it.snippet?.publishedAt || "",
          thumb: it.snippet?.thumbnails?.medium?.url || "",
          lawyer: isLawyer,
        };
        (isLawyer ? lawyer : news).push(entry);
      }
    };

    // Lấy toàn bộ video từ kênh luật sư Hà
    const channelId = await resolveChannelId(LAWYER_HANDLE, key);
    if (channelId) push(await searchByChannel(channelId, key), true);

    // Lấy thêm video tin tức thị trường làm nền
    for (const q of NEWS_QUERIES) push(await searchByQuery(q, key), false);

    const byDate = (a: Vid, b: Vid) => (b.publishedAt || "").localeCompare(a.publishedAt || "");
    lawyer.sort(byDate);
    news.sort(byDate);

    // Đan xen: cứ 2 video luật sư thì 1 video tin tức để luật sư xuất hiện nhiều hơn
    const videos: Vid[] = [];
    let li = 0;
    let ni = 0;
    while ((li < lawyer.length || ni < news.length) && videos.length < 50) {
      if (li < lawyer.length) videos.push(lawyer[li++]);
      if (li < lawyer.length) videos.push(lawyer[li++]);
      if (ni < news.length) videos.push(news[ni++]);
    }

    return NextResponse.json({ ok: true, vertical: true, videos }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false, reason: "error", videos: [] }, { status: 200 });
  }
}
