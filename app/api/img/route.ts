import { NextRequest, NextResponse } from "next/server";

export const revalidate = 86400; // cache proxied images for a day

// Only allow proxying images from these trusted news / stock hosts.
const ALLOWED = [
  "images.unsplash.com",
  "vcdn1-vnexpress.vnecdn.net",
  "vcdn2-vnexpress.vnecdn.net",
  "i1-vnexpress.vnecdn.net",
  "vnexpress.net",
  "cafefcdn.com",
  "static.cafeland.vn",
  "cafeland.vn",
  "dantricdn.com",
  "cdnimg.vietnamplus.vn",
  "image.tienphong.vn",
  "media.vneconomy.vn",
];

function hostAllowed(h: string): boolean {
  return ALLOWED.some((d) => h === d || h.endsWith("." + d));
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("u");
  if (!raw) return new NextResponse("Missing u", { status: 400 });

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return new NextResponse("Bad url", { status: 400 });
  }
  if (target.protocol !== "https:" || !hostAllowed(target.hostname)) {
    return new NextResponse("Host not allowed", { status: 403 });
  }

  try {
    const upstream = await fetch(target.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
        Referer: target.origin + "/",
      },
      next: { revalidate: 86400 },
    });
    if (!upstream.ok || !upstream.body) {
      return new NextResponse("Upstream error", { status: 502 });
    }
    const ct = upstream.headers.get("content-type") || "image/jpeg";
    if (!ct.startsWith("image/")) {
      return new NextResponse("Not an image", { status: 415 });
    }
    const buf = await upstream.arrayBuffer();
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": ct,
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new NextResponse("Fetch failed", { status: 502 });
  }
}
