import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How UKJobAlert Works",

  description:
    "Learn how UKJobAlert helps job seekers search UK vacancies and how employers complete company checks before publishing jobs.",

  alternates: {
    canonical: "/how-it-works",
  },

  openGraph: {
    type: "website",
    url: "/how-it-works",
    title: "How UKJobAlert Works | UKJobAlert",
    description:
      "See how job seekers find UK vacancies and how employers publish jobs through UKJobAlert.",
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