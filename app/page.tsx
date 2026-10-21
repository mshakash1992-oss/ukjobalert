import Home, { type HomeJob } from "./home-client";
import { getPublicJobs } from "@/lib/public-jobs";
import { pageMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";
export const metadata = pageMetadata("UK Jobs & Latest Vacancies", "Search UK jobs by role, location and sector. Browse current vacancies from verified employers and post jobs for free on UKJobAlert.", "/");
export default async function Page() {
  let jobs: HomeJob[] = [];
  let loadError = false;
  try { jobs = (await getPublicJobs()).slice(0, 8); }
  catch (error) { console.error("Homepage vacancies unavailable", error); loadError = true; }
  return <Home initialJobs={jobs} loadError={loadError} />;
}
