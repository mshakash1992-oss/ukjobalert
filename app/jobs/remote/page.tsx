import type { Metadata } from "next";

import SeoJobResults from "@/components/seo-job-results";
import { hasPublicJobs } from "@/lib/public-jobs";

export async function generateMetadata(): Promise<Metadata> {
  const hasVacancies = await hasPublicJobs("remote");
  return {
    title: "Remote Jobs in the UK",
    description:
      "Find current remote jobs in the UK from verified employers. Browse work-from-home vacancies by role, sector and employment type on UKJobAlert.",
    alternates: { canonical: "/jobs/remote" },
    openGraph: {
      title: "Remote Jobs in the UK | UKJobAlert",
      description: "Browse current remote UK jobs from verified employers.",
      url: "/jobs/remote",
      type: "website",
    },
    robots: { index: hasVacancies, follow: true },
  };
}

export default function RemoteJobsPage() {
  return (
    <SeoJobResults
      mode="remote"
      eyebrow="Work from home opportunities"
      title="Remote jobs in the UK"
      description="Explore current remote roles from verified UK employers. Each listing shows the employer, role details and application route so you can make an informed decision before applying."
    />
  );
}
