import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, Search, ShieldCheck, Users } from "lucide-react";
import AuthMainHeader from "@/components/auth-main-header";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-[#101828]">
      <AuthMainHeader />

      <section className="bg-[#fbfbfa]">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-6 py-14 md:px-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,.9fr)] lg:items-stretch lg:py-20 xl:px-12">
          <div className="flex flex-col justify-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#d71920]">About UKJobAlert</p>
            <h1 className="mt-5 max-w-[800px] text-[44px] font-bold leading-[1.02] tracking-[-2px] text-[#07182d] sm:text-[56px] lg:text-[64px]">Built for a UK job search that feels easier to trust.</h1>
            <p className="mt-6 max-w-[710px] text-[16px] leading-7 text-[#5d6673]">UKJobAlert is a job-discovery platform focused on clear vacancy information, practical employer checks and direct application routes.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/jobs" style={{ color: "#ffffff" }} className="inline-flex min-h-[50px] items-center gap-2 bg-[#07182d] px-6 text-[14px] font-bold text-white">Explore jobs <ArrowRight className="h-4 w-4" /></Link><Link href="/employers" className="inline-flex min-h-[50px] items-center border border-[#cfd5dc] bg-white px-6 text-[14px] font-bold text-[#07182d]">For employers</Link></div>
          </div>
          <div className="relative overflow-hidden bg-[#07182d] p-8 text-white sm:p-10 lg:p-12">
            <div className="absolute right-0 top-0 h-2 w-28 bg-[#d71920]" />
            <p className="text-[11px] font-bold uppercase tracking-[.16em] text-white/40">The principle</p>
            <p className="mt-8 text-[28px] font-bold leading-[1.28] tracking-[-.7px] text-white sm:text-[32px]">Useful job information should be easy to find, easy to understand and connected to a clear way to apply.</p>
            <div className="mt-10 h-px bg-white/10" />
            <p className="mt-6 text-[13px] leading-6 text-white/55">That principle shapes how vacancies are presented and how employer posting access is handled.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dfe3e8] bg-[#f4f6f8]">
        <div className="mx-auto grid max-w-[1360px] gap-12 px-6 py-16 md:px-10 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-20 xl:px-12">
          <div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#d71920]">Why we exist</p><h2 className="mt-4 text-[34px] font-bold leading-[1.08] tracking-[-1.2px] text-[#07182d]">Job hunting already takes effort. The platform should not add confusion.</h2></div>
          <div className="max-w-[760px] space-y-5 text-[16px] leading-8 text-[#5d6673]"><p>People looking for work need the essentials quickly: what the role is, where it is, what kind of work it offers and how to apply.</p><p>Employers need a straightforward way to publish genuine opportunities without turning a vacancy into a marketing page. UKJobAlert is being built around those two needs.</p><p>We prioritise structured job details, employer-account checks and a focused application journey over unnecessary features or distractions.</p></div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1360px] px-6 py-16 md:px-10 lg:py-20 xl:px-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#d71920]">What we focus on</p><h2 className="mt-3 text-[36px] font-bold tracking-[-1.3px] text-[#07182d]">Three things that matter.</h2></div><p className="max-w-[430px] text-[13px] leading-6 text-[#667085]">The platform is designed around useful information rather than decorative features.</p></div>
          <div className="mt-10 grid gap-px bg-[#dfe3e8] lg:grid-cols-3"><Value number="01" icon={Search} title="Clarity" text="Vacancies should make the role, location, job type and application route easy to understand." /><Value number="02" icon={Building2} title="Employer checks" text="Posting access can require company information to pass the platform's verification process." /><Value number="03" icon={ShieldCheck} title="Responsible discovery" text="Verification adds context, while job seekers are still encouraged to assess every opportunity carefully." /></div>
        </div>
      </section>

      <section className="bg-[#07182d]">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-6 py-14 md:px-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-20 lg:py-18 xl:px-12">
          <div><ShieldCheck className="h-7 w-7 text-[#f06b70]" /><p className="mt-5 text-[11px] font-bold uppercase tracking-[.16em] text-[#f06b70]">Employer verification</p><h2 className="mt-3 text-[34px] font-bold leading-[1.08] tracking-[-1.1px] text-white">An extra check before an employer starts posting.</h2></div>
          <div><p className="text-[16px] leading-8 text-white/70">Employer accounts may be asked to provide company information before job-posting access is enabled. Relevant details can be checked against publicly available Companies House information, with some cases requiring additional review.</p><p className="mt-5 text-[13px] leading-7 text-white/50">Verification confirms specified information at the time of the check. It does not constitute an endorsement or guarantee of an employer, vacancy or employment outcome.</p><Link href="/employer/verify" className="mt-7 inline-flex items-center gap-2 text-[13px] font-bold text-[#f06b70]">Read the employer route <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>

      <section className="bg-[#eef1f4]">
        <div className="mx-auto grid max-w-[1360px] gap-px bg-[#dfe3e8] md:grid-cols-2">
          <Audience icon={Users} label="For job seekers" title="A focused place to discover current vacancies." text="Search roles, review the important details and follow the employer's stated application route when the opportunity fits." href="/jobs" linkText="Browse jobs" />
          <Audience icon={BriefcaseBusiness} label="For employers" title="A structured way to publish and manage vacancies." text="Complete the required company checks, create clear listings and manage published jobs through your employer account." href="/employers" linkText="Employer information" />
        </div>
      </section>

      <section className="bg-white"><div className="mx-auto flex max-w-[1360px] flex-col gap-6 px-6 py-12 md:px-10 lg:flex-row lg:items-center lg:justify-between xl:px-12"><div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#d71920]">Current vacancies</p><h2 className="mt-2 text-[30px] font-bold tracking-[-1px] text-[#07182d]">See what employers are hiring for now.</h2></div><Link href="/jobs" style={{ color: "#ffffff" }} className="inline-flex min-h-[50px] items-center gap-2 self-start bg-[#d71920] px-6 text-[14px] font-bold text-white lg:self-auto">Find jobs <ArrowRight className="h-4 w-4" /></Link></div></section>
    </main>
  );
}
function Value({ number, icon: Icon, title, text }: { number: string; icon: typeof Search; title: string; text: string }) { return <div className="bg-white p-7 sm:p-8"><div className="flex items-center justify-between"><Icon className="h-5 w-5 text-[#d71920]" /><span className="text-[10px] font-bold tracking-[.14em] text-[#98a2b3]">{number}</span></div><h3 className="mt-8 text-[20px] font-bold text-[#07182d]">{title}</h3><p className="mt-3 text-[13px] leading-6 text-[#667085]">{text}</p></div>; }
function Audience({ icon: Icon, label, title, text, href, linkText }: { icon: typeof Users; label: string; title: string; text: string; href: string; linkText: string }) { return <div className="bg-[#f4f6f8] p-8 sm:p-10 lg:p-12"><Icon className="h-6 w-6 text-[#d71920]" /><p className="mt-6 text-[10px] font-bold uppercase tracking-[.15em] text-[#d71920]">{label}</p><h3 className="mt-3 max-w-[500px] text-[28px] font-bold leading-[1.15] tracking-[-.8px] text-[#07182d]">{title}</h3><p className="mt-4 max-w-[540px] text-[14px] leading-7 text-[#667085]">{text}</p><Link href={href} className="mt-7 inline-flex items-center gap-2 text-[13px] font-bold text-[#07182d]">{linkText} <ArrowRight className="h-4 w-4" /></Link></div>; }
