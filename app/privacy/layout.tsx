import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",

  description:
    "Read the UKJobAlert Privacy Policy to understand how information is collected, used and handled when using the UKJobAlert platform.",

  alternates: {
    canonical: "/privacy",
  },

  openGraph: {
    type: "website",
    url: "/privacy",
    title: "Privacy Policy | UKJobAlert",
    description:
      "Read the UKJobAlert Privacy Policy and learn how information is handled when using the platform.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
