import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const db = createAdminClient();
    const { data: jobs, error } = await db.from("jobs").select("*").eq("status", "published").order("created_at", { ascending: false }).limit(100);
    if (error) throw error;
    const now = Date.now();
    const valid = (jobs ?? []).filter(j => !j.expires_at || new Date(j.expires_at).getTime() > now);
    const owners = [...new Set(valid.map(j => j.employer_id).filter(Boolean))];
    if (!owners.length) return NextResponse.json({ jobs: [] });
    const { data: verified, error: verificationError } = await db.from("employer_verifications").select("user_id,company_name").in("user_id", owners).eq("verification_status", "verified");
    if (verificationError) throw verificationError;
    const companies = new Map((verified ?? []).map(v => [v.user_id, v.company_name]));
    const publicJobs = valid.filter(j => companies.has(j.employer_id)).map(j => ({
      id: String(j.id), slug: String(j.slug || j.id), title: String(j.title || "Untitled job"),
      company: String(companies.get(j.employer_id) || "Verified employer"),
      location: String(j.location || "United Kingdom"),
      type: String(j.job_type || "Not specified"), category: String(j.category || ""),
      salary: j.salary ? String(j.salary) : "Salary not specified",
      time: j.created_at ? new Date(j.created_at).toLocaleDateString("en-GB") : "",
      logo: "", featured: false, urgent: false,
    }));
    return NextResponse.json({ jobs: publicJobs }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Public jobs retrieval failed", error);
    return NextResponse.json({ error: "Unable to load vacancies" }, { status: 500 });
  }
}
