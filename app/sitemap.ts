import { isPublicJob } from "@/lib/job-publication";
import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
const SITE = "https://www.ukjobalert.com";
const ALWAYS_INDEXABLE_PATHS = [
  "",
  "/about",
  "/contact",
  "/faq",
  "/privacy-policy",
  "/terms",
  "/security-privacy",
  "/how-it-works",
  "/guides/jobs-in-uk-for-foreigners",
  "/employers",
  "/site-map",
];

function staticPages(paths: string[]): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: `${SITE}${path || "/"}`,
    changeFrequency: path === "/jobs" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/jobs" ? 0.9 : 0.5,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const db = createAdminClient();
    const { data: verified, error: verificationError } = await db
      .from("employer_verifications")
      .select("user_id,company_name")
      .eq("verification_status", "verified");
    if (verificationError) throw verificationError;

    const verifiedIds = new Set((verified ?? []).map((item) => String(item.user_id)));
    const namedEmployerIds = new Set(
      (verified ?? [])
        .filter((item) => typeof item.company_name === "string" && item.company_name.trim())
        .map((item) => String(item.user_id)),
    );
    if (!verifiedIds.size) return staticPages(ALWAYS_INDEXABLE_PATHS);

    const jobPages: MetadataRoute.Sitemap = [];
    const now = Date.now();
    const pageSize = 500;
    let hasRemoteJobs = false;
    let hasVisaJobs = false;
    let hasHiringCompanies = false;

    for (let offset = 0; ; offset += pageSize) {
      const { data: jobs, error } = await db
        .from("jobs")
        .select("slug,employer_id,expires_at,created_at,updated_at,workplace_type,visa_sponsorship_available")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .range(offset, offset + pageSize - 1);
      if (error) throw error;

      const rows = jobs ?? [];
      for (const job of rows) {
        if (!job.slug || !verifiedIds.has(String(job.employer_id))) continue;
        if (!isPublicJob(job, now)) continue;

        if (namedEmployerIds.has(String(job.employer_id))) hasHiringCompanies = true;
        if (job.workplace_type === "Remote") hasRemoteJobs = true;
        if (job.visa_sponsorship_available === true) hasVisaJobs = true;

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

    const paths = [...ALWAYS_INDEXABLE_PATHS];
    if (jobPages.length) paths.push("/jobs");
    if (hasHiringCompanies) paths.push("/companies");
    if (hasRemoteJobs) paths.push("/jobs/remote");
    if (hasVisaJobs) paths.push("/jobs/visa-sponsorship");

    return [...staticPages(paths), ...jobPages];
  } catch (error) {
    console.error("Sitemap job loading failed:", error);
    return staticPages(ALWAYS_INDEXABLE_PATHS);
  }
}
