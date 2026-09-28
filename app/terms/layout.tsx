import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",

  description:
    "Read the UKJobAlert Terms of Service covering the use of the platform, job listings, employer accounts and user responsibilities.",

  alternates: {
    canonical: "/terms",
  },

  openGraph: {
    type: "website",
    url: "/terms",
    title: "Terms of Service | UKJobAlert",
    description:
      "Read the UKJobAlert Terms of Service for job seekers and employers using the platform.",
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