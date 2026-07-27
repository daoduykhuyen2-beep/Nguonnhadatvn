import type { MetadataRoute } from "next";

const SITE = "https://www.nguonnhadatvn.vn";

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
