import Link from "next/link";
import { redirect } from "next/navigation";

import {
  ArrowRight,
  BellRing,
  Bookmark,
  BriefcaseBusiness,
  CheckCircle2,
  Mail,
  MapPin,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import MainHeader from "@/components/main-header";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "My Account",
  description: "Manage your UKJobAlert job seeker account.",
};

type SavedJobRow = {
  id: string;
  created_at: string;
  job_id: string;
  jobs:
    | {
        id: string;
        title: string;
        slug: string;
        company_name: string;
        location: string;
        job_type: string;
        salary: string | null;
        status: string;
        expires_at: string;
      }
    | {
        id: string;
        title: string;
        slug: string;
        company_name: string;
        location: string;
        job_type: string;
        salary: string | null;
        status: string;
        expires_at: string;
      }[]
    | null;
};

function getSavedJob(
  relation: SavedJobRow["jobs"]
) {
  if (!relation) {
    return null;
  }

  if (Array.isArray(relation)) {
    return relation[0] ?? null;
  }

  return relation;
}

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const accountType =
    user.user_metadata?.account_type;

  if (accountType === "employer") {
    redirect("/employer/jobs");
  }

  const fullName =
    user.user_metadata?.full_name?.trim() ||
    "Job seeker";

  const email = user.email || "";

  const firstName =
    fullName === "Job seeker"
      ? "there"
      : fullName.split(" ")[0];

  /*
   * SAVED JOBS
   */

  const {
    data: savedRows,
    error: savedError,
  } = await supabase
    .from("saved_jobs")
    .select(`
      id,
      job_id,
      created_at,
      jobs (
        id,
        title,
        slug,
        company_name,
        location,
        job_type,
        salary,
        status,
        expires_at
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (savedError) {
    console.error(
      "Saved jobs account error:",
      savedError
    );
  }

  const now = new Date();

  const savedJobs = (
    (savedRows || []) as SavedJobRow[]
  )
    .map((row) => ({
      savedId: row.id,
      savedAt: row.created_at,
      job: getSavedJob(row.jobs),
    }))
    .filter((item) => {
      if (!item.job) {
        return false;
      }

      return (
        item.job.status === "published" &&
        new Date(item.job.expires_at) > now
      );
    });

  /*
   * ACTIVE JOB ALERTS
   */

  const {
    count: activeAlertCount,
    error: alertCountError,
  } = await supabase
    .from("job_alerts")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (alertCountError) {
    console.error(
      "Job alert count error:",
      alertCountError
    );
  }

  const activeAlerts =
    activeAlertCount ?? 0;

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <MainHeader />

      {/* HERO */}

      <section className="relative overflow-hidden bg-[#07182d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(23,92,211,0.2),transparent_34%)]" />

        <div className="relative mx-auto max-w-[1280px] px-6 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="h-[2px] w-7 bg-[#3b82f6]" />

                <p
                  className="text-[11px] font-bold uppercase tracking-[0.17em]"
                  style={{
                    color: "#9ec2ff",
                  }}
                >
                  Job seeker account
                </p>
              </div>

              <h1
                className="mt-6 text-[42px] font-bold leading-[1.04] tracking-[-1.7px] sm:text-[52px]"
                style={{
                  color: "#ffffff",
                }}
              >
                Welcome, {firstName}.
              </h1>

              <p
                className="mt-5 max-w-[620px] text-[15px] leading-7"
                style={{
                  color:
                    "rgba(255,255,255,.66)",
                }}
              >
                Manage your UKJobAlert account and continue
                your job search from one place.
              </p>
            </div>

            <Link
              href="/jobs"
              className="inline-flex min-h-[50px] items-center justify-center gap-2 self-start rounded-[8px] bg-[#e4232a] px-6 text-[14px] font-bold text-white transition hover:bg-[#c91d23] lg:self-auto"
            >
              Find jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CONTENT */}

      <section>
        <div className="mx-auto max-w-[1280px] px-6 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

            {/* LEFT */}

            <div className="space-y-8">

              {/* ACCOUNT DETAILS */}

              <div className="border border-[#e4e7ec] bg-white">
                <div className="border-b border-[#e4e7ec] px-7 py-6 sm:px-8">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#eef4ff]">
                        <UserRound className="h-5 w-5 text-[#175cd3]" />
                      </div>

                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#98a2b3]">
                          Account
                        </p>

                        <h2 className="mt-1 text-[20px] font-bold tracking-[-0.4px] text-[#101828]">
                          Your details
                        </h2>
                      </div>
                    </div>

                    <Link
                      href="/account/settings"
                      className="group inline-flex min-h-[42px] w-fit items-center justify-center gap-2 rounded-[7px] border border-[#d0d5dd] bg-white px-4 text-[12px] font-bold text-[#344054] transition hover:border-[#b2c5e8] hover:bg-[#f5f8ff] hover:text-[#175cd3]"
                    >
                      <Settings className="h-4 w-4 text-[#667085] transition group-hover:text-[#175cd3]" />
                      Account settings
                      <ArrowRight className="h-3.5 w-3.5 text-[#98a2b3] transition group-hover:translate-x-0.5 group-hover:text-[#175cd3]" />
                    </Link>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2">
                  <AccountDetail
                    label="Full name"
                    value={fullName}
                  />

                  <AccountDetail
                    label="Account type"
                    value="Job seeker"
                  />

                  <div className="border-t border-[#e4e7ec] px-7 py-6 sm:px-8">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#98a2b3]">
                      Email address
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0 text-[#667085]" />

                      <p className="break-all text-[14px] font-semibold text-[#344054]">
                        {email}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#e4e7ec] px-7 py-6 sm:border-l sm:px-8">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#98a2b3]">
                      Email status
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#039855]" />

                      <p className="text-[14px] font-semibold text-[#344054]">
                        {user.email_confirmed_at
                          ? "Verified"
                          : "Not verified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* JOB SEEKER TOOLS */}

              <div className="grid gap-5 sm:grid-cols-2">

                {/* JOB SEARCH */}

                <div className="flex min-h-[230px] flex-col border border-[#e4e7ec] bg-white px-7 py-7">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#eef4ff]">
                    <Search className="h-5 w-5 text-[#175cd3]" />
                  </div>

                  <h2 className="mt-5 text-[20px] font-bold tracking-[-0.4px] text-[#101828]">
                    Find your next role
                  </h2>

                  <p className="mt-2 text-[13px] leading-6 text-[#667085]">
                    Browse current UK vacancies from
                    verified employers.
                  </p>

                  <div className="mt-auto pt-6">
                    <Link
                      href="/jobs"
                      className="inline-flex items-center gap-2 text-[12px] font-bold text-[#175cd3]"
                    >
                      Browse jobs
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* JOB ALERTS */}

                <div className="flex min-h-[230px] flex-col border border-[#e4e7ec] bg-white px-7 py-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#eef4ff]">
                      <BellRing className="h-5 w-5 text-[#175cd3]" />
                    </div>

                    <div className="flex h-8 min-w-8 items-center justify-center rounded-full bg-[#eef4ff] px-2.5 text-[11px] font-bold text-[#175cd3]">
                      {activeAlerts}
                    </div>
                  </div>

                  <h2 className="mt-5 text-[20px] font-bold tracking-[-0.4px] text-[#101828]">
                    Job alerts
                  </h2>

                  <p className="mt-2 text-[13px] leading-6 text-[#667085]">
                    {activeAlerts > 0
                      ? `You have ${activeAlerts} active ${
                          activeAlerts === 1
                            ? "job alert"
                            : "job alerts"
                        }.`
                      : "Save a job search and keep your preferences organised."}
                  </p>

                  <div className="mt-auto pt-6">
                    <Link
                      href="/account/alerts"
                      className="inline-flex items-center gap-2 text-[12px] font-bold text-[#175cd3]"
                    >
                      {activeAlerts > 0
                        ? "Manage alerts"
                        : "Create an alert"}

                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* SAVED JOBS */}

              <div className="border border-[#e4e7ec] bg-white">
                <div className="flex flex-col gap-5 border-b border-[#e4e7ec] px-7 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                  <div>
                    <div className="flex items-center gap-2">
                      <Bookmark className="h-5 w-5 text-[#175cd3]" />

                      <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#175cd3]">
                        Saved jobs
                      </p>
                    </div>

                    <h2 className="mt-3 text-[24px] font-bold tracking-[-0.6px] text-[#101828]">
                      Your saved vacancies
                    </h2>
                  </div>

                  <div className="flex h-9 min-w-9 items-center justify-center rounded-full bg-[#eef4ff] px-3 text-[12px] font-bold text-[#175cd3]">
                    {savedJobs.length}
                  </div>
                </div>

                {savedJobs.length > 0 ? (
                  <div>
                    {savedJobs.map(
                      ({
                        savedId,
                        job,
                      }) => {
                        if (!job) {
                          return null;
                        }

                        return (
                          <Link
                            key={savedId}
                            href={`/jobs/${job.slug}`}
                            className="group block border-b border-[#eaecf0] px-7 py-6 transition last:border-b-0 hover:bg-[#f9fafb] sm:px-8"
                          >
                            <div className="flex items-start justify-between gap-6">
                              <div className="min-w-0">
                                <p className="text-[17px] font-bold tracking-[-0.3px] text-[#101828] transition group-hover:text-[#175cd3]">
                                  {job.title}
                                </p>

                                <p className="mt-1.5 text-[13px] font-semibold text-[#475467]">
                                  {job.company_name}
                                </p>

                                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#667085]">
                                  <span className="flex items-center gap-1.5">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {job.location}
                                  </span>

                                  <span className="flex items-center gap-1.5">
                                    <BriefcaseBusiness className="h-3.5 w-3.5" />
                                    {job.job_type}
                                  </span>
                                </div>

                                {job.salary && (
                                  <p className="mt-3 text-[13px] font-bold text-[#344054]">
                                    {job.salary}
                                  </p>
                                )}
                              </div>

                              <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-[#98a2b3] transition group-hover:translate-x-1 group-hover:text-[#175cd3]" />
                            </div>
                          </Link>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div className="px-7 py-12 text-center sm:px-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f2f4f7]">
                      <Bookmark className="h-5 w-5 text-[#667085]" />
                    </div>

                    <h3 className="mt-5 text-[17px] font-bold text-[#101828]">
                      No saved jobs yet
                    </h3>

                    <p className="mx-auto mt-2 max-w-[420px] text-[13px] leading-6 text-[#667085]">
                      Save vacancies you&apos;re interested
                      in and they&apos;ll appear here for
                      quick access.
                    </p>

                    <Link
                      href="/jobs"
                      className="mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[7px] bg-[#175cd3] px-5 text-[13px] font-bold text-white"
                    >
                      Find jobs
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT */}

            <aside className="space-y-6">

              {/* ACCOUNT STATUS */}

              <div className="bg-[#07182d] p-7 sm:p-8">
                <ShieldCheck
                  className="h-7 w-7"
                  style={{
                    color: "#7fb0ff",
                  }}
                />

                <p
                  className="mt-6 text-[11px] font-bold uppercase tracking-[0.15em]"
                  style={{
                    color:
                      "rgba(255,255,255,.45)",
                  }}
                >
                  Account status
                </p>

                <h2
                  className="mt-3 text-[23px] font-bold tracking-[-0.5px]"
                  style={{
                    color: "#ffffff",
                  }}
                >
                  Job seeker
                </h2>

                <p
                  className="mt-4 text-[13px] leading-6"
                  style={{
                    color:
                      "rgba(255,255,255,.62)",
                  }}
                >
                  Your account is set up for searching,
                  saving and applying for vacancies.
                </p>

                <div className="mt-7 border-t border-white/10 pt-6">
                  <StatusItem>
                    Account active
                  </StatusItem>

                  <StatusItem>
                    Job search access
                  </StatusItem>

                  <StatusItem>
                    Saved jobs enabled
                  </StatusItem>

                  <StatusItem>
                    Job alerts enabled
                  </StatusItem>
                </div>
              </div>

              {/* OVERVIEW */}

              <div className="border border-[#e4e7ec] bg-white">
                <div className="border-b border-[#eaecf0] px-7 py-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#667085]">
                    Your activity
                  </p>

                  <h3 className="mt-2 text-[18px] font-bold tracking-[-0.3px] text-[#101828]">
                    Account overview
                  </h3>
                </div>

                <div className="grid grid-cols-2">
                  <div className="px-7 py-6">
                    <Bookmark className="h-4 w-4 text-[#175cd3]" />

                    <p className="mt-3 text-[28px] font-bold tracking-[-0.8px] text-[#101828]">
                      {savedJobs.length}
                    </p>

                    <p className="mt-1 text-[11px] font-semibold text-[#667085]">
                      Saved jobs
                    </p>
                  </div>

                  <div className="border-l border-[#eaecf0] px-7 py-6">
                    <BellRing className="h-4 w-4 text-[#175cd3]" />

                    <p className="mt-3 text-[28px] font-bold tracking-[-0.8px] text-[#101828]">
                      {activeAlerts}
                    </p>

                    <p className="mt-1 text-[11px] font-semibold text-[#667085]">
                      Job alerts
                    </p>
                  </div>
                </div>
              </div>

              {/* ALERT SHORTCUT */}

              <div className="border border-[#e4e7ec] bg-white p-7">
                <BellRing className="h-5 w-5 text-[#175cd3]" />

                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#667085]">
                  Job alerts
                </p>

                <h3 className="mt-2 text-[18px] font-bold tracking-[-0.3px] text-[#101828]">
                  Keep your search organised.
                </h3>

                <p className="mt-3 text-[12px] leading-6 text-[#667085]">
                  Create alerts for the roles, locations
                  and job types you&apos;re interested in.
                </p>

                <Link
                  href="/account/alerts"
                  className="mt-5 inline-flex items-center gap-2 text-[12px] font-bold text-[#175cd3]"
                >
                  Manage job alerts
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* HELP */}

              <div className="border border-[#e4e7ec] bg-white p-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#98a2b3]">
                  Need help?
                </p>

                <h3 className="mt-3 text-[18px] font-bold tracking-[-0.3px] text-[#101828]">
                  Account support
                </h3>

                <p className="mt-3 text-[13px] leading-6 text-[#667085]">
                  Visit the contact page for account,
                  privacy or job listing questions.
                </p>

                <Link
                  href="/contact"
                  className="mt-5 inline-flex items-center gap-2 text-[13px] font-bold text-[#175cd3]"
                >
                  Contact UKJobAlert
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function AccountDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="px-7 py-6 sm:px-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#98a2b3]">
        {label}
      </p>

      <p className="mt-3 text-[15px] font-bold text-[#344054]">
        {value}
      </p>
    </div>
  );
}

function StatusItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 flex first:mt-0 items-center gap-2.5">
      <CheckCircle2
        className="h-4 w-4 shrink-0"
        style={{
          color: "#7fb0ff",
        }}
      />

      <p
        className="text-[12px] font-semibold"
        style={{
          color: "#ffffff",
        }}
      >
        {children}
      </p>
    </div>
  );
}