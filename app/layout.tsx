import type { Metadata } from "next";
import { Suspense } from "react";
import GlobalNavigationLoader from "@/components/GlobalNavigationLoader";
import { Roboto } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import WhatsAppChat from "@/components/whatsapp-chat";
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/seo";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s | UKJobAlert" },
  description: SITE_DESCRIPTION,
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "UKJobAlert",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: `${SITE_URL}/`,
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
        <WhatsAppChat />
      </body>
    </html>
  );
}
