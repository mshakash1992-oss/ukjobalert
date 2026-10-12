import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/auth/", "/account/", "/employer/", "/login", "/register", "/post-job"],
    }],
    sitemap: "https://www.ukjobalert.com/sitemap.xml",
    host: "https://www.ukjobalert.com",
  };
}
