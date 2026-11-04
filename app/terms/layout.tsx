import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service for UK Job Seekers and Employers",

  description:
    "Read the terms for using UKJobAlert, including rules for job seekers and employers, job listings, applications, accounts and responsibilities on the platform.",

  alternates: {
    canonical: "/terms",
  },

  openGraph: {
    type: "website",
    url: "/terms",
    title: "Terms of Service for UK Job Seekers and Employers | UKJobAlert",
    description:
      "Review the terms that apply when job seekers and employers use UKJobAlert and its recruitment services.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}