import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact UKJobAlert",

  description:
    "Contact UKJobAlert for questions about the job platform, employer accounts, job listings and general support.",

  alternates: {
    canonical: "/contact",
  },

  openGraph: {
    type: "website",
    url: "/contact",
    title: "Contact UKJobAlert | UKJobAlert",
    description:
      "Get in touch with UKJobAlert about the platform, employer accounts, job listings and general support.",
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