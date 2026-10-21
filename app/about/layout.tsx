import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About UKJobAlert",

  description:
    "Learn about UKJobAlert, a UK job discovery platform helping job seekers find current vacancies and connect with employers.",

  alternates: {
    canonical: "/about",
  },

  openGraph: {
    type: "website",
    url: "/about",
    title: "About UKJobAlert | UKJobAlert",
    description:
      "Learn about UKJobAlert and how the platform helps job seekers discover current UK vacancies.",
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