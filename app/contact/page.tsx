import Link from "next/link";

import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  HelpCircle,
  Mail,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";

import MainHeader from "@/components/main-header";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <MainHeader />

      {/* HERO */}

      <section className="relative overflow-hidden bg-[#07182d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(23,92,211,0.22),transparent_34%)]" />

        <div className="relative mx-auto max-w-[1280px] px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-[820px]">

            <div className="flex items-center gap-2.5">
              <div className="h-[2px] w-7 bg-[#3b82f6]" />

              <p
                className="text-[12px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "#9ec2ff" }}
              >
                Contact
              </p>
            </div>

            <h1
              className="mt-7 text-[46px] font-bold leading-[1.03] tracking-[-2px] sm:text-[58px] lg:text-[66px]"
              style={{ color: "#ffffff" }}
            >
              How can we help?
            </h1>

            <p
              className="mt-7 max-w-[680px] text-[17px] leading-8"
              style={{
                color: "rgba(255,255,255,.72)",
              }}
            >
              Whether you&apos;re searching for a job,
              managing vacancies or need help with employer
              verification, choose the right route below.
            </p>

          </div>
        </div>
      </section>

      {/* CONTACT ROUTES */}

      <section className="border-b border-[#e4e7ec] bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-20 sm:px-8 lg:px-10 lg:py-24">

          <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">

            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#175cd3]">
                Get support
              </p>

              <h2 className="mt-5 text-[35px] font-bold leading-[1.12] tracking-[-1.3px] text-[#101828] sm:text-[42px]">
                Start with the right place.
              </h2>

              <p className="mt-6 max-w-[440px] text-[15px] leading-7 text-[#667085]">
                Using the correct support route helps make
                it easier to understand what you need help
                with.
              </p>
            </div>

            <div className="grid gap-x-10 gap-y-0 sm:grid-cols-2">

              <ContactRoute
                icon={BriefcaseBusiness}
                title="Job seekers"
                text="Questions about finding jobs, job listings or application routes."
                href="/jobs"
                linkText="Browse jobs"
              />

              <ContactRoute
                icon={Building2}
                title="Employers"
                text="Help with employer accounts, posting vacancies or managing listings."
                href="/employers"
                linkText="Employer information"
              />

              <ContactRoute
                icon={ShieldCheck}
                title="Verification"
                text="Information about company verification and employer posting access."
                href="/employer/verify"
                linkText="Verification"
              />

              <ContactRoute
                icon={HelpCircle}
                title="How UKJobAlert works"
                text="Learn how job discovery, applications and employer verification work."
                href="/how-it-works"
                linkText="How it works"
              />

            </div>
          </div>

        </div>
      </section>

      {/* MESSAGE SECTION */}

      <section className="bg-[#f8fafc]">
        <div className="mx-auto grid max-w-[1280px] gap-14 px-6 py-20 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-24 lg:px-10 lg:py-24">

          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#eef4ff]">
              <MessageSquareText className="h-6 w-6 text-[#175cd3]" />
            </div>

            <p className="mt-7 text-[12px] font-bold uppercase tracking-[0.16em] text-[#175cd3]">
              General enquiries
            </p>

            <h2 className="mt-5 max-w-[560px] text-[35px] font-bold leading-[1.12] tracking-[-1.3px] text-[#101828] sm:text-[42px]">
              Need to contact UKJobAlert directly?
            </h2>

            <p className="mt-6 max-w-[580px] text-[16px] leading-8 text-[#667085]">
              For general platform enquiries, account
              issues, privacy questions or reports about a
              suspicious listing, use the official contact
              details published by UKJobAlert.
            </p>
          </div>

          {/* CONTACT PANEL */}

          <div className="self-start bg-[#07182d] p-8 sm:p-10">

            <Mail
              className="h-7 w-7"
              style={{ color: "#7fb0ff" }}
            />

            <p
              className="mt-7 text-[11px] font-bold uppercase tracking-[0.15em]"
              style={{
                color: "rgba(255,255,255,.45)",
              }}
            >
              Email support
            </p>

            <h3
              className="mt-3 text-[26px] font-bold tracking-[-0.6px]"
              style={{ color: "#ffffff" }}
            >
              Contact UKJobAlert
            </h3>

            <p
              className="mt-4 max-w-[500px] text-[14px] leading-7"
              style={{
                color: "rgba(255,255,255,.65)",
              }}
            >
              We&apos;ll publish the official UKJobAlert
              support email here before the website goes
              live.
            </p>

            <div className="mt-8 border-t border-white/10 pt-7">

              <p
                className="text-[13px] font-semibold"
                style={{ color: "#ffffff" }}
              >
                When contacting support
              </p>

              <div className="mt-5 space-y-4">

                <SupportPoint>
                  Include the email address connected to
                  your account where relevant.
                </SupportPoint>

                <SupportPoint>
                  Employers should include their company
                  name or company number for verification
                  questions.
                </SupportPoint>

                <SupportPoint>
                  For a suspicious vacancy, include the job
                  title and company name.
                </SupportPoint>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SAFETY */}

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-24 lg:px-10 lg:py-24">

          <div>
            <ShieldCheck className="h-8 w-8 text-[#175cd3]" />

            <h2 className="mt-6 text-[34px] font-bold leading-[1.12] tracking-[-1.2px] text-[#101828]">
              Reporting a suspicious job.
            </h2>
          </div>

          <div>
            <p className="max-w-[690px] text-[17px] leading-8 text-[#475467]">
              If a listing appears misleading or
              suspicious, keep the job title, company name
              and any relevant details so the listing can
              be identified.
            </p>

            <div className="mt-8 border-l-2 border-[#175cd3] pl-6">
              <p className="max-w-[650px] text-[14px] leading-7 text-[#667085]">
                If someone claiming to be an employer asks
                you to send money, banking credentials,
                passwords or other unusually sensitive
                information, do not continue solely because
                the vacancy appeared on UKJobAlert.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* LEGAL LINKS */}

      <section className="border-t border-[#e4e7ec] bg-[#f8fafc]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-6 py-14 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">

          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#98a2b3]">
              Legal information
            </p>

            <h2 className="mt-3 text-[23px] font-bold tracking-[-0.5px] text-[#101828]">
              Privacy and platform terms
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">

            <Link
              href="/privacy"
              className="inline-flex min-h-[46px] items-center gap-2 border border-[#d0d5dd] bg-white px-5 text-[13px] font-bold text-[#344054] transition hover:border-[#98a2b3]"
            >
              Privacy Policy
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/terms"
              className="inline-flex min-h-[46px] items-center gap-2 border border-[#d0d5dd] bg-white px-5 text-[13px] font-bold text-[#344054] transition hover:border-[#98a2b3]"
            >
              Terms of Service
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </div>
      </section>
    </main>
  );
}

function ContactRoute({
  icon: Icon,
  title,
  text,
  href,
  linkText,
}: {
  icon: typeof BriefcaseBusiness;
  title: string;
  text: string;
  href: string;
  linkText: string;
}) {
  return (
    <div className="border-t border-[#d0d5dd] py-7">

      <Icon className="h-6 w-6 text-[#175cd3]" />

      <h3 className="mt-6 text-[19px] font-bold tracking-[-0.35px] text-[#101828]">
        {title}
      </h3>

      <p className="mt-3 max-w-[330px] text-[13px] leading-6 text-[#667085]">
        {text}
      </p>

      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-2 text-[13px] font-bold text-[#175cd3] transition hover:text-[#154fb7]"
      >
        {linkText}
        <ArrowRight className="h-4 w-4" />
      </Link>

    </div>
  );
}

function SupportPoint({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#7fb0ff]" />

      <p
        className="text-[12px] leading-6"
        style={{
          color: "rgba(255,255,255,.62)",
        }}
      >
        {children}
      </p>

    </div>
  );
}