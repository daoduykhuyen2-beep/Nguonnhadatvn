import { NextResponse } from "next/server";

export const revalidate = 3600;

// Kênh YouTube của luật sư Hà (video cảnh báo lừa đảo nhà đất)
const LAWYER_HANDLE = "LuậtSưHà-d5u";

type YtItem = {
  id: { videoId?: string };
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails?: { medium?: { url: string } };
  };
};

type Vid = {
  id: string;
  title: string;
  channel: string;
  publishedAt: string;
  thumb: string;
  lawyer: boolean;
};

// Video tin tức thị trường nhà đất Việt Nam (làm nền, đan xen)
const NEWS_QUERIES = [
  "thị trường bất động sản Việt Nam",
  "tin tức nhà đất Việt Nam",
  "tin bất động sản hôm nay",
  "giá nhà đất Việt Nam",
  "quy hoạch bất động sản Việt Nam",
];

async function ytFetch(url: string): Promise<{ ok: boolean; status: number; json: any }> {
  const res = await fetch(url);
  let json: any = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  return { ok: res.ok, status: res.status, json };
}

async function resolveChannelId(handle: string, key: string): Promise<string | null> {
  const url =
    "https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=" +
    encodeURIComponent(handle) +
    "&key=" +
    key;
  const { ok, json } = await ytFetch(url);
  if (!ok) return null;
  return json?.items?.[0]?.id || null;
}

async function searchByChannel(channelId: string, key: string): Promise<YtItem[]> {
  const url =
    "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50&order=date&channelId=" +
    channelId +
    "&key=" +
    key;
  const { ok, json } = await ytFetch(url);
  if (!ok) return [];
  return json?.items || [];
}

async function searchByQuery(q: string, key: string): Promise<YtItem[]> {
  const url =
    "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&order=relevance&regionCode=VN&relevanceLanguage=vi&q=" +
    encodeURIComponent(q) +
    "&key=" +
    key;
  const { ok, json } = await ytFetch(url);
  if (!ok) return [];
  return json?.items || [];
}

export async function GET() {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    return NextResponse.json({ ok: false, reason: "no-key", videos: [] }, { status: 200 });
  }

  try {
    const lawyer: Vid[] = [];
    const news: Vid[] = [];
    const seen: Record<string, boolean> = {};
    let firstError: { status: number; reason: string } | null = null;

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

    // Kiểm tra key có hoạt động phía server không (bắt lỗi để chẩn đoán)
    const probe = await ytFetch(
      "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&order=relevance&regionCode=VN&q=" +
        encodeURIComponent("bất động sản Việt Nam") +
        "&key=" +
        key
    );
    if (!probe.ok) {
      firstError = {
        status: probe.status,
        reason: probe.json?.error?.errors?.[0]?.reason || probe.json?.error?.message || "unknown",
      };
    } else {
      push(probe.json?.items || [], false);
    }

    // Lấy toàn bộ video từ kênh luật sư Hà
    const channelId = await resolveChannelId(LAWYER_HANDLE, key);
    if (channelId) push(await searchByChannel(channelId, key), true);

    // Lấy thêm video tin tức thị trường làm nền
    for (const q of NEWS_QUERIES) push(await searchByQuery(q, key), false);

    const byDate = (a: Vid, b: Vid) =>
      (b.publishedAt || "").localeCompare(a.publishedAt || "");
    lawyer.sort(byDate);
    news.sort(byDate);

    // Đan xen: cứ 2 video luật sư thì 1 video tin tức
    const videos: Vid[] = [];
    let li = 0;
    let ni = 0;
    while ((li < lawyer.length || ni < news.length) && videos.length < 24) {
      if (li < lawyer.length) videos.push(lawyer[li++]);
      if (li < lawyer.length) videos.push(lawyer[li++]);
      if (ni < news.length) videos.push(news[ni++]);
    }

    return NextResponse.json(
      { ok: true, vertical: true, count: videos.length, error: firstError, videos },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { ok: false, reason: "error", message: String(e), videos: [] },
      { status: 200 }
    );
  }
}
