import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UK Job Search FAQs: Accounts, Jobs and Alerts",
  description:
    "Get answers about finding UK jobs, applying for vacancies, employer checks, saved jobs, account settings and job alerts on UKJobAlert.",
  alternates: { canonical: "/faq" },
  robots: { index: true, follow: true },
};

export default function FaqLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
