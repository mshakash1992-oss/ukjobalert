import CompaniesClient, { type PublicCompany } from "./companies-client";
import { getPublicCompanies } from "@/lib/public-companies";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  let companies: PublicCompany[] = [];
  try {
    companies = await getPublicCompanies();
  } catch (error) {
    console.error("Public company listing failed:", error);
  }
  return <CompaniesClient companies={companies} />;
}
