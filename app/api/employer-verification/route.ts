import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CompanyLookupError, lookupCompany, normalizeCompanyNumber, recommendationFor } from "@/lib/companies-house";

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return NextResponse.json({ error: "Please login first." }, { status: 401 });
    if (user.user_metadata?.account_type !== "employer") return NextResponse.json({ error: "Only Employer accounts can verify a company." }, { status: 403 });
    if (!user.email_confirmed_at) return NextResponse.json({ error: "Confirm your account email before verifying your business." }, { status: 403 });

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid verification details." }, { status: 400 });
    const companyNumber = normalizeCompanyNumber(body.companyNumber);
    const businessEmail = typeof body.businessEmail === "string" ? body.businessEmail.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const website = typeof body.website === "string" ? body.website.trim() : "";
    if (!/^[A-Z0-9]{8}$/.test(companyNumber)) return NextResponse.json({ error: "Enter a valid 8-character company number." }, { status: 400 });
    if (businessEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail)) return NextResponse.json({ error: "Enter a valid contact email." }, { status: 400 });
    if (!phone || phone.length > 50 || !/^[+\d\s().-]+$/.test(phone) || phone.replace(/\D/g, "").length < 7) return NextResponse.json({ error: "Enter a valid business phone number." }, { status: 400 });
    if (website) {
      try {
        const url = new URL(website);
        if (website.length > 2048 || !["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new Error();
      } catch { return NextResponse.json({ error: "Enter a valid http or https website URL." }, { status: 400 }); }
    }

    const admin = createAdminClient();
    const { data: existing, error: existingError } = await admin.from("employer_verifications").select("id,verification_status").eq("user_id", user.id).maybeSingle();
    if (existingError) return NextResponse.json({ error: "Unable to load your verification. Please try again." }, { status: 503 });
    if (existing?.verification_status === "verified" || existing?.verification_status === "pending") {
      return NextResponse.json({ success: true, status: existing.verification_status, message: existing.verification_status === "verified" ? "Your employer account is already verified." : "Your verification is awaiting manual review." });
    }

    // Always re-fetch the record: browser-supplied names, statuses and approval flags are ignored.
    const company = await lookupCompany(companyNumber);
    const recommendation = recommendationFor(company);
    const status = recommendation === "auto" ? "verified" : recommendation === "reject" ? "rejected" : "pending";
    const now = new Date().toISOString();
    const record = {
      user_id: user.id,
      company_number: company.company_number,
      company_name: company.company_name,
      company_status: company.company_status,
      company_status_detail: company.company_status_detail ?? null,
      company_type: company.type ?? null,
      date_of_creation: company.date_of_creation ?? null,
      registered_office_address: company.registered_office_address ?? null,
      business_email: businessEmail,
      phone,
      website: website || null,
      verification_status: status,
      auto_approved: status === "verified",
      verification_method: "companies_house",
      review_notes: status === "pending" ? "Companies House record requires manual review." : status === "rejected" ? "Company status is not eligible for job posting." : null,
      submitted_at: now,
      reviewed_at: status === "pending" ? null : now,
      updated_at: now,
    };
    const result = existing
      ? await admin.from("employer_verifications").update(record).eq("id", existing.id).eq("user_id", user.id).eq("verification_status", existing.verification_status).select("id").maybeSingle()
      : await admin.from("employer_verifications").insert(record).select("id").single();
    if (result.error || !result.data) return NextResponse.json({ error: "Unable to save verification. Refresh the page and try again." }, { status: 503 });
    return NextResponse.json({ success: true, status, message: status === "verified" ? "Your active company has been verified automatically." : status === "pending" ? "Your company requires manual review." : "This company's current status is not eligible for job posting." });
  } catch (error) {
    if (error instanceof CompanyLookupError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Unable to submit verification. Please try again." }, { status: 500 });
  }
}
