import type { Metadata } from "next";
export const SITE_URL = "https://www.ukjobalert.com";
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return { title, description, alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", siteName: "UKJobAlert" },
    twitter: { card: "summary", title, description } };
}
