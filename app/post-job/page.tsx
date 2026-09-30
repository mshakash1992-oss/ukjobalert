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
    <main className="min-h-screen bg-[#f4f6f8] text-[#101828]">
      <MainHeader loggedIn={true} displayName={displayName} accountType={accountType} isAdmin={isAdmin} />

      <section className="border-b border-[#dfe3e8] bg-white">
        <div className="mx-auto grid max-w-[1360px] gap-8 px-6 py-10 md:px-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end lg:py-14 xl:px-12">
          <div>
            <Link href="/employer/jobs" className="inline-flex items-center gap-2 text-[12px] font-bold text-[#667085] hover:text-[#07182d]"><ArrowLeft className="h-3.5 w-3.5" />Employer dashboard</Link>
            <p className="mt-8 text-[11px] font-bold uppercase tracking-[.18em] text-[#d71920]">Post a vacancy</p>
            <h1 className="mt-4 max-w-[760px] text-[42px] font-bold leading-[1.04] tracking-[-1.7px] text-[#07182d] sm:text-[52px]">Publish a vacancy candidates can understand quickly.</h1>
            <p className="mt-5 max-w-[680px] text-[15px] leading-7 text-[#5d6673]">Add the role, working details and application route. The listing will be published under your approved employer account.</p>
          </div>
          <div className="border-l-4 border-[#0b6b4b] bg-[#eef7f3] p-5">
            <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0b6b4b]" /><div><p className="text-[11px] font-bold uppercase tracking-[.12em] text-[#0b6b4b]">Approved employer</p><p className="mt-2 text-[15px] font-bold text-[#07182d]">{verification.company_name}</p><p className="mt-1 text-[12px] text-[#667085]">Companies House No. {verification.company_number}</p></div></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1360px] px-6 py-10 md:px-10 lg:py-14 xl:px-12">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="border border-[#dfe3e8] bg-white">
            <div className="border-b border-[#dfe3e8] px-6 py-5 sm:px-8"><p className="text-[11px] font-bold uppercase tracking-[.15em] text-[#d71920]">Vacancy details</p><h2 className="mt-2 text-[24px] font-bold text-[#07182d]">Create the job listing</h2><p className="mt-2 text-[13px] leading-6 text-[#667085]">Use specific, accurate information so candidates can judge the role before applying.</p></div>
            <div className="px-6 pb-8 sm:px-8"><PostJobForm /></div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-[104px]">
            <div className="border-t-4 border-[#07182d] bg-white p-6"><BriefcaseBusiness className="h-5 w-5 text-[#07182d]" /><p className="mt-5 text-[10px] font-bold uppercase tracking-[.14em] text-[#98a2b3]">Publishing as</p><h3 className="mt-2 text-[18px] font-bold text-[#07182d]">{verification.company_name}</h3><p className="mt-2 text-[12px] leading-5 text-[#667085]">This company name will be associated with the vacancy.</p></div>
            <div className="border-l-4 border-[#d71920] bg-[#07182d] p-6 text-white"><h3 className="text-[18px] font-bold text-white">Before you publish</h3><p className="mt-2 text-[12px] leading-5 text-white/55">A useful listing should let a candidate understand the opportunity without guessing.</p><div className="mt-5 border-t border-white/10 pt-4"><CheckItem text="Use a specific job title" /><CheckItem text="State the correct location" /><CheckItem text="Explain duties and requirements" /><CheckItem text="Check the application email or URL" /></div></div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function BlockedPage({ title, text, buttonText, buttonHref }: { title: string; text: string; buttonText: string; buttonHref: string }) {
  return <main className="flex min-h-screen items-center justify-center bg-[#f4f6f8] px-5"><div className="w-full max-w-[560px] border border-[#dfe3e8] bg-white"><div className="h-1 bg-[#d71920]" /><div className="p-8 text-center sm:p-10"><div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#dfe3e8] bg-[#f7f8f9] text-[#07182d]"><LockKeyhole className="h-5 w-5" /></div><h1 className="mt-6 text-[28px] font-bold tracking-[-.8px] text-[#07182d]">{title}</h1><p className="mx-auto mt-3 max-w-[420px] text-[14px] leading-6 text-[#667085]">{text}</p><Link href={buttonHref} className="mt-7 inline-flex min-h-[48px] items-center justify-center bg-[#07182d] px-6 text-[14px] font-bold text-white">{buttonText}</Link><Link href="/" className="mt-4 flex items-center justify-center gap-2 text-[12px] font-semibold text-[#667085]"><ArrowLeft className="h-3.5 w-3.5" />Return home</Link></div></div></main>;
}
function CheckItem({ text }: { text: string }) { return <div className="mt-3 flex first:mt-0 items-start gap-2.5"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#f06b70]" /><span className="text-[12px] leading-5 text-white/70">{text}</span></div>; }
