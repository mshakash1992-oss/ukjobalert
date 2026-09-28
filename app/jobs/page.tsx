import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import MainHeader from "@/components/main-header";

export const metadata: Metadata = {
  title: "UK Jobs & Current Vacancies",

  description:
    "Search current UK jobs and vacancies from verified employers. Find opportunities by job title, location, sector and employment type on UKJobAlert.",

  alternates: {
    canonical: "/jobs",
  },

  openGraph: {
    type: "website",
    url: "/jobs",
    siteName: "UKJobAlert",
    title: "UK Jobs & Current Vacancies | UKJobAlert",
    description:
      "Search current UK jobs and vacancies from verified employers across the UK.",
  },

  twitter: {
    card: "summary_large_image",
    title: "UK Jobs & Current Vacancies | UKJobAlert",
    description:
      "Search current UK jobs and vacancies from verified employers across the UK.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

const categories = [
  "Healthcare",
  "Construction",
  "Hospitality",
  "Driving",
  "Warehouse",
  "Retail",
  "IT & Tech",
  "Education",
  "Cleaning",
  "Office",
  "Other",
];

const jobTypes = [
  "Full Time",
  "Part Time",
  "Temporary",
  "Contract",
  "Apprenticeship",
  "Internship",
];

type Job = {
  id: string;
  slug: string;
  company_name: string;
  title: string;
  category: string;
  job_type: string;
  location: string;
  salary: string | null;
  created_at: string;
  expires_at: string;
};

type PageProps = {
  searchParams?: Promise<{
    q?: string;
    location?: string;
    category?: string;
    type?: string;
  }>;
};

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

export default async function JobsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const q =
    (params?.q || "").trim();

  const location =
    (params?.location || "").trim();

  const category =
    (params?.category || "").trim();

  const type =
    (params?.type || "").trim();

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
    "My Account";

  const adminEmails =
    (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((email) =>
        email.trim().toLowerCase()
      )
      .filter(Boolean);

  const isAdmin =
    Boolean(
      user?.email &&
        adminEmails.includes(
          user.email.toLowerCase()
        )
    );

  let query =
    supabase
      .from("jobs")
      .select(`
        id,
        slug,
        company_name,
        title,
        category,
        job_type,
        location,
        salary,
        created_at,
        expires_at
      `)
      .eq("status", "published")
      .gt(
        "expires_at",
        new Date().toISOString()
      )
      .order("created_at", {
        ascending: false,
      });

  if (q) {
    query =
      query.ilike(
        "title",
        `%${q}%`
      );
  }

  if (location) {
    query =
      query.ilike(
        "location",
        `%${location}%`
      );
  }

  if (
    category &&
    categories.includes(category)
  ) {
    query =
      query.eq(
        "category",
        category
      );
  }

  if (
    type &&
    jobTypes.includes(type)
  ) {
    query =
      query.eq(
        "job_type",
        type
      );
  }

  const {
    data,
    error,
  } = await query;

  if (error) {
    console.error(error);
  }

  const jobs =
    (data || []) as Job[];

  const hasFilters =
    Boolean(
      q ||
        location ||
        category ||
        type
    );

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#101828]">
      <MainHeader
        loggedIn={loggedIn}
        displayName={displayName}
        accountType={accountType}
        isAdmin={isAdmin}
      />

      {/* TOP */}

      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: "#07182d",
        }}
      >
        <div
          className="absolute -right-[160px] -top-[260px] h-[620px] w-[620px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(23,92,211,.22) 0%, rgba(23,92,211,0) 68%)",
          }}
        />

        <div className="relative mx-auto max-w-[1440px] px-6 pb-[92px] pt-[74px] md:px-10 xl:px-12">
          <div className="max-w-[720px]">
            <div
              className="flex items-center gap-3 text-[13px] font-semibold"
              style={{
                color:
                  "rgba(255,255,255,.62)",
              }}
            >
              <span className="h-[2px] w-8 bg-[#e11d48]" />
              UK vacancies
            </div>

            <h1
              className="mt-5 text-[48px] font-bold leading-[1.02] tracking-[-2px] sm:text-[58px]"
              style={{
                color: "#ffffff",
              }}
            >
              Find jobs across
              <br />
              the UK.
            </h1>

            <p
              className="mt-5 max-w-[600px] text-[17px] leading-7"
              style={{
                color:
                  "rgba(255,255,255,.68)",
              }}
            >
              Search current vacancies by
              role, location, sector and
              employment type.
            </p>
          </div>
        </div>
      </section>

      {/* SEARCH PANEL */}

      <section className="relative z-10 mx-auto -mt-[42px] max-w-[1440px] px-6 md:px-10 xl:px-12">
        <form
          method="GET"
          action="/jobs"
          className="overflow-hidden rounded-[16px] border border-[#e4e7ec] bg-white shadow-[0_18px_55px_rgba(16,24,40,.12)]"
        >
          <div className="grid lg:grid-cols-[1.15fr_1fr_.85fr_.85fr_180px]">
            <label className="flex min-h-[82px] items-center gap-4 border-b border-[#eaecf0] px-6 lg:border-b-0 lg:border-r">
              <Search className="h-[20px] w-[20px] shrink-0 text-[#667085]" />

              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#98a2b3]">
                  Keyword
                </span>

                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Job title or keyword"
                  className="mt-1 w-full bg-transparent text-[15px] font-medium text-[#101828] outline-none placeholder:font-normal placeholder:text-[#98a2b3]"
                />
              </div>
            </label>

            <label className="flex min-h-[82px] items-center gap-4 border-b border-[#eaecf0] px-6 lg:border-b-0 lg:border-r">
              <MapPin className="h-[20px] w-[20px] shrink-0 text-[#667085]" />

              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#98a2b3]">
                  Location
                </span>

                <input
                  name="location"
                  defaultValue={location}
                  placeholder="City or postcode"
                  className="mt-1 w-full bg-transparent text-[15px] font-medium text-[#101828] outline-none placeholder:font-normal placeholder:text-[#98a2b3]"
                />
              </div>
            </label>

            <label className="flex min-h-[82px] items-center border-b border-[#eaecf0] px-5 lg:border-b-0 lg:border-r">
              <div className="w-full">
                <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#98a2b3]">
                  Sector
                </span>

                <select
                  name="category"
                  defaultValue={category}
                  className="mt-1 w-full bg-transparent text-[14px] font-medium text-[#344054] outline-none"
                >
                  <option value="">
                    All sectors
                  </option>

                  {categories.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>
            </label>

            <label className="flex min-h-[82px] items-center border-b border-[#eaecf0] px-5 lg:border-b-0 lg:border-r">
              <div className="w-full">
                <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#98a2b3]">
                  Job type
                </span>

                <select
                  name="type"
                  defaultValue={type}
                  className="mt-1 w-full bg-transparent text-[14px] font-medium text-[#344054] outline-none"
                >
                  <option value="">
                    Any type
                  </option>

                  {jobTypes.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>
            </label>

            <button
              type="submit"
              className="flex min-h-[82px] items-center justify-center gap-2.5 bg-[#e11d48] px-6 text-[14px] font-semibold transition hover:bg-[#be123c]"
              style={{
                color: "#ffffff",
              }}
            >
              Search
              <ArrowRight className="h-[17px] w-[17px]" />
            </button>
          </div>
        </form>

        {hasFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[12px] font-medium text-[#667085]">
              Active filters
            </span>

            {q && (
              <FilterChip
                label={`Keyword: ${q}`}
              />
            )}

            {location && (
              <FilterChip
                label={`Location: ${location}`}
              />
            )}

            {category && (
              <FilterChip
                label={category}
              />
            )}

            {type && (
              <FilterChip
                label={type}
              />
            )}

            <Link
              href="/jobs"
              className="ml-1 inline-flex items-center gap-1.5 px-2 py-2 text-[12px] font-semibold text-[#475467] transition hover:text-[#e11d48]"
            >
              <X className="h-[14px] w-[14px]" />
              Clear all
            </Link>
          </div>
        )}
      </section>

      {/* RESULTS */}

      <section className="mx-auto max-w-[1440px] px-6 pb-[100px] pt-[64px] md:px-10 xl:px-12">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="flex items-end justify-between gap-6 border-b border-[#e4e7ec] pb-6">
              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[#175cd3]">
                  <SlidersHorizontal className="h-[15px] w-[15px]" />

                  {hasFilters
                    ? "Search results"
                    : "Current vacancies"}
                </div>

                <h2 className="mt-2 text-[30px] font-bold tracking-[-1px] text-[#101828]">
                  {hasFilters
                    ? "Jobs matching your search"
                    : "Latest jobs"}
                </h2>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-[22px] font-bold tracking-[-0.5px] text-[#101828]">
                  {jobs.length}
                </p>

                <p className="text-[12px] text-[#98a2b3]">
                  {jobs.length === 1
                    ? "vacancy"
                    : "vacancies"}
                </p>
              </div>
            </div>

            {jobs.length === 0 ? (
              <div className="mt-6 rounded-[16px] border border-[#e4e7ec] bg-white px-8 py-[80px] text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f2f4f7]">
                  <BriefcaseBusiness className="h-6 w-6 text-[#667085]" />
                </div>

                <h3 className="mt-5 text-[20px] font-semibold text-[#101828]">
                  No jobs found
                </h3>

                <p className="mx-auto mt-2 max-w-[420px] text-[14px] leading-6 text-[#667085]">
                  Try changing your keyword,
                  location or filters.
                </p>

                {hasFilters && (
                  <Link
                    href="/jobs"
                    className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-[8px] border border-[#d0d5dd] bg-white px-5 text-[13px] font-semibold text-[#344054] transition hover:bg-[#f9fafb]"
                  >
                    Clear filters
                  </Link>
                )}
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {jobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.slug}`}
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
                              {job.company_name}
                            </p>
                          </div>

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f8fafc] text-[#98a2b3] transition group-hover:bg-[#eef4ff] group-hover:text-[#175cd3]">
                            <ChevronRight className="h-5 w-5" />
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                          <span className="flex items-center gap-1.5 text-[13px] text-[#667085]">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>

                          {job.salary && (
                            <span className="text-[13px] font-semibold text-[#344054]">
                              {job.salary}
                            </span>
                          )}

                          <span className="rounded-full border border-[#dbe7fb] bg-[#f2f7ff] px-3 py-1.5 text-[11px] font-semibold text-[#175cd3]">
                            {job.job_type}
                          </span>

                          <span className="rounded-full bg-[#f2f4f7] px-3 py-1.5 text-[11px] font-semibold text-[#475467]">
                            {job.category}
                          </span>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-[#f0f2f5] pt-4">
                          <span className="flex items-center gap-1.5 text-[12px] text-[#98a2b3]">
                            <Clock3 className="h-[14px] w-[14px]" />
                            Posted{" "}
                            {timeAgo(
                              job.created_at
                            )}
                          </span>

                          <span className="hidden items-center gap-1.5 text-[12px] font-semibold text-[#175cd3] sm:flex">
                            View job
                            <ArrowRight className="h-[14px] w-[14px]" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* SIDE */}

          <aside className="space-y-4 lg:sticky lg:top-[105px]">
            <div className="rounded-[16px] border border-[#e4e7ec] bg-white p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#f2f4f7] text-[#344054]">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <h3 className="mt-6 text-[19px] font-semibold tracking-[-0.3px] text-[#101828]">
                Employer information
              </h3>

              <p className="mt-3 text-[13px] leading-6 text-[#667085]">
                Company information is
                checked before employer
                posting access is enabled.
              </p>

              <div className="mt-6 border-t border-[#eaecf0] pt-5">
                <InfoRow text="Company details" />
                <InfoRow text="Current vacancies" />
                <InfoRow text="Application details" />
              </div>
            </div>

            <div
              className="rounded-[16px] p-6"
              style={{
                backgroundColor:
                  "#07182d",
              }}
            >
              <Building2
                className="h-6 w-6"
                style={{
                  color:
                    "rgba(255,255,255,.72)",
                }}
              />

              <p
                className="mt-6 text-[12px] font-semibold uppercase tracking-[0.08em]"
                style={{
                  color:
                    "rgba(255,255,255,.48)",
                }}
              >
                Employers
              </p>

              <h3
                className="mt-2 text-[22px] font-semibold tracking-[-0.5px]"
                style={{
                  color: "#ffffff",
                }}
              >
                Hiring?
              </h3>

              <p
                className="mt-3 text-[13px] leading-6"
                style={{
                  color:
                    "rgba(255,255,255,.62)",
                }}
              >
                Create an employer account
                to publish and manage your
                vacancies.
              </p>

              <Link
                href={
                  accountType ===
                  "employer"
                    ? "/post-job"
                    : "/signup"
                }
                className="mt-6 flex min-h-[46px] items-center justify-center gap-2 rounded-[8px] bg-white px-4 text-[13px] font-semibold"
                style={{
                  color: "#07182d",
                }}
              >
                Post a job
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function FilterChip({
  label,
}: {
  label: string;
}) {
  return (
    <span className="inline-flex min-h-[34px] items-center rounded-full border border-[#e4e7ec] bg-white px-3.5 text-[12px] font-medium text-[#475467]">
      {label}
    </span>
  );
}

function InfoRow({
  text,
}: {
  text: string;
}) {
  return (
    <div className="mt-3 flex first:mt-0 items-center gap-2.5 text-[13px] font-medium text-[#475467]">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#175cd3]" />
      {text}
    </div>
  );
}