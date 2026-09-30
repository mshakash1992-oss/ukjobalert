import Link from "next/link";

import { redirect } from "next/navigation";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  FileCheck2,
  LockKeyhole,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import MainHeader from "@/components/main-header";

import VerificationForm from "./verification-form";

export default async function EmployerVerificationPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const accountType =
    user.user_metadata?.account_type;

  if (accountType !== "employer") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-5">
        <div className="w-full max-w-[560px] rounded-[8px] border border-[#e1e5eb] bg-white p-8 text-center shadow-[0_8px_24px_rgba(16,24,40,.06)] sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[8px] bg-[#f2f4f7] text-[#344054]">
            <LockKeyhole className="h-6 w-6" />
          </div>

          <p className="mt-7 text-[12px] font-semibold text-[#d71920]">
            Employer verification
          </p>

          <h1 className="mt-2 text-[30px] font-bold tracking-[-1px] text-[#101828]">
            Employer account required
          </h1>

          <p className="mx-auto mt-4 max-w-[420px] text-[14px] leading-7 text-[#667085]">
            Business verification is available only
            to employer accounts.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[8px] bg-[#07182d] px-6 text-[14px] font-semibold transition hover:bg-[#102a4c]"
            style={{ color: "#ffffff" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to homepage
          </Link>
        </div>
      </main>
    );
  }

  const {
    data: existingVerification,
  } = await supabase
    .from("employer_verifications")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

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

  const isAdmin = Boolean(
    user.email &&
      adminEmails.includes(
        user.email.toLowerCase()
      )
  );

  const status =
    existingVerification?.verification_status;

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#101828]">
      <MainHeader
        loggedIn={true}
        displayName={displayName}
        accountType={accountType}
        isAdmin={isAdmin}
      />

      {/* HERO */}

      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: "#07182d",
        }}
      >
        <div
          className="absolute -right-[180px] -top-[330px] h-[720px] w-[720px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(23,92,211,.24) 0%, rgba(23,92,211,0) 68%)",
          }}
        />

        <div className="relative mx-auto max-w-[1440px] px-6 pb-[78px] pt-[54px] md:px-10 xl:px-12">
          <Link
            href="/employer/jobs"
            className="inline-flex items-center gap-2 text-[13px] font-semibold transition hover:opacity-100"
            style={{
              color:
                "rgba(255,255,255,.58)",
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <div className="mt-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <div
                className="flex items-center gap-3 text-[13px] font-semibold"
                style={{
                  color:
                    "rgba(255,255,255,.58)",
                }}
              >
                <span className="h-[2px] w-8 bg-[#d71920]" />

                Employer verification
              </div>

              <h1
                className="mt-5 max-w-[760px] text-[46px] font-bold leading-[1.02] tracking-[-1.8px] sm:text-[56px]"
                style={{
                  color: "#ffffff",
                }}
              >
                Verify your business.
              </h1>

              <p
                className="mt-5 max-w-[680px] text-[16px] leading-7"
                style={{
                  color:
                    "rgba(255,255,255,.65)",
                }}
              >
                Submit your UK company information.
                Company details are checked before
                job posting access is enabled.
              </p>
            </div>

            <StatusBadge status={status} />
          </div>
        </div>
      </section>

      {/* CONTENT */}

      <section className="mx-auto max-w-[1440px] px-6 py-[58px] md:px-10 xl:px-12">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">

          {/* FORM AREA */}

          <div>
            <div className="rounded-[8px] border border-[#e1e5eb] bg-white p-6 shadow-[0_4px_18px_rgba(16,24,40,.03)] md:p-8">
              <div className="border-b border-[#eaecf0] pb-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[#f2f4f7] text-[#344054]">
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-[12px] font-semibold text-[#d71920]">
                      Company information
                    </p>

                    <h2 className="mt-1.5 text-[26px] font-bold tracking-[-0.8px] text-[#101828]">
                      Business verification
                    </h2>

                    <p className="mt-2 max-w-[650px] text-[13px] leading-6 text-[#667085]">
                      Enter the company details requested
                      below. Use the registered information
                      for the business.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-7">
                <VerificationForm
                  userId={user.id}
                  existingVerification={
                    existingVerification
                  }
                />
              </div>
            </div>
          </div>

          {/* SIDEBAR */}

          <aside className="space-y-4 lg:sticky lg:top-[105px]">
            <div
              className="rounded-[8px] p-7 shadow-[0_8px_24px_rgba(16,24,40,.07)]"
              style={{
                backgroundColor: "#07182d",
              }}
            >
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
                    color: "#ffffff",
                  }}
                />
              </div>

              <p
                className="mt-7 text-[11px] font-bold uppercase tracking-[0.08em]"
                style={{
                  color:
                    "rgba(255,255,255,.42)",
                }}
              >
                Employer accounts
              </p>

              <h2
                className="mt-2 text-[24px] font-semibold tracking-[-0.6px]"
                style={{
                  color: "#ffffff",
                }}
              >
                Company check
              </h2>

              <p
                className="mt-3 text-[13px] leading-6"
                style={{
                  color:
                    "rgba(255,255,255,.60)",
                }}
              >
                Company information must be
                checked before an employer can
                publish vacancies.
              </p>

              <div
                className="my-6 h-px"
                style={{
                  backgroundColor:
                    "rgba(255,255,255,.10)",
                }}
              />

              <SidebarPoint
                number="01"
                text="Enter company details"
              />

              <SidebarPoint
                number="02"
                text="Company information checked"
              />

              <SidebarPoint
                number="03"
                text="Posting access enabled"
              />
            </div>

            <div className="rounded-[8px] border border-[#e1e5eb] bg-white p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#f2f4f7] text-[#475467]">
                <SearchCheck className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-[16px] font-semibold text-[#101828]">
                Before submitting
              </h3>

              <div className="mt-5 border-t border-[#eaecf0] pt-5">
                <CheckItem text="Use the registered company name" />
                <CheckItem text="Check the company number" />
                <CheckItem text="Review your contact information" />
              </div>
            </div>

            {status === "verified" && (
              <Link
                href="/post-job"
                className="flex min-h-[50px] items-center justify-center gap-2 rounded-[8px] bg-[#d71920] px-5 text-[13px] font-semibold transition hover:bg-[#b91319]"
                style={{
                  color: "#ffffff",
                }}
              >
                <BriefcaseBusiness className="h-4 w-4" />
                Post a job
              </Link>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

function StatusBadge({
  status,
}: {
  status?: string | null;
}) {
  if (!status) {
    return (
      <div
        className="inline-flex self-start items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-semibold"
        style={{
          borderColor:
            "rgba(255,255,255,.13)",
          backgroundColor:
            "rgba(255,255,255,.06)",
          color:
            "rgba(255,255,255,.70)",
        }}
      >
        <FileCheck2 className="h-4 w-4" />
        Not submitted
      </div>
    );
  }

  if (status === "verified") {
    return (
      <div
        className="inline-flex self-start items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-semibold"
        style={{
          borderColor:
            "rgba(23,178,106,.30)",
          backgroundColor:
            "rgba(23,178,106,.12)",
          color: "#a6f4c5",
        }}
      >
        <CheckCircle2 className="h-4 w-4" />
        Verified employer
      </div>
    );
  }

  return (
    <div
      className="inline-flex self-start items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-semibold capitalize"
      style={{
        borderColor:
          "rgba(255,255,255,.13)",
        backgroundColor:
          "rgba(255,255,255,.06)",
        color:
          "rgba(255,255,255,.72)",
      }}
    >
      <ShieldCheck className="h-4 w-4" />
      {status}
    </div>
  );
}

function SidebarPoint({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div className="mt-4 flex first:mt-0 items-center gap-3">
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
        style={{
          backgroundColor:
            "rgba(255,255,255,.09)",
          color:
            "rgba(255,255,255,.70)",
        }}
      >
        {number}
      </span>

      <span
        className="text-[12px]"
        style={{
          color:
            "rgba(255,255,255,.65)",
        }}
      >
        {text}
      </span>
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