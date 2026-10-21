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
  return <>
    <link
      rel="preload"
      as="image"
      href="/images/grow-team-hero-960.webp"
      imageSrcSet="/images/grow-team-hero-960.webp 960w, /images/grow-team-hero-1440.webp 1440w, /images/grow-team-hero-2172.webp 2172w"
      imageSizes="100vw"
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
