import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  ClipboardCheck,
  FilePenLine,
  ShieldCheck,
  Users,
} from "lucide-react";

import MainHeader from "@/components/main-header";

export default function EmployersPage() {
  return (
    <main className="min-h-screen bg-white">
      <MainHeader />

      {/* HERO */}

      <section className="relative overflow-hidden bg-[#07182d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(23,92,211,0.22),transparent_34%)]" />

        <div className="relative mx-auto grid max-w-[1280px] items-center gap-14 px-6 py-20 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-20 lg:px-10 lg:py-24">

          <div className="max-w-[760px]">
            <div className="flex items-center gap-2.5">
              <div className="h-[2px] w-7 bg-[#3b82f6]" />

              <p
                className="text-[12px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "#9ec2ff" }}
              >
                For UK employers
              </p>
            </div>

            <h1
              className="mt-7 text-[46px] font-bold leading-[1.03] tracking-[-2px] sm:text-[58px] lg:text-[66px]"
              style={{ color: "#ffffff" }}
            >
              Reach candidates with a clearer job listing.
            </h1>

            <p
              className="mt-7 max-w-[680px] text-[17px] leading-8"
              style={{
                color: "rgba(255,255,255,.72)",
              }}
            >
              Verify your business, publish structured
              vacancies and manage your jobs from one
              employer account.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/post-job"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[8px] bg-[#e4232a] px-7 text-[14px] font-bold text-white transition hover:bg-[#c91d23]"
              >
                Post a job
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/employer/verify"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[8px] border border-white/20 bg-white/[0.06] px-7 text-[14px] font-semibold text-white transition hover:bg-white/[0.1]"
              >
                Verify your company
              </Link>
            </div>
          </div>

          {/* HERO PANEL */}

          <div className="border border-white/10 bg-white/[0.055] p-7 backdrop-blur-sm sm:p-9">
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div>
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.15em]"
                  style={{
                    color: "rgba(255,255,255,.45)",
                  }}
                >
                  Employer account
                </p>

                <h2
                  className="mt-2 text-[21px] font-bold"
                  style={{ color: "#ffffff" }}
                >
                  From verification to publishing
                </h2>
              </div>

              <BriefcaseBusiness
                className="h-7 w-7"
                style={{ color: "#7fb0ff" }}
              />
            </div>

            <div className="mt-7 space-y-6">
              <HeroStep
                number="01"
                title="Verify"
                text="Submit your company information."
              />

              <HeroStep
                number="02"
                title="Create"
                text="Build a structured vacancy."
              />

              <HeroStep
                number="03"
                title="Publish"
                text="Make the opportunity available to job seekers."
              />

              <HeroStep
                number="04"
                title="Manage"
                text="Edit, close or reopen listings from your dashboard."
              />
            </div>
          </div>

        </div>
      </section>

      {/* INTRO */}

      <section className="border-b border-[#e4e7ec]">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-24 lg:px-10 lg:py-24">

          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#175cd3]">
              Employer tools
            </p>

            <h2 className="mt-5 text-[35px] font-bold leading-[1.12] tracking-[-1.3px] text-[#101828] sm:text-[42px]">
              Focus on the vacancy, not unnecessary setup.
            </h2>
          </div>

          <div className="max-w-[710px]">
            <p className="text-[17px] leading-[1.85] text-[#475467]">
              UKJobAlert gives employers a straightforward
              way to publish opportunities while keeping
              important vacancy information consistent and
              easy for candidates to understand.
            </p>

            <p className="mt-5 text-[17px] leading-[1.85] text-[#475467]">
              Once your employer account has the required
              verification, you can create jobs, choose how
              candidates should apply and manage your live
              listings from the employer dashboard.
            </p>
          </div>

        </div>
      </section>

      {/* FEATURES */}

      <section className="bg-[#f8fafc]">
        <div className="mx-auto max-w-[1280px] px-6 py-20 sm:px-8 lg:px-10 lg:py-24">

          <div className="max-w-[700px]">
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#175cd3]">
              Built for recruitment
            </p>

            <h2 className="mt-5 text-[35px] font-bold leading-[1.12] tracking-[-1.3px] text-[#101828] sm:text-[42px]">
              Everything needed to manage your listings.
            </h2>
          </div>

          <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">

            <Feature
              icon={BadgeCheck}
              title="Company verification"
              text="Complete the employer verification process before publishing vacancies."
            />

            <Feature
              icon={FilePenLine}
              title="Structured job listings"
              text="Add role, location, job type, salary, description and application information in a consistent format."
            />

            <Feature
              icon={ClipboardCheck}
              title="Listing management"
              text="View and manage your published jobs from your employer account."
            />

            <Feature
              icon={BarChart3}
              title="Application activity"
              text="See application click activity recorded for your listings."
            />

            <Feature
              icon={Users}
              title="Clear candidate journey"
              text="Give candidates a direct route from job discovery to your chosen application method."
            />

            <Feature
              icon={ShieldCheck}
              title="Platform controls"
              text="Verification and moderation controls help reduce misuse and maintain listing quality."
            />

          </div>
        </div>
      </section>

      {/* VERIFICATION */}

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1280px] items-start gap-16 px-6 py-20 sm:px-8 lg:grid-cols-[.95fr_1.05fr] lg:gap-24 lg:px-10 lg:py-28">

          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#eef4ff]">
              <Building2 className="h-6 w-6 text-[#175cd3]" />
            </div>

            <p className="mt-7 text-[12px] font-bold uppercase tracking-[0.16em] text-[#175cd3]">
              Company verification
            </p>

            <h2 className="mt-5 max-w-[570px] text-[36px] font-bold leading-[1.1] tracking-[-1.4px] text-[#101828] sm:text-[44px]">
              Business details checked before posting access.
            </h2>

            <p className="mt-7 max-w-[620px] text-[16px] leading-8 text-[#475467]">
              Employer accounts may be required to provide
              company information before job posting is
              enabled. Relevant details can be checked
              against publicly available Companies House
              information.
            </p>

            <p className="mt-5 max-w-[620px] text-[16px] leading-8 text-[#475467]">
              Some cases may require additional review
              before an employer account is approved.
            </p>

            <Link
              href="/employer/verify"
              className="mt-8 inline-flex items-center gap-2 text-[14px] font-bold text-[#175cd3] transition hover:text-[#154fb7]"
            >
              Start verification
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* CHECK PANEL */}

          <div className="bg-[#07182d] p-8 sm:p-10">

            <div className="flex items-center justify-between border-b border-white/10 pb-7">
              <div>
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.15em]"
                  style={{
                    color: "rgba(255,255,255,.45)",
                  }}
                >
                  Verification flow
                </p>

                <h3
                  className="mt-2 text-[23px] font-bold tracking-[-0.5px]"
                  style={{ color: "#ffffff" }}
                >
                  Before your first vacancy
                </h3>
              </div>

              <ShieldCheck
                className="h-7 w-7"
                style={{ color: "#7fb0ff" }}
              />
            </div>

            <div className="mt-8">

              <VerificationRow
                number="1"
                title="Employer account"
                text="Create or sign in using an employer account."
              />

              <VerificationRow
                number="2"
                title="Company information"
                text="Provide the requested business details."
              />

              <VerificationRow
                number="3"
                title="Verification check"
                text="Relevant company information is checked."
              />

              <VerificationRow
                number="4"
                title="Posting access"
                text="Approved employers can start creating vacancies."
                last
              />

            </div>
          </div>

        </div>
      </section>

      {/* JOB LISTING */}

      <section className="border-y border-[#e4e7ec] bg-[#f8fafc]">
        <div className="mx-auto grid max-w-[1280px] gap-16 px-6 py-20 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-24 lg:px-10 lg:py-24">

          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#175cd3]">
              Your vacancy
            </p>

            <h2 className="mt-5 text-[35px] font-bold leading-[1.12] tracking-[-1.3px] text-[#101828] sm:text-[42px]">
              Give candidates the details they need.
            </h2>

            <p className="mt-6 max-w-[520px] text-[16px] leading-8 text-[#667085]">
              Structured listings make important job
              information easier to scan before a candidate
              decides whether to apply.
            </p>
          </div>

          <div className="grid gap-x-10 gap-y-0 sm:grid-cols-2">

            <ListingItem>Job title</ListingItem>
            <ListingItem>Company name</ListingItem>
            <ListingItem>Location</ListingItem>
            <ListingItem>Job type</ListingItem>
            <ListingItem>Sector</ListingItem>
            <ListingItem>Salary where provided</ListingItem>
            <ListingItem>Job description</ListingItem>
            <ListingItem>Application method</ListingItem>

          </div>

        </div>
      </section>

      {/* DASHBOARD */}

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1280px] items-center gap-16 px-6 py-20 sm:px-8 lg:grid-cols-[1fr_.9fr] lg:gap-24 lg:px-10 lg:py-28">

          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#175cd3]">
              Employer dashboard
            </p>

            <h2 className="mt-5 max-w-[620px] text-[36px] font-bold leading-[1.1] tracking-[-1.4px] text-[#101828] sm:text-[44px]">
              Keep control of every job you publish.
            </h2>

            <p className="mt-7 max-w-[650px] text-[16px] leading-8 text-[#475467]">
              Your employer dashboard gives you one place
              to review and manage vacancies associated
              with your account.
            </p>

            <div className="mt-8 grid max-w-[620px] gap-4 sm:grid-cols-2">
              <DashboardItem text="View published jobs" />
              <DashboardItem text="Edit vacancy details" />
              <DashboardItem text="Close job listings" />
              <DashboardItem text="Reopen listings" />
              <DashboardItem text="Delete listings" />
              <DashboardItem text="Review apply clicks" />
            </div>
          </div>

          <div className="border border-[#e4e7ec] bg-[#f8fafc] p-7 sm:p-9">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#98a2b3]">
                  Employer dashboard
                </p>

                <h3 className="mt-2 text-[21px] font-bold text-[#101828]">
                  Your jobs
                </h3>
              </div>

              <BriefcaseBusiness className="h-6 w-6 text-[#175cd3]" />
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <Stat number="4" label="Total jobs" />
              <Stat number="3" label="Published" />
              <Stat number="1" label="Closed" />
            </div>

            <div className="mt-6 border border-[#e4e7ec] bg-white p-5">
              <div className="flex items-start justify-between gap-5">

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#175cd3]">
                    Published
                  </p>

                  <p className="mt-2 text-[16px] font-bold text-[#101828]">
                    Example job listing
                  </p>

                  <p className="mt-1 text-[12px] text-[#667085]">
                    London · Full-time
                  </p>
                </div>

                <BadgeCheck className="h-5 w-5 shrink-0 text-[#175cd3]" />
              </div>

              <div className="mt-5 flex gap-5 border-t border-[#eaecf0] pt-4">
                <span className="text-[12px] font-semibold text-[#475467]">
                  Edit
                </span>

                <span className="text-[12px] font-semibold text-[#475467]">
                  View
                </span>

                <span className="text-[12px] font-semibold text-[#475467]">
                  Close
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="bg-[#07182d]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-6 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-20">

          <div className="max-w-[700px]">
            <p
              className="text-[12px] font-bold uppercase tracking-[0.16em]"
              style={{ color: "#8ab8ff" }}
            >
              Hiring?
            </p>

            <h2
              className="mt-4 text-[34px] font-bold leading-[1.12] tracking-[-1.2px] sm:text-[40px]"
              style={{ color: "#ffffff" }}
            >
              Publish your next opportunity on UKJobAlert.
            </h2>

            <p
              className="mt-4 text-[14px] leading-7"
              style={{
                color: "rgba(255,255,255,.62)",
              }}
            >
              Employer verification may be required before
              your first job can be published.
            </p>
          </div>

          <Link
            href="/post-job"
            className="inline-flex min-h-[52px] shrink-0 items-center justify-center gap-2 self-start rounded-[8px] bg-[#e4232a] px-7 text-[14px] font-bold text-white transition hover:bg-[#c91d23] lg:self-auto"
          >
            Post a job
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>
      </section>
    </main>
  );
}

function HeroStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="grid grid-cols-[34px_90px_1fr] items-start gap-3">
      <span
        className="pt-[2px] text-[10px] font-bold tracking-[0.1em]"
        style={{ color: "#7fb0ff" }}
      >
        {number}
      </span>

      <p
        className="text-[13px] font-bold"
        style={{ color: "#ffffff" }}
      >
        {title}
      </p>

      <p
        className="text-[12px] leading-5"
        style={{
          color: "rgba(255,255,255,.56)",
        }}
      >
        {text}
      </p>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof BadgeCheck;
  title: string;
  text: string;
}) {
  return (
    <div className="border-t border-[#d0d5dd] pt-7">
      <Icon className="h-6 w-6 text-[#175cd3]" />

      <h3 className="mt-7 text-[20px] font-bold tracking-[-0.4px] text-[#101828]">
        {title}
      </h3>

      <p className="mt-4 max-w-[350px] text-[14px] leading-7 text-[#667085]">
        {text}
      </p>
    </div>
  );
}

function VerificationRow({
  number,
  title,
  text,
  last = false,
}: {
  number: string;
  title: string;
  text: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex gap-4 py-5 ${
        last ? "" : "border-b border-white/10"
      }`}
    >
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
            color: "rgba(255,255,255,.58)",
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

function ListingItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-t border-[#d0d5dd] py-5">
      <Check className="h-4 w-4 shrink-0 text-[#175cd3]" />

      <p className="text-[14px] font-medium text-[#344054]">
        {children}
      </p>
    </div>
  );
}

function DashboardItem({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="h-[17px] w-[17px] shrink-0 text-[#175cd3]" />

      <p className="text-[14px] text-[#475467]">
        {text}
      </p>
    </div>
  );
}

function Stat({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="border border-[#e4e7ec] bg-white p-4">
      <p className="text-[22px] font-bold tracking-[-0.5px] text-[#101828]">
        {number}
      </p>

      <p className="mt-1 text-[10px] font-semibold text-[#667085]">
        {label}
      </p>
    </div>
  );
}