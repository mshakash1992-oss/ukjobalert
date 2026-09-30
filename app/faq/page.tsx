import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, HelpCircle, ShieldCheck } from "lucide-react";

import AuthMainHeader from "@/components/auth-main-header";

const questions = [
  {
    question: "Do I need an account to search for jobs?",
    answer:
      "No. You can browse current vacancies and open job details without creating an account. A job seeker account is useful for saved jobs, job alerts and application tracking.",
  },
  {
    question: "What does employer verification mean?",
    answer:
      "Employer accounts complete the required company-information checks before posting access is enabled. Verification confirms specified information at the time of the check; it is not an endorsement or guarantee of an employer, vacancy or employment outcome.",
  },
  {
    question: "How do I apply for a vacancy?",
    answer:
      "Open the vacancy and use the application route supplied by the employer. Depending on the listing, this may be an email address or an external application website.",
  },
  {
    question: "Can I save jobs for later?",
    answer:
      "Yes. Job seeker accounts can save current vacancies and return to them from the account area while the jobs remain published and open.",
  },
  {
    question: "What are job alerts?",
    answer:
      "Job alerts let signed-in job seekers save search criteria so they can manage the kinds of vacancies they want to follow from their account.",
  },
  {
    question: "Can employers edit or close a job?",
    answer:
      "Yes. Approved employer accounts can manage their own listings, including editing, closing, reopening and deleting jobs from the employer dashboard.",
  },
  {
    question: "Does UKJobAlert charge job seekers to apply?",
    answer:
      "UKJobAlert does not ask job seekers to pay to secure a vacancy. Be cautious of any request for payment that claims it will guarantee a job or application outcome.",
  },
  {
    question: "Where can I see companies that are currently hiring?",
    answer:
      "The Companies page lists employers that currently have published, unexpired vacancies on UKJobAlert. You can open a company to see its current jobs.",
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-[#f5f6f7] text-[#101828]">
      <AuthMainHeader />

      <section className="bg-[#07182d]">
        <div className="mx-auto max-w-[1360px] px-6 py-16 md:px-10 lg:py-20 xl:px-12">
          <div className="max-w-[800px]">
            <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f3b4bc]">
              <span className="h-px w-9 bg-[#d71920]" />
              Help centre
            </div>
            <h1 className="mt-5 font-serif text-[44px] font-semibold leading-[1.02] tracking-[-1.8px] text-white sm:text-[56px] lg:text-[64px]">
              Questions about using UKJobAlert?
            </h1>
            <p className="mt-5 max-w-[680px] text-[16px] leading-7 text-white/65">
              Straightforward answers for job seekers and employers using the platform.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1360px] gap-10 px-6 py-14 md:px-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-18 xl:px-12">
        <div className="border-t border-[#cfd5dc]">
          {questions.map((item, index) => (
            <div key={item.question} className="grid gap-4 border-b border-[#cfd5dc] py-7 sm:grid-cols-[44px_minmax(0,1fr)] sm:gap-5">
              <div className="flex h-10 w-10 items-center justify-center bg-white text-[12px] font-bold text-[#d71920]">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-[#07182d]">{item.question}</h2>
                <p className="mt-3 max-w-[760px] text-[14px] leading-7 text-[#667085]">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-[104px] lg:self-start">
          <div className="border-t-4 border-[#d71920] bg-white p-6">
            <HelpCircle className="h-5 w-5 text-[#07182d]" />
            <h2 className="mt-5 text-[19px] font-bold text-[#07182d]">Still need help?</h2>
            <p className="mt-3 text-[13px] leading-6 text-[#667085]">
              Contact UKJobAlert if your question is about the platform or your account.
            </p>
            <Link href="/contact" className="mt-5 inline-flex items-center gap-2 text-[13px] font-bold text-[#d71920]">
              Contact us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="bg-[#07182d] p-6 text-white">
            <ShieldCheck className="h-5 w-5 text-white/70" />
            <h2 className="mt-5 text-[18px] font-bold text-white">Searching for work?</h2>
            <p className="mt-3 text-[13px] leading-6 text-white/60">
              Browse current vacancies and review the full listing before using the employer&apos;s application route.
            </p>
            <Link href="/jobs" className="mt-5 inline-flex items-center gap-2 text-[13px] font-bold text-white">
              Find jobs <BriefcaseBusiness className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
