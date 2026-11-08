import { jobContentError } from "@/lib/job-publication";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getVerifiedEmployer() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in required", status: 401 } as const;
  if (user.user_metadata?.account_type !== "employer") {
    return { error: "Employer account required", status: 403 } as const;
  }

  const db = createAdminClient();
  const { data: verification, error } = await db
    .from("employer_verifications")
    .select("company_name,verification_status")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) return { error: "Unable to check company verification", status: 500 } as const;
  if (verification?.verification_status !== "verified") {
    return { error: "Verified employer required", status: 403 } as const;
  }

  return { user, db, companyName: verification.company_name || "Employer" } as const;
}

function expiryTimestamp(dateOnly: string) {
  const match = dateOnly.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return date.toISOString();
}

function defaultExpiryTimestamp() {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + 30);
  date.setUTCHours(23, 59, 59, 999);
  return date.toISOString();
}

export function validateJob(body: Record<string, unknown>) {
  const str = (key: string, max: number) =>
    typeof body[key] === "string" ? String(body[key]).trim().slice(0, max) : "";
  const title = str("title", 160);
  const location = str("location", 180);
  const category = str("category", 100);
  const job_type = str("job_type", 100);
  const description = str("description", 30000);
  const salary = str("salary", 120);
  const apply_url = str("apply_url", 2048);
  const apply_email = str("apply_email", 254);
  const status = str("status", 20);
  const suppliedExpiry = str("expires_at", 10);
  const expires_at = suppliedExpiry ? expiryTimestamp(suppliedExpiry) : defaultExpiryTimestamp();

  if (!title || !location || !category || !job_type || description.length < 30) {
    return { error: "Complete all required job fields (description at least 30 characters)." };
  }
  if (status === "published") {
    const contentError = jobContentError(title, description);
    if (contentError) return { error: contentError };
  }
  if (status !== "published" && status !== "draft") return { error: "Invalid job status" };
  if (Boolean(apply_url) === Boolean(apply_email)) {
    return { error: "Provide exactly one application URL or email" };
  }
  if (apply_url) {
    try {
      const url = new URL(apply_url);
      if (!["http:", "https:"].includes(url.protocol)) throw Error();
    } catch {
      return { error: "Enter a valid HTTPS/HTTP application URL" };
    }
  }
  if (apply_email && !/^[^\s@]+@[^\s@]+\\.[^\s@]+$/.test(apply_email)) {
    return { error: "Invalid application email" };
  }
  if (!expires_at) return { error: "Enter a valid application end date." };
  if (status === "published" && new Date(expires_at).getTime() <= Date.now()) {
    return { error: "Application end date must be today or later." };
  }

  return {
    value: {
      title, location, category, job_type, description, salary: salary || null,
      apply_url: apply_url || null, apply_email: apply_email || null, status, expires_at,
    },
  };
}
