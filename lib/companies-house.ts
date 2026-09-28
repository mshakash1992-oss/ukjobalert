import "server-only";

export class CompanyLookupError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export type CompanyProfile = {
  company_number: string;
  company_name: string;
  company_status: string;
  company_status_detail?: string;
  type?: string;
  date_of_creation?: string;
  registered_office_address?: Record<string, string>;
  has_insolvency_history?: boolean;
  can_file?: boolean;
};

export function normalizeCompanyNumber(value: unknown): string {
  return typeof value === "string" ? value.trim().replace(/\s+/g, "").toUpperCase() : "";
}

export function recommendationFor(company: CompanyProfile): "auto" | "manual" | "reject" {
  if (["dissolved", "liquidation", "receivership", "administration", "converted-closed", "insolvency-proceedings", "removed", "closed"].includes(company.company_status)) {
    return "reject";
  }
  // Unknown status details require review rather than silently approving them.
  if (company.company_status === "active" && !company.company_status_detail && company.has_insolvency_history !== true) {
    return "auto";
  }
  return "manual";
}

export async function lookupCompany(companyNumber: string): Promise<CompanyProfile> {
  if (!/^[A-Z0-9]{8}$/.test(companyNumber)) {
    throw new CompanyLookupError("Enter a valid 8-character company number.", 400);
  }
  const apiKey = process.env.COMPANIES_HOUSE_API_KEY?.trim();
  if (!apiKey || /\s|:|\*/.test(apiKey) || /YOUR_|NEW_KEY|HERE/i.test(apiKey)) {
    throw new CompanyLookupError("Companies House verification is not configured correctly. Please contact support.", 503);
  }
  let response: Response;
  try {
    response = await fetch(`https://api.company-information.service.gov.uk/company/${encodeURIComponent(companyNumber)}`, {
      headers: { Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`, Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new CompanyLookupError("Companies House could not be reached. Please try again shortly.", 503);
  }
  if (response.status === 404) throw new CompanyLookupError("Company not found on Companies House.", 404);
  if (response.status === 401 || response.status === 403) throw new CompanyLookupError("Companies House authentication failed. Please contact support.", 503);
  if (response.status === 429) throw new CompanyLookupError("Too many Companies House requests. Try again shortly.", 429);
  if (!response.ok) throw new CompanyLookupError("Unable to check Companies House right now.", 503);
  let company: CompanyProfile;
  try { company = await response.json(); } catch {
    throw new CompanyLookupError("Companies House returned an invalid response. Please try again.", 502);
  }
  if (!company || company.company_number !== companyNumber || typeof company.company_name !== "string" || !company.company_name || typeof company.company_status !== "string" || !company.company_status) {
    throw new CompanyLookupError("Companies House returned an incomplete record. Please try again.", 502);
  }
  return company;
}
