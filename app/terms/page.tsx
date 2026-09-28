import Link from "next/link";

import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  Check,
  FileText,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import MainHeader from "@/components/main-header";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <MainHeader />

      {/* HERO */}

      <section className="relative overflow-hidden bg-[#07182d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_10%,rgba(23,92,211,0.18),transparent_32%)]" />

        <div className="relative mx-auto max-w-[1280px] px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-[860px]">
            <div className="flex items-center gap-2.5">
              <div className="h-[2px] w-7 bg-[#3b82f6]" />

              <p
                className="text-[12px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "#9ec2ff" }}
              >
                Legal information
              </p>
            </div>

            <h1
              className="mt-7 text-[48px] font-bold leading-[1.02] tracking-[-2.2px] sm:text-[58px] lg:text-[68px]"
              style={{ color: "#ffffff" }}
            >
              Terms of Service
            </h1>

            <p
              className="mt-6 max-w-[720px] text-[17px] leading-8"
              style={{
                color: "rgba(255,255,255,.72)",
              }}
            >
              The terms that govern access to and use of
              UKJobAlert.com by job seekers, employers and
              other visitors.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-6">
              <p
                className="text-[13px]"
                style={{
                  color: "rgba(255,255,255,.55)",
                }}
              >
                Effective 27 September 2026
              </p>

              <p
                className="text-[13px]"
                style={{
                  color: "rgba(255,255,255,.55)",
                }}
              >
                UKJobAlert.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DOCUMENT */}

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1280px] gap-14 px-6 py-16 sm:px-8 lg:grid-cols-[minmax(0,820px)_280px] lg:justify-between lg:px-10 lg:py-20">

          {/* MAIN */}

          <article className="min-w-0">

            {/* INTRO */}

            <div className="border-b border-[#e4e7ec] pb-12">
              <p className="text-[18px] font-medium leading-8 tracking-[-0.15px] text-[#344054]">
                Please read these Terms of Service carefully
                before using UKJobAlert.com. By accessing or
                using the platform, you agree to comply with
                these terms.
              </p>
            </div>

            <LegalSection
              number="01"
              title="About UKJobAlert.com"
            >
              <p>
                UKJobAlert.com is an online job platform
                designed to help job seekers discover job
                opportunities and allow employers to publish
                vacancies.
              </p>

              <p>
                By accessing or using UKJobAlert.com, you
                agree to these Terms of Service. If you do
                not agree with these terms, you should not
                use the platform.
              </p>
            </LegalSection>

            <LegalSection
              number="02"
              title="User accounts"
            >
              <p>
                Some features require you to create an
                account. You are responsible for providing
                accurate information and keeping your
                account credentials secure.
              </p>

              <p>
                You must not share your password with
                another person or use another user&apos;s
                account without permission.
              </p>

              <p>
                You are responsible for activity carried out
                through your account unless you notify us of
                suspected unauthorized access.
              </p>
            </LegalSection>

            <LegalSection
              number="03"
              title="Job seeker accounts"
            >
              <p>
                Job seekers may use the platform to browse
                vacancies and access application information
                provided by employers.
              </p>

              <p>
                UKJobAlert.com does not guarantee that an
                application will result in an interview, job
                offer, employment, sponsorship, or any other
                particular outcome.
              </p>
            </LegalSection>

            <LegalSection
              number="04"
              title="Employer accounts and verification"
            >
              <p>
                Employers may be required to complete
                business verification before being allowed
                to publish vacancies.
              </p>

              <p>
                Verification may include checking company
                information against publicly available
                records, including information provided by
                Companies House where applicable.
              </p>

              <p>
                Verification confirms only that specified
                business information passed our verification
                process at the time of the check. It does not
                constitute an endorsement, guarantee, or
                certification of an employer.
              </p>
            </LegalSection>

            <LegalSection
              number="05"
              title="Job listings"
            >
              <p>
                Employers are responsible for ensuring their
                job listings are accurate, lawful, current,
                and not misleading.
              </p>

              <p>
                Job listings must not contain fraudulent
                opportunities, unlawful discrimination,
                misleading salary information, deceptive
                application instructions, or requests for
                unlawful payments.
              </p>

              <p>
                We may remove, close, restrict, or review a
                listing where we reasonably believe it
                violates these terms or may create a risk to
                users or the platform.
              </p>
            </LegalSection>

            <LegalSection
              number="06"
              title="Prohibited use"
            >
              <p>
                You must not use UKJobAlert.com to:
              </p>

              <ul className="mt-6 space-y-4">
                <RuleItem>
                  Publish false, fraudulent, misleading, or
                  unlawful job opportunities.
                </RuleItem>

                <RuleItem>
                  Impersonate another person, employer, or
                  organization.
                </RuleItem>

                <RuleItem>
                  Attempt to gain unauthorized access to
                  accounts, systems, or data.
                </RuleItem>

                <RuleItem>
                  Upload malicious code or intentionally
                  interfere with the operation or security
                  of the platform.
                </RuleItem>

                <RuleItem>
                  Collect or misuse personal information in
                  violation of applicable law.
                </RuleItem>
              </ul>
            </LegalSection>

            <LegalSection
              number="07"
              title="Applications and third-party websites"
            >
              <p>
                Some vacancies may direct users to an
                employer&apos;s email address or external
                website to complete an application.
              </p>

              <p>
                External websites and services are operated
                independently from UKJobAlert.com. Their
                content, security, availability, and privacy
                practices are governed by their own terms
                and policies.
              </p>
            </LegalSection>

            <LegalSection
              number="08"
              title="No employment guarantee"
            >
              <p>
                UKJobAlert.com provides a platform for
                connecting job seekers with employment
                opportunities. We are not a party to an
                employment agreement between a job seeker
                and an employer unless expressly stated
                otherwise.
              </p>

              <p>
                Users should independently assess job
                opportunities, employers, application
                requests, and employment terms before making
                decisions.
              </p>
            </LegalSection>

            <LegalSection
              number="09"
              title="Account restriction and termination"
            >
              <p>
                We may suspend, restrict, or terminate
                access to the platform where reasonably
                necessary to protect users, enforce these
                terms, comply with legal obligations, or
                protect the security and integrity of
                UKJobAlert.com.
              </p>
            </LegalSection>

            <LegalSection
              number="10"
              title="Platform availability"
            >
              <p>
                We aim to keep UKJobAlert.com available and
                reliable, but we do not guarantee
                uninterrupted or error-free access.
              </p>

              <p>
                Features may occasionally be changed,
                suspended, or unavailable due to
                maintenance, security, technical issues, or
                other operational reasons.
              </p>
            </LegalSection>

            <LegalSection
              number="11"
              title="Intellectual property"
            >
              <p>
                The UKJobAlert.com name, website design,
                branding, original content, and software are
                protected by applicable intellectual
                property laws.
              </p>

              <p>
                Users retain responsibility for content they
                submit and must have the necessary rights to
                publish that content.
              </p>
            </LegalSection>

            <LegalSection
              number="12"
              title="Changes to these terms"
            >
              <p>
                We may update these Terms of Service when
                the platform, our practices, or applicable
                requirements change.
              </p>

              <p>
                The latest version will be published on this
                page with an updated revision date.
              </p>
            </LegalSection>

            <LegalSection
              number="13"
              title="Contact"
              last
            >
              <p>
                If you have questions about these Terms of
                Service, you can contact UKJobAlert.com
                through the contact details published on the
                website.
              </p>
            </LegalSection>

          </article>

          {/* RIGHT SIDE */}

          <aside className="lg:sticky lg:top-[96px] lg:self-start">

            <div className="border-t-[3px] border-[#175cd3] bg-[#f8fafc] px-6 py-7">
              <FileText className="h-6 w-6 text-[#175cd3]" />

              <h2 className="mt-5 text-[18px] font-bold tracking-[-0.3px] text-[#101828]">
                Terms at a glance
              </h2>

              <p className="mt-3 text-[13px] leading-6 text-[#667085]">
                The platform is intended to connect job
                seekers with employers while maintaining
                clear responsibilities for both sides.
              </p>

              <div className="mt-7 space-y-6">
                <SummaryItem
                  icon={BriefcaseBusiness}
                  title="Job seekers"
                  text="Review vacancies and application requests carefully."
                />

                <SummaryItem
                  icon={Building2}
                  title="Employers"
                  text="Provide accurate business information and lawful job listings."
                />

                <SummaryItem
                  icon={ShieldCheck}
                  title="Verification"
                  text="Verification is a platform check, not an endorsement."
                />
              </div>
            </div>

            <div className="mt-8 border-t border-[#e4e7ec] pt-7">
              <div className="flex items-start gap-3">
                <TriangleAlert className="mt-[2px] h-[19px] w-[19px] shrink-0 text-[#b54708]" />

                <div>
                  <h3 className="text-[14px] font-bold text-[#101828]">
                    Job safety
                  </h3>

                  <p className="mt-2 text-[12px] leading-5 text-[#667085]">
                    Be cautious if a job opportunity asks
                    for money, unnecessary financial
                    information, or unusual payments.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-[#e4e7ec] pt-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#98a2b3]">
                Related document
              </p>

              <Link
                href="/privacy"
                className="mt-4 flex items-center justify-between gap-4 text-[14px] font-semibold text-[#101828] transition hover:text-[#175cd3]"
              >
                Privacy Policy
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <Link
              href="/"
              className="mt-10 flex items-center gap-2 text-[13px] font-semibold text-[#667085] transition hover:text-[#101828]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to homepage
            </Link>

          </aside>
        </div>
      </section>
    </main>
  );
}

function LegalSection({
  number,
  title,
  children,
  last = false,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <section
      className={
        last
          ? "pt-12"
          : "border-b border-[#e4e7ec] py-12"
      }
    >
      <div className="flex items-baseline gap-4">
        <span className="text-[12px] font-bold tracking-[0.08em] text-[#175cd3]">
          {number}
        </span>

        <h2 className="text-[25px] font-bold leading-[1.25] tracking-[-0.55px] text-[#101828] sm:text-[27px]">
          {title}
        </h2>
      </div>

      <div className="ml-0 mt-6 space-y-5 text-[16px] leading-[1.85] tracking-[-0.05px] text-[#475467] sm:ml-[42px]">
        {children}
      </div>
    </section>
  );
}

function RuleItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-[5px] flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-[#eef4ff]">
        <Check className="h-[12px] w-[12px] text-[#175cd3]" />
      </div>

      <span>{children}</span>
    </li>
  );
}

function SummaryItem({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof BriefcaseBusiness;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <Icon className="mt-[2px] h-[18px] w-[18px] shrink-0 text-[#175cd3]" />

      <div>
        <p className="text-[13px] font-bold text-[#101828]">
          {title}
        </p>

        <p className="mt-1.5 text-[12px] leading-5 text-[#667085]">
          {text}
        </p>
      </div>
    </div>
  );
}