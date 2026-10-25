import type { Metadata } from "next";

import CompaniesClient from "./companies-client";
import { getPublicCompanies } from "@/lib/public-companies";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const companies = await getPublicCompanies();
  const hasHiringCompanies = companies.length > 0;

  return {
    title: "Companies Hiring in the UK",
    description:
      "Browse verified UK employers with current vacancies and explore their active job listings.",
    alternates: { canonical: "/companies" },
    openGraph: {
      type: "website",
      url: "/companies",
      title: "Companies Hiring in the UK | UKJobAlert",
      description:
        "Browse verified UK employers with open UK vacancies and view their active job listings.",
    },
    robots: { index: hasHiringCompanies, follow: true },
  };
}

export default async function CompaniesPage() {
  const companies = await getPublicCompanies();
  return <CompaniesClient companies={companies} />;
}
