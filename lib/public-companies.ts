import { createAdminClient } from "@/lib/supabase/admin";
import { isPublicJob } from "@/lib/job-publication";

type Row = Record<string, unknown>;
const text = (value: unknown) =>
  typeof value === "string" ? value.trim() : typeof value === "number" ? String(value) : "";
const first = (row: Row, keys: string[]) => keys.map((key) => text(row[key])).find(Boolean) || "";
const plainText = (value: string) =>
  value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim();

export async function getPublicCompanies() {
  const db = createAdminClient();
  const { data: employerRows, error: employerError } = await db
    .from("employer_verifications")
    .select("*")
    .eq("verification_status", "verified");
  if (employerError) throw employerError;

  const employers = (employerRows ?? []) as Row[];
  const ids = employers.map((row) => text(row.user_id)).filter(Boolean);
  if (!ids.length) return [];

  const { data: jobRows, error: jobsError } = await db
    .from("jobs")
    .select("id,employer_id,slug,title,location,category,industry,expires_at,created_at,status")
    .in("employer_id", ids)
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (jobsError) throw jobsError;

  const counts = new Map<string, number>();
  const latestJob = new Map<string, Row>();
  for (const job of ((jobRows ?? []) as Row[]).filter((row) => isPublicJob(row))) {
    const id = text(job.employer_id);
    if (!id) continue;
    counts.set(id, (counts.get(id) ?? 0) + 1);
    if (!latestJob.has(id)) latestJob.set(id, job);
  }

  return employers.flatMap((employer) => {
    const id = text(employer.user_id);
    const jobs = counts.get(id) ?? 0;
    const name = first(employer, ["company_name", "legal_name"]);
    if (!id || !name || jobs === 0) return [];
    const job = latestJob.get(id) ?? {};
    const industry = first(employer, ["industry", "sector", "category", "company_industry"]) ||
      first(job, ["category", "industry"]) || "Other";
    const description = plainText(first(employer, [
      "company_description", "description", "about", "about_company", "company_about",
    ]));
    const size = first(employer, ["company_size", "team_size", "employee_count"]) || "Not specified";
    const location = first(employer, [
      "location", "company_location", "city", "address", "registered_address",
    ]) || text(job.location) || "United Kingdom";

    return [{
      id,
      name,
      initial: name.charAt(0).toUpperCase(),
      industry,
      location,
      jobs,
      size,
      verified: true,
      description: description.slice(0, 220),
    }];
  }).sort((a, b) => b.jobs - a.jobs || a.name.localeCompare(b.name));
}
