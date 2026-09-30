import Link from "next/link";
import { ArrowRight, BadgeCheck, BarChart3, BriefcaseBusiness, Building2, Check, FilePenLine, ShieldCheck } from "lucide-react";
import AuthMainHeader from "@/components/auth-main-header";

export default function EmployersPage() {
  return (
    <main className="min-h-screen bg-[#f5f6f7] text-[#101828]">
      <AuthMainHeader />

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1360px] lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,.8fr)]">
          <div className="px-6 py-14 md:px-10 lg:py-20 xl:px-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#d71920]">For UK employers</p>
            <h1 className="mt-5 max-w-[760px] text-[44px] font-bold leading-[1.02] tracking-[-2px] text-[#07182d] sm:text-[56px] lg:text-[64px]">
              Hire with clearer listings and a more credible employer profile.
            </h1>
            <p className="mt-6 max-w-[690px] text-[16px] leading-7 text-[#5d6673]">
              Complete the required company checks, publish structured vacancies and manage live roles from one employer account. Candidates get the details they need without unnecessary noise.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/post-job" className="inline-flex min-h-[50px] items-center gap-2 bg-[#d71920] px-6 text-[14px] font-bold text-white hover:bg-[#b9151b]">Post a vacancy <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/employer/verify" className="inline-flex min-h-[50px] items-center border border-[#cfd5dc] bg-white px-6 text-[14px] font-bold text-[#07182d] hover:bg-[#f7f8f9]">Verify your company</Link>
            </div>
          </div>

          <div className="relative bg-[#07182d] px-7 py-12 text-white sm:px-10 lg:flex lg:items-center lg:px-12">
            <div className="absolute left-0 top-0 h-full w-1 bg-[#d71920]" />
            <div className="w-full">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">Employer route</p>
              <h2 className="mt-3 text-[28px] font-bold tracking-[-.8px] text-white">From company check to live vacancy.</h2>
              <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
                <RouteStep number="01" title="Verify" text="Provide the requested company information." />
                <RouteStep number="02" title="Publish" text="Create a vacancy with clear role and application details." />
                <RouteStep number="03" title="Manage" text="Edit, close or reopen jobs from your employer account." />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dfe3e8] bg-[#f5f6f7]">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-6 py-14 md:px-10 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-20 lg:py-18 xl:px-12">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d71920]">A practical employer workspace</p>
            <h2 className="mt-4 text-[34px] font-bold leading-[1.08] tracking-[-1.2px] text-[#07182d]">Less admin around the listing. More clarity in the listing.</h2>
          </div>
          <div className="grid gap-px bg-[#dfe3e8] sm:grid-cols-2">
            <Feature icon={BadgeCheck} title="Company checks" text="Complete the required verification before posting access is enabled." />
            <Feature icon={FilePenLine} title="Structured vacancies" text="Present role, location, job type, salary and application details consistently." />
            <Feature icon={BarChart3} title="Application activity" text="Review the application-click activity recorded for your published vacancies." />
            <Feature icon={BriefcaseBusiness} title="Listing controls" text="Edit, close, reopen or remove jobs from the employer dashboard." />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1360px] gap-12 px-6 py-16 md:px-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start lg:gap-20 lg:py-20 xl:px-12">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d71920]">Company verification</p>
            <h2 className="mt-4 max-w-[720px] text-[38px] font-bold leading-[1.08] tracking-[-1.4px] text-[#07182d]">A business check before posting access.</h2>
            <p className="mt-6 max-w-[720px] text-[16px] leading-8 text-[#5d6673]">
              Employer accounts may be asked for company information before they can publish. Relevant details can be checked against publicly available Companies House information, and some cases may require manual review.
            </p>
            <p className="mt-4 max-w-[720px] text-[14px] leading-7 text-[#667085]">
              Verification confirms specified information at the time of the check. It is not an endorsement or guarantee of an employer, vacancy or employment outcome.
            </p>
            <Link href="/employer/verify" className="mt-7 inline-flex items-center gap-2 text-[13px] font-bold text-[#d71920]">Start company verification <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="border-t-4 border-[#d71920] bg-[#07182d] p-7 text-white sm:p-8">
            <ShieldCheck className="h-6 w-6 text-white/75" />
            <h3 className="mt-5 text-[22px] font-bold text-white">What the process checks</h3>
            <div className="mt-6 space-y-0 border-t border-white/10">
              <CheckRow text="Employer account details" />
              <CheckRow text="Company information provided" />
              <CheckRow text="Relevant public company records" />
              <CheckRow text="Whether posting access can be enabled" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eef1f4]">
        <div className="mx-auto max-w-[1360px] px-6 py-16 md:px-10 lg:py-20 xl:px-12">
          <div className="grid gap-12 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-20">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d71920]">A better vacancy</p>
              <h2 className="mt-4 text-[34px] font-bold leading-[1.08] tracking-[-1.2px] text-[#07182d]">Give candidates enough information to make a decision.</h2>
            </div>
            <div className="grid border-t border-[#cfd5dc] sm:grid-cols-2">
              {["Job title", "Location", "Job type", "Sector", "Salary where provided", "Role description", "Application email or URL", "Closing period"].map((item) => (
                <div key={item} className="flex items-center gap-3 border-b border-[#cfd5dc] py-5 sm:odd:pr-8 sm:even:pl-8"><Check className="h-4 w-4 shrink-0 text-[#d71920]" /><span className="text-[14px] font-semibold text-[#344054]">{item}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#07182d]">
        <div className="mx-auto flex max-w-[1360px] flex-col gap-7 px-6 py-12 md:px-10 lg:flex-row lg:items-center lg:justify-between xl:px-12">
          <div className="max-w-[720px]">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#f06b70]">Ready to recruit?</p>
            <h2 className="mt-3 text-[30px] font-bold tracking-[-1px] text-white sm:text-[36px]">Create a vacancy candidates can understand quickly.</h2>
          </div>
          <Link href="/post-job" className="inline-flex min-h-[50px] shrink-0 items-center gap-2 self-start bg-[#d71920] px-6 text-[14px] font-bold text-white hover:bg-[#b9151b] lg:self-auto">Post a vacancy <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </main>
  );
}

function RouteStep({ number, title, text }: { number: string; title: string; text: string }) {
  return <div className="grid grid-cols-[44px_90px_1fr] gap-3 py-5"><span className="text-[10px] font-bold tracking-[.12em] text-[#f06b70]">{number}</span><span className="text-[13px] font-bold text-white">{title}</span><span className="text-[12px] leading-5 text-white/55">{text}</span></div>;
}
function Feature({ icon: Icon, title, text }: { icon: typeof BadgeCheck; title: string; text: string }) {
  return <div className="bg-white p-7"><Icon className="h-5 w-5 text-[#d71920]" /><h3 className="mt-5 text-[18px] font-bold text-[#07182d]">{title}</h3><p className="mt-3 text-[13px] leading-6 text-[#667085]">{text}</p></div>;
}
function CheckRow({ text }: { text: string }) {
  return <div className="flex items-center gap-3 border-b border-white/10 py-4"><span className="flex h-6 w-6 items-center justify-center border border-white/20 text-[#f06b70]"><Check className="h-3.5 w-3.5" /></span><span className="text-[13px] font-semibold text-white/75">{text}</span></div>;
}
