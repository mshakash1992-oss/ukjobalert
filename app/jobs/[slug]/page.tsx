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
  ChevronRight,
  Clock3,
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

function employmentTypeSchema(jobType: string) {
  const normalized = jobType
    .trim()
    .toLowerCase();

  if (
    normalized === "full time" ||
    normalized === "full-time"
  ) {
    return "FULL_TIME";
  }

  if (
    normalized === "part time" ||
    normalized === "part-time"
  ) {
    return "PART_TIME";
  }

  if (
    normalized === "contract" ||
    normalized === "contractor"
  ) {
    return "CONTRACTOR";
  }

  if (normalized === "temporary") {
    return "TEMPORARY";
  }

  if (
    normalized === "internship" ||
    normalized === "intern"
  ) {
    return "INTERN";
  }

  return "OTHER";
}

function jobDescriptionHtml(
  description: string
) {
  const escaped = description
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  return escaped
    .split(/\n{2,}/)
    .map((paragraph) => {
      const content = paragraph
        .trim()
        .replace(/\n/g, "<br>");

      return content
        ? `<p>${content}</p>`
        : "";
    })
    .filter(Boolean)
    .join("");
}

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
    .gt(
      "expires_at",
      new Date().toISOString()
    )
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
        ? `${descriptionText
            .slice(0, 152)
            .trim()}...`
        : descriptionText
      : fallbackDescription;

  const canonicalUrl =
    `/jobs/${slug}`;

  return {
    title:
      `${job.title} - ${job.company_name}`,

    description: metaDescription,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "UKJobAlert",
      title:
        `${job.title} - ${job.company_name}`,
      description: metaDescription,
    },

    twitter: {
      card: "summary_large_image",
      title:
        `${job.title} - ${job.company_name}`,
      description: metaDescription,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  ).format(new Date(date));
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) =>
      word.charAt(0)
    )
    .join("")
    .toUpperCase();
}

export default async function JobDetailsPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const loggedIn =
    Boolean(user);

  const accountType =
    user?.user_metadata
      ?.account_type;

  const displayName =
    user?.user_metadata
      ?.full_name ||
    user?.email?.split("@")[0] ||
    "Account";

  const adminEmails = (
    process.env.ADMIN_EMAILS || ""
  )
    .split(",")
    .map((email) =>
      email
        .trim()
        .toLowerCase()
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
    .eq(
      "status",
      "published"
    )
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
   * GOOGLE JOBPOSTING
   *
   * Only real job data already
   * stored in the database is used.
   */

  const jobPostingJsonLd = {
    "@context":
      "https://schema.org",
    "@type": "JobPosting",

    title: job.title,

    description:
      jobDescriptionHtml(
        job.description
      ),

    identifier: {
      "@type":
        "PropertyValue",
      name: job.company_name,
      value: job.id,
    },

    datePosted:
      new Date(
        job.created_at
      ).toISOString(),

    validThrough:
      new Date(
        job.expires_at
      ).toISOString(),

    employmentType:
      employmentTypeSchema(
        job.job_type
      ),

    hiringOrganization: {
      "@type":
        "Organization",
      name: job.company_name,
    },

    jobLocation: {
      "@type": "Place",
      address: {
        "@type":
          "PostalAddress",
        addressLocality:
          job.location,
        addressCountry: "GB",
      },
    },

    url:
      `https://ukjobalert.com/jobs/${job.slug}`,
  };

  /*
   * Check whether this job
   * is already saved by the
   * logged-in job seeker.
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
      .eq(
        "user_id",
        user.id
      )
      .eq(
        "job_id",
        job.id
      )
      .maybeSingle();

    if (savedJobError) {
      console.error(
        "Saved job lookup error:",
        savedJobError
      );
    }

    initiallySaved =
      Boolean(savedJob);
  }

  const { data: relatedJobs, error: relatedJobsError } = await supabase
    .from("jobs")
    .select("id, slug, title, company_name, location, job_type, created_at")
    .eq("status", "published")
    .eq("category", job.category)
    .neq("id", job.id)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(3);

  if (relatedJobsError) {
    console.error("Related jobs error:", relatedJobsError);
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#101828]">

      {/* GOOGLE JOB STRUCTURED DATA */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jobPostingJsonLd
          ).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />

      <MainHeader
        loggedIn={loggedIn}
        displayName={
          displayName
        }
        accountType={
          accountType
        }
        isAdmin={isAdmin}
      />

      {/* JOB HEADER */}

      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor:
            "#07182d",
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
              className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-[8px] border text-[16px] font-bold"
              style={{
                backgroundColor:
                  "rgba(255,255,255,.08)",
                borderColor:
                  "rgba(255,255,255,.12)",
                color:
                  "#ffffff",
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
                    color:
                      "#ffffff",
                  }}
                >
                  {job.title}
                </h1>

                <ShieldCheck
                  className="h-[21px] w-[21px]"
                  style={{
                    color:
                      "#f3b4bc",
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
                value={
                  job.location
                }
              />

              <Info
                icon={
                  BriefcaseBusiness
                }
                label="Job type"
                value={
                  job.job_type
                }
              />

              <Info
                icon={
                  CalendarDays
                }
                label="Posted"
                value={formatDate(
                  job.created_at
                )}
              />

              <Info
                icon={
                  CalendarClock
                }
                label="Closing date"
                value={formatDate(
                  job.expires_at
                )}
              />
            </div>

            {job.salary && (
              <div className="mt-4 flex items-center justify-between gap-6 rounded-[8px] border border-[#d9e2ef] bg-white px-6 py-5">
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

            <article className="mt-6 rounded-[8px] border border-[#e1e5eb] bg-white px-7 py-8 md:px-9 md:py-9">
              <div className="border-b border-[#eaecf0] pb-6">
                <p className="text-[12px] font-semibold text-[#d71920]">
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
              className="overflow-hidden rounded-[8px] shadow-[0_8px_24px_rgba(16,24,40,.07)]"
              style={{
                backgroundColor:
                  "#07182d",
              }}
            >
              <div className="p-7">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-[8px]"
                  style={{
                    backgroundColor:
                      "rgba(255,255,255,.09)",
                  }}
                >
                  <ShieldCheck
                    className="h-6 w-6"
                    style={{
                      color:
                        "#ffffff",
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
                    color:
                      "#ffffff",
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
                    jobId={
                      job.id
                    }
                    title={
                      job.title
                    }
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

            {accountType !==
              "employer" && (
              <SaveJobButton
                jobId={
                  job.id
                }
                userId={
                  user?.id ??
                  null
                }
                initiallySaved={
                  initiallySaved
                }
              />
            )}

            <div className="rounded-[8px] border border-[#e4e7ec] bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#f2f4f7]">
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
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-[8px] border border-[#d0d5dd] bg-white px-5 text-[13px] font-semibold text-[#344054] transition hover:bg-[#f9fafb]"
            >
              <ArrowLeft className="h-4 w-4" />
              Browse more jobs
            </Link>
          </aside>
        </div>
      </section>

      {(relatedJobs || []).length > 0 && (
        <section className="border-t border-[#e1e5eb] bg-white">
          <div className="mx-auto max-w-[1440px] px-6 py-14 md:px-10 lg:py-16 xl:px-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d71920]">
                  More in {job.category}
                </p>
                <h2 className="mt-2 font-serif text-[32px] font-semibold tracking-[-.8px] text-[#07182d] md:text-[38px]">
                  Related vacancies
                </h2>
              </div>
              <Link href={`/jobs?category=${encodeURIComponent(job.category)}`} className="inline-flex items-center gap-2 text-[13px] font-bold text-[#07182d] hover:text-[#d71920]">
                View all {job.category.toLowerCase()} jobs <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-7 grid gap-px border border-[#dfe3e8] bg-[#dfe3e8] lg:grid-cols-3">
              {(relatedJobs || []).map((related) => (
                <Link key={related.id} href={`/jobs/${related.slug}`} className="group bg-white p-6 transition hover:bg-[#fbfbfa]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-[17px] font-bold text-[#07182d] transition group-hover:text-[#d71920]">{related.title}</h3>
                      <p className="mt-1.5 text-[13px] font-semibold text-[#475467]">{related.company_name}</p>
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#98a2b3] transition group-hover:translate-x-0.5 group-hover:text-[#d71920]" />
                  </div>
                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#eaecf0] pt-4 text-[11px] text-[#667085]">
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{related.location}</span>
                    <span>{related.job_type}</span>
                    <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{formatDate(related.created_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
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
    <div className="min-h-[112px] rounded-[8px] border border-[#e1e5eb] bg-white p-5">
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
      <CheckCircle2 className="mt-[1px] h-[16px] w-[16px] shrink-0 text-[#d71920]" />

      <span className="text-[12px] leading-5 text-[#667085]">
        {text}
      </span>
    </div>
  );
}