import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/staff/", "/api/"],
      },
    ],
    sitemap: "https://faded.ro/sitemap.xml",
  };
}
