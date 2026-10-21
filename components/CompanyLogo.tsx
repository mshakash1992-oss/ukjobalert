"use client";
import { useState } from "react";
export default function CompanyLogo({ src, name }: { src?: string | null; name: string }) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const safe = src && (/^https?:\/\//i.test(src) || /^\/(?!\/)/.test(src)) ? src : "";
  const initials = name.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join("").toUpperCase() || "UK";
  return safe && failedSource !== safe
    ? <img src={safe} alt={`${name} logo`} loading="lazy" onError={() => setFailedSource(safe)} style={{ display: "block", width: "100%", height: "100%", objectFit: "contain", padding: 3 }} />
    : <span aria-label={name}>{initials}</span>;
}
