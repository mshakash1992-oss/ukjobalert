import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowRight,
  BellRing,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import MainHeader from "@/components/main-header";

export const metadata: Metadata = {
  title: "UK Jobs & Verified Employer Vacancies",
  description:
    "Search current UK jobs and vacancies from verified employers. Browse opportunities by job title, location, sector and employment type on UKJobAlert.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "UKJobAlert",
    title: "UK Jobs & Verified Employer Vacancies | UKJobAlert",
    description:
      "Search current UK jobs and vacancies from verified employers across the United Kingdom.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Jobs & Verified Employer Vacancies | UKJobAlert",
    description:
      "Search current UK jobs and vacancies from verified employers across the United Kingdom.",
  },
  robots: { index: true, follow: true },
};

type Job = {
  id: string;
  slug: string;
  company_name: string;
  company_number: string;
  title: string;
  category: string;
  job_type: string;
  location: string;
  salary: string | null;
  created_at: string;
};

const sectors = [
  { name: "Healthcare", icon: "https://cdn-icons-png.flaticon.com/512/5405/5405344.png" },
  { name: "Hospitality", icon: "https://cdn-icons-png.flaticon.com/512/4488/4488970.png" },
  { name: "Construction", icon: "https://cdn-icons-png.flaticon.com/512/16235/16235921.png" },
  { name: "Driving", icon: "https://cdn-icons-png.flaticon.com/512/6104/6104007.png" },
  { name: "Cleaning", icon: "https://cdn-icons-png.flaticon.com/512/12003/12003562.png" },
  { name: "Warehouse", icon: "https://cdn-icons-png.flaticon.com/512/17452/17452560.png" },
  { name: "Office", icon: "https://cdn-icons-png.flaticon.com/512/9973/9973985.png" },
  { name: "Retail", icon: "https://cdn-icons-png.flaticon.com/512/12315/12315929.png" },
];

const jobTypes = [
  "Full Time",
  "Part Time",
  "Temporary",
  "Contract",
  "Apprenticeship",
  "Internship",
];

function timeAgo(date: string) {
  const difference = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(difference / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const loggedIn = Boolean(user);
  const accountType = user?.user_metadata?.account_type;
  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Account";
  const now = new Date().toISOString();

  const { data: jobsData, error: jobsError } = await supabase
    .from("jobs")
    .select(`
      id,
      slug,
      company_name,
      company_number,
      title,
      category,
      job_type,
      location,
      salary,
      created_at
    `)
    .eq("status", "published")
    .gt("expires_at", now)
    .order("created_at", { ascending: false })
    .limit(6);

  if (jobsError) console.error(jobsError);
  const jobs = (jobsData || []) as Job[];

  const admin = createAdminClient();
  const [liveJobsResult, ...sectorResults] = await Promise.all([
    admin
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .gt("expires_at", now),
    ...sectors.map((sector) =>
      admin
        .from("jobs")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .eq("category", sector.name)
        .gt("expires_at", now)
    ),
  ]);

  const liveJobsCount = liveJobsResult.count || 0;
  const sectorData = sectors.map((sector, index) => ({
    ...sector,
    count: sectorResults[index]?.count || 0,
  }));

  const typeResults = await Promise.all(
    jobTypes.map((jobType) =>
      admin
        .from("jobs")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .eq("job_type", jobType)
        .gt("expires_at", now)
    )
  );

  const jobTypeData = jobTypes.map((name, index) => ({
    name,
    count: typeResults[index]?.count || 0,
  }));

  const seekerBaseHref = !loggedIn ? "/signup" : accountType === "employer" ? "/jobs" : "/account";

  return (
    <main className="min-h-screen bg-white text-[#0b1f3a]">
      <MainHeader
        loggedIn={loggedIn}
        displayName={displayName}
        accountType={accountType}
      />

      {/* HERO */}
      <link
        rel="preload"
        as="image"
        href="/london-hero.webp"
        type="image/webp"
        media="(min-width: 640px)"
        fetchPriority="high"
      />
      <section className="relative overflow-hidden bg-[#07182d] sm:min-h-[600px] lg:min-h-[720px]">
        <div
          className="absolute inset-0 hidden bg-cover sm:block"
          style={{
            backgroundImage: "url('/london-hero.webp')",
            backgroundPosition: "center 38%",
          }}
        />
        <div
          className="absolute inset-0 sm:hidden"
          style={{
            background:
              "radial-gradient(circle at 88% 18%, rgba(38,105,174,.42) 0%, rgba(38,105,174,0) 34%), linear-gradient(135deg, #07182d 0%, #0b2949 58%, #123d68 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(3,17,34,.78) 0%, rgba(3,17,34,.58) 42%, rgba(3,17,34,.20) 72%, rgba(3,17,34,.06) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(3,17,34,.42) 0%, rgba(3,17,34,.02) 62%)",
          }}
        />

        <div className="relative mx-auto max-w-[1440px] px-6 pt-[50px] sm:pt-[62px] md:px-10 md:pt-[72px] lg:pt-[190px] xl:px-12">
          <div className="mx-auto w-full max-w-[1260px] pb-10 sm:pb-12 lg:pb-10">
            <p
              className="mb-4 text-[12px] font-extrabold uppercase tracking-[0.22em] sm:text-[13px]"
              style={{ color: "#f3c4c8" }}
            >
              Jobs across the United Kingdom
            </p>

            <h1
              className="max-w-[980px] font-serif text-[50px] font-semibold leading-[0.96] tracking-[-1.8px] drop-shadow-[0_4px_18px_rgba(0,0,0,.22)] sm:text-[62px] lg:text-[80px] lg:leading-[0.95] lg:tracking-[-3px]"
              style={{ color: "#ffffff" }}
            >
              Find a better
              <br />
              job in the UK
            </h1>

            <p
              className="mt-6 max-w-[760px] text-[16px] font-medium leading-7 sm:text-[18px] sm:leading-8"
              style={{ color: "rgba(255,255,255,.90)" }}
            >
              Search current vacancies from verified UK employers. Find roles by
              title, location, sector and employment type.
            </p>
          </div>

          <form
            action="/jobs"
            method="GET"
            className="mx-auto grid w-full max-w-[1260px] overflow-hidden border border-[#dfe3e8] bg-white shadow-[0_12px_30px_rgba(0,0,0,.20)] sm:mt-12 lg:mt-0 lg:grid-cols-[1.18fr_1fr_.72fr_168px]"
          >
            <label className="flex min-h-[62px] items-center gap-3 border-b border-[#e2e6eb] px-5 lg:border-b-0 lg:border-r">
              <Search className="h-[18px] w-[18px] shrink-0 text-[#667085]" />
              <input
                name="q"
                placeholder="Job title, skill or keyword"
                className="w-full bg-transparent text-[14px] font-medium text-[#101828] outline-none placeholder:font-normal placeholder:text-[#98a2b3]"
              />
            </label>

            <label className="flex min-h-[62px] items-center gap-3 border-b border-[#e2e6eb] px-5 lg:border-b-0 lg:border-r">
              <MapPin className="h-[18px] w-[18px] shrink-0 text-[#667085]" />
              <input
                name="location"
                placeholder="Location e.g. London"
                className="w-full bg-transparent text-[14px] font-medium text-[#101828] outline-none placeholder:font-normal placeholder:text-[#98a2b3]"
              />
            </label>

            <label className="flex min-h-[62px] items-center border-b border-[#e2e6eb] px-5 lg:border-b-0 lg:border-r">
              <select
                name="type"
                defaultValue=""
                className="w-full bg-transparent text-[14px] font-medium text-[#344054] outline-none"
              >
                <option value="">Any job type</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
                <option value="Apprenticeship">Apprenticeship</option>
                <option value="Internship">Internship</option>
              </select>
            </label>

            <button
              type="submit"
              className="flex min-h-[62px] items-center justify-center gap-2 bg-[#d71920] px-5 text-[14px] font-bold transition hover:bg-[#b91319]"
              style={{ color: "#ffffff" }}
            >
              Search jobs
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div
            className="mx-auto grid w-full max-w-[1260px] border-x border-b border-white/15 sm:grid-cols-3"
            style={{ backgroundColor: "rgba(4,24,45,.94)" }}
          >
            <TrustItem
              icon={BriefcaseBusiness}
              title={`${liveJobsCount} live ${liveJobsCount === 1 ? "job" : "jobs"}`}
              text="Currently published"
            />
            <TrustItem
              icon={ShieldCheck}
              title="Employer checks"
              text="Before posting access"
            />
            <TrustItem
              icon={MapPin}
              title="United Kingdom"
              text="Search roles nationwide"
            />
          </div>

          <div className="h-[24px] sm:h-[60px] lg:h-[28px]" />
        </div>
      </section>

      {/* SECTORS */}
      <section className="border-b border-[#e5e8ec] bg-white">
        <div className="mx-auto max-w-[1360px] px-6 pb-[50px] pt-[42px] md:px-10 md:pt-[46px] xl:px-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d71920]">
                Browse vacancies
              </p>
              <h2 className="mt-2 font-serif text-[34px] font-semibold tracking-[-.8px] text-[#0b1f3a] md:text-[39px]">
                Browse jobs by sector
              </h2>
              <p className="mt-1.5 text-[14px] text-[#667085]">
                Explore current vacancies by industry and find the right role.
              </p>
            </div>

            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-[13px] font-bold text-[#0b1f3a] transition hover:text-[#d71920]"
            >
              View all sectors <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {sectorData.map(({ name, icon, count }) => (
              <Link
                key={name}
                href={`/jobs?category=${encodeURIComponent(name)}`}
                className="group flex min-h-[76px] items-center gap-3.5 rounded-[4px] border border-[#e2e6ea] bg-white px-[18px] py-3.5 transition duration-200 hover:-translate-y-[1px] hover:border-[#c8d0d9] hover:shadow-[0_7px_18px_rgba(16,24,40,.055)]"
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] border border-[#e3e8ee] bg-white"
                  style={{ boxShadow: "0 3px 10px rgba(11,31,58,.07)" }}
                >
                  <img
                    src={icon}
                    alt=""
                    aria-hidden="true"
                    width={38}
                    height={38}
                    loading="lazy"
                    className="h-[38px] w-[38px] object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-[14px] font-bold text-[#101828]">{name}</h3>
                  <p className="mt-0.5 text-[12px] text-[#667085]">
                    {count} {count === 1 ? "job" : "jobs"}
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 shrink-0 text-[#98a2b3] transition group-hover:translate-x-0.5 group-hover:text-[#d71920]" />
              </Link>
            ))}
          </div>

          <p className="mt-4 text-right text-[10px] leading-4 text-[#7b8794]">
            Sector icons designed by Creatype, Mehwish, apien, agus raharjo, ADI_ICONS, Paul J., Icon.verse and khld939 from{" "}
            <a
              href="https://www.flaticon.com/"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              Flaticon
            </a>
          </p>
        </div>
      </section>

      {/* JOB TYPES */}
      <section className="border-b border-[#e2e7ec] bg-[#f7f8fa]">
        <div className="mx-auto max-w-[1360px] px-6 py-8 md:px-10 xl:px-12">
          <div className="grid gap-4 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#d71920]">
                Working pattern
              </p>
              <h2 className="mt-1.5 text-[20px] font-bold tracking-[-.4px] text-[#07182d]">
                Browse by job type
              </h2>
            </div>

            <div className="grid gap-px border border-[#dfe4ea] bg-[#dfe4ea] sm:grid-cols-2 xl:grid-cols-3">
              {jobTypeData.map(({ name, count }) => (
                <Link
                  key={name}
                  href={`/jobs?type=${encodeURIComponent(name)}`}
                  className="group flex min-h-[64px] items-center justify-between gap-4 bg-white px-5 transition hover:bg-[#fbfbfa]"
                >
                  <div>
                    <p className="text-[13px] font-bold text-[#101828] group-hover:text-[#d71920]">{name}</p>
                    <p className="mt-0.5 text-[11px] text-[#98a2b3]">{count} {count === 1 ? "vacancy" : "vacancies"}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#98a2b3] transition group-hover:translate-x-0.5 group-hover:text-[#d71920]" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LATEST JOBS */}
      <section className="bg-[#f7f8fa]">
        <div className="mx-auto max-w-[1440px] px-6 py-[60px] md:px-10 xl:px-12">
          <div className="grid gap-9 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <div className="mb-6 flex items-end justify-between gap-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d71920]">
                    Recently added
                  </p>
                  <h2 className="mt-2 font-serif text-[34px] font-semibold tracking-[-.8px] text-[#0b1f3a] md:text-[39px]">
                    Latest jobs
                  </h2>
                  <p className="mt-1.5 text-[14px] text-[#667085]">
                    New vacancies from employers using UKJobAlert.
                  </p>
                </div>

                <Link
                  href="/jobs"
                  className="hidden items-center gap-2 text-[13px] font-bold text-[#0b1f3a] transition hover:text-[#d71920] sm:flex"
                >
                  View all jobs <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {jobs.length === 0 ? (
                <div className="border border-[#dfe4ea] bg-white px-8 py-12 text-center">
                  <BriefcaseBusiness className="mx-auto h-7 w-7 text-[#98a2b3]" />
                  <h3 className="mt-4 text-[18px] font-bold text-[#101828]">
                    No jobs available
                  </h3>
                  <p className="mt-2 text-[14px] text-[#667085]">
                    New vacancies will appear here when they are published.
                  </p>
                </div>
              ) : (
                <div className="border border-[#dfe4ea] bg-white">
                  {jobs.map((job, index) => (
                    <Link
                      href={`/jobs/${job.slug}`}
                      key={job.id}
                      className={`group block px-5 py-[18px] transition hover:bg-[#fbfcfd] md:px-6 ${
                        index !== jobs.length - 1
                          ? "border-b border-[#e6e9ed]"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#dfe4ea] bg-[#f7f8fa] text-[11px] font-bold text-[#344054]">
                          {initials(job.company_name)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="truncate text-[16px] font-bold text-[#101828] transition group-hover:text-[#b91319]">
                                  {job.title}
                                </h3>
                                <ShieldCheck className="h-4 w-4 shrink-0 text-[#d71920]" />
                              </div>
                              <p className="mt-1 text-[13px] font-semibold text-[#475467]">
                                {job.company_name}
                              </p>
                            </div>

                            <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-[#98a2b3] transition group-hover:translate-x-0.5 group-hover:text-[#d71920]" />
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#667085]">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" />
                              {job.location}
                            </span>
                            <span className="font-semibold text-[#344054]">
                              {job.salary || "Salary not specified"}
                            </span>
                            <span>{job.job_type}</span>
                            <span className="flex items-center gap-1.5 text-[#98a2b3]">
                              <Clock3 className="h-3.5 w-3.5" />
                              {timeAgo(job.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* EMPLOYER PANEL */}
            <aside className="lg:pt-[82px]">
              <div className="border border-[#dfe4ea] bg-white">
                <div className="border-b border-[#e4e7ec] p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d71920]">
                    For employers
                  </p>
                  <h2 className="mt-3 font-serif text-[29px] font-semibold leading-[1.05] text-[#0b1f3a]">
                    Hiring in the UK?
                  </h2>
                  <p className="mt-4 text-[14px] leading-6 text-[#667085]">
                    Complete the company check, then create and manage vacancies
                    from your employer account.
                  </p>

                  <Link
                    href={accountType === "employer" ? "/post-job" : "/signup"}
                    className="mt-5 inline-flex min-h-[44px] items-center gap-2 bg-[#d71920] px-5 text-[13px] font-bold transition hover:bg-[#b91319]"
                    style={{ color: "#ffffff" }}
                  >
                    Post a job <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="divide-y divide-[#e4e7ec]">
                  <EmployerPoint text="Company information checked before posting access" />
                  <EmployerPoint text="Create and manage vacancies" />
                  <EmployerPoint text="Email or website applications" />
                </div>
              </div>

              <div className="mt-4 bg-[#07182d] p-6">
                <ShieldCheck className="h-6 w-6 text-[#f3b4bc]" />
                <h3
                  className="mt-4 text-[18px] font-bold"
                  style={{ color: "#ffffff" }}
                >
                  Employer verification
                </h3>
                <p
                  className="mt-2.5 text-[13px] leading-6"
                  style={{ color: "rgba(255,255,255,.68)" }}
                >
                  UKJobAlert checks specified company information before
                  employer posting access is enabled.
                </p>
                <Link
                  href="/how-it-works"
                  className="mt-4 inline-flex items-center gap-2 text-[13px] font-bold transition hover:opacity-80"
                  style={{ color: "#ffffff" }}
                >
                  How it works <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* JOB SEEKER TOOLS */}
      <section className="border-t border-[#e2e7ec] bg-[#07182d]">
        <div className="mx-auto max-w-[1360px] px-6 py-14 md:px-10 lg:py-16 xl:px-12">
          <div className="grid gap-10 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start lg:gap-16">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#f3b4bc]">
                Job seeker tools
              </p>
              <h2 className="mt-3 font-serif text-[34px] font-semibold leading-[1.05] tracking-[-.8px] text-white md:text-[39px]">
                Keep your search organised.
              </h2>
              <p className="mt-4 text-[14px] leading-7 text-white/60">
                A job seeker account gives you practical tools for returning to roles, following searches and keeping track of applications.
              </p>
            </div>

            <div className="grid gap-px bg-white/10 md:grid-cols-3">
              <SeekerTool
                icon={Bookmark}
                title="Saved jobs"
                text="Keep current vacancies in one place and return to them later."
                href={loggedIn && accountType !== "employer" ? "/account" : seekerBaseHref}
              />
              <SeekerTool
                icon={BellRing}
                title="Job alerts"
                text="Save the search criteria you want to follow from your account."
                href={loggedIn && accountType !== "employer" ? "/account/alerts" : seekerBaseHref}
              />
              <SeekerTool
                icon={ClipboardList}
                title="Applications"
                text="Record and review the vacancies you have applied for."
                href={loggedIn && accountType !== "employer" ? "/account/applications" : seekerBaseHref}
              />
            </div>
          </div>
        </div>
      </section>

      {/* COMPANY CHECK */}
      <section className="border-t border-[#e2e7ec] bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-[62px] md:px-10 xl:px-12">
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d71920]">
                Employer accounts
              </p>
              <h2 className="mt-3 max-w-[500px] font-serif text-[34px] font-semibold leading-[1.05] tracking-[-.8px] text-[#0b1f3a] md:text-[39px]">
                Company checks before posting
              </h2>
              <p className="mt-4 max-w-[470px] text-[14px] leading-7 text-[#667085]">
                Employer accounts complete a company information check before
                job posting access is enabled.
              </p>
            </div>

            <div className="grid border-l border-t border-[#dfe4ea] sm:grid-cols-3">
              <ProcessItem
                number="01"
                icon={Building2}
                title="Company details"
                text="Submit the registered company information for the employer account."
              />
              <ProcessItem
                number="02"
                icon={ShieldCheck}
                title="Account check"
                text="Company information is checked before posting access is enabled."
              />
              <ProcessItem
                number="03"
                icon={BriefcaseBusiness}
                title="Publish jobs"
                text="Approved employer accounts can publish and manage vacancies."
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function TrustItem({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof BriefcaseBusiness;
  title: string;
  text: string;
}) {
  return (
    <div className="flex min-h-[70px] items-center gap-3.5 border-b border-white/10 px-5 py-3.5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <Icon
        className="h-[21px] w-[21px] shrink-0"
        strokeWidth={1.8}
        style={{ color: "#f0c36a" }}
      />
      <div>
        <p className="text-[14px] font-bold" style={{ color: "#ffffff" }}>
          {title}
        </p>
        <p
          className="mt-0.5 text-[11px]"
          style={{ color: "rgba(255,255,255,.58)" }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

function SeekerTool({
  icon: Icon,
  title,
  text,
  href,
}: {
  icon: typeof Bookmark;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group min-h-[190px] bg-[#0a213b] p-6 transition hover:bg-[#0d2948]"
    >
      <Icon className="h-5 w-5 text-[#f3b4bc]" />
      <h3 className="mt-7 text-[17px] font-bold text-white">{title}</h3>
      <p className="mt-2.5 text-[13px] leading-6 text-white/58">{text}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-[12px] font-bold text-white">
        Open tool <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function EmployerPoint({ text }: { text: string }) {
  return (
    <div className="flex min-h-[52px] items-center gap-3 px-6 text-[13px] font-medium text-[#475467]">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#d71920]" />
      <span>{text}</span>
    </div>
  );
}

function ProcessItem({
  number,
  icon: Icon,
  title,
  text,
}: {
  number: string;
  icon: typeof Building2;
  title: string;
  text: string;
}) {
  return (
    <div className="min-h-[205px] border-b border-r border-[#dfe4ea] bg-white p-6">
      <div className="flex items-center justify-between">
        <span className="font-serif text-[21px] font-semibold text-[#b9c0c9]">
          {number}
        </span>
        <Icon className="h-5 w-5 text-[#0b1f3a]" strokeWidth={1.8} />
      </div>

      <h3 className="mt-8 text-[16px] font-bold text-[#101828]">{title}</h3>
      <p className="mt-2.5 text-[13px] leading-6 text-[#667085]">{text}</p>
    </div>
  );
}
