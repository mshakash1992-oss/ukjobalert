import type { Metadata } from "next";
import Link from "next/link";

import { notFound } from "next/navigation";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import MainHeader from "@/components/main-header";

import ApplyButton from "../apply-button";
import SaveJobButton from "../save-job-button";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: job } = await supabase
    .from("jobs")
    .select(`
      title,
      company_name,
      location,
      description,
      expires_at
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (!job) {
    return {
      title: "Job Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const descriptionText =
    typeof job.description === "string"
      ? job.description
          .replace(/\s+/g, " ")
          .trim()
      : "";

  const fallbackDescription =
    `${job.title} job at ${job.company_name} in ${job.location}. ` +
    `View vacancy details and application information on UKJobAlert.`;

  const metaDescription =
    descriptionText.length > 0
      ? descriptionText.length > 155
        ? `${descriptionText.slice(0, 152).trim()}...`
        : descriptionText
      : fallbackDescription;

  const canonicalUrl = `/jobs/${slug}`;

  return {
    title: `${job.title} - ${job.company_name}`,

    description: metaDescription,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "UKJobAlert",
      title: `${job.title} - ${job.company_name}`,
      description: metaDescription,
    },

    twitter: {
      card: "summary_large_image",
      title: `${job.title} - ${job.company_name}`,
      description: metaDescription,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
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

export default async function JobDetailsPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const loggedIn = Boolean(user);

  const accountType =
    user?.user_metadata?.account_type;

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Account";

  const adminEmails = (
    process.env.ADMIN_EMAILS || ""
  )
    .split(",")
    .map((email) =>
      email.trim().toLowerCase()
    )
    .filter(Boolean);

  const isAdmin = Boolean(
    user?.email &&
      adminEmails.includes(
        user.email.toLowerCase()
      )
  );

  const {
    data: job,
    error,
  } = await supabase
    .from("jobs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .gt(
      "expires_at",
      new Date().toISOString()
    )
    .maybeSingle();

  if (error) {
    console.error(error);
  }

  if (!job) {
    notFound();
  }

  /*
   * Check whether this job is already saved
   * by the currently logged-in job seeker.
   */

  let initiallySaved = false;

  if (
    user &&
    accountType !== "employer"
  ) {
    const {
      data: savedJob,
      error: savedJobError,
    } = await supabase
      .from("saved_jobs")
      .select("id")
      .eq("user_id", user.id)
      .eq("job_id", job.id)
      .maybeSingle();

    if (savedJobError) {
      console.error(
        "Saved job lookup error:",
        savedJobError
      );
    }

    initiallySaved = Boolean(savedJob);
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#101828]">
      <MainHeader
        loggedIn={loggedIn}
        displayName={displayName}
        accountType={accountType}
        isAdmin={isAdmin}
      />

      {/* JOB HEADER */}

      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: "#07182d",
        }}
      >
        <div
          className="absolute -right-[120px] -top-[280px] h-[620px] w-[620px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(23,92,211,.22) 0%, rgba(23,92,211,0) 68%)",
          }}
        />

        <div className="relative mx-auto max-w-[1440px] px-6 pb-[78px] pt-[54px] md:px-10 xl:px-12">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-[13px] font-semibold transition hover:opacity-100"
            style={{
              color:
                "rgba(255,255,255,.62)",
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to jobs
          </Link>

          <div className="mt-9 flex max-w-[950px] items-start gap-5">
            <div
              className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-[14px] border text-[16px] font-bold"
              style={{
                backgroundColor:
                  "rgba(255,255,255,.08)",
                borderColor:
                  "rgba(255,255,255,.12)",
                color: "#ffffff",
              }}
            >
              {initials(
                job.company_name
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1
                  className="text-[38px] font-bold leading-[1.08] tracking-[-1.5px] sm:text-[48px]"
                  style={{
                    color: "#ffffff",
                  }}
                >
                  {job.title}
                </h1>

                <ShieldCheck
                  className="h-[21px] w-[21px]"
                  style={{
                    color: "#8ab4ff",
                  }}
                />
              </div>

              <p
                className="mt-3 text-[16px] font-semibold"
                style={{
                  color:
                    "rgba(255,255,255,.72)",
                }}
              >
                {job.company_name}
              </p>

              <div
                className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px]"
                style={{
                  color:
                    "rgba(255,255,255,.60)",
                }}
              >
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>

                <span
                  className="rounded-full border px-3 py-1.5"
                  style={{
                    borderColor:
                      "rgba(255,255,255,.14)",
                    backgroundColor:
                      "rgba(255,255,255,.07)",
                    color:
                      "rgba(255,255,255,.80)",
                  }}
                >
                  {job.job_type}
                </span>

                <span
                  className="rounded-full border px-3 py-1.5"
                  style={{
                    borderColor:
                      "rgba(255,255,255,.14)",
                    backgroundColor:
                      "rgba(255,255,255,.07)",
                    color:
                      "rgba(255,255,255,.80)",
                  }}
                >
                  {job.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}

      <section className="mx-auto max-w-[1440px] px-6 py-[58px] md:px-10 xl:px-12">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">

          {/* LEFT */}

          <div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Info
                icon={MapPin}
                label="Location"
                value={job.location}
              />

              <Info
                icon={BriefcaseBusiness}
                label="Job type"
                value={job.job_type}
              />

              <Info
                icon={CalendarDays}
                label="Posted"
                value={formatDate(
                  job.created_at
                )}
              />

              <Info
                icon={CalendarClock}
                label="Closing date"
                value={formatDate(
                  job.expires_at
                )}
              />
            </div>

            {job.salary && (
              <div className="mt-4 flex items-center justify-between gap-6 rounded-[14px] border border-[#d9e2ef] bg-white px-6 py-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#98a2b3]">
                    Salary
                  </p>

                  <p className="mt-1.5 text-[20px] font-semibold tracking-[-0.4px] text-[#101828]">
                    {job.salary}
                  </p>
                </div>

                <BriefcaseBusiness className="h-5 w-5 text-[#98a2b3]" />
              </div>
            )}

            <article className="mt-6 rounded-[16px] border border-[#e1e5eb] bg-white px-7 py-8 md:px-9 md:py-9">
              <div className="border-b border-[#eaecf0] pb-6">
                <p className="text-[12px] font-semibold text-[#175cd3]">
                  Vacancy details
                </p>

                <h2 className="mt-2 text-[27px] font-bold tracking-[-0.8px] text-[#101828]">
                  Job description
                </h2>
              </div>

              <div className="mt-7 whitespace-pre-wrap text-[15px] leading-[1.9] text-[#475467]">
                {job.description}
              </div>
            </article>
          </div>

          {/* RIGHT */}

          <aside className="space-y-4 lg:sticky lg:top-[105px]">
            <div
              className="overflow-hidden rounded-[16px] shadow-[0_24px_55px_rgba(7,24,45,.16)]"
              style={{
                backgroundColor:
                  "#07182d",
              }}
            >
              <div className="p-7">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-[11px]"
                  style={{
                    backgroundColor:
                      "rgba(255,255,255,.09)",
                  }}
                >
                  <ShieldCheck
                    className="h-6 w-6"
                    style={{
                      color: "#ffffff",
                    }}
                  />
                </div>

                <p
                  className="mt-7 text-[11px] font-bold uppercase tracking-[0.09em]"
                  style={{
                    color:
                      "rgba(255,255,255,.48)",
                  }}
                >
                  Employer
                </p>

                <h2
                  className="mt-2 text-[25px] font-semibold tracking-[-0.6px]"
                  style={{
                    color: "#ffffff",
                  }}
                >
                  {job.company_name}
                </h2>

                <p
                  className="mt-4 text-[13px] leading-6"
                  style={{
                    color:
                      "rgba(255,255,255,.62)",
                  }}
                >
                  This vacancy was
                  published through an
                  approved UKJobAlert
                  employer account.
                </p>

                <div
                  className="my-6 h-px"
                  style={{
                    backgroundColor:
                      "rgba(255,255,255,.10)",
                  }}
                />

                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.08em]"
                    style={{
                      color:
                        "rgba(255,255,255,.40)",
                    }}
                  >
                    Companies House
                  </p>

                  <p
                    className="mt-1.5 text-[13px] font-semibold"
                    style={{
                      color:
                        "rgba(255,255,255,.78)",
                    }}
                  >
                    {job.company_number}
                  </p>
                </div>

                {/* EXISTING APPLY LOGIC */}

                <div className="mt-7">
                  <ApplyButton
                    jobId={job.id}
                    title={job.title}
                    applyMethod={
                      job.apply_method
                    }
                    applyEmail={
                      job.apply_email
                    }
                    applyUrl={
                      job.apply_url
                    }
                  />
                </div>
              </div>
            </div>

            {/* SAVE JOB */}

            {accountType !== "employer" && (
              <SaveJobButton
                jobId={job.id}
                userId={user?.id ?? null}
                initiallySaved={
                  initiallySaved
                }
              />
            )}

            <div className="rounded-[16px] border border-[#e4e7ec] bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[9px] bg-[#f2f4f7]">
                  <Building2 className="h-[18px] w-[18px] text-[#475467]" />
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#98a2b3]">
                    Company
                  </p>

                  <p className="mt-0.5 text-[14px] font-semibold text-[#101828]">
                    {job.company_name}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-[#eaecf0] pt-5">
                <CheckItem text="Company information checked" />
                <CheckItem text="Current job listing" />
                <CheckItem text="Application details provided" />
              </div>
            </div>

            <Link
              href="/jobs"
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-[9px] border border-[#d0d5dd] bg-white px-5 text-[13px] font-semibold text-[#344054] transition hover:bg-[#f9fafb]"
            >
              <ArrowLeft className="h-4 w-4" />
              Browse more jobs
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="min-h-[112px] rounded-[14px] border border-[#e1e5eb] bg-white p-5">
      <div className="flex items-center gap-2 text-[#98a2b3]">
        <Icon className="h-[16px] w-[16px]" />

        <p className="text-[10px] font-bold uppercase tracking-[0.07em]">
          {label}
        </p>
      </div>

      <p className="mt-4 text-[14px] font-semibold leading-5 text-[#101828]">
        {value}
      </p>
    </div>
  );
}

function CheckItem({
  text,
}: {
  text: string;
}) {
  return (
    <div className="mt-3 flex first:mt-0 items-start gap-2.5">
      <CheckCircle2 className="mt-[1px] h-[16px] w-[16px] shrink-0 text-[#175cd3]" />

      <span className="text-[12px] leading-5 text-[#667085]">
        {text}
      </span>
    </div>
  );
}