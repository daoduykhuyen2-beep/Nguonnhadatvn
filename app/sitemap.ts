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
    "/lien-he",
  ].map((path) => ({
    url: SITE + path,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("web_posts")
      .select("id, updated_at, created_at")
      .eq("trang_thai", "duyet")
      .order("created_at", { ascending: false })
      .limit(1000);
    postRoutes = (data || []).map((p: { id: number; updated_at?: string; created_at?: string }) => ({
      url: SITE + "/tin-dang/" + p.id,
      lastModified: new Date(p.updated_at || p.created_at || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {}

  return [...staticRoutes, ...postRoutes];
}
