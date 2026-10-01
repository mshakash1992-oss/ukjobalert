import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  HardHat,
  Stethoscope,
  UtensilsCrossed,
  CarFront,
  Boxes,
  MapPin,
  Search,
  ShieldCheck,
  ShoppingBag,
  SprayCan,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import MainHeader from "@/components/main-header";

export const metadata: Metadata = {
  title: "UK Jobs & Verified Employer Vacancies",

  description:
    "Search current UK jobs and vacancies from verified employers. Browse opportunities by job title, location, sector and employment type on UKJobAlert.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "/",
    siteName: "UKJobAlert",
    title:
      "UK Jobs & Verified Employer Vacancies | UKJobAlert",
    description:
      "Search current UK jobs and vacancies from verified employers across the United Kingdom.",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "UK Jobs & Verified Employer Vacancies | UKJobAlert",
    description:
      "Search current UK jobs and vacancies from verified employers across the United Kingdom.",
  },

  robots: {
    index: true,
    follow: true,
  },
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
  {
    name: "Healthcare",
    icon: Stethoscope,
    image: "https://images.pexels.com/photos/6010859/pexels-photo-6010859.jpeg?auto=compress&cs=tinysrgb&w=900",
    imagePosition: "50% 48%",
    accent: "#2563eb",
    soft: "#eff6ff",
  },
  {
    name: "Hospitality",
    icon: UtensilsCrossed,
    image: "https://images.pexels.com/photos/36430081/pexels-photo-36430081.jpeg?auto=compress&cs=tinysrgb&w=900",
    imagePosition: "50% 48%",
    accent: "#ff5a1f",
    soft: "#fff1eb",
  },
  {
    name: "Construction",
    icon: HardHat,
    image: "https://images.pexels.com/photos/32467381/pexels-photo-32467381/free-photo-of-construction-worker-at-building-site-in-safety-gear.jpeg?auto=compress&cs=tinysrgb&w=900",
    imagePosition: "50% 48%",
    accent: "#f5b400",
    soft: "#fff8df",
  },
  {
    name: "Driving",
    icon: CarFront,
    image: "https://images.pexels.com/photos/6407433/pexels-photo-6407433.jpeg?auto=compress&cs=tinysrgb&w=900",
    imagePosition: "50% 48%",
    accent: "#7c3aed",
    soft: "#f3e8ff",
  },
  {
    name: "Cleaning",
    icon: SprayCan,
    image: "https://images.pexels.com/photos/7513057/pexels-photo-7513057.jpeg?auto=compress&cs=tinysrgb&w=900",
    imagePosition: "50% 48%",
    accent: "#10b981",
    soft: "#e9fbf4",
  },
  {
    name: "Warehouse",
    icon: Boxes,
    image: "https://images.pexels.com/photos/36552175/pexels-photo-36552175/free-photo-of-warehouse-worker-handling-box-on-storage-aisle.jpeg?auto=compress&cs=tinysrgb&w=900",
    imagePosition: "50% 50%",
    accent: "#f43f5e",
    soft: "#fff0f3",
  },
  {
    name: "Office",
    icon: BriefcaseBusiness,
    image: "https://images.pexels.com/photos/12902945/pexels-photo-12902945.jpeg?auto=compress&cs=tinysrgb&w=900",
    imagePosition: "50% 48%",
    accent: "#2f66ed",
    soft: "#edf4ff",
  },
  {
    name: "Retail",
    icon: ShoppingBag,
    image: "https://images.pexels.com/photos/14458537/pexels-photo-14458537.jpeg?auto=compress&cs=tinysrgb&w=900",
    imagePosition: "50% 42%",
    accent: "#ec168c",
    soft: "#fff0f8",
  },
];

function timeAgo(date: string) {
  const difference =
    Date.now() - new Date(date).getTime();

  const minutes =
    Math.floor(difference / 60000);

  if (minutes < 1) return "Just now";

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours =
    Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days =
    Math.floor(hours / 24);

  if (days === 1) {
    return "1 day ago";
  }

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
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const loggedIn =
    Boolean(user);

  const accountType =
    user?.user_metadata?.account_type;

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Account";

  const now =
    new Date().toISOString();

  const {
    data: jobsData,
    error: jobsError,
  } = await supabase
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
    .order("created_at", {
      ascending: false,
    })
    .limit(6);

  if (jobsError) {
    console.error(jobsError);
  }

  const jobs =
    (jobsData || []) as Job[];

  const admin =
    createAdminClient();

  const [
    liveJobsResult,
    ...sectorResults
  ] = await Promise.all([
    admin
      .from("jobs")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("status", "published")
      .gt("expires_at", now),

    ...sectors.map((sector) =>
      admin
        .from("jobs")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("status", "published")
        .eq(
          "category",
          sector.name
        )
        .gt("expires_at", now)
    ),
  ]);

  const liveJobsCount =
    liveJobsResult.count || 0;

  const sectorData =
    sectors.map(
      (sector, index) => ({
        ...sector,
        count:
          sectorResults[index]
            ?.count || 0,
      })
    );

  return (
    <main className="min-h-screen bg-white text-[#101828]">
      <MainHeader
        loggedIn={loggedIn}
        displayName={displayName}
        accountType={accountType}
      />

      {/* HERO */}

      <section className="relative overflow-hidden bg-[#07182d]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/london-hero.jpg')",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(5,21,40,0.96) 0%, rgba(5,21,40,0.82) 38%, rgba(5,21,40,0.45) 67%, rgba(5,21,40,0.10) 100%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(5,21,40,0.56) 0%, rgba(5,21,40,0.06) 52%, rgba(5,21,40,0.10) 100%)",
          }}
        />

        <div className="relative mx-auto max-w-[1440px] px-6 py-[102px] md:px-10 md:py-[124px] xl:px-12">
          <div className="max-w-[820px]">
            <div
              className="mb-6 flex items-center gap-3 text-[14px] font-semibold"
              style={{
                color:
                  "rgba(255,255,255,0.82)",
              }}
            >
              <span className="h-[2px] w-8 bg-[#e11d48]" />
              Jobs across the United Kingdom
            </div>

            <h1
              className="max-w-[800px] text-[52px] font-bold leading-[0.98] tracking-[-2.8px] sm:text-[64px] lg:text-[78px]"
              style={{
                color: "#ffffff",
              }}
            >
              Find your next
              <br />
              opportunity.
            </h1>

            <p
              className="mt-7 max-w-[650px] text-[18px] leading-8 lg:text-[20px]"
              style={{
                color:
                  "rgba(255,255,255,0.78)",
              }}
            >
              Search current vacancies by job
              title, location and employment
              type.
            </p>
          </div>

          <form
            action="/jobs"
            method="GET"
            className="mt-11 grid max-w-[1250px] overflow-hidden rounded-[14px] bg-white shadow-[0_28px_70px_rgba(0,0,0,.28)] lg:grid-cols-[1.25fr_1fr_.75fr_210px]"
          >
            <label className="flex min-h-[82px] items-center gap-4 border-b border-[#e4e7ec] px-6 lg:border-b-0 lg:border-r">
              <Search className="h-[22px] w-[22px] shrink-0 text-[#667085]" />

              <div className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-[0.07em] text-[#667085]">
                  Job
                </span>

                <input
                  name="q"
                  placeholder="Job title or keyword"
                  className="mt-1 w-full bg-transparent text-[16px] font-medium text-[#101828] outline-none placeholder:font-normal placeholder:text-[#98a2b3]"
                />
              </div>
            </label>

            <label className="flex min-h-[82px] items-center gap-4 border-b border-[#e4e7ec] px-6 lg:border-b-0 lg:border-r">
              <MapPin className="h-[22px] w-[22px] shrink-0 text-[#667085]" />

              <div className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold uppercase tracking-[0.07em] text-[#667085]">
                  Location
                </span>

                <input
                  name="location"
                  placeholder="City or postcode"
                  className="mt-1 w-full bg-transparent text-[16px] font-medium text-[#101828] outline-none placeholder:font-normal placeholder:text-[#98a2b3]"
                />
              </div>
            </label>

            <label className="flex min-h-[82px] items-center border-b border-[#e4e7ec] px-6 lg:border-b-0 lg:border-r">
              <div className="w-full">
                <span className="block text-[11px] font-bold uppercase tracking-[0.07em] text-[#667085]">
                  Type
                </span>

                <select
                  name="type"
                  defaultValue=""
                  className="mt-1 w-full bg-transparent text-[16px] font-medium text-[#344054] outline-none"
                >
                  <option value="">
                    Any type
                  </option>

                  <option value="Full Time">
                    Full Time
                  </option>

                  <option value="Part Time">
                    Part Time
                  </option>

                  <option value="Contract">
                    Contract
                  </option>

                  <option value="Temporary">
                    Temporary
                  </option>

                  <option value="Apprenticeship">
                    Apprenticeship
                  </option>

                  <option value="Internship">
                    Internship
                  </option>
                </select>
              </div>
            </label>

            <button
              type="submit"
              className="flex min-h-[82px] items-center justify-center gap-3 bg-[#e11d48] px-8 text-[15px] font-semibold transition hover:bg-[#be123c]"
              style={{
                color: "#ffffff",
              }}
            >
              Search jobs
              <ArrowRight className="h-[18px] w-[18px]" />
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px]">
            <span
              style={{
                color:
                  "rgba(255,255,255,0.52)",
              }}
            >
              Popular
            </span>

            {[
              "Care Assistant",
              "Driver",
              "Warehouse",
              "Cleaner",
              "Part Time",
            ].map((item) => (
              <Link
                key={item}
                href={`/jobs?q=${encodeURIComponent(
                  item
                )}`}
                className="font-medium transition hover:opacity-100"
                style={{
                  color:
                    "rgba(255,255,255,0.88)",
                }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTORS */}

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fbfdff_0%,#f6f9ff_48%,#eef5ff_100%)]">
        <div className="pointer-events-none absolute -right-[150px] -top-[240px] h-[560px] w-[560px] rounded-full bg-[#e7f0ff]/70 blur-[1px]" />
        <div className="pointer-events-none absolute -bottom-[300px] -left-[210px] h-[540px] w-[540px] rounded-full bg-[#e8f1ff]/75" />
        <div className="pointer-events-none absolute right-[5%] top-[42px] hidden grid-cols-5 gap-[8px] opacity-30 xl:grid">
          {Array.from({ length: 20 }).map((_, index) => (
            <span
              key={index}
              className="h-[4px] w-[4px] rounded-full bg-[#7fa8f7]"
            />
          ))}
        </div>

        <div className="relative mx-auto max-w-[1440px] px-6 py-[74px] md:px-10 md:py-[84px] xl:px-12">
          <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-[3px] w-9 rounded-full bg-[#2f66ed]" />
                <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#175cd3]">
                  Job categories
                </p>
              </div>

              <h2 className="mt-4 text-[38px] font-bold leading-none tracking-[-1.7px] text-[#101828] sm:text-[44px] lg:text-[50px]">
                Browse by <span className="text-[#2f66ed]">sector</span>
              </h2>

              <p className="mt-4 max-w-[620px] text-[15px] leading-7 text-[#667085] sm:text-[16px]">
                Explore current vacancies by industry and find the right opportunity for you.
              </p>
            </div>

            <Link
              href="/jobs"
              className="group inline-flex min-h-[50px] w-fit items-center justify-center gap-3 rounded-[13px] bg-[#2f66ed] px-6 text-[14px] font-semibold text-white shadow-[0_10px_26px_rgba(47,102,237,.18)] transition-[transform,background-color,box-shadow] duration-300 ease-out hover:-translate-y-[2px] hover:bg-[#2458d8] hover:shadow-[0_16px_34px_rgba(47,102,237,.24)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2f66ed]/20 motion-reduce:transform-none motion-reduce:transition-none"
              style={{ color: "#ffffff" }}
            >
              <span className="grid grid-cols-3 gap-[2px]" aria-hidden="true">
                {Array.from({ length: 9 }).map((_, index) => (
                  <span key={index} className="h-[3px] w-[3px] rounded-[1px] bg-white" />
                ))}
              </span>
              View all jobs
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transform-none" />
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8">
            {sectorData.map(
              ({
                name,
                icon: Icon,
                image,
                imagePosition,
                accent,
                soft,
                count,
              }) => (
                <Link
                  key={name}
                  href={`/jobs?category=${encodeURIComponent(name)}`}
                  className="group relative isolate flex min-h-[332px] flex-col overflow-hidden rounded-[20px] border border-[#e7edf5] bg-white shadow-[0_8px_24px_rgba(16,24,40,.055)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-[5px] hover:border-white hover:shadow-[0_20px_45px_rgba(16,24,40,.11)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2f66ed]/15 motion-reduce:transform-none motion-reduce:transition-none"
                  style={{ borderBottomColor: accent, borderBottomWidth: 3 }}
                >
                  <div className="relative h-[184px] bg-white p-[6px] pb-0">
                    <div className="relative h-full overflow-hidden rounded-[15px] rounded-b-none bg-[#eef3f8]">
                      <img
                        src={image}
                        alt={`${name} jobs`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(.2,.75,.25,1)] group-hover:scale-[1.018] motion-reduce:transform-none motion-reduce:transition-none"
                        style={{ objectPosition: imagePosition || "50% 50%" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07182d]/[0.08] via-transparent to-white/[0.02] transition-opacity duration-300 group-hover:opacity-60" />
                    </div>
                  </div>

                  <div
                    className="absolute left-5 top-[161px] z-10 flex h-[44px] w-[44px] items-center justify-center rounded-[13px] border-[3px] border-white shadow-[0_7px_18px_rgba(16,24,40,.13)] transition-[transform,box-shadow] duration-300 ease-out group-hover:-translate-y-[2px] group-hover:shadow-[0_10px_22px_rgba(16,24,40,.16)] motion-reduce:transform-none motion-reduce:transition-none"
                    style={{ backgroundColor: accent }}
                  >
                    <Icon className="h-[18px] w-[18px] text-white" strokeWidth={2.1} />
                  </div>

                  <div className="flex flex-1 flex-col px-5 pb-[18px] pt-8">
                    <h3 className="text-[16px] font-bold tracking-[-0.3px] text-[#101828] transition-colors duration-300 group-hover:text-[#175cd3]">
                      {name}
                    </h3>

                    <div className="mt-auto flex items-center justify-between pt-5">
                      <div className="flex items-center gap-2 text-[12px] font-medium text-[#667085]">
                        <BriefcaseBusiness className="h-[14px] w-[14px]" />
                        <span>
                          {count} {count === 1 ? "job" : "jobs"}
                        </span>
                      </div>

                      <span
                        className="flex h-[34px] w-[34px] items-center justify-center rounded-full transition-[transform,background-color] duration-300 ease-out group-hover:translate-x-[3px] motion-reduce:transform-none motion-reduce:transition-none"
                        style={{ backgroundColor: soft, color: accent }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>

                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-[0.72] opacity-80 transition-[transform,opacity] duration-300 ease-out group-hover:scale-x-100 group-hover:opacity-100 motion-reduce:transform-none motion-reduce:transition-none"
                    style={{ backgroundColor: accent }}
                  />
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* LATEST JOBS */}

      <section className="border-t border-[#eaecf0] bg-[#f7f8fa]">
        <div className="mx-auto max-w-[1440px] px-6 py-[76px] md:px-10 xl:px-12">
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_390px]">
            <div>
              <div className="mb-8 flex items-end justify-between gap-6">
                <div>
                  <p className="text-[13px] font-semibold text-[#175cd3]">
                    Recently added
                  </p>

                  <h2 className="mt-2 text-[38px] font-bold tracking-[-1.5px] text-[#101828]">
                    Latest jobs
                  </h2>

                  <p className="mt-3 text-[15px] text-[#667085]">
                    Recently published
                    vacancies.
                  </p>
                </div>

                <Link
                  href="/jobs"
                  className="hidden items-center gap-2 text-[14px] font-semibold text-[#101828] transition hover:text-[#175cd3] sm:flex"
                >
                  Browse all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {jobs.length === 0 ? (
                <div className="rounded-[16px] border border-[#e4e7ec] bg-white px-8 py-16 text-center">
                  <BriefcaseBusiness className="mx-auto h-8 w-8 text-[#98a2b3]" />

                  <h3 className="mt-5 text-[19px] font-semibold text-[#101828]">
                    No jobs available
                  </h3>

                  <p className="mt-2 text-[14px] text-[#667085]">
                    New vacancies will appear
                    here when they are
                    published.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <Link
                      href={`/jobs/${job.slug}`}
                      key={job.id}
                      className="group block rounded-[16px] border border-[#e1e5eb] bg-white p-6 transition duration-200 hover:-translate-y-[1px] hover:border-[#cbd2dc] hover:shadow-[0_14px_35px_rgba(16,24,40,.07)] md:p-7"
                    >
                      <div className="flex items-start gap-5">
                        <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-[12px] border border-[#e4e7ec] bg-[#f8fafc] text-[14px] font-bold text-[#344054]">
                          {initials(
                            job.company_name
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-5">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="truncate text-[20px] font-semibold tracking-[-0.4px] text-[#101828] transition group-hover:text-[#175cd3]">
                                  {job.title}
                                </h3>

                                <ShieldCheck className="h-[17px] w-[17px] shrink-0 text-[#175cd3]" />
                              </div>

                              <p className="mt-1.5 text-[14px] font-semibold text-[#475467]">
                                {
                                  job.company_name
                                }
                              </p>
                            </div>

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f8fafc] text-[#98a2b3] transition group-hover:bg-[#eef4ff] group-hover:text-[#175cd3]">
                              <ChevronRight className="h-5 w-5" />
                            </div>
                          </div>

                          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                            <span className="flex items-center gap-1.5 text-[13px] text-[#667085]">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>

                            <span className="text-[13px] font-semibold text-[#344054]">
                              {job.salary ||
                                "Salary not specified"}
                            </span>

                            <span className="job-tag">
                              {job.job_type}
                            </span>

                            <span className="flex items-center gap-1.5 text-[13px] text-[#98a2b3]">
                              <Clock3 className="h-4 w-4" />
                              {timeAgo(
                                job.created_at
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-6 sm:hidden">
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#175cd3]"
                >
                  Browse all jobs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* EMPLOYER SIDE */}

            <aside>
              <div
                className="overflow-hidden rounded-[16px] shadow-[0_24px_55px_rgba(7,24,45,.14)]"
                style={{
                  backgroundColor:
                    "#07182d",
                }}
              >
                <div className="p-8">
                  <div
                    className="flex h-[48px] w-[48px] items-center justify-center rounded-[11px]"
                    style={{
                      backgroundColor:
                        "rgba(255,255,255,0.10)",
                    }}
                  >
                    <BriefcaseBusiness
                      className="h-6 w-6"
                      style={{
                        color:
                          "#ffffff",
                      }}
                    />
                  </div>

                  <p
                    className="mt-8 text-[12px] font-bold uppercase tracking-[0.09em]"
                    style={{
                      color:
                        "rgba(255,255,255,0.55)",
                    }}
                  >
                    Employers
                  </p>

                  <h2
                    className="mt-3 text-[34px] font-semibold leading-[1.08] tracking-[-1.2px]"
                    style={{
                      color:
                        "#ffffff",
                    }}
                  >
                    Post your next vacancy.
                  </h2>

                  <p
                    className="mt-5 text-[15px] leading-7"
                    style={{
                      color:
                        "rgba(255,255,255,0.66)",
                    }}
                  >
                    Complete the employer
                    company check, then create
                    and manage your job
                    listings.
                  </p>

                  <Link
                    href={
                      accountType ===
                      "employer"
                        ? "/post-job"
                        : "/signup"
                    }
                    className="mt-8 flex min-h-[52px] items-center justify-center gap-2 rounded-[8px] bg-white px-5 text-[14px] font-semibold transition hover:bg-[#f2f4f7]"
                    style={{
                      color:
                        "#07182d",
                    }}
                  >
                    Post a job
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div
                  className="border-t px-8 py-6"
                  style={{
                    borderColor:
                      "rgba(255,255,255,0.10)",
                    backgroundColor:
                      "rgba(255,255,255,0.035)",
                  }}
                >
                  <div className="flex gap-3">
                    <ShieldCheck
                      className="mt-0.5 h-5 w-5 shrink-0"
                      style={{
                        color:
                          "rgba(255,255,255,0.62)",
                      }}
                    />

                    <p
                      className="text-[13px] leading-6"
                      style={{
                        color:
                          "rgba(255,255,255,0.60)",
                      }}
                    >
                      Company information is
                      checked before posting
                      access is enabled.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-[14px] border border-[#e1e5eb] bg-white">
                <EmployerPoint text="Create and manage vacancies" />
                <EmployerPoint text="Email or website applications" />
                <EmployerPoint text="Update or close listings" />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* COMPANY CHECK */}

      <section
        id="about"
        className="bg-white"
      >
        <div className="mx-auto max-w-[1440px] px-6 py-[84px] md:px-10 xl:px-12">
          <div className="grid gap-14 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-[13px] font-semibold text-[#175cd3]">
                Employer accounts
              </p>

              <h2 className="mt-4 max-w-[540px] text-[40px] font-bold leading-[1.08] tracking-[-1.7px] text-[#101828] md:text-[46px]">
                Company checks before posting.
              </h2>

              <p className="mt-6 max-w-[500px] text-[15px] leading-7 text-[#667085]">
                Employer accounts complete a
                company information check
                before job posting access is
                enabled.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
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
                icon={
                  BriefcaseBusiness
                }
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

function EmployerPoint({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex min-h-[52px] items-center gap-3 border-b border-[#eaecf0] px-5 text-[13px] font-medium text-[#475467] last:border-b-0">
      <CheckCircle2 className="h-[17px] w-[17px] shrink-0 text-[#175cd3]" />
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
    <div className="rounded-[14px] border border-[#e4e7ec] bg-white p-6">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold text-[#98a2b3]">
          {number}
        </span>

        <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#f2f4f7] text-[#475467]">
          <Icon className="h-[17px] w-[17px]" />
        </div>
      </div>

      <h3 className="mt-7 text-[18px] font-semibold tracking-[-0.3px] text-[#101828]">
        {title}
      </h3>

      <p className="mt-3 text-[14px] leading-6 text-[#667085]">
        {text}
      </p>
    </div>
  );
}