import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import MainHeader from "@/components/main-header";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <MainHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#07182d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(23,92,211,0.22),transparent_34%)]" />

        <div className="relative mx-auto max-w-[1280px] px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="max-w-[920px]">
            <div className="flex items-center gap-2.5">
              <div className="h-[2px] w-7 bg-[#3b82f6]" />

              <p
                className="text-[12px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "#9ec2ff" }}
              >
                About UKJobAlert
              </p>
            </div>

            <h1
              className="mt-7 max-w-[850px] text-[46px] font-bold leading-[1.03] tracking-[-2px] sm:text-[58px] lg:text-[68px]"
              style={{ color: "#ffffff" }}
            >
              A clearer way to find jobs across the UK.
            </h1>

            <p
              className="mt-7 max-w-[720px] text-[17px] leading-8"
              style={{
                color: "rgba(255,255,255,.72)",
              }}
            >
              UKJobAlert.com is built to make job discovery simpler while
              giving employers a professional place to publish genuine
              opportunities.
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
                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-[8px] border px-6 text-[14px] font-semibold transition hover:bg-white/[0.12]"
                style={{
                  color: "#ffffff",
                  borderColor: "rgba(255,255,255,0.35)",
                  backgroundColor: "rgba(255,255,255,0.06)",
                }}
              >
                Post a job
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="border-b border-[#e4e7ec] bg-white">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 lg:px-10 lg:py-24">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#175cd3]">
              Why we exist
            </p>

            <h2 className="mt-5 text-[34px] font-bold leading-[1.12] tracking-[-1.3px] text-[#101828] sm:text-[40px]">
              Job searching should feel straightforward.
            </h2>
          </div>

          <div className="max-w-[700px] space-y-6 text-[17px] leading-[1.85] text-[#475467]">
            <p>
              Finding a job can already take time. Job seekers should not also
              have to navigate unclear listings, confusing application routes
              or uncertainty about who published a vacancy.
            </p>

            <p>
              UKJobAlert.com is being built around a simple principle: make
              useful UK vacancies easier to discover and give legitimate
              employers a clear, structured way to reach candidates.
            </p>

            <p>
              That means focusing on useful job information, employer checks
              and direct application routes instead of unnecessary
              distractions.
            </p>
          </div>
        </div>
      </section>

      {/* CORE PRINCIPLES */}
      <section className="bg-[#f8fafc]">
        <div className="mx-auto max-w-[1280px] px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-[650px]">
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#175cd3]">
              Our approach
            </p>

            <h2 className="mt-5 text-[34px] font-bold leading-[1.12] tracking-[-1.2px] text-[#101828] sm:text-[40px]">
              Built around trust, clarity and useful job information.
            </h2>
          </div>

          <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            <Principle
              number="01"
              icon={Search}
              title="Clear job discovery"
              text="Search and browse vacancies with the information that matters — role, location, job type, salary where provided and a clear route to apply."
            />

            <Principle
              number="02"
              icon={BadgeCheck}
              title="Employer checks"
              text="Employers may be required to complete company verification before publishing vacancies on UKJobAlert."
            />

            <Principle
              number="03"
              icon={ShieldCheck}
              title="Platform integrity"
              text="Verification and moderation controls are designed to reduce misuse and help maintain a more dependable job platform."
            />
          </div>
        </div>
      </section>

      {/* VERIFICATION */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1280px] items-center gap-14 px-6 py-20 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:gap-24 lg:px-10 lg:py-28">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#eef4ff]">
              <Building2 className="h-6 w-6 text-[#175cd3]" />
            </div>

            <p className="mt-8 text-[12px] font-bold uppercase tracking-[0.16em] text-[#175cd3]">
              Employer verification
            </p>

            <h2 className="mt-5 max-w-[650px] text-[36px] font-bold leading-[1.1] tracking-[-1.4px] text-[#101828] sm:text-[44px]">
              An extra check before employers start posting.
            </h2>

            <p className="mt-7 max-w-[670px] text-[16px] leading-8 text-[#475467]">
              Employer accounts may be asked to provide company information
              before gaining access to job posting. Where applicable, company
              details can be checked against publicly available Companies House
              records.
            </p>

            <p className="mt-5 max-w-[670px] text-[16px] leading-8 text-[#475467]">
              Verification is one part of our platform controls. It helps
              confirm specified business information, but it is not an
              endorsement or guarantee of an employer or vacancy.
            </p>

            <Link
              href="/employer/verify"
              className="mt-8 inline-flex items-center gap-2 text-[14px] font-bold text-[#175cd3] transition hover:text-[#154fb7]"
            >
              Employer verification
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* VERIFICATION PANEL */}
          <div className="bg-[#07182d] p-8 sm:p-10">
            <div className="flex items-center justify-between border-b border-white/10 pb-7">
              <div>
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.15em]"
                  style={{
                    color: "rgba(255,255,255,.48)",
                  }}
                >
                  Employer check
                </p>

                <h3
                  className="mt-2 text-[22px] font-bold tracking-[-0.5px]"
                  style={{ color: "#ffffff" }}
                >
                  Before a job goes live
                </h3>
              </div>

              <ShieldCheck
                className="h-7 w-7"
                style={{ color: "#7fb0ff" }}
              />
            </div>

            <div className="mt-8 space-y-7">
              <VerificationStep
                number="1"
                title="Company details"
                text="The employer provides its company information."
              />

              <VerificationStep
                number="2"
                title="Company check"
                text="Relevant details may be checked against public company records."
              />

              <VerificationStep
                number="3"
                title="Posting access"
                text="Approved employers can publish vacancies through their account."
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOR BOTH SIDES */}
      <section className="border-y border-[#e4e7ec] bg-[#f8fafc]">
        <div className="mx-auto max-w-[1280px] px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <AudienceBlock
              icon={Users}
              eyebrow="For job seekers"
              title="Find opportunities without unnecessary noise."
              text="Browse current vacancies, understand the key details and follow the employer's application route when a role fits what you're looking for."
              items={[
                "Search jobs across the UK",
                "See important vacancy details clearly",
                "Apply using the employer's stated method",
              ]}
              link="/jobs"
              linkText="Browse jobs"
            />

            <AudienceBlock
              icon={BriefcaseBusiness}
              eyebrow="For employers"
              title="A focused place to reach UK job seekers."
              text="Verified employers can create structured job listings, manage published vacancies and give candidates a direct way to apply."
              items={[
                "Complete employer verification",
                "Publish and manage job listings",
                "Track application activity",
              ]}
              link="/post-job"
              linkText="Post a job"
            />
          </div>
        </div>
      </section>

      {/* SAFETY */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <ShieldCheck className="h-8 w-8 text-[#175cd3]" />

              <h2 className="mt-6 text-[34px] font-bold leading-[1.12] tracking-[-1.2px] text-[#101828]">
                Staying careful when applying.
              </h2>
            </div>

            <div className="max-w-[700px]">
              <p className="text-[17px] leading-8 text-[#475467]">
                Employer verification can add useful information, but job
                seekers should still assess each opportunity carefully before
                sharing personal information or accepting employment terms.
              </p>

              <div className="mt-8 grid gap-4">
                <SafetyItem>
                  Review the employer and vacancy details before applying.
                </SafetyItem>

                <SafetyItem>
                  Be cautious if someone asks you to pay money to secure a job.
                </SafetyItem>

                <SafetyItem>
                  Check external application websites before submitting
                  sensitive information.
                </SafetyItem>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#07182d]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-6 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-20">
          <div className="max-w-[670px]">
            <p
              className="text-[12px] font-bold uppercase tracking-[0.16em]"
              style={{ color: "#8ab8ff" }}
            >
              Start exploring
            </p>

            <h2
              className="mt-4 text-[34px] font-bold leading-[1.12] tracking-[-1.2px] sm:text-[40px]"
              style={{ color: "#ffffff" }}
            >
              Your next opportunity could be closer than you think.
            </h2>
          </div>

          <Link
            href="/jobs"
            className="inline-flex min-h-[52px] shrink-0 items-center justify-center gap-2 self-start rounded-[8px] bg-[#e4232a] px-7 text-[14px] font-bold text-white transition hover:bg-[#c91d23] lg:self-auto"
          >
            Find jobs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function Principle({
  number,
  icon: Icon,
  title,
  text,
}: {
  number: string;
  icon: typeof Search;
  title: string;
  text: string;
}) {
  return (
    <div className="border-t border-[#d0d5dd] pt-7">
      <div className="flex items-center justify-between">
        <Icon className="h-6 w-6 text-[#175cd3]" />

        <span className="text-[11px] font-bold tracking-[0.12em] text-[#98a2b3]">
          {number}
        </span>
      </div>

      <h3 className="mt-8 text-[20px] font-bold tracking-[-0.4px] text-[#101828]">
        {title}
      </h3>

      <p className="mt-4 max-w-[350px] text-[14px] leading-7 text-[#667085]">
        {text}
      </p>
    </div>
  );
}

function VerificationStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-[11px] font-bold"
        style={{ color: "#ffffff" }}
      >
        {number}
      </div>

      <div>
        <p
          className="text-[14px] font-bold"
          style={{ color: "#ffffff" }}
        >
          {title}
        </p>

        <p
          className="mt-1.5 text-[12px] leading-5"
          style={{
            color: "rgba(255,255,255,.6)",
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

function AudienceBlock({
  icon: Icon,
  eyebrow,
  title,
  text,
  items,
  link,
  linkText,
}: {
  icon: typeof Users;
  eyebrow: string;
  title: string;
  text: string;
  items: string[];
  link: string;
  linkText: string;
}) {
  return (
    <div>
      <div className="flex h-11 w-11 items-center justify-center rounded-[9px] bg-[#eef4ff]">
        <Icon className="h-5 w-5 text-[#175cd3]" />
      </div>

      <p className="mt-7 text-[11px] font-bold uppercase tracking-[0.15em] text-[#175cd3]">
        {eyebrow}
      </p>

      <h3 className="mt-4 max-w-[500px] text-[28px] font-bold leading-[1.2] tracking-[-0.8px] text-[#101828]">
        {title}
      </h3>

      <p className="mt-5 max-w-[540px] text-[15px] leading-7 text-[#667085]">
        {text}
      </p>

      <div className="mt-7 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3"
          >
            <CheckCircle2 className="mt-[3px] h-[17px] w-[17px] shrink-0 text-[#175cd3]" />

            <p className="text-[14px] leading-6 text-[#475467]">
              {item}
            </p>
          </div>
        ))}
      </div>

      <Link
        href={link}
        className="mt-8 inline-flex items-center gap-2 text-[14px] font-bold text-[#175cd3] transition hover:text-[#154fb7]"
      >
        {linkText}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function SafetyItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 border-t border-[#e4e7ec] py-4">
      <CheckCircle2 className="mt-[3px] h-[18px] w-[18px] shrink-0 text-[#175cd3]" />

      <p className="text-[14px] leading-6 text-[#475467]">
        {children}
      </p>
    </div>
  );
}