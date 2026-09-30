import Link from "next/link";

import { redirect } from "next/navigation";

import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Eye,
  MapPin,
  Pencil,
  Plus,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import MainHeader from "@/components/main-header";

import JobActions from "./job-actions";

type Job = {
  id: string;
  slug: string;
  title: string;
  category: string;
  job_type: string;
  location: string;
  salary: string | null;
  status: string;
  apply_clicks: number;
  expires_at: string;
  created_at: string;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function EmployerJobsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (user.user_metadata?.account_type !== "employer") {
    redirect("/");
  }

  const admin = createAdminClient();

  await admin.rpc("close_expired_jobs");

  const { data: verification } = await admin
    .from("employer_verifications")
    .select(`
      company_name,
      company_number,
      verification_status
    `)
    .eq("user_id", user.id)
    .maybeSingle();

  const { data, error } = await admin
    .from("jobs")
    .select(`
      id,
      slug,
      title,
      category,
      job_type,
      location,
      salary,
      status,
      apply_clicks,
      expires_at,
      created_at
    `)
    .eq("employer_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
  }

  const jobs = (data || []) as Job[];

  const published = jobs.filter(
    (job) => job.status === "published"
  ).length;

  const closed = jobs.filter(
    (job) => job.status === "closed"
  ).length;

  const totalClicks = jobs.reduce(
    (sum, job) =>
      sum + Number(job.apply_clicks || 0),
    0
  );

  const displayName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Account";

  const accountType =
    user.user_metadata?.account_type;

  const adminEmails = (
    process.env.ADMIN_EMAILS || ""
  )
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  const isAdmin = Boolean(
    user.email &&
      adminEmails.includes(
        user.email.toLowerCase()
      )
  );

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#101828]">
      <MainHeader
        loggedIn={true}
        displayName={displayName}
        accountType={accountType}
        isAdmin={isAdmin}
      />

      {/* DASHBOARD HEADER */}

      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: "#07182d",
        }}
      >
        <div
          className="absolute -right-[180px] -top-[300px] h-[680px] w-[680px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(23,92,211,.22) 0%, rgba(23,92,211,0) 68%)",
          }}
        />

        <div className="relative mx-auto max-w-[1440px] px-6 pb-[72px] pt-[62px] md:px-10 xl:px-12">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div
                className="flex items-center gap-3 text-[13px] font-semibold"
                style={{
                  color:
                    "rgba(255,255,255,.58)",
                }}
              >
                <span className="h-[2px] w-8 bg-[#d71920]" />
                Employer dashboard
              </div>

              <h1
                className="mt-5 text-[46px] font-bold tracking-[-1.8px] sm:text-[56px]"
                style={{
                  color: "#ffffff",
                }}
              >
                My jobs.
              </h1>

              {verification && (
                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  <span
                    className="text-[15px] font-semibold"
                    style={{
                      color:
                        "rgba(255,255,255,.82)",
                    }}
                  >
                    {verification.company_name}
                  </span>

                  {verification.verification_status ===
                    "verified" && (
                    <ShieldCheck
                      className="h-[17px] w-[17px]"
                      style={{
                        color: "#f3b4bc",
                      }}
                    />
                  )}

                  <span
                    className="text-[13px]"
                    style={{
                      color:
                        "rgba(255,255,255,.46)",
                    }}
                  >
                    Company No.{" "}
                    {verification.company_number}
                  </span>
                </div>
              )}
            </div>

            <Link
              href="/post-job"
              className="inline-flex min-h-[50px] items-center justify-center gap-2.5 self-start rounded-[8px] bg-[#d71920] px-6 text-[14px] font-semibold transition hover:bg-[#b91319] md:self-auto"
              style={{
                color: "#ffffff",
              }}
            >
              <Plus className="h-[17px] w-[17px]" />
              Post new job
            </Link>
          </div>
        </div>
      </section>

      {/* DASHBOARD */}

      <section className="mx-auto max-w-[1440px] px-6 py-[58px] md:px-10 xl:px-12">
        {/* STATS */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            number={jobs.length}
            label="Total jobs"
            description="All job listings"
            icon={BriefcaseBusiness}
          />

          <StatCard
            number={published}
            label="Published"
            description="Currently live"
            icon={CheckCircle2}
          />

          <StatCard
            number={closed}
            label="Closed"
            description="Not publicly listed"
            icon={XCircle}
          />

          <StatCard
            number={totalClicks}
            label="Apply clicks"
            description="Across your jobs"
            icon={Eye}
          />
        </div>

        {/* JOBS */}

        <div className="mt-12">
          <div className="flex flex-col justify-between gap-5 border-b border-[#dfe3e8] pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-[12px] font-semibold text-[#d71920]">
                Vacancies
              </p>

              <h2 className="mt-2 text-[30px] font-bold tracking-[-1px] text-[#101828]">
                Your job listings
              </h2>

              <p className="mt-2 text-[13px] text-[#667085]">
                Manage your published and closed vacancies.
              </p>
            </div>

            <p className="text-[13px] font-medium text-[#667085]">
              {jobs.length}{" "}
              {jobs.length === 1
                ? "listing"
                : "listings"}
            </p>
          </div>

          {jobs.length === 0 ? (
            <div className="mt-6 rounded-[8px] border border-[#e1e5eb] bg-white px-8 py-[80px] text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f2f4f7]">
                <BriefcaseBusiness className="h-6 w-6 text-[#667085]" />
              </div>

              <h2 className="mt-5 text-[20px] font-semibold text-[#101828]">
                No jobs yet
              </h2>

              <p className="mx-auto mt-2 max-w-[400px] text-[14px] leading-6 text-[#667085]">
                Create your first vacancy to start receiving applications.
              </p>

              <Link
                href="/post-job"
                className="mt-6 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[8px] bg-[#07182d] px-5 text-[13px] font-semibold transition hover:bg-[#102a4c]"
                style={{
                  color: "#ffffff",
                }}
              >
                <Plus className="h-4 w-4" />
                Post a job
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {jobs.map((job) => (
                <article
                  key={job.id}
                  className="overflow-hidden rounded-[8px] border border-[#e1e5eb] bg-white transition hover:border-[#cbd2dc] hover:shadow-[0_12px_32px_rgba(16,24,40,.06)]"
                >
                  <div className="p-6 md:p-7">
                    <div className="flex flex-col justify-between gap-7 xl:flex-row xl:items-start">
                      {/* JOB INFO */}

                      <div className="flex min-w-0 flex-1 items-start gap-5">
                        <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-[8px] border border-[#e4e7ec] bg-[#f7f8fa]">
                          <BriefcaseBusiness className="h-[22px] w-[22px] text-[#667085]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-[20px] font-semibold tracking-[-0.4px] text-[#101828]">
                              {job.title}
                            </h3>

                            <StatusBadge
                              status={job.status}
                            />
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] text-[#667085]">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <CalendarClock className="h-4 w-4" />
                              Expires{" "}
                              {formatDate(
                                job.expires_at
                              )}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <Eye className="h-4 w-4" />
                              {job.apply_clicks || 0}{" "}
                              apply{" "}
                              {Number(
                                job.apply_clicks || 0
                              ) === 1
                                ? "click"
                                : "clicks"}
                            </span>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="rounded-full border border-[#f1d2d4] bg-[#fff7f6] px-3 py-1.5 text-[11px] font-semibold text-[#d71920]">
                              {job.job_type}
                            </span>

                            <span className="rounded-full bg-[#f2f4f7] px-3 py-1.5 text-[11px] font-semibold text-[#475467]">
                              {job.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}

                      <div className="flex shrink-0 flex-col gap-4 xl:min-w-[310px] xl:items-end">
                        {job.salary && (
                          <div className="xl:text-right">
                            <p className="text-[10px] font-bold uppercase tracking-[0.07em] text-[#98a2b3]">
                              Salary
                            </p>

                            <p className="mt-1 text-[15px] font-semibold text-[#101828]">
                              {job.salary}
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/employer/jobs/${job.id}/edit`}
                            className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-[7px] border border-[#d0d5dd] bg-white px-4 text-[12px] font-semibold text-[#344054] transition hover:bg-[#f9fafb]"
                          >
                            <Pencil className="h-[14px] w-[14px]" />
                            Edit
                          </Link>

                          {job.status ===
                            "published" && (
                            <Link
                              href={`/jobs/${job.slug}`}
                              target="_blank"
                              className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-[7px] border border-[#f1d2d4] bg-[#fff7f6] px-4 text-[12px] font-semibold text-[#d71920] transition hover:bg-[#fff5f4]"
                            >
                              <Eye className="h-[14px] w-[14px]" />
                              View
                            </Link>
                          )}
                        </div>

                        <JobActions
                          jobId={job.id}
                          title={job.title}
                          status={job.status}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#eaecf0] bg-[#fcfcfd] px-6 py-3.5 md:px-7">
                    <span className="text-[11px] text-[#98a2b3]">
                      Created{" "}
                      {formatDate(
                        job.created_at
                      )}
                    </span>

                    {job.status ===
                      "published" && (
                      <Link
                        href={`/jobs/${job.slug}`}
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#475467] transition hover:text-[#d71920]"
                      >
                        Open listing
                        <ArrowRight className="h-[13px] w-[13px]" />
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function StatCard({
  number,
  label,
  description,
  icon: Icon,
}: {
  number: number;
  label: string;
  description: string;
  icon: typeof BriefcaseBusiness;
}) {
  return (
    <div className="rounded-[8px] border border-[#e1e5eb] bg-white p-6">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-[32px] font-bold leading-none tracking-[-1.2px] text-[#101828]">
            {number}
          </p>

          <p className="mt-3 text-[14px] font-semibold text-[#344054]">
            {label}
          </p>

          <p className="mt-1 text-[11px] text-[#98a2b3]">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#f2f4f7] text-[#475467]">
          <Icon className="h-[20px] w-[20px]" />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const published =
    status === "published";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
        published
          ? "border-[#abefc6] bg-[#ecfdf3] text-[#067647]"
          : "border-[#e4e7ec] bg-[#f2f4f7] text-[#667085]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          published
            ? "bg-[#17b26a]"
            : "bg-[#98a2b3]"
        }`}
      />

      {published
        ? "Published"
        : "Closed"}
    </span>
  );
}