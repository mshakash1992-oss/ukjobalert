import { pageMetadata } from "@/lib/seo";
import SeoJobResults from "@/components/seo-job-results";

export const metadata = pageMetadata(
  "Remote Work From Home Jobs in the UK",
  "Find current remote jobs in the UK from verified employers. Browse work-from-home vacancies by role, sector and employment type on UKJobAlert.",
  "/jobs/remote"
);

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
