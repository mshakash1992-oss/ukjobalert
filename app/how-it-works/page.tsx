import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  FileCheck2,
  Mail,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import MainHeader from "@/components/main-header";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-white">
      <MainHeader />

      {/* HERO */}

      <section className="relative overflow-hidden bg-[#07182d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_16%,rgba(23,92,211,0.22),transparent_34%)]" />

        <div className="relative mx-auto max-w-[1280px] px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-[900px]">

            <div className="flex items-center gap-2.5">
              <div className="h-[2px] w-7 bg-[#3b82f6]" />

              <p
                className="text-[12px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "#9ec2ff" }}
              >
                How it works
              </p>
            </div>

            <h1
              className="mt-7 max-w-[850px] text-[46px] font-bold leading-[1.03] tracking-[-2px] sm:text-[58px] lg:text-[66px]"
              style={{ color: "#ffffff" }}
            >
              Find jobs. Verify employers. Apply clearly.
            </h1>

            <p
              className="mt-7 max-w-[730px] text-[17px] leading-8"
              style={{
                color: "rgba(255,255,255,.72)",
              }}
            >
              UKJobAlert.com keeps the process focused.
              Job seekers can discover vacancies and follow
              clear application routes, while employers
              complete verification before publishing jobs.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">

              <Link
                href="/jobs"
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[8px] bg-[#e4232a] px-6 text-[14px] font-bold text-white transition hover:bg-[#c91d23]"
              >
                Find jobs
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/post-job"
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[8px] border border-white/20 bg-white/[0.06] px-6 text-[14px] font-semibold text-white transition hover:bg-white/[0.1]"
              >
                Post a job
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}

      <section className="border-b border-[#e4e7ec] bg-white">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 lg:px-10 lg:py-20">

          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#175cd3]">
              One platform
            </p>

            <h2 className="mt-5 text-[34px] font-bold leading-[1.12] tracking-[-1.2px] text-[#101828] sm:text-[40px]">
              A simple process for both sides.
            </h2>
          </div>

          <div className="max-w-[700px]">
            <p className="text-[17px] leading-[1.85] text-[#475467]">
              Job seekers and employers use UKJobAlert in
              different ways, but the goal is the same:
              make genuine vacancies easier to publish,
              understand and apply for.
            </p>

            <p className="mt-5 text-[17px] leading-[1.85] text-[#475467]">
              The platform keeps job discovery separate
              from employer verification so each user gets
              a clear path from the moment they arrive.
            </p>
          </div>

        </div>
      </section>

      {/* JOB SEEKERS */}

      <section className="bg-[#f8fafc]">
        <div className="mx-auto max-w-[1280px] px-6 py-20 sm:px-8 lg:px-10 lg:py-24">

          <div className="grid gap-12 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-20">

            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#eef4ff]">
                <UserRound className="h-6 w-6 text-[#175cd3]" />
              </div>

              <p className="mt-7 text-[12px] font-bold uppercase tracking-[0.16em] text-[#175cd3]">
                For job seekers
              </p>

              <h2 className="mt-4 text-[34px] font-bold leading-[1.12] tracking-[-1.1px] text-[#101828]">
                From search to application.
              </h2>

              <p className="mt-5 text-[15px] leading-7 text-[#667085]">
                Browse vacancies and move through the
                application process without unnecessary
                steps.
              </p>

              <Link
                href="/jobs"
                className="mt-8 inline-flex items-center gap-2 text-[14px] font-bold text-[#175cd3] transition hover:text-[#154fb7]"
              >
                Browse current jobs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="border-t border-[#d0d5dd]">

              <ProcessStep
                number="01"
                icon={Search}
                title="Search for a role"
                text="Browse current vacancies and narrow the results using details such as keyword, location, sector and job type."
              />

              <ProcessStep
                number="02"
                icon={FileCheck2}
                title="Review the vacancy"
                text="Open the job listing to review the role, company, location, employment type, salary where provided and closing information."
              />

              <ProcessStep
                number="03"
                icon={ShieldCheck}
                title="Check the employer details"
                text="Where employer verification is shown, it means specified business information has passed the platform's verification process."
              />

              <ProcessStep
                number="04"
                icon={Mail}
                title="Follow the application route"
                text="Apply using the method provided in the vacancy, such as the employer's application email or external application website."
                last
              />

            </div>
          </div>
        </div>
      </section>

      {/* EMPLOYERS */}

      <section className="bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-20 sm:px-8 lg:px-10 lg:py-24">

          <div className="grid gap-12 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-20">

            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#eef4ff]">
                <BriefcaseBusiness className="h-6 w-6 text-[#175cd3]" />
              </div>

              <p className="mt-7 text-[12px] font-bold uppercase tracking-[0.16em] text-[#175cd3]">
                For employers
              </p>

              <h2 className="mt-4 text-[34px] font-bold leading-[1.12] tracking-[-1.1px] text-[#101828]">
                Verify once. Then start posting.
              </h2>

              <p className="mt-5 text-[15px] leading-7 text-[#667085]">
                Employer verification helps us check
                specified company information before job
                posting access is enabled.
              </p>

              <Link
                href="/employer/verify"
                className="mt-8 inline-flex items-center gap-2 text-[14px] font-bold text-[#175cd3] transition hover:text-[#154fb7]"
              >
                Start employer verification
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="border-t border-[#d0d5dd]">

              <ProcessStep
                number="01"
                icon={Building2}
                title="Create an employer account"
                text="Register as an employer so the platform can separate employer tools from job seeker access."
              />

              <ProcessStep
                number="02"
                icon={BadgeCheck}
                title="Complete company verification"
                text="Provide the requested company information. Relevant details may be checked against publicly available Companies House records."
              />

              <ProcessStep
                number="03"
                icon={BriefcaseBusiness}
                title="Create your vacancy"
                text="Add the role title, location, job type, salary where applicable, description and the method candidates should use to apply."
              />

              <ProcessStep
                number="04"
                icon={CheckCircle2}
                title="Publish and manage jobs"
                text="Publish vacancies through your verified account, then edit, close, reopen or remove listings from the employer dashboard."
                last
              />

            </div>
          </div>
        </div>
      </section>

      {/* VERIFICATION EXPLAINER */}

      <section className="bg-[#07182d]">
        <div className="mx-auto grid max-w-[1280px] gap-14 px-6 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 lg:px-10 lg:py-24">

          <div>
            <ShieldCheck
              className="h-8 w-8"
              style={{ color: "#7fb0ff" }}
            />

            <p
              className="mt-7 text-[12px] font-bold uppercase tracking-[0.16em]"
              style={{ color: "#8ab8ff" }}
            >
              Verification explained
            </p>

            <h2
              className="mt-4 max-w-[500px] text-[36px] font-bold leading-[1.1] tracking-[-1.3px] sm:text-[42px]"
              style={{ color: "#ffffff" }}
            >
              What does “Verified Employer” mean?
            </h2>
          </div>

          <div>

            <p
              className="text-[17px] leading-8"
              style={{
                color: "rgba(255,255,255,.72)",
              }}
            >
              A verified employer has provided specified
              company information that passed the
              UKJobAlert verification process at the time
              of the check.
            </p>

            <p
              className="mt-5 text-[17px] leading-8"
              style={{
                color: "rgba(255,255,255,.72)",
              }}
            >
              Verification can include checking relevant
              details against public company records. It is
              designed to add an additional platform check
              before employers publish vacancies.
            </p>

            <div className="mt-9 border-l-2 border-[#3b82f6] pl-6">
              <p
                className="text-[14px] leading-7"
                style={{
                  color: "rgba(255,255,255,.62)",
                }}
              >
                Verification does not guarantee an
                employer, vacancy, employment offer or
                application outcome. Job seekers should
                still assess each opportunity carefully.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK OVERVIEW */}

      <section className="bg-[#f8fafc]">
        <div className="mx-auto max-w-[1280px] px-6 py-20 sm:px-8 lg:px-10 lg:py-24">

          <div className="max-w-[650px]">
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#175cd3]">
              At a glance
            </p>

            <h2 className="mt-5 text-[34px] font-bold leading-[1.12] tracking-[-1.2px] text-[#101828] sm:text-[40px]">
              Two clear routes through UKJobAlert.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">

            <Overview
              icon={UserRound}
              label="Job seeker"
              title="Search → Review → Apply"
              text="Search current vacancies, review the role and employer information, then follow the stated application method."
              href="/jobs"
              linkText="Find jobs"
            />

            <Overview
              icon={Building2}
              label="Employer"
              title="Register → Verify → Publish"
              text="Create an employer account, complete the company verification process and publish vacancies through your dashboard."
              href="/post-job"
              linkText="Post a job"
            />

          </div>
        </div>
      </section>

      {/* SAFETY */}

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24 lg:px-10 lg:py-24">

          <div>
            <ShieldCheck className="h-8 w-8 text-[#175cd3]" />

            <h2 className="mt-6 text-[34px] font-bold leading-[1.12] tracking-[-1.2px] text-[#101828]">
              Apply with care.
            </h2>
          </div>

          <div>

            <p className="max-w-[680px] text-[17px] leading-8 text-[#475467]">
              UKJobAlert provides job and employer
              information to support your search, but you
              should still review each opportunity before
              sharing information or accepting an offer.
            </p>

            <div className="mt-8">
              <SafetyRow>
                Review the company name and vacancy details
                before applying.
              </SafetyRow>

              <SafetyRow>
                Be cautious if someone asks for payment to
                secure a job or interview.
              </SafetyRow>

              <SafetyRow>
                Check external application websites before
                submitting personal or sensitive
                information.
              </SafetyRow>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="bg-[#07182d]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-6 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-20">

          <div className="max-w-[680px]">
            <p
              className="text-[12px] font-bold uppercase tracking-[0.16em]"
              style={{ color: "#8ab8ff" }}
            >
              Ready to start?
            </p>

            <h2
              className="mt-4 text-[34px] font-bold leading-[1.12] tracking-[-1.2px] sm:text-[40px]"
              style={{ color: "#ffffff" }}
            >
              Search current UK opportunities.
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">

            <Link
              href="/jobs"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[8px] bg-[#e4232a] px-7 text-[14px] font-bold text-white transition hover:bg-[#c91d23]"
            >
              Find jobs
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/post-job"
              className="inline-flex min-h-[52px] items-center justify-center rounded-[8px] border border-white/20 bg-white/[0.06] px-7 text-[14px] font-semibold text-white transition hover:bg-white/[0.1]"
            >
              Post a job
            </Link>

          </div>

        </div>
      </section>
    </main>
  );
}

function ProcessStep({
  number,
  icon: Icon,
  title,
  text,
  last = false,
}: {
  number: string;
  icon: typeof Search;
  title: string;
  text: string;
  last?: boolean;
}) {
  return (
    <div
      className={`grid gap-5 py-8 sm:grid-cols-[50px_55px_minmax(0,1fr)] sm:items-start ${
        last ? "" : "border-b border-[#d0d5dd]"
      }`}
    >
      <span className="pt-1 text-[11px] font-bold tracking-[0.12em] text-[#98a2b3]">
        {number}
      </span>

      <div className="flex h-11 w-11 items-center justify-center rounded-[9px] bg-[#eef4ff]">
        <Icon className="h-5 w-5 text-[#175cd3]" />
      </div>

      <div>
        <h3 className="text-[20px] font-bold tracking-[-0.4px] text-[#101828]">
          {title}
        </h3>

        <p className="mt-3 max-w-[620px] text-[14px] leading-7 text-[#667085]">
          {text}
        </p>
      </div>
    </div>
  );
}

function Overview({
  icon: Icon,
  label,
  title,
  text,
  href,
  linkText,
}: {
  icon: typeof UserRound;
  label: string;
  title: string;
  text: string;
  href: string;
  linkText: string;
}) {
  return (
    <div className="border border-[#e4e7ec] bg-white p-8 sm:p-9">

      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-[9px] bg-[#eef4ff]">
          <Icon className="h-5 w-5 text-[#175cd3]" />
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#98a2b3]">
          {label}
        </p>
      </div>

      <h3 className="mt-8 text-[25px] font-bold tracking-[-0.6px] text-[#101828]">
        {title}
      </h3>

      <p className="mt-4 max-w-[520px] text-[14px] leading-7 text-[#667085]">
        {text}
      </p>

      <Link
        href={href}
        className="mt-7 inline-flex items-center gap-2 text-[14px] font-bold text-[#175cd3] transition hover:text-[#154fb7]"
      >
        {linkText}
        <ArrowRight className="h-4 w-4" />
      </Link>

    </div>
  );
}

function SafetyRow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 border-t border-[#e4e7ec] py-5">
      <CheckCircle2 className="mt-[3px] h-[18px] w-[18px] shrink-0 text-[#175cd3]" />

      <p className="text-[14px] leading-6 text-[#475467]">
        {children}
      </p>
    </div>
  );
}