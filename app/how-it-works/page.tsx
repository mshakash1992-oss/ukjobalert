import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, CheckCircle2, FileCheck2, Mail, Search, ShieldCheck, UserRound } from "lucide-react";
import MainHeader from "@/components/main-header";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-white text-[#101828]">
      <MainHeader />

      <section className="border-b border-[#dfe3e8] bg-[#f4f6f8]">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-6 py-14 md:px-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:py-20 xl:px-12">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#d71920]">How UKJobAlert works</p>
            <h1 className="mt-5 max-w-[780px] text-[44px] font-bold leading-[1.02] tracking-[-2px] text-[#07182d] sm:text-[56px] lg:text-[64px]">One clear route from search to application.</h1>
            <p className="mt-6 max-w-[720px] text-[16px] leading-7 text-[#5d6673]">Job seekers can find and review current vacancies. Employers complete the required company checks before publishing. Each side gets a focused path without unnecessary steps.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/jobs" className="inline-flex min-h-[50px] items-center gap-2 bg-[#d71920] px-6 text-[14px] font-bold text-white hover:bg-[#b9151b]">Search jobs <ArrowRight className="h-4 w-4" /></Link><Link href="/post-job" className="inline-flex min-h-[50px] items-center border border-[#cfd5dc] bg-white px-6 text-[14px] font-bold text-[#07182d] hover:bg-[#fafafa]">Post a vacancy</Link></div>
          </div>
          <div className="bg-[#07182d] p-7 text-white sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[.15em] text-white/45">Two routes</p>
            <div className="mt-6 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-1">
              <RouteCard icon={UserRound} label="Job seeker" title="Search → Review → Apply" />
              <RouteCard icon={Building2} label="Employer" title="Register → Verify → Publish" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1360px] px-6 py-16 md:px-10 lg:py-20 xl:px-12">
          <div className="grid gap-12 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-20">
            <div className="lg:sticky lg:top-[110px] lg:self-start">
              <Search className="mb-5 h-8 w-8 text-[#d71920]" strokeWidth={1.8} />
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#d71920]">For job seekers</p>
              <h2 className="mt-3 text-[34px] font-bold leading-[1.08] tracking-[-1.2px] text-[#07182d]">Find the role. Check the details. Choose whether to apply.</h2>
              <Link href="/jobs" className="mt-7 inline-flex items-center gap-2 text-[13px] font-bold text-[#d71920]">Browse current jobs <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="border-t border-[#cfd5dc]">
              <Process number="01" icon={Search} title="Search current vacancies" text="Use a keyword, location, sector or job type to narrow the roles currently available on UKJobAlert." />
              <Process number="02" icon={FileCheck2} title="Read the full listing" text="Review the role, company, location, working pattern, salary where provided and the application information." />
              <Process number="03" icon={ShieldCheck} title="Review employer information" text="Where verification is shown, specified company information has passed the platform's verification process at the time of the check." />
              <Process number="04" icon={Mail} title="Apply through the stated route" text="Use the email address or external application page supplied in the vacancy. Check the destination before sharing personal information." last />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dfe3e8] bg-[#eef1f4]">
        <div className="mx-auto max-w-[1360px] px-6 py-16 md:px-10 lg:py-20 xl:px-12">
          <div className="grid gap-12 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-20">
            <div>
              <BriefcaseBusiness className="mb-5 h-8 w-8 text-[#d71920]" strokeWidth={1.8} />
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#d71920]">For employers</p>
              <h2 className="mt-3 text-[34px] font-bold leading-[1.08] tracking-[-1.2px] text-[#07182d]">Verify the business, then publish and manage vacancies.</h2>
              <Link href="/employer/verify" className="mt-7 inline-flex items-center gap-2 text-[13px] font-bold text-[#d71920]">Start employer verification <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="border-t border-[#cfd5dc]">
              <Process number="01" icon={UserRound} title="Create an employer account" text="Register as an employer so employer tools and job-seeker features remain clearly separated." />
              <Process number="02" icon={Building2} title="Complete company verification" text="Provide the requested company information. Relevant details may be checked against public Companies House records." />
              <Process number="03" icon={BriefcaseBusiness} title="Create the vacancy" text="Add the role title, location, job type, salary where applicable, description and application method." />
              <Process number="04" icon={CheckCircle2} title="Publish and manage" text="Once approved, publish vacancies and use the employer dashboard to edit, close, reopen or remove listings." last />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#07182d]">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-6 py-14 md:px-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20 lg:py-18 xl:px-12">
          <div><ShieldCheck className="mb-5 h-9 w-9 text-[#f06b70]" strokeWidth={1.8} /><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#f06b70]">What verification means</p><h2 className="mt-3 text-[32px] font-bold leading-[1.08] tracking-[-1px] text-white">An additional company-information check before posting.</h2></div>
          <div><p className="text-[16px] leading-8 text-white/70">A verified employer has provided specified company information that passed the UKJobAlert verification process at the time of the check. Relevant details can include information available in public company records.</p><p className="mt-5 border-l-2 border-[#d71920] pl-5 text-[13px] leading-7 text-white/55">Verification does not guarantee an employer, vacancy, offer or employment outcome. Job seekers should still assess each opportunity carefully.</p></div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1360px] gap-12 px-6 py-16 md:px-10 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-20 xl:px-12">
          <div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#d71920]">Apply with care</p><h2 className="mt-4 text-[34px] font-bold leading-[1.08] tracking-[-1.2px] text-[#07182d]">A few checks are always worth making yourself.</h2></div>
          <div className="border-t border-[#cfd5dc]"><Safety text="Read the full vacancy and confirm the company name before applying." /><Safety text="Be cautious if anyone asks for payment to secure a job, interview or offer." /><Safety text="Check external application websites before submitting personal or sensitive information." /></div>
        </div>
      </section>

      <section className="border-t border-[#dfe3e8] bg-[#f4f6f8]"><div className="mx-auto flex max-w-[1360px] flex-col gap-6 px-6 py-12 md:px-10 lg:flex-row lg:items-center lg:justify-between xl:px-12"><div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#d71920]">Start here</p><h2 className="mt-2 text-[30px] font-bold tracking-[-1px] text-[#07182d]">See what is currently hiring across the UK.</h2></div><Link href="/jobs" className="inline-flex min-h-[50px] items-center gap-2 self-start bg-[#07182d] px-6 text-[14px] font-bold text-white lg:self-auto">Find jobs <ArrowRight className="h-4 w-4" /></Link></div></section>
    </main>
  );
}
function RouteCard({ icon: Icon, label, title }: { icon: typeof UserRound; label: string; title: string }) { return <div className="bg-[#0b203a] p-5"><Icon className="mb-4 h-7 w-7 text-[#f06b70]" strokeWidth={1.8} /><p className="text-[10px] font-bold uppercase tracking-[.14em] text-white/40">{label}</p><p className="mt-2 text-[15px] font-bold text-white">{title}</p></div>; }
function Process({ number, icon: Icon, title, text, last=false }: { number: string; icon: typeof Search; title: string; text: string; last?: boolean }) { return <div className={`grid gap-4 py-7 sm:grid-cols-[50px_44px_minmax(0,1fr)] ${last ? "" : "border-b border-[#dfe3e8]"}`}><span className="pt-2 text-[10px] font-bold tracking-[.12em] text-[#d71920]">{number}</span><div className="flex h-10 w-10 items-center justify-center border border-[#cfd5dc] bg-white text-[#07182d]"><Icon className="h-4 w-4" /></div><div><h3 className="text-[18px] font-bold text-[#07182d]">{title}</h3><p className="mt-2 max-w-[680px] text-[13px] leading-6 text-[#667085]">{text}</p></div></div>; }
function Safety({ text }: { text: string }) { return <div className="flex gap-3 border-b border-[#dfe3e8] py-5"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0b6b4b]" /><p className="text-[14px] leading-6 text-[#475467]">{text}</p></div>; }
