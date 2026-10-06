import type { Metadata } from "next";

import SeoJobResults from "@/components/seo-job-results";

export const metadata: Metadata = {
  title: "UK Jobs With Visa Sponsorship",
  description:
    "Browse current UK jobs where the employer has stated that visa sponsorship may be available. Check each vacancy carefully before applying.",
  alternates: { canonical: "/jobs/visa-sponsorship" },
  openGraph: {
    title: "UK Jobs With Visa Sponsorship | UKJobAlert",
    description:
      "Browse UK vacancies where the employer has stated that visa sponsorship may be available.",
    url: "/jobs/visa-sponsorship",
    type: "website",
  },
};

export default function VisaSponsorshipJobsPage() {
  return (
    <SeoJobResults
      mode="visa"
      eyebrow="Visa sponsorship opportunities"
      title="UK jobs with visa sponsorship"
      description="Browse current UK vacancies where an employer has stated that visa sponsorship may be available. Eligibility, role requirements and sponsorship decisions are confirmed by the employer, so always review the full listing before applying."
    />
  );
}
