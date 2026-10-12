import type { Metadata } from "next";
import { Suspense } from "react";
import GlobalNavigationLoader from "@/components/GlobalNavigationLoader";
import { Roboto } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ukjobalert.com"),
  title: { default: "UKJobAlert", template: "%s | UKJobAlert" },
  description: "Find jobs across the United Kingdom from verified employers.",
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "UKJobAlert",
    title: "UKJobAlert",
    description: "Find jobs across the United Kingdom from verified employers.",
    url: "https://www.ukjobalert.com/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <Suspense fallback={null}><GlobalNavigationLoader /></Suspense>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
