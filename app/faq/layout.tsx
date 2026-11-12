import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata(
    "UK Job Search FAQs: Accounts, Jobs and Alerts",
    "Get answers about finding UK jobs, applying for vacancies, employer checks, saved jobs, account settings and job alerts on UKJobAlert.",
    "/faq"
  ),
  robots: { index: true, follow: true },
};

export default function FaqLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
