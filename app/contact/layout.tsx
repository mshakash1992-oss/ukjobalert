import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact UKJobAlert Support for Job Seekers",

  description:
    "Get help with your UKJobAlert account, job applications, employer profile, job listings or alerts. Contact the team with platform support questions.",

  alternates: {
    canonical: "/contact",
  },

  openGraph: {
    type: "website",
    url: "/contact",
    title: "Contact UKJobAlert Support for Job Seekers | UKJobAlert",
    description:
      "Contact the UKJobAlert team for assistance with job seeker accounts, employer tools, vacancies and job alerts.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}