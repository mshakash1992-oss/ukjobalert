"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function SiteHeader() {
  const pathname = usePathname();

  const isCandidateDashboard = pathname === "/account" || pathname.startsWith("/account/");

  if (isCandidateDashboard) return null;

  return <Header />;
}
