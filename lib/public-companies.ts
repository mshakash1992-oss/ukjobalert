import { cache } from "react";

import { isPublicJob } from "@/lib/job-publication";
import { createAdminClient } from "@/lib/supabase/admin";

export type PublicCompany = {
  id: string;
  name: string;
  initial: string;
  industry: string;
  location: string;
  jobs: number;
  size?: string;
  verified: boolean;
  description?: string;
};

type CompanyRow = Record<string, unknown> & { user_id?: string | null };
type JobRow = {
  employer_id: string | null;
  expires_at: string | null;
  slug: string | null;
  status: string | null;
};

const value = (input: unknown): string =>
  typeof input === "string" ? input.trim() : typeof input === "number" ? String(input) : "";

function firstValue(row: CompanyRow, keys: string[]): string {
  for (const key of keys) {
    const result = value(row[key]);
    if (result) return result;
  }
  return "";
}

function plainText(input: string): string {
  const text = input
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > 220 ? `${text.slice(0, 217).trimEnd()}…` : text;
}

export const getPublicCompanies = cache(async (): Promise<PublicCompany[]> => {
  const db = createAdminClient();
  const { data: employers, error: employersError } = await db
    .from("employer_verifications")
    .select("*")
    .eq("verification_status", "verified")
    .limit(500);

  if (employersError) throw employersError;

  const verifiedEmployers = (employers ?? []) as CompanyRow[];
  const ownerIds = [...new Set(verifiedEmployers.map((employer) => value(employer.user_id)).filter(Boolean))];
  if (!ownerIds.length) return [];

  const jobCounts = new Map<string, number>();
  const pageSize = 500;

  for (let offset = 0; ; offset += pageSize) {
    const { data: jobs, error: jobsError } = await db
      .from("jobs")
      .select("employer_id,expires_at,slug,status")
      .in("employer_id", ownerIds)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (jobsError) throw jobsError;

    const rows = (jobs ?? []) as JobRow[];
    for (const job of rows) {
      if (!job.employer_id || !isPublicJob(job)) continue;
      jobCounts.set(job.employer_id, (jobCounts.get(job.employer_id) ?? 0) + 1);
    }

    if (rows.length < pageSize) break;
  }

  return verifiedEmployers.flatMap((employer) => {
    const id = value(employer.user_id);
    const name = firstValue(employer, ["company_name", "legal_name"]);
    const jobs = jobCounts.get(id) ?? 0;
    if (!id || !name || !jobs) return [];

    const location = firstValue(employer, ["company_location", "location", "city", "address"]);
    const industry = firstValue(employer, ["industry", "sector", "category", "company_industry"]);
    const size = firstValue(employer, ["company_size", "team_size", "employee_count"]);
    const description = plainText(firstValue(employer, ["company_description", "description", "about_company", "about"]));

    return [{
      id,
      name,
      initial: name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(),
      industry,
      location,
      jobs,
      ...(size ? { size } : {}),
      verified: true,
      ...(description ? { description } : {}),
    }];
  }).sort((a, b) => b.jobs - a.jobs || a.name.localeCompare(b.name));
});
