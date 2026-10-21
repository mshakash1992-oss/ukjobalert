import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about finding jobs, employer verification, applications, saved jobs and job alerts on UKJobAlert.",
  alternates: { canonical: "/faq" },
  robots: { index: true, follow: true },
};

export default function FaqLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
