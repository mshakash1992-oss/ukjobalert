import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How UKJobAlert Helps You Find Jobs and Hire",

  description:
    "See how to search UK vacancies, review job details and apply, and learn how employers complete company checks before publishing jobs on UKJobAlert.",

  alternates: {
    canonical: "/how-it-works",
  },

  openGraph: {
    type: "website",
    url: "/how-it-works",
    title: "How UKJobAlert Helps You Find Jobs and Hire | UKJobAlert",
    description:
      "Follow the steps for finding a vacancy or publishing a UK job through UKJobAlert.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function HowItWorksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}