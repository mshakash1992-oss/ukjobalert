import Link from "next/link";

import { redirect } from "next/navigation";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import MainHeader from "@/components/main-header";

import PostJobForm from "./post-job-form";

export default async function PostJobPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (
    user.user_metadata?.account_type !==
    "employer"
  ) {
    return (
      <BlockedPage
        title="Employer account required"
        text="Only employer accounts can publish vacancies on UKJobAlert."
        buttonText="Back to homepage"
        buttonHref="/"
      />
    );
  }

  const {
    data: verification,
  } = await supabase
    .from("employer_verifications")
    .select(`
      id,
      company_name,
      company_number,
      verification_status
    `)
    .eq(
      "user_id",
      user.id
    )
    .maybeSingle();

  if (!verification) {
    return (
      <BlockedPage
        title="Company check required"
        text="Complete your company check before posting a vacancy."
        buttonText="Start company check"
        buttonHref="/employer/verify"
      />
    );
  }

  if (
    verification.verification_status !==
    "verified"
  ) {
    return (
      <BlockedPage
        title="Job posting unavailable"
        text="Your employer account must be approved before you can publish vacancies."
        buttonText="View company check"
        buttonHref="/employer/verify"
      />
    );
  }

  const accountType =
    user.user_metadata?.account_type;

  const displayName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Account";

  const adminEmails =
    (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((email) =>
        email.trim().toLowerCase()
      )
      .filter(Boolean);

  const isAdmin =
    Boolean(
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

      {/* PAGE HEADER */}

      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: "#07182d",
        }}
      >
        <div
          className="absolute -right-[160px] -top-[300px] h-[650px] w-[650px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(23,92,211,.22) 0%, rgba(23,92,211,0) 68%)",
          }}
        />

        <div className="relative mx-auto max-w-[1440px] px-6 pb-[74px] pt-[52px] md:px-10 xl:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[13px] font-semibold transition hover:opacity-100"
            style={{
              color:
                "rgba(255,255,255,.60)",
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to homepage
          </Link>

          <div className="mt-9 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div
                className="flex items-center gap-3 text-[13px] font-semibold"
                style={{
                  color:
                    "rgba(255,255,255,.58)",
                }}
              >
                <span className="h-[2px] w-8 bg-[#e11d48]" />
                Employers
              </div>

              <h1
                className="mt-5 text-[46px] font-bold leading-[1.02] tracking-[-1.8px] sm:text-[56px]"
                style={{
                  color: "#ffffff",
                }}
              >
                Post a job.
              </h1>

              <p
                className="mt-5 max-w-[590px] text-[16px] leading-7"
                style={{
                  color:
                    "rgba(255,255,255,.66)",
                }}
              >
                Create a new vacancy for
                your approved employer
                account.
              </p>
            </div>

            <div
              className="flex items-center gap-3 rounded-[10px] border px-4 py-3"
              style={{
                borderColor:
                  "rgba(255,255,255,.12)",
                backgroundColor:
                  "rgba(255,255,255,.06)",
              }}
            >
              <ShieldCheck
                className="h-[18px] w-[18px]"
                style={{
                  color: "#8ab4ff",
                }}
              />

              <span
                className="text-[13px] font-semibold"
                style={{
                  color:
                    "rgba(255,255,255,.82)",
                }}
              >
                Approved employer account
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}

      <section className="mx-auto max-w-[1440px] px-6 py-[58px] md:px-10 xl:px-12">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_330px]">

          {/* FORM SIDE */}

          <div>
            <div className="mb-6 flex items-center gap-4 rounded-[14px] border border-[#dce2ea] bg-white p-5">
              <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[11px] bg-[#f2f4f7] text-[#344054]">
                <Building2 className="h-[22px] w-[22px]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-[16px] font-semibold text-[#101828]">
                    {verification.company_name}
                  </p>

                  <ShieldCheck className="h-[17px] w-[17px] shrink-0 text-[#175cd3]" />
                </div>

                <p className="mt-1 text-[12px] text-[#667085]">
                  Companies House No.{" "}
                  {verification.company_number}
                </p>
              </div>

              <div className="hidden rounded-full border border-[#dbe7fb] bg-[#f2f7ff] px-3 py-1.5 text-[11px] font-semibold text-[#175cd3] sm:block">
                Approved
              </div>
            </div>

            <div className="rounded-[16px] border border-[#e1e5eb] bg-white p-6 shadow-[0_4px_18px_rgba(16,24,40,.03)] md:p-8">
              <div className="border-b border-[#eaecf0] pb-6">
                <p className="text-[12px] font-semibold text-[#175cd3]">
                  Vacancy details
                </p>

                <h2 className="mt-2 text-[27px] font-bold tracking-[-0.8px] text-[#101828]">
                  Create your listing
                </h2>

                <p className="mt-2 text-[14px] leading-6 text-[#667085]">
                  Enter the information
                  candidates need to review
                  and apply for this role.
                </p>
              </div>

              <div className="pt-2">
                <PostJobForm />
              </div>
            </div>
          </div>

          {/* SIDEBAR */}

          <aside className="space-y-4 lg:sticky lg:top-[105px]">
            <div
              className="rounded-[16px] p-7"
              style={{
                backgroundColor:
                  "#07182d",
              }}
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-[10px]"
                style={{
                  backgroundColor:
                    "rgba(255,255,255,.09)",
                }}
              >
                <BriefcaseBusiness
                  className="h-5 w-5"
                  style={{
                    color: "#ffffff",
                  }}
                />
              </div>

              <p
                className="mt-7 text-[11px] font-bold uppercase tracking-[0.08em]"
                style={{
                  color:
                    "rgba(255,255,255,.44)",
                }}
              >
                Posting account
              </p>

              <h3
                className="mt-2 text-[23px] font-semibold tracking-[-0.5px]"
                style={{
                  color: "#ffffff",
                }}
              >
                {verification.company_name}
              </h3>

              <p
                className="mt-3 text-[13px] leading-6"
                style={{
                  color:
                    "rgba(255,255,255,.60)",
                }}
              >
                This vacancy will be
                published under this
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
                      "rgba(255,255,255,.38)",
                  }}
                >
                  Company number
                </p>

                <p
                  className="mt-1.5 text-[13px] font-semibold"
                  style={{
                    color:
                      "rgba(255,255,255,.76)",
                  }}
                >
                  {verification.company_number}
                </p>
              </div>
            </div>

            <div className="rounded-[16px] border border-[#e4e7ec] bg-white p-6">
              <h3 className="text-[16px] font-semibold text-[#101828]">
                Before publishing
              </h3>

              <p className="mt-2 text-[12px] leading-5 text-[#667085]">
                Review the vacancy details
                before publishing.
              </p>

              <div className="mt-5 border-t border-[#eaecf0] pt-5">
                <CheckItem text="Use a clear job title" />
                <CheckItem text="Enter the correct location" />
                <CheckItem text="Add complete job details" />
                <CheckItem text="Check application information" />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function BlockedPage({
  title,
  text,
  buttonText,
  buttonHref,
}: {
  title: string;
  text: string;
  buttonText: string;
  buttonHref: string;
}) {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-5"
      style={{
        backgroundColor: "#f7f8fa",
      }}
    >
      <div className="w-full max-w-[540px] overflow-hidden rounded-[18px] border border-[#e1e5eb] bg-white shadow-[0_24px_65px_rgba(16,24,40,.10)]">
        <div
          className="h-[6px]"
          style={{
            backgroundColor: "#07182d",
          }}
        />

        <div className="p-8 text-center sm:p-10">
          <div className="mx-auto flex h-[58px] w-[58px] items-center justify-center rounded-[14px] bg-[#f2f4f7] text-[#475467]">
            <LockKeyhole className="h-7 w-7" />
          </div>

          <h1 className="mt-6 text-[28px] font-bold tracking-[-0.8px] text-[#101828]">
            {title}
          </h1>

          <p className="mx-auto mt-3 max-w-[400px] text-[14px] leading-6 text-[#667085]">
            {text}
          </p>

          <Link
            href={buttonHref}
            className="mt-7 inline-flex min-h-[48px] items-center justify-center rounded-[8px] bg-[#07182d] px-6 text-[14px] font-semibold transition hover:bg-[#102a4c]"
            style={{
              color: "#ffffff",
            }}
          >
            {buttonText}
          </Link>

          <Link
            href="/"
            className="mt-4 flex items-center justify-center gap-2 text-[12px] font-semibold text-[#667085] transition hover:text-[#101828]"
          >
            <ArrowLeft className="h-[14px] w-[14px]" />
            Return home
          </Link>
        </div>
      </div>
    </main>
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