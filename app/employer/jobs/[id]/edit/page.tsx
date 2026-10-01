import Link from "next/link";

import {
  notFound,
  redirect,
} from "next/navigation";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Pencil,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import MainHeader from "@/components/main-header";

import EditJobForm from "./edit-job-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditJobPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

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
    redirect("/");
  }

  const admin = createAdminClient();

  const {
    data: verification,
  } = await admin
    .from("employer_verifications")
    .select(`
      company_name,
      company_number,
      verification_status
    `)
    .eq("user_id", user.id)
    .maybeSingle();

  if (
    !verification ||
    verification.verification_status !==
      "verified"
  ) {
    redirect("/employer/verify");
  }

  const {
    data: job,
    error,
  } = await admin
    .from("jobs")
    .select(`
      id,
      employer_id,
      title,
      category,
      job_type,
      location,
      salary,
      description,
      apply_method,
      apply_email,
      apply_url,
      status,
      company_logo_url,
      job_image_url
    `)
    .eq("id", id)
    .maybeSingle();

  if (error || !job) {
    notFound();
  }

  if (
    job.employer_id !==
    user.id
  ) {
    notFound();
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Account";

  const accountType =
    user.user_metadata?.account_type;

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

        <div className="relative mx-auto max-w-[1440px] px-6 pb-[72px] pt-[52px] md:px-10 xl:px-12">
          <Link
            href="/employer/jobs"
            className="inline-flex items-center gap-2 text-[13px] font-semibold transition hover:opacity-100"
            style={{
              color:
                "rgba(255,255,255,.60)",
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to my jobs
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
                <span className="h-[2px] w-8 bg-[#d71920]" />
                Employer dashboard
              </div>

              <h1
                className="mt-5 text-[46px] font-bold leading-[1.02] tracking-[-1.8px] sm:text-[56px]"
                style={{
                  color: "#ffffff",
                }}
              >
                Edit job.
              </h1>

              <p
                className="mt-5 max-w-[600px] text-[16px] leading-7"
                style={{
                  color:
                    "rgba(255,255,255,.66)",
                }}
              >
                Update the vacancy details
                and application information
                for this listing.
              </p>
            </div>

            <div
              className="flex items-center gap-3 rounded-[8px] border px-4 py-3"
              style={{
                borderColor:
                  "rgba(255,255,255,.12)",
                backgroundColor:
                  "rgba(255,255,255,.06)",
              }}
            >
              <Pencil
                className="h-[17px] w-[17px]"
                style={{
                  color: "#f3b4bc",
                }}
              />

              <span
                className="max-w-[250px] truncate text-[13px] font-semibold"
                style={{
                  color:
                    "rgba(255,255,255,.82)",
                }}
              >
                {job.title}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}

      <section className="mx-auto max-w-[1440px] px-6 py-[58px] md:px-10 xl:px-12">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_330px]">

          {/* FORM */}

          <div>
            <div className="mb-6 flex items-center gap-4 rounded-[8px] border border-[#dce2ea] bg-white p-5">
              <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[8px] bg-[#f2f4f7] text-[#344054]">
                <Building2 className="h-[22px] w-[22px]" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-[16px] font-semibold text-[#101828]">
                    {verification.company_name}
                  </p>

                  <ShieldCheck className="h-[17px] w-[17px] shrink-0 text-[#d71920]" />
                </div>

                <p className="mt-1 text-[12px] text-[#667085]">
                  Companies House No.{" "}
                  {verification.company_number}
                </p>
              </div>

              <div className="hidden rounded-full border border-[#f1d2d4] bg-[#fff7f6] px-3 py-1.5 text-[11px] font-semibold text-[#d71920] sm:block">
                Approved
              </div>
            </div>

            <div className="rounded-[8px] border border-[#e1e5eb] bg-white p-6 shadow-[0_4px_18px_rgba(16,24,40,.03)] md:p-8">
              <div className="border-b border-[#eaecf0] pb-6">
                <p className="text-[12px] font-semibold text-[#d71920]">
                  Vacancy details
                </p>

                <h2 className="mt-2 text-[27px] font-bold tracking-[-0.8px] text-[#101828]">
                  Edit your listing
                </h2>

                <p className="mt-2 text-[14px] leading-6 text-[#667085]">
                  Make changes to the
                  vacancy and save the
                  updated information.
                </p>
              </div>

              <div className="pt-2">
                <EditJobForm
                  job={{
                    id: job.id,

                    title:
                      job.title,

                    category:
                      job.category,

                    jobType:
                      job.job_type,

                    location:
                      job.location,

                    salary:
                      job.salary || "",

                    description:
                      job.description,

                    applyMethod:
                      job.apply_method,

                    applyEmail:
                      job.apply_email || "",

                    applyUrl:
                      job.apply_url || "",

                    status:
                      job.status,

                    companyLogoUrl:
                      job.company_logo_url || null,

                    jobImageUrl:
                      job.job_image_url || null,
                  }}
                />
              </div>
            </div>
          </div>

          {/* SIDEBAR */}

          <aside className="space-y-4 lg:sticky lg:top-[105px]">
            <div
              className="rounded-[8px] p-7 shadow-[0_24px_55px_rgba(7,24,45,.12)]"
              style={{
                backgroundColor:
                  "#07182d",
              }}
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-[8px]"
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
                Current listing
              </p>

              <h3
                className="mt-2 text-[22px] font-semibold leading-[1.2] tracking-[-0.5px]"
                style={{
                  color: "#ffffff",
                }}
              >
                {job.title}
              </h3>

              <p
                className="mt-3 text-[13px] leading-6"
                style={{
                  color:
                    "rgba(255,255,255,.60)",
                }}
              >
                {verification.company_name}
              </p>

              <div
                className="my-6 h-px"
                style={{
                  backgroundColor:
                    "rgba(255,255,255,.10)",
                }}
              />

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.08em]"
                    style={{
                      color:
                        "rgba(255,255,255,.38)",
                    }}
                  >
                    Status
                  </p>

                  <p
                    className="mt-1.5 text-[13px] font-semibold capitalize"
                    style={{
                      color:
                        "rgba(255,255,255,.78)",
                    }}
                  >
                    {job.status}
                  </p>
                </div>

                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor:
                      job.status ===
                      "published"
                        ? "#17b26a"
                        : "#98a2b3",
                  }}
                />
              </div>
            </div>

            <div className="rounded-[8px] border border-[#e4e7ec] bg-white p-6">
              <h3 className="text-[16px] font-semibold text-[#101828]">
                Before saving
              </h3>

              <p className="mt-2 text-[12px] leading-5 text-[#667085]">
                Review any information you
                changed before saving the
                listing.
              </p>

              <div className="mt-5 border-t border-[#eaecf0] pt-5">
                <CheckItem text="Check the job title" />
                <CheckItem text="Confirm location and job type" />
                <CheckItem text="Review the job description" />
                <CheckItem text="Confirm application details" />
              </div>
            </div>

            <Link
              href="/employer/jobs"
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-[8px] border border-[#d0d5dd] bg-white px-5 text-[13px] font-semibold text-[#344054] transition hover:bg-[#f9fafb]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to my jobs
            </Link>
          </aside>
        </div>
      </section>
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
      <CheckCircle2 className="mt-[1px] h-[16px] w-[16px] shrink-0 text-[#d71920]" />

      <span className="text-[12px] leading-5 text-[#667085]">
        {text}
      </span>
    </div>
  );
}