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
  company_logo_url: string | null;
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
    company?: string;
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

  const company =
    (params?.company || "").trim();

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
        company_logo_url,
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

  if (company) {
    query = query.eq(
      "company_name",
      company
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

  const { data: filterRows, error: filterError } = await supabase
    .from("jobs")
    .select("category, job_type")
    .eq("status", "published")
    .gt("expires_at", new Date().toISOString());

  if (filterError) {
    console.error("Job filter counts error:", filterError);
  }

  const categoryCounts = new Map<string, number>();
  const typeCounts = new Map<string, number>();

  for (const row of filterRows || []) {
    if (row.category) {
      categoryCounts.set(
        row.category,
        (categoryCounts.get(row.category) || 0) + 1
      );
    }

    if (row.job_type) {
      typeCounts.set(
        row.job_type,
        (typeCounts.get(row.job_type) || 0) + 1
      );
    }
  }

  function filterHref(
    key: "category" | "type",
    value: string
  ) {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (location) next.set("location", location);
    if (company) next.set("company", company);
    if (category && key !== "category") next.set("category", category);
    if (type && key !== "type") next.set("type", type);
    if (value) next.set(key, value);
    const queryString = next.toString();
    return queryString ? `/jobs?${queryString}` : "/jobs";
  }

  const hasFilters =
    Boolean(
      q ||
        location ||
        category ||
        type ||
        company
    );

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-[#101828]">
      <MainHeader
        loggedIn={loggedIn}
        displayName={displayName}
        accountType={accountType}
        isAdmin={isAdmin}
      />

      <section className="border-b border-[#dfe3e8] bg-[#fbfbfa]">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-6 py-12 md:px-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end lg:py-16 xl:px-12">
          <div className="max-w-[820px]">
            <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#d71920]">
              <span className="h-px w-9 bg-[#d71920]" />
              Find jobs
            </div>
            <h1 className="mt-5 text-[42px] font-bold leading-[1.04] tracking-[-1.8px] text-[#07182d] sm:text-[54px] lg:text-[60px]">
              Search UK jobs that are ready to explore.
            </h1>
            <p className="mt-5 max-w-[700px] text-[16px] leading-7 text-[#5d6673]">
              Browse current vacancies by role, location, sector and working pattern. Open a listing to review the details, employer information and application route before you apply.
            </p>
          </div>

          <div className="border-l-4 border-[#d71920] bg-[#07182d] p-6 sm:p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Current search</p>
            <p className="mt-3 text-[32px] font-bold tracking-[-1px] text-white">{jobs.length}</p>
            <p className="mt-1 text-[13px] leading-6 text-white/65">
              {jobs.length === 1 ? "vacancy matches" : "vacancies match"} the filters currently selected.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#dfe3e8] bg-[#f4f6f8]">
        <div className="mx-auto max-w-[1360px] px-6 py-7 md:px-10 xl:px-12">
          <form
            method="GET"
            action="/jobs"
            className="grid w-full overflow-hidden rounded-[18px] border border-white/55 bg-white p-1.5 shadow-[0_12px_30px_rgba(16,24,40,.10)] lg:grid-cols-[1.15fr_1fr_.8fr_.8fr_168px]"
          >
            <SearchField icon={Search} label="What">
              <input name="q" defaultValue={q} placeholder="Job title or keyword" className="mt-1 w-full bg-transparent text-[14px] font-semibold text-[#101828] outline-none placeholder:font-normal placeholder:text-[#98a2b3]" />
            </SearchField>
            <SearchField icon={MapPin} label="Where">
              <input name="location" defaultValue={location} placeholder="City or postcode" className="mt-1 w-full bg-transparent text-[14px] font-semibold text-[#101828] outline-none placeholder:font-normal placeholder:text-[#98a2b3]" />
            </SearchField>
            <SearchField label="Sector">
              <select name="category" defaultValue={category} className="mt-1 w-full bg-transparent text-[14px] font-semibold text-[#344054] outline-none">
                <option value="">All sectors</option>
                {categories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </SearchField>
            <SearchField label="Job type">
              <select name="type" defaultValue={type} className="mt-1 w-full bg-transparent text-[14px] font-semibold text-[#344054] outline-none">
                <option value="">Any type</option>
                {jobTypes.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </SearchField>
            <button type="submit" className="flex min-h-[60px] items-center justify-center gap-2 rounded-[12px] bg-[#ff9f1c] px-5 text-[14px] font-extrabold text-[#10203a] transition hover:bg-[#f28c00] lg:min-h-[68px]">
              Search jobs <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {hasFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#667085]">Filtered by</span>
              {q && <FilterChip label={`Keyword: ${q}`} />}
              {location && <FilterChip label={`Location: ${location}`} />}
              {category && <FilterChip label={category} />}
              {type && <FilterChip label={type} />}
              {company && <FilterChip label={`Company: ${company}`} />}
              <Link href="/jobs" className="ml-1 inline-flex items-center gap-1.5 px-2 py-2 text-[12px] font-semibold text-[#667085] hover:text-[#d71920]">
                <X className="h-3.5 w-3.5" /> Clear all
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1360px] px-6 py-12 md:px-10 lg:py-16 xl:px-12">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[240px_minmax(0,1fr)_280px]">
          <aside className="hidden border-t-4 border-[#d71920] bg-white xl:block">
            <div className="border-b border-[#e4e7ec] p-5">
              <div className="flex items-center gap-2 text-[#07182d]">
                <SlidersHorizontal className="h-4 w-4" />
                <h2 className="text-[14px] font-bold">Advanced filters</h2>
              </div>
              <p className="mt-2 text-[12px] leading-5 text-[#667085]">
                Refine current vacancies using live sector and job-type counts.
              </p>
            </div>

            <FilterGroup title="Sector">
              {categories.map((item) => (
                <Link
                  key={item}
                  href={filterHref("category", category === item ? "" : item)}
                  className={`group -mx-2 flex items-center justify-between gap-3 rounded-sm px-2 py-2.5 text-[12px] font-semibold transition-all duration-300 ease-out hover:translate-x-1 hover:bg-[#fff6f6] hover:shadow-[0_4px_12px_rgba(215,25,32,.08)] motion-reduce:transform-none motion-reduce:transition-none ${
                    category === item
                      ? "text-[#d71920]"
                      : "text-[#475467] hover:text-[#d71920]"
                  }`}
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none">{item}</span>
                  <span className="min-w-6 text-right text-[11px] text-[#98a2b3] transition-colors duration-300 group-hover:text-[#d71920]">
                    {categoryCounts.get(item) || 0}
                  </span>
                </Link>
              ))}
            </FilterGroup>

            <FilterGroup title="Job type">
              {jobTypes.map((item) => (
                <Link
                  key={item}
                  href={filterHref("type", type === item ? "" : item)}
                  className={`group -mx-2 flex items-center justify-between gap-3 rounded-sm px-2 py-2.5 text-[12px] font-semibold transition-all duration-300 ease-out hover:translate-x-1 hover:bg-[#fff6f6] hover:shadow-[0_4px_12px_rgba(215,25,32,.08)] motion-reduce:transform-none motion-reduce:transition-none ${
                    type === item
                      ? "text-[#d71920]"
                      : "text-[#475467] hover:text-[#d71920]"
                  }`}
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none">{item}</span>
                  <span className="min-w-6 text-right text-[11px] text-[#98a2b3] transition-colors duration-300 group-hover:text-[#d71920]">
                    {typeCounts.get(item) || 0}
                  </span>
                </Link>
              ))}
            </FilterGroup>

            {hasFilters && (
              <div className="border-t border-[#e4e7ec] p-5">
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 text-[12px] font-bold text-[#d71920]"
                >
                  <X className="h-3.5 w-3.5" />
                  Reset all filters
                </Link>
              </div>
            )}
          </aside>

          <div>
            <div className="flex flex-col gap-4 border-b border-[#cfd5dc] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d71920]">{hasFilters ? "Search results" : "Latest vacancies"}</p>
                <h2 className="mt-2 text-[30px] font-bold tracking-[-1px] text-[#07182d] sm:text-[34px]">
                  {hasFilters ? "Roles matching your search" : "Open roles, newest first"}
                </h2>
              </div>
              <p className="text-[13px] font-semibold text-[#667085]">{jobs.length} {jobs.length === 1 ? "vacancy" : "vacancies"}</p>
            </div>

            {jobs.length === 0 ? (
              <div className="mt-6 border border-[#dfe3e8] bg-white px-7 py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center bg-[#f1f3f5] text-[#667085]"><BriefcaseBusiness className="h-5 w-5" /></div>
                <h3 className="mt-5 text-[20px] font-bold text-[#07182d]">No vacancies match these filters</h3>
                <p className="mx-auto mt-2 max-w-[430px] text-[14px] leading-6 text-[#667085]">Try a broader keyword, another location or remove one of the filters to see more current roles.</p>
                {hasFilters && <Link href="/jobs" className="mt-6 inline-flex min-h-[44px] items-center justify-center border border-[#cfd5dc] bg-white px-5 text-[13px] font-bold text-[#07182d] hover:bg-[#f8f9fa]">Reset search</Link>}
              </div>
            ) : (
              <div className="divide-y divide-[#e1e5e9] border-b border-[#e1e5e9]">
                {jobs.map((job) => (
                  <Link key={job.id} href={`/jobs/${job.slug}`} className="group relative grid gap-5 bg-white px-5 py-6 transition-all duration-200 ease-out hover:z-10 hover:-translate-y-[2px] hover:bg-white hover:shadow-[0_10px_28px_rgba(16,24,40,.10)] sm:grid-cols-[56px_minmax(0,1fr)_36px] sm:px-6">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden border border-[#dfe3e8] bg-[#f6f7f8] text-[13px] font-bold text-[#07182d]">
                      {job.company_logo_url ? (
                        <img
                          src={job.company_logo_url}
                          alt={`${job.company_name} logo`}
                          className="h-full w-full object-contain p-2"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        initials(job.company_name)
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[19px] font-bold tracking-[-0.35px] text-[#07182d] group-hover:text-[#d71920]">{job.title}</h3>
                        <ShieldCheck className="h-4 w-4 shrink-0 text-[#0b6b4b]" />
                      </div>
                      <p className="mt-1 text-[13px] font-semibold text-[#475467]">{job.company_name}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#667085]">
                        <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                        <span>{job.job_type}</span><span>{job.category}</span>
                        {job.salary && <span className="font-semibold text-[#344054]">{job.salary.trim().startsWith("┬ú") ? job.salary : `┬ú${job.salary}`}</span>}
                      </div>
                      <div className="mt-4 flex items-center gap-1.5 text-[11px] text-[#98a2b3]"><Clock3 className="h-3.5 w-3.5" />Posted {timeAgo(job.created_at)}</div>
                    </div>
                    <div className="hidden h-9 w-9 items-center justify-center self-center border border-[#dfe3e8] text-[#667085] transition group-hover:border-[#d71920] group-hover:text-[#d71920] sm:flex"><ChevronRight className="h-4 w-4" /></div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-[104px]">
            <div className="border-t-4 border-[#07182d] bg-white p-6">
              <ShieldCheck className="h-5 w-5 text-[#0b6b4b]" />
              <h3 className="mt-5 text-[18px] font-bold text-[#07182d]">Before you apply</h3>
              <p className="mt-3 text-[13px] leading-6 text-[#667085]">Read the full vacancy, confirm the employer and check where the application link or email will take you.</p>
              <div className="mt-5 border-t border-[#e4e7ec] pt-4">
                <InfoRow text="Review role and location" />
                <InfoRow text="Check application method" />
                <InfoRow text="Never pay to secure a job" />
              </div>
            </div>

            <div className="border-l-4 border-[#d71920] bg-[#07182d] p-6 text-white">
              <Building2 className="h-5 w-5 text-white/70" />
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">For employers</p>
              <h3 className="mt-2 text-[21px] font-bold text-white">Recruiting in the UK?</h3>
              <p className="mt-3 text-[13px] leading-6 text-white/65">Complete the employer checks, publish a clear vacancy and manage it from your account.</p>
              <Link href={accountType === "employer" ? "/post-job" : "/signup"} className="mt-6 inline-flex items-center gap-2 border border-white/20 px-4 py-3 text-[12px] font-bold text-white hover:bg-white/10">Post a vacancy <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#e4e7ec] p-5">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#98a2b3]">
        {title}
      </p>
      <div>{children}</div>
    </div>
  );
}

function SearchField({ icon: Icon, label, children, className = "" }: { icon?: typeof Search; label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`flex min-h-[68px] items-center gap-3 border-b border-[#e7e9ed] px-5 last:border-b-0 lg:border-b-0 lg:border-r ${className}`}>
      {Icon && <Icon className="h-5 w-5 shrink-0 text-[#ff9f1c]" strokeWidth={2} />}
      <span className="min-w-0 flex-1"><span className="block text-[11px] font-bold uppercase tracking-[.08em] text-[#98a2b3]">{label}</span>{children}</span>
    </label>
  );
}

function FilterChip({ label }: { label: string }) {
  return <span className="inline-flex min-h-[30px] items-center border border-[#dfe3e8] bg-white px-3 text-[11px] font-semibold text-[#475467]">{label}</span>;
}

function InfoRow({ text }: { text: string }) {
  return <div className="mt-3 flex first:mt-0 items-center gap-2.5 text-[12px] font-semibold text-[#475467]"><span className="h-1.5 w-1.5 shrink-0 bg-[#d71920]" />{text}</div>;
}
