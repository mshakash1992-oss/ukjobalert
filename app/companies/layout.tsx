import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Companies Hiring in the UK",
  description:
    "Browse companies with current vacancies on UKJobAlert and view their active UK job listings.",
  alternates: { canonical: "/companies" },
  openGraph: {
    type: "website",
    url: "/companies",
    title: "Companies Hiring in the UK | UKJobAlert",
    description:
      "Browse employers with current vacancies and open their active UK job listings.",
  },
  robots: { index: true, follow: true },
};

export default function CompaniesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
