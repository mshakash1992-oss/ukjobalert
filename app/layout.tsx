import type { Metadata } from "next";
import {
  Manrope,
  Playfair_Display,
} from "next/font/google";

import "./globals.css";

import SiteFooter from "@/components/site-footer";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://ukjobalert.com"
  ),

  title: {
    default:
      "UK Jobs & Verified Employer Vacancies | UKJobAlert",
    template: "%s | UKJobAlert",
  },

  description:
    "Search UK jobs and current vacancies from verified employers. Find opportunities by job title, location, sector and employment type on UKJobAlert.",

  applicationName: "UKJobAlert",

  keywords: [
    "UK jobs",
    "jobs in UK",
    "UK job vacancies",
    "UK vacancies",
    "find jobs UK",
    "job search UK",
    "verified employers UK",
    "UKJobAlert",
  ],

  authors: [
    {
      name: "UKJobAlert",
    },
  ],

  creator: "UKJobAlert",
  publisher: "UKJobAlert",

  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "UKJobAlert",
    title:
      "UK Jobs & Verified Employer Vacancies | UKJobAlert",
    description:
      "Search UK jobs and current vacancies from verified employers by job title, location, sector and employment type.",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "UK Jobs & Verified Employer Vacancies | UKJobAlert",
    description:
      "Search UK jobs and current vacancies from verified employers.",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "jobs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${manrope.variable} ${playfair.variable}`}
    >
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}