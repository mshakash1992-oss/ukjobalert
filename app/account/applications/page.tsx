import Link from "next/link";
import { redirect } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  MapPin,
} from "lucide-react";

import MainHeader from "@/components/main-header";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "My Applications",
  description: "Track your UKJobAlert job applications.",
};

type ApplicationRow = {
  id: string;
  status: string;
  applied_at: string;

  jobs:
    | {
        id: string;
        title: string;
        slug: string;
        company_name: string;
        location: string;
        job_type: string;
        salary: string | null;
      }
    | {
        id: string;
        title: string;
        slug: string;
        company_name: string;
        location: string;
        job_type: string;
        salary: string | null;
      }[]
    | null;
};

function getJob(
  relation: ApplicationRow["jobs"]
) {
  if (!relation) {
    return null;
  }

  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(new Date(date));
}

function formatStatus(status: string) {
  switch (status) {
    case "interview":
      return "Interview";

    case "offer":
      return "Offer";

    case "rejected":
      return "Rejected";

    case "withdrawn":
      return "Withdrawn";

    default:
      return "Applied";
  }
}

export default async function ApplicationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (
    user.user_metadata?.account_type ===
    "employer"
  ) {
    redirect("/employer/jobs");
  }

  const {
    data: applicationRows,
    error,
  } = await supabase
    .from("job_applications")
    .select(`
      id,
      status,
      applied_at,
      jobs (
        id,
        title,
        slug,
        company_name,
        location,
        job_type,
        salary
      )
    `)
    .eq("user_id", user.id)
    .order("applied_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Applications page error:",
      error
    );
  }

  const applications = (
    (applicationRows || []) as ApplicationRow[]
  )
    .map((application) => ({
      id: application.id,
      status: application.status,
      appliedAt: application.applied_at,
      job: getJob(application.jobs),
    }))
    .filter(
      (
        application
      ): application is typeof application & {
        job: NonNullable<
          typeof application.job
        >;
      } => Boolean(application.job)
    );

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <MainHeader />

      {/* HERO */}

      <section className="relative overflow-hidden bg-[#07182d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(23,92,211,0.2),transparent_34%)]" />

        <div className="relative mx-auto max-w-[1180px] px-6 py-14 sm:px-8 lg:px-10 lg:py-16">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-[12px] font-bold text-[#9ec2ff] transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to account
          </Link>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="h-[2px] w-7 bg-[#3b82f6]" />

                <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#9ec2ff]">
                  Job seeker
                </p>
              </div>

              <h1 className="mt-5 text-[40px] font-bold tracking-[-1.5px] text-white sm:text-[48px]">
                My applications.
              </h1>

              <p className="mt-4 max-w-[560px] text-[14px] leading-7 text-white/60">
                Keep track of vacancies you
                have applied for through
                UKJobAlert.
              </p>
            </div>

            <div className="flex min-w-[120px] items-center justify-center border border-white/10 bg-white/[0.06] px-6 py-5">
              <div className="text-center">
                <p className="text-[30px] font-bold text-white">
                  {applications.length}
                </p>

                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/45">
                  Applications
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}

      <section>
        <div className="mx-auto max-w-[1180px] px-6 py-14 sm:px-8 lg:px-10 lg:py-16">
          {applications.length > 0 ? (
            <div className="border border-[#e4e7ec] bg-white">
              <div className="border-b border-[#e4e7ec] px-7 py-6 sm:px-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#667085]">
                  Application history
                </p>

                <h2 className="mt-2 text-[21px] font-bold tracking-[-0.4px] text-[#101828]">
                  Jobs you&apos;ve applied for
                </h2>
              </div>

              <div>
                {applications.map(
                  ({
                    id,
                    status,
                    appliedAt,
                    job,
                  }) => (
                    <Link
                      key={id}
                      href={`/jobs/${job.slug}`}
                      className="group block border-b border-[#eaecf0] px-7 py-7 transition last:border-b-0 hover:bg-[#f9fafb] sm:px-8"
                    >
                      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-[18px] font-bold tracking-[-0.3px] text-[#101828] transition group-hover:text-[#175cd3]">
                              {job.title}
                            </h3>

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf3] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#027a48]">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {formatStatus(
                                status
                              )}
                            </span>
                          </div>

                          <p className="mt-2 text-[13px] font-semibold text-[#475467]">
                            {job.company_name}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-[#667085]">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" />
                              {job.location}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <BriefcaseBusiness className="h-3.5 w-3.5" />
                              {job.job_type}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <CalendarDays className="h-3.5 w-3.5" />
                              Applied{" "}
                              {formatDate(
                                appliedAt
                              )}
                            </span>
                          </div>

                          {job.salary && (
                            <p className="mt-4 text-[13px] font-bold text-[#344054]">
                              {job.salary}
                            </p>
                          )}
                        </div>

                        <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-[#98a2b3] transition group-hover:translate-x-1 group-hover:text-[#175cd3]" />
                      </div>
                    </Link>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="border border-[#e4e7ec] bg-white px-7 py-16 text-center sm:px-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef4ff]">
                <BriefcaseBusiness className="h-6 w-6 text-[#175cd3]" />
              </div>

              <h2 className="mt-6 text-[21px] font-bold tracking-[-0.4px] text-[#101828]">
                No applications yet
              </h2>

              <p className="mx-auto mt-3 max-w-[460px] text-[13px] leading-6 text-[#667085]">
                When you apply for a vacancy
                through UKJobAlert, you can
                keep track of it here.
              </p>

              <Link
                href="/jobs"
                className="mt-7 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[7px] bg-[#175cd3] px-6 text-[13px] font-bold text-white transition hover:bg-[#1849a9]"
              >
                Find jobs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}