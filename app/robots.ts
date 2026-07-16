import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://nguonnhadatvn.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/tai-khoan/", "/admin/", "/thanh-toan/", "/dang-nhap", "/dang-ky"],
    },
    sitemap: SITE + "/sitemap.xml",
    host: SITE,
  };
}
