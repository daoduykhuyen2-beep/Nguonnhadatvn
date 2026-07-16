import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://nguonnhadatvn.vercel.app";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/tin-dang",
    "/tin-tuc",
    "/tuyen-dung",
    "/gioi-thieu",
    "/bang-gia",
    "/chinh-sach-bao-mat",
  ].map((path) => ({
    url: SITE + path,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  let postRoutes: MetadataRoute.Sitemap = [];
  let newsRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();

    const { data: posts } = await supabase
      .from("web_posts")
      .select("id, created_at")
      .eq("trang_thai", "duyet")
      .order("created_at", { ascending: false })
      .limit(1000);
    postRoutes = (posts || []).map((p: { id: number | string; created_at?: string }) => ({
      url: SITE + "/tin-dang/" + p.id,
      lastModified: new Date(p.created_at || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    const { data: news } = await supabase
      .from("news")
      .select("id, created_at")
      .order("created_at", { ascending: false })
      .limit(1000);
    newsRoutes = (news || []).map((n: { id: string; created_at?: string }) => ({
      url: SITE + "/tin-tuc/" + n.id,
      lastModified: new Date(n.created_at || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {}

  return [...staticRoutes, ...postRoutes, ...newsRoutes];
}
