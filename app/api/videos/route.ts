import { NextResponse } from "next/server";

export const revalidate = 3600; // cache 1 hour

type YtItem = {
  id: { videoId?: string };
  snippet: { title: string; channelTitle: string; publishedAt: string; thumbnails?: { medium?: { url: string } } };
};

type Vid = { id: string; title: string; channel: string; publishedAt: string; thumb: string; lawyer: boolean };

// Video luật sư nói về các vụ việc lừa đảo nhà đất (ưu tiên, đan xen nhiều)
const LAWYER_QUERIES = [
  "luật sư Hà lừa đảo bất động sản",
  "luật sư Hà lừa đảo mua bán nhà đất",
  "luật sư Hà vụ án lừa đảo nhà đất",
  "luật sư tư vấn lừa đảo bất động sản",
  "luật sư cảnh báo lừa đảo mua bán nhà đất",
  "luật sư phân tích vụ lừa đảo bất động sản",
  "luật sư chiêu trò lừa đảo mua đất nền",
  "luật sư tranh chấp hợp đồng mua bán nhà đất",
];

// Video tin tức thị trường nhà đất Việt Nam
const NEWS_QUERIES = [
  "shorts thị trường bất động sản Việt Nam",
  "shorts tin tức nhà đất Việt Nam",
  "shorts tin bất động sản hôm nay",
  "shorts giá nhà đất Việt Nam",
  "shorts quy hoạch bất động sản Việt Nam",
];

async function search(q: string, key: string, shortOnly: boolean): Promise<YtItem[]> {
  const dur = shortOnly ? "&videoDuration=short" : "";
  const url =
    "https://www.googleapis.com/youtube/v3/search" +
    "?part=snippet&type=video&maxResults=10&order=date&regionCode=VN&relevanceLanguage=vi" +
    dur +
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

    for (const q of LAWYER_QUERIES) push(await search(q, key, false), true);
    for (const q of NEWS_QUERIES) push(await search(q, key, true), false);

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
