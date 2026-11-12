import type { Metadata } from "next";

export const SITE_URL = "https://www.ukjobalert.com";
export const SITE_TITLE = "Latest UK Jobs & Vacancies: Find Roles and Apply | UKJobAlert";
export const SITE_DESCRIPTION = "Find UK jobs by role, location and sector. Explore full-time, part-time and remote vacancies from verified employers, and apply through UKJobAlert.";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const fullTitle = title.endsWith(" | UKJobAlert") ? title : `${title} | UKJobAlert`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: { title: fullTitle, description, url: path, type: "website", siteName: "UKJobAlert" },
    twitter: { card: "summary", title: fullTitle, description },
  };
}
