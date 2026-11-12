import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata(
    "UK Companies Hiring: Browse Employers",
    "Explore UK employers hiring now, review company profiles and browse current vacancies from businesses posting jobs on UKJobAlert.",
    "/companies"
  ),
  robots: { index: true, follow: true },
};

export default function CompaniesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
