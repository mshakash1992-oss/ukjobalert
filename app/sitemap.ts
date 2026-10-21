import { isPublicJob } from "@/lib/job-publication";
import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
const SITE = "https://www.ukjobalert.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = ["", "/jobs", "/companies", "/about", "/contact", "/faq", "/privacy-policy", "/terms", "/security-privacy", "/how-it-works", "/jobs/remote", "/jobs/visa-sponsorship", "/guides/jobs-in-uk-for-foreigners"];
  const staticPages: MetadataRoute.Sitemap = paths.map((path) => ({
    url: `${SITE}${path || "/"}`,
    changeFrequency: path === "/jobs" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/jobs" ? 0.9 : 0.5,
  }));

  try {
    const db = createAdminClient();
    const { data: verified, error: verificationError } = await db
      .from("employer_verifications")
      .select("user_id")
      .eq("verification_status", "verified");
    if (verificationError) throw verificationError;
    const verifiedIds = new Set((verified ?? []).map((item) => String(item.user_id)));
    if (!verifiedIds.size) return staticPages;

    const jobPages: MetadataRoute.Sitemap = [];
    const now = Date.now();
    const pageSize = 500;
    for (let offset = 0; ; offset += pageSize) {
      const { data: jobs, error } = await db.from("jobs")
        .select("slug,employer_id,expires_at,created_at,updated_at")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .range(offset, offset + pageSize - 1);
      if (error) throw error;
      const rows = jobs ?? [];
      for (const job of rows) {
        if (!job.slug || !verifiedIds.has(String(job.employer_id))) continue;
        if (!isPublicJob(job, now)) continue;
        const changed = job.updated_at || job.created_at;
        const parsed = changed ? new Date(changed) : null;
        jobPages.push({
          url: `${SITE}/jobs/${encodeURIComponent(job.slug)}`,
          ...(parsed && !Number.isNaN(parsed.getTime()) ? { lastModified: parsed } : {}),
          changeFrequency: "daily",
          priority: 0.8,
        });
      }
      if (rows.length < pageSize) break;
    }
    return [...staticPages, ...jobPages];
  } catch (error) {
    console.error("Sitemap job loading failed:", error);
    return staticPages;
  }
}
