type CompaniesHouseAddress = {
  premises?: string;
  address_line_1?: string;
  address_line_2?: string;
  locality?: string;
  region?: string;
  postal_code?: string;
  country?: string;
};

type CompaniesHouseCompany = {
  company_name?: string;
  company_number?: string;
  company_status?: string;
  company_status_detail?: string;
  type?: string;
  date_of_creation?: string;
  registered_office_address?: CompaniesHouseAddress;
  has_insolvency_history?: boolean;
  can_file?: boolean;
};

export type CompanyCheckResult = {
  companyNumber: string;
  companyName: string;
  companyStatus: string;
  companyStatusDetail: string;
  companyType: string;
  dateOfCreation: string | null;
  registeredOfficeAddress: CompaniesHouseAddress | null;
  hasInsolvencyHistory: boolean;
  canFile: boolean | null;
};

export function normalizeCompanyNumber(value: string) {
  return value.trim().replace(/\s+/g, "").toUpperCase();
}

export async function getCompaniesHouseCompany(
  companyNumber: string
): Promise<CompanyCheckResult> {
  const apiKey = process.env.COMPANIES_HOUSE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "COMPANIES_HOUSE_API_KEY is missing."
    );
  }

  const normalized =
    normalizeCompanyNumber(companyNumber);

  if (!/^[A-Z0-9]{8}$/.test(normalized)) {
    throw new Error(
      "Enter a valid Companies House company number."
    );
  }

  const auth = Buffer.from(
    `${apiKey}:`
  ).toString("base64");

  const response = await fetch(
    `https://api.company-information.service.gov.uk/company/${encodeURIComponent(
      normalized
    )}`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    throw new Error(
      "Company not found on Companies House."
    );
  }

  if (response.status === 401) {
    throw new Error(
      "Companies House API authentication failed."
    );
  }

  if (!response.ok) {
    throw new Error(
      `Companies House request failed (${response.status}).`
    );
  }

  const company =
    (await response.json()) as CompaniesHouseCompany;

  if (
    !company.company_name ||
    !company.company_number
  ) {
    throw new Error(
      "Companies House returned incomplete company information."
    );
  }

  return {
    companyNumber: company.company_number,
    companyName: company.company_name,
    companyStatus:
      company.company_status || "unknown",
    companyStatusDetail:
      company.company_status_detail || "",
    companyType: company.type || "",
    dateOfCreation:
      company.date_of_creation || null,
    registeredOfficeAddress:
      company.registered_office_address || null,
    hasInsolvencyHistory:
      Boolean(company.has_insolvency_history),
    canFile:
      typeof company.can_file === "boolean"
        ? company.can_file
        : null,
  };
}

export function getVerificationRecommendation(
  company: CompanyCheckResult
): "auto" | "manual" | "reject" {
  if (
    company.companyStatus.toLowerCase() !==
    "active"
  ) {
    return "reject";
  }

  if (company.hasInsolvencyHistory) {
    return "manual";
  }

  return "auto";
}