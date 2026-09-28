import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post UK Jobs & Hire Candidates",

  description:
    "Post UK job vacancies on UKJobAlert. Employer accounts complete a company information check before publishing and managing job listings.",

  alternates: {
    canonical: "/employers",
  },

  openGraph: {
    type: "website",
    url: "/employers",
    title: "Post UK Jobs & Hire Candidates | UKJobAlert",
    description:
      "Publish and manage UK job vacancies on UKJobAlert after completing the employer company information check.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function EmployersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}