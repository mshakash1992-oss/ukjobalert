import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UK Companies Hiring: Browse Employers",
  description:
    "Explore UK employers hiring now, review company profiles and browse current vacancies from businesses posting jobs on UKJobAlert.",
  alternates: { canonical: "/companies" },
  openGraph: {
    type: "website",
    url: "/companies",
    title: "UK Companies Hiring: Browse Employers | UKJobAlert",
    description:
      "Compare UK employer profiles and open current vacancies to review roles, locations and application details.",
  },
  robots: { index: true, follow: true },
};

export default function CompaniesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
