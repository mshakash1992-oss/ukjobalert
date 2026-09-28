import type { MetadataRoute } from "next";

import { createAdminClient } from "@/lib/supabase/admin";

const BASE_URL = "https://ukjobalert.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const nowIso = now.toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/jobs`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/how-it-works`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/employers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const admin = createAdminClient();

  const { data: jobs, error } = await admin
    .from("jobs")
    .select("slug, updated_at")
    .eq("status", "published")
    .gt("expires_at", nowIso)
    .order("updated_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Unable to generate job sitemap:",
      error
    );

    return staticPages;
  }

  const jobPages: MetadataRoute.Sitemap =
    (jobs || []).map((job) => ({
      url: `${BASE_URL}/jobs/${job.slug}`,
      lastModified: job.updated_at
        ? new Date(job.updated_at)
        : now,
      changeFrequency: "daily",
      priority: 0.8,
    }));

  return [
    ...staticPages,
    ...jobPages,
  ];
}