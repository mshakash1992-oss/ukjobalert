import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About UKJobAlert: UK Jobs and Recruitment",

  description:
    "Learn how UKJobAlert helps people find UK vacancies and connects employers with candidates, with a focus on useful listings and safer recruitment.",

  alternates: {
    canonical: "/about",
  },

  openGraph: {
    type: "website",
    url: "/about",
    title: "About UKJobAlert: UK Jobs and Recruitment | UKJobAlert",
    description:
      "Find out how the platform supports job seekers and employers throughout the UK job search and recruitment process.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}