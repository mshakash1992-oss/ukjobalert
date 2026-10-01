import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",

      allow: "/",

      disallow: [
        "/admin",
        "/account",
        "/api/",
        "/auth/",
        "/employer/jobs",
        "/employer/verify",
        "/post-job",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
      ],
    },

    sitemap:
      "https://ukjobalert.com/sitemap.xml",

    host:
      "https://ukjobalert.com",
  };
}