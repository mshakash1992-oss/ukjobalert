import { createAdminClient } from "@/lib/supabase/admin";
import { isPublicJob } from "@/lib/job-publication";
export async function getPublicJobs() {
  const db = createAdminClient();
  const { data: jobs, error } = await db.from("jobs").select("id,slug,title,location,job_type,category,salary,created_at,expires_at,employer_id,company_logo_url").eq("status", "published").order("created_at", { ascending: false }).limit(100);
  if (error) throw error;
  const valid = (jobs ?? []).filter(j => isPublicJob(j));
  const owners = [...new Set(valid.map(j => j.employer_id).filter(Boolean))];
  if (!owners.length) return [];
  const { data: verified, error: verificationError } = await db.from("employer_verifications").select("user_id,company_name").in("user_id", owners).eq("verification_status", "verified");
  if (verificationError) throw verificationError;
  const companies = new Map((verified ?? []).map(v => [v.user_id, v.company_name]));
  return valid.filter(j => companies.has(j.employer_id)).map(j => ({
    id: String(j.id), slug: String(j.slug || j.id), title: String(j.title || "Job opportunity"),
    company: String(companies.get(j.employer_id) || "Verified employer"),
    location: String(j.location || "United Kingdom"), type: String(j.job_type || "Not specified"),
    category: String(j.category || ""), salary: j.salary ? String(j.salary) : "Salary not specified",
    time: j.created_at ? new Date(j.created_at).toLocaleDateString("en-GB", { timeZone: "Europe/London" }) : "",
    logo: typeof j.company_logo_url === "string" ? j.company_logo_url : "", featured: false, urgent: false,
  }));
}


export type PublicJobMode = "remote" | "visa";

/**
 * Return whether a searchable page has at least one current vacancy from a
 * verified employer. The paged scan avoids indexing empty result pages.
 */
export async function hasPublicJobs(mode?: PublicJobMode): Promise<boolean> {
  const db = createAdminClient();
  const pageSize = 500;

  for (let offset = 0; ; offset += pageSize) {
    let query = db
      .from("jobs")
      .select("slug,expires_at,employer_id,status,workplace_type,visa_sponsorship_available")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (mode === "remote") query = query.eq("workplace_type", "Remote");
    if (mode === "visa") query = query.eq("visa_sponsorship_available", true);

    const { data, error } = await query;
    if (error) throw error;

    const rows = data ?? [];
    const candidates = rows.filter((job) => job.employer_id && isPublicJob(job));
    const ownerIds = [...new Set(candidates.map((job) => job.employer_id).filter(Boolean))];

    if (ownerIds.length) {
      const { data: verified, error: verificationError } = await db
        .from("employer_verifications")
        .select("user_id")
        .in("user_id", ownerIds)
        .eq("verification_status", "verified");
      if (verificationError) throw verificationError;

      const verifiedIds = new Set((verified ?? []).map((employer) => String(employer.user_id)));
      if (candidates.some((job) => verifiedIds.has(String(job.employer_id)))) return true;
    }

    if (rows.length < pageSize) return false;
  }
}
