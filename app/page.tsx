import Home, { type HomeJob } from "./home-client";
import { getPublicJobs } from "@/lib/public-jobs";
import { pageMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";
export const metadata = pageMetadata("Find the Latest UK Jobs, Vacancies & Career Opportunities", "Search UK vacancies by role, location and sector. Find verified full-time, part-time and remote jobs, and apply directly to employers on UKJobAlert today.", "/");
export default async function Page() {
  let jobs: HomeJob[] = [];
  let loadError = false;
  try { jobs = (await getPublicJobs()).slice(0, 8); }
  catch (error) { console.error("Homepage vacancies unavailable", error); loadError = true; }
  return <>
    <link
      rel="preload"
      as="image"
      href="/images/grow-team-header-mobile.webp"
      media="(max-width: 700px)"
      fetchPriority="high"
    />
    <link
      rel="preload"
      as="image"
      href="/images/grow-team-hero-2172.webp"
      imageSrcSet="/images/grow-team-hero-960.webp 960w, /images/grow-team-hero-1440.webp 1440w, /images/grow-team-hero-2172.webp 2172w"
      imageSizes="100vw"
      media="(min-width: 701px)"
      fetchPriority="high"
    />
    <Home initialJobs={jobs} loadError={loadError} />
  </>;
}
