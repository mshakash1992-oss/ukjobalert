import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CompanyLookupError, lookupCompany, normalizeCompanyNumber, recommendationFor } from "@/lib/companies-house";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return NextResponse.json({ error: "Please login first." }, { status: 401 });
    if (user.user_metadata?.account_type !== "employer") return NextResponse.json({ error: "Only Employer accounts can verify a company." }, { status: 403 });
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Enter a valid company number." }, { status: 400 });
    const company = await lookupCompany(normalizeCompanyNumber(body.companyNumber));
    return NextResponse.json({
      success: true,
      recommendation: recommendationFor(company),
      company: {
        companyNumber: company.company_number,
        companyName: company.company_name,
        companyStatus: company.company_status,
        companyStatusDetail: company.company_status_detail ?? "",
        companyType: company.type ?? "",
        dateOfCreation: company.date_of_creation ?? null,
        registeredOfficeAddress: company.registered_office_address ?? null,
        hasInsolvencyHistory: company.has_insolvency_history === true,
        canFile: company.can_file ?? null,
      },
    });
  } catch (error) {
    if (error instanceof CompanyLookupError) return NextResponse.json({ error: error.message }, { status: error.status });
    return NextResponse.json({ error: "Unable to check your company. Please try again." }, { status: 500 });
  }
}
