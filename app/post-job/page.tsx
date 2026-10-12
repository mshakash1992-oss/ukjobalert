import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import EmployerJobForm from "@/components/EmployerJobForm";

export const metadata = {
  title: "Submit Job | UKJobAlert",
  description:
    "Post a job vacancy on UKJobAlert. Free job posting for verified UK employers.",
};

export default async function PostJobPage() {
  // Check authentication
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login?next=%2Fpost-job");
  }

  // Only employers can post jobs
  const accountType = user.user_metadata?.account_type;

  if (accountType !== "employer") {
    redirect("/account");
  }

  // Check employer verification
  const admin = createAdminClient();

  const { data: verification, error: verificationError } =
    await admin
      .from("employer_verifications")
      .select("company_name,verification_status")
      .eq("user_id", user.id)
      .maybeSingle();

  if (verificationError) {
    throw new Error(
      "Unable to check employer verification. Please try again."
    );
  }

  // Block unverified employers
  if (verification?.verification_status !== "verified") {
    redirect("/employer/verification");
  }

  const companyName =
    verification.company_name ||
    user.user_metadata?.company_name ||
    "Verified Employer";

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <Link
            href="/employer"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#64748b] transition-colors hover:text-[#012169]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Employer Dashboard
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#c8102e]">
                <BriefcaseBusiness className="h-4 w-4" />
                Employer Job Posting
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#012169] sm:text-4xl">
                Submit a Job
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#64748b] sm:text-base">
                Create a professional job listing and connect with
                candidates across the United Kingdom.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#d9e9df] bg-[#f0faf4] px-4 py-3 text-sm font-semibold text-[#17663b]">
              <ShieldCheck className="h-5 w-5" />
              Verified Employer
            </div>
          </div>
        </div>

        {/* Job Form */}
        <EmployerJobForm companyName={companyName} />

        {/* Footer Note */}
        <div className="mt-8 border-t border-[#e2e8f0] pt-6">
          <p className="text-center text-xs leading-6 text-[#64748b]">
            UKJobAlert is a free UK job platform. Only verified
            employers are permitted to publish vacancies.
            All job listings must be genuine and comply with
            applicable UK employment laws.
          </p>
        </div>
      </div>
    </main>
  );
}