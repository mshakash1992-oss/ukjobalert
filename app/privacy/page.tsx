import Link from "next/link";

import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Check,
  Cookie,
  Database,
  FileText,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import AuthMainHeader from "@/components/auth-main-header";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <AuthMainHeader />

      {/* HERO */}

      <section className="relative overflow-hidden bg-[#07182d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_10%,rgba(23,92,211,0.18),transparent_32%)]" />

        <div className="relative mx-auto max-w-[1280px] px-6 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-[860px]">

            <div className="flex items-center gap-2.5">
              <div className="h-[2px] w-7 bg-[#d71920]" />

              <p
                className="text-[12px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "#f3b4bc" }}
              >
                Privacy & data
              </p>
            </div>

            <h1
              className="mt-7 text-[48px] font-bold leading-[1.02] tracking-[-2.2px] sm:text-[58px] lg:text-[68px]"
              style={{ color: "#ffffff" }}
            >
              Privacy Policy
            </h1>

            <p
              className="mt-6 max-w-[720px] text-[17px] leading-8"
              style={{
                color: "rgba(255,255,255,.72)",
              }}
            >
              This policy explains how UKJobAlert.com
              handles information when you create an
              account, browse vacancies, publish jobs or
              otherwise use the platform.
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

          {/* MAIN CONTENT */}

          <article className="min-w-0">

            <div className="border-b border-[#e4e7ec] pb-12">
              <p className="text-[18px] font-medium leading-8 tracking-[-0.15px] text-[#344054]">
                We aim to handle personal information
                responsibly and only use information for
                legitimate purposes connected with
                operating, securing and improving
                UKJobAlert.com.
              </p>
            </div>

            <PrivacySection
              number="01"
              title="Information we collect"
            >
              <p>
                The information we collect depends on how
                you use UKJobAlert.com and the features you
                choose to access.
              </p>

              <p>
                When you create an account, we may collect
                information such as your name, email
                address, account type and authentication
                information required to operate your
                account.
              </p>

              <p>
                We may also process technical information
                generated when you use the website, such as
                information necessary for security,
                authentication, troubleshooting and basic
                platform operation.
              </p>
            </PrivacySection>

            <PrivacySection
              number="02"
              title="Job seeker information"
            >
              <p>
                Job seekers may provide information when
                creating and using an account or
                interacting with vacancies on the
                platform.
              </p>

              <p>
                Where an application is completed directly
                through an employer&apos;s email address or
                external website, the information you send
                to that employer is handled by the
                employer under its own privacy practices.
              </p>
            </PrivacySection>

            <PrivacySection
              number="03"
              title="Employer information"
            >
              <p>
                Employers may provide account details,
                contact information, company information,
                company numbers and information contained
                in job listings.
              </p>

              <p>
                We may compare employer information with
                publicly available company records,
                including Companies House information,
                where appropriate for our verification
                process.
              </p>
            </PrivacySection>

            <PrivacySection
              number="04"
              title="How we use information"
            >
              <p>
                Information may be used to operate and
                maintain UKJobAlert.com and provide the
                features requested by users.
              </p>

              <ul className="mt-6 space-y-4">
                <PrivacyItem>
                  Create and maintain user accounts.
                </PrivacyItem>

                <PrivacyItem>
                  Authenticate users and protect account
                  security.
                </PrivacyItem>

                <PrivacyItem>
                  Verify employer and company information.
                </PrivacyItem>

                <PrivacyItem>
                  Publish and manage job vacancies.
                </PrivacyItem>

                <PrivacyItem>
                  Prevent fraud, abuse and misuse of the
                  platform.
                </PrivacyItem>

                <PrivacyItem>
                  Maintain, troubleshoot and improve the
                  website.
                </PrivacyItem>

                <PrivacyItem>
                  Comply with applicable legal obligations.
                </PrivacyItem>
              </ul>
            </PrivacySection>

            <PrivacySection
              number="05"
              title="Authentication and account security"
            >
              <p>
                UKJobAlert.com uses authentication
                technology to create and manage user
                sessions, verify account access and support
                features such as password recovery.
              </p>

              <p>
                Users are responsible for choosing a secure
                password and protecting access to their
                account.
              </p>
            </PrivacySection>

            <PrivacySection
              number="06"
              title="Employer verification"
            >
              <p>
                Employer accounts may be subject to
                verification before they are permitted to
                publish jobs.
              </p>

              <p>
                Verification may involve processing company
                information and checking it against public
                records. The purpose of this process is to
                help protect the integrity of the platform
                and reduce misuse.
              </p>
            </PrivacySection>

            <PrivacySection
              number="07"
              title="Sharing of information"
            >
              <p>
                We do not sell personal information.
              </p>

              <p>
                Information may be processed or shared with
                service providers where reasonably
                necessary to operate, secure or maintain
                UKJobAlert.com.
              </p>

              <p>
                We may also disclose information where
                required by law, legal process, regulatory
                requirements, or where reasonably necessary
                to protect users, the platform or the
                rights of others.
              </p>
            </PrivacySection>

            <PrivacySection
              number="08"
              title="Third-party services"
            >
              <p>
                UKJobAlert.com may rely on third-party
                technology providers for services such as
                hosting, authentication, databases and
                infrastructure.
              </p>

              <p>
                Job listings may also contain links or
                application routes to external employer
                websites. Those websites operate
                independently and may have their own
                privacy policies.
              </p>
            </PrivacySection>

            <PrivacySection
              number="09"
              title="Cookies and similar technologies"
            >
              <p>
                UKJobAlert.com may use cookies or similar
                technologies that are necessary for
                authentication, security, user sessions and
                essential website functionality.
              </p>

              <p>
                If additional analytics or non-essential
                technologies are introduced, this policy
                may be updated and additional consent
                controls may be provided where required.
              </p>
            </PrivacySection>

            <PrivacySection
              number="10"
              title="Data retention"
            >
              <p>
                Information is retained for as long as
                reasonably necessary for the purposes for
                which it was collected, including account
                operation, security, fraud prevention,
                dispute resolution and applicable legal
                requirements.
              </p>

              <p>
                Retention periods may differ depending on
                the type of information and the reason it
                is being processed.
              </p>
            </PrivacySection>

            <PrivacySection
              number="11"
              title="Data security"
            >
              <p>
                We use reasonable technical and
                organizational measures intended to protect
                information and reduce the risk of
                unauthorized access, loss, misuse or
                alteration.
              </p>

              <p>
                No internet service can guarantee absolute
                security, so users should also take
                reasonable steps to protect their accounts
                and devices.
              </p>
            </PrivacySection>

            <PrivacySection
              number="12"
              title="Your privacy rights"
            >
              <p>
                Depending on applicable law and your
                circumstances, you may have rights relating
                to your personal information.
              </p>

              <ul className="mt-6 space-y-4">
                <PrivacyItem>
                  Request access to personal information
                  held about you.
                </PrivacyItem>

                <PrivacyItem>
                  Request correction of inaccurate or
                  incomplete information.
                </PrivacyItem>

                <PrivacyItem>
                  Request deletion of information in
                  circumstances where the law provides that
                  right.
                </PrivacyItem>

                <PrivacyItem>
                  Object to or request restriction of
                  certain processing where applicable.
                </PrivacyItem>
              </ul>
            </PrivacySection>

            <PrivacySection
              number="13"
              title="Children"
            >
              <p>
                UKJobAlert.com is intended for people using
                the platform for legitimate employment and
                recruitment purposes.
              </p>

              <p>
                The platform is not designed as a service
                directed specifically at children.
              </p>
            </PrivacySection>

            <PrivacySection
              number="14"
              title="Changes to this policy"
            >
              <p>
                We may update this Privacy Policy when our
                services, technology, data practices or
                applicable requirements change.
              </p>

              <p>
                The current version will be published on
                this page with its effective or revision
                date.
              </p>
            </PrivacySection>

            <PrivacySection
              number="15"
              title="Contact"
              last
            >
              <p>
                If you have questions about this Privacy
                Policy or wish to make a privacy-related
                request, you can contact UKJobAlert.com
                using the contact details published on the
                website.
              </p>
            </PrivacySection>

          </article>

          {/* SIDEBAR */}

          <aside className="lg:sticky lg:top-[96px] lg:self-start">

            <div className="border-t-[3px] border-[#d71920] bg-[#f7f8fa] px-6 py-7">

              <ShieldCheck className="h-6 w-6 text-[#d71920]" />

              <h2 className="mt-5 text-[18px] font-bold tracking-[-0.3px] text-[#101828]">
                Privacy at a glance
              </h2>

              <p className="mt-3 text-[13px] leading-6 text-[#667085]">
                Account and platform information is used
                to operate, secure and maintain
                UKJobAlert.com.
              </p>

              <div className="mt-7 space-y-6">

                <SummaryItem
                  icon={UserRound}
                  title="Account information"
                  text="Used to create and manage your UKJobAlert account."
                />

                <SummaryItem
                  icon={Building2}
                  title="Employer information"
                  text="May be checked against public company records."
                />

                <SummaryItem
                  icon={LockKeyhole}
                  title="Security"
                  text="Authentication and security controls help protect accounts."
                />

                <SummaryItem
                  icon={Database}
                  title="Data"
                  text="Information is retained only as reasonably necessary."
                />

              </div>
            </div>

            <div className="mt-8 border-t border-[#e4e7ec] pt-7">
              <div className="flex items-start gap-3">

                <Cookie className="mt-[2px] h-[19px] w-[19px] shrink-0 text-[#d71920]" />

                <div>
                  <h3 className="text-[14px] font-bold text-[#101828]">
                    Essential cookies
                  </h3>

                  <p className="mt-2 text-[12px] leading-5 text-[#667085]">
                    Cookies may be required for secure
                    authentication and essential website
                    functionality.
                  </p>
                </div>

              </div>
            </div>

            <div className="mt-8 border-t border-[#e4e7ec] pt-7">

              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#98a2b3]">
                Related document
              </p>

              <Link
                href="/terms"
                className="mt-4 flex items-center justify-between gap-4 text-[14px] font-semibold text-[#101828] transition hover:text-[#d71920]"
              >
                Terms of Service
                <ArrowUpRight className="h-4 w-4" />
              </Link>

            </div>

            <div className="mt-8 border-t border-[#e4e7ec] pt-7">

              <div className="flex items-start gap-3">

                <Mail className="mt-[2px] h-[18px] w-[18px] shrink-0 text-[#667085]" />

                <div>
                  <h3 className="text-[13px] font-bold text-[#101828]">
                    Privacy questions
                  </h3>

                  <p className="mt-2 text-[12px] leading-5 text-[#667085]">
                    Privacy-related requests can be made
                    through the contact details published
                    on UKJobAlert.com.
                  </p>
                </div>

              </div>
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

function PrivacySection({
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

        <span className="text-[12px] font-bold tracking-[0.08em] text-[#d71920]">
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

function PrivacyItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">

      <div className="mt-[5px] flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-[#fff5f4]">
        <Check className="h-[12px] w-[12px] text-[#d71920]" />
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
  icon: typeof FileText;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3.5">

      <Icon className="mt-[2px] h-[18px] w-[18px] shrink-0 text-[#d71920]" />

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