import Link from "next/link";
import { redirect } from "next/navigation";

import {
  ArrowLeft,
  Bell,
  BellRing,
  BriefcaseBusiness,
  CheckCircle2,
  MapPin,
  Search,
} from "lucide-react";

import MainHeader from "@/components/main-header";
import { createClient } from "@/lib/supabase/server";

import DeleteAlertButton from "./delete-alert-button";

export const metadata = {
  title: "Job Alerts",
  description:
    "Create and manage your UKJobAlert job alerts.",
};

type JobAlert = {
  id: string;
  keyword: string | null;
  location: string | null;
  category: string | null;
  job_type: string | null;
  is_active: boolean;
  created_at: string;
};

export default async function JobAlertsPage() {
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
    data,
    error,
  } = await supabase
    .from("job_alerts")
    .select(`
      id,
      keyword,
      location,
      category,
      job_type,
      is_active,
      created_at
    `)
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Job alerts fetch error:",
      error
    );
  }

  const alerts = (data || []) as JobAlert[];

  const activeAlerts =
    alerts.filter(
      (alert) => alert.is_active
    ).length;

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <MainHeader
        loggedIn
        displayName={
          user.user_metadata?.full_name?.trim() ||
          "Account"
        }
        accountType={
          user.user_metadata?.account_type ||
          "job_seeker"
        }
      />

      {/* HERO */}

      <section className="relative overflow-hidden bg-[#07182d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(23,92,211,0.20),transparent_34%)]" />

        <div className="relative mx-auto max-w-[1280px] px-6 py-16 sm:px-8 lg:px-10 lg:py-20">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-[13px] font-semibold"
            style={{
              color:
                "rgba(255,255,255,.62)",
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to account
          </Link>

          <div className="mt-9 flex items-center gap-2.5">
            <div className="h-[2px] w-7 bg-[#d71920]" />

            <p
              className="text-[11px] font-bold uppercase tracking-[0.17em]"
              style={{
                color: "#f3b4bc",
              }}
            >
              Job seeker tools
            </p>
          </div>

          <h1
            className="mt-6 text-[42px] font-bold leading-[1.04] tracking-[-1.7px] sm:text-[52px]"
            style={{
              color: "#ffffff",
            }}
          >
            Job alerts.
          </h1>

          <p
            className="mt-5 max-w-[620px] text-[15px] leading-7"
            style={{
              color:
                "rgba(255,255,255,.66)",
            }}
          >
            Save the type of role you&apos;re
            looking for and keep your job search
            organised.
          </p>
        </div>
      </section>

      {/* CONTENT */}

      <section>
        <div className="mx-auto grid max-w-[1180px] gap-8 px-6 py-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-10 lg:py-20">

          {/* LEFT */}

          <div className="space-y-7">

            {/* CREATE ALERT */}

            <div className="border border-[#e4e7ec] bg-white">
              <div className="border-b border-[#e4e7ec] px-7 py-7 sm:px-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[#fff5f4]">
                    <BellRing className="h-5 w-5 text-[#d71920]" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#667085]">
                      New alert
                    </p>

                    <h2 className="mt-1 text-[21px] font-bold tracking-[-0.4px] text-[#101828]">
                      What jobs are you looking for?
                    </h2>
                  </div>
                </div>
              </div>

              <form
                action="/api/job-alerts"
                method="POST"
                className="px-7 py-8 sm:px-8"
              >
                <div className="grid gap-6 sm:grid-cols-2">

                  {/* KEYWORD */}

                  <div>
                    <label
                      htmlFor="keyword"
                      className="block text-[12px] font-bold text-[#344054]"
                    >
                      Keyword
                    </label>

                    <div className="relative mt-2">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98a2b3]" />

                      <input
                        id="keyword"
                        name="keyword"
                        type="text"
                        maxLength={100}
                        placeholder="e.g. Software Engineer"
                        className="min-h-[50px] w-full rounded-[7px] border border-[#d0d5dd] bg-white py-3 pl-11 pr-4 text-[13px] text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[#d71920] focus:ring-2 focus:ring-[#d71920]/10"
                      />
                    </div>
                  </div>

                  {/* LOCATION */}

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-[12px] font-bold text-[#344054]"
                    >
                      Location
                    </label>

                    <div className="relative mt-2">
                      <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98a2b3]" />

                      <input
                        id="location"
                        name="location"
                        type="text"
                        maxLength={100}
                        placeholder="e.g. London"
                        className="min-h-[50px] w-full rounded-[7px] border border-[#d0d5dd] bg-white py-3 pl-11 pr-4 text-[13px] text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[#d71920] focus:ring-2 focus:ring-[#d71920]/10"
                      />
                    </div>
                  </div>

                  {/* CATEGORY */}

                  <div>
                    <label
                      htmlFor="category"
                      className="block text-[12px] font-bold text-[#344054]"
                    >
                      Category
                    </label>

                    <select
                      id="category"
                      name="category"
                      defaultValue=""
                      className="mt-2 min-h-[50px] w-full rounded-[7px] border border-[#d0d5dd] bg-white px-4 text-[13px] text-[#344054] outline-none transition focus:border-[#d71920] focus:ring-2 focus:ring-[#d71920]/10"
                    >
                      <option value="">
                        Any category
                      </option>

                      <option value="Technology">
                        Technology
                      </option>

                      <option value="Healthcare">
                        Healthcare
                      </option>

                      <option value="Finance">
                        Finance
                      </option>

                      <option value="Education">
                        Education
                      </option>

                      <option value="Engineering">
                        Engineering
                      </option>

                      <option value="Construction">
                        Construction
                      </option>

                      <option value="Retail">
                        Retail
                      </option>

                      <option value="Hospitality">
                        Hospitality
                      </option>

                      <option value="Transport">
                        Transport
                      </option>

                      <option value="Administration">
                        Administration
                      </option>

                      <option value="Sales">
                        Sales
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>
                  </div>

                  {/* JOB TYPE */}

                  <div>
                    <label
                      htmlFor="job_type"
                      className="block text-[12px] font-bold text-[#344054]"
                    >
                      Job type
                    </label>

                    <select
                      id="job_type"
                      name="job_type"
                      defaultValue=""
                      className="mt-2 min-h-[50px] w-full rounded-[7px] border border-[#d0d5dd] bg-white px-4 text-[13px] text-[#344054] outline-none transition focus:border-[#d71920] focus:ring-2 focus:ring-[#d71920]/10"
                    >
                      <option value="">
                        Any job type
                      </option>

                      <option value="Full-time">
                        Full-time
                      </option>

                      <option value="Part-time">
                        Part-time
                      </option>

                      <option value="Contract">
                        Contract
                      </option>

                      <option value="Temporary">
                        Temporary
                      </option>

                      <option value="Internship">
                        Internship
                      </option>
                    </select>
                  </div>
                </div>

                <div className="mt-7 border-t border-[#eaecf0] pt-6">
                  <button
                    type="submit"
                    className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[7px] bg-[#d71920] px-6 text-[13px] font-bold text-white transition hover:bg-[#b91319]"
                  >
                    <Bell className="h-4 w-4" />
                    Create job alert
                  </button>
                </div>
              </form>
            </div>

            {/* EXISTING ALERTS */}

            <div className="border border-[#e4e7ec] bg-white">
              <div className="flex items-center justify-between border-b border-[#e4e7ec] px-7 py-6 sm:px-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#667085]">
                    Your alerts
                  </p>

                  <h2 className="mt-1.5 text-[20px] font-bold tracking-[-0.4px] text-[#101828]">
                    Saved job searches
                  </h2>
                </div>

                <div className="flex h-9 min-w-9 items-center justify-center rounded-full bg-[#fff5f4] px-3 text-[12px] font-bold text-[#d71920]">
                  {alerts.length}
                </div>
              </div>

              {alerts.length > 0 ? (
                <div>
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="border-b border-[#eaecf0] px-7 py-6 last:border-b-0 sm:px-8"
                    >
                      <div className="flex items-start justify-between gap-6">

                        {/* ALERT DETAILS */}

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-[16px] font-bold text-[#101828]">
                              {alert.keyword ||
                                "All jobs"}
                            </h3>

                            {alert.is_active && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#ecfdf3] px-2.5 py-1 text-[10px] font-bold text-[#027a48]">
                                <CheckCircle2 className="h-3 w-3" />
                                Active
                              </span>
                            )}
                          </div>

                          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-[#667085]">
                            {alert.location && (
                              <span className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5" />
                                {alert.location}
                              </span>
                            )}

                            {alert.category && (
                              <span className="flex items-center gap-1.5">
                                <BriefcaseBusiness className="h-3.5 w-3.5" />
                                {alert.category}
                              </span>
                            )}

                            {alert.job_type && (
                              <span>
                                {alert.job_type}
                              </span>
                            )}

                            {!alert.location &&
                              !alert.category &&
                              !alert.job_type && (
                                <span>
                                  All UK vacancies
                                </span>
                              )}
                          </div>
                        </div>

                        {/* REAL DELETE BUTTON */}

                        <DeleteAlertButton
                          alertId={alert.id}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-7 py-12 text-center sm:px-8">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f2f4f7]">
                    <Bell className="h-5 w-5 text-[#667085]" />
                  </div>

                  <h3 className="mt-5 text-[17px] font-bold text-[#101828]">
                    No job alerts yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-[430px] text-[13px] leading-6 text-[#667085]">
                    Create an alert above to save the type
                    of vacancy you&apos;re interested in.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}

          <aside className="space-y-6">
            <div className="bg-[#07182d] p-7">
              <BellRing
                className="h-7 w-7"
                style={{
                  color: "#f3b4bc",
                }}
              />

              <p
                className="mt-6 text-[10px] font-bold uppercase tracking-[0.15em]"
                style={{
                  color:
                    "rgba(255,255,255,.46)",
                }}
              >
                Job alerts
              </p>

              <h2
                className="mt-3 text-[22px] font-bold tracking-[-0.4px]"
                style={{
                  color: "#ffffff",
                }}
              >
                Save your search.
              </h2>

              <p
                className="mt-4 text-[12px] leading-6"
                style={{
                  color:
                    "rgba(255,255,255,.62)",
                }}
              >
                Choose the role, location and type of work
                you&apos;re interested in. Your alerts stay
                private to your account.
              </p>

              <div className="mt-6 border-t border-white/10 pt-5">
                <InfoItem>
                  Private to your account
                </InfoItem>

                <InfoItem>
                  Manage alerts anytime
                </InfoItem>

                <InfoItem>
                  Match future vacancies
                </InfoItem>
              </div>
            </div>

            <div className="border border-[#e4e7ec] bg-white p-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#667085]">
                Active alerts
              </p>

              <p className="mt-3 text-[32px] font-bold tracking-[-1px] text-[#101828]">
                {activeAlerts}
              </p>

              <p className="mt-2 text-[12px] leading-6 text-[#667085]">
                Job searches currently saved to your
                account.
              </p>
            </div>

            <Link
              href="/account"
              className="flex min-h-[46px] items-center justify-center gap-2 border border-[#d0d5dd] bg-white px-5 text-[12px] font-bold text-[#344054] transition hover:border-[#98a2b3] hover:bg-[#f9fafb]"
            >
              <ArrowLeft className="h-4 w-4" />
              My account
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

function InfoItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3.5 flex first:mt-0 items-center gap-2.5">
      <CheckCircle2
        className="h-4 w-4 shrink-0"
        style={{
          color: "#f3b4bc",
        }}
      />

      <span
        className="text-[11px] font-semibold"
        style={{
          color:
            "rgba(255,255,255,.78)",
        }}
      >
        {children}
      </span>
    </div>
  );
}