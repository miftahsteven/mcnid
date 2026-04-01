import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin-panel/", "/api/"],
      },
    ],
    sitemap: "https://mcnid.net/sitemap.xml",
    host: "https://mcnid.net",
  };
}
