import { NextResponse } from "next/server";

export const revalidate = 3600; // refresh hourly

type NewsItem = {
  title: string;
  link: string;
  image: string;
  source: string;
  pubDate: string;
};

const FEEDS = [
  { url: "https://vnexpress.net/rss/bat-dong-san.rss", source: "VnExpress" },
  { url: "https://vnexpress.net/rss/kinh-doanh.rss", source: "VnExpress" },
  { url: "https://cafef.vn/bat-dong-san.rss", source: "CafeF" },
  { url: "https://dantri.com.vn/bat-dong-san.rss", source: "Dân trí" },
  { url: "https://dantri.com.vn/kinh-doanh.rss", source: "Dân trí" },
  { url: "https://tuoitre.vn/rss/nha-dat.rss", source: "Tuổi Trẻ" },
  { url: "https://cafeland.vn/rss/", source: "CafeLand" },
  { url: "https://cafeland.vn/rss/thi-truong.rss", source: "CafeLand" },
];

const FALLBACK_IMG = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";

function pick(block: string, tag: string): string {
  const m = block.match(new RegExp("<" + tag + "[^>]*>([\\s\\S]*?)</" + tag + ">", "i"));
  if (!m) return "";
  return m[1].replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "").replace(/<[^>]+>/g, "").replace(/&amp;amp;/g, "&").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").trim();
}

function decodeEntities(u: string): string {
  return u
    .replace(/&amp;/g, "&")
    .replace(/&#38;/g, "&")
    .replace(/&#x26;/gi, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .trim();
}

function findImage(block: string): string {
  const enc = block.match(/<enclosure[^>]*url=["']([^"']+)["']/i);
  if (enc) return decodeEntities(enc[1]);
  const media = block.match(/<media:content[^>]*url=["']([^"']+)["']/i);
  if (media) return decodeEntities(media[1]);
  const desc = pick(block, "description");
  const img = desc.match(/<img[^>]*src=["']([^"']+)["']/i);
  if (img) return decodeEntities(img[1]);
  return "";
}

async function parseFeed(url: string, source: string): Promise<NewsItem[]> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 }, headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) return [];
    const xml = await res.text();
    const items = xml.split(/<item[>\s]/i).slice(1);
    const out: NewsItem[] = [];
    for (const raw of items) {
      const block = raw.split(/<\/item>/i)[0];
      const title = pick(block, "title");
      const link = pick(block, "link");
      if (!title || !link) continue;
      out.push({
        title,
        link,
        image: findImage(block) || FALLBACK_IMG,
        source,
        pubDate: pick(block, "pubDate"),
      });
    }
    return out;
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const all: NewsItem[] = [];
    for (const f of FEEDS) {
      const items = await parseFeed(f.url, f.source);
      all.push(...items);
    }
    const seen = new Set<string>();
    const unique = all.filter((it) => {
      if (seen.has(it.link)) return false;
      seen.add(it.link);
      return true;
    });
    unique.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    return NextResponse.json({ ok: true, items: unique.slice(0, 60) }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false, items: [] }, { status: 200 });
  }
}
