// Reviewed test records from the 21 October 2026 live-site audit.
// Keep them editable in the employer dashboard, but never expose them as vacancies.
export const QUARANTINED_JOB_SLUGS = new Set([
  "vefewd-b2f52ba4", "amazon-seller-9ebc2b5e", "sell-d1ff68d1",
]);
export function isPublicJob(job: { slug?: unknown; expires_at?: unknown; status?: unknown }, now = Date.now()): boolean {
  if (QUARANTINED_JOB_SLUGS.has(String(job.slug ?? ""))) return false;
  if (job.status !== undefined && job.status !== "published") return false;
  if (!job.expires_at) return true;
  const expires = new Date(String(job.expires_at)).getTime();
  return Number.isFinite(expires) && expires > now;
}
export function jobContentError(title: string, description: string): string | null {
  const text = description.replace(/<[^>]*>/g, " ").trim();
  if (title.trim().length < 3 || text.length < 50)
    return "Provide a clear job title and a job description of at least 50 characters.";
  if (/(.{6,80})\1{4,}/i.test(text))
    return "Replace repeated placeholder text with the role, responsibilities and requirements.";
  return null;
}
export function schemaEmploymentType(type: string): string | undefined {
  const key = type.toLowerCase().replace(/[ _-]+/g, "");
  const types: Record<string, string> = { fulltime: "FULL_TIME", parttime: "PART_TIME",
    contract: "CONTRACTOR", contractor: "CONTRACTOR", temporary: "TEMPORARY",
    internship: "INTERN", intern: "INTERN", volunteer: "VOLUNTEER", perdiem: "PER_DIEM", other: "OTHER" };
  return types[key]; // Remote is a workplace arrangement, not an employment type.
}
