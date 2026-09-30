import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#06172b] text-white">
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1360px] flex-col gap-5 px-6 py-7 md:px-10 lg:flex-row lg:items-center lg:justify-between xl:px-12">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#f3b4bc]">
              Ready to search?
            </p>
            <p className="mt-1.5 text-[20px] font-bold tracking-[-.4px] text-white">
              Explore current vacancies from employers using UKJobAlert.
            </p>
          </div>
          <Link
            href="/jobs"
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 self-start bg-[#d71920] px-5 text-[13px] font-bold text-white transition hover:bg-[#b91319] lg:self-auto"
          >
            Find jobs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1360px] px-6 py-11 md:px-10 lg:py-12 xl:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_.75fr_.75fr_.75fr] lg:gap-12">
          <div className="max-w-[390px]">
            <Link
              href="/"
              aria-label="UKJobAlert home"
              className="inline-flex bg-white px-3 py-2"
            >
              <Image
                src="/ukjobalert-logo.png"
                alt="UKJobAlert"
                width={190}
                height={52}
                className="h-auto w-[160px] object-contain"
              />
            </Link>

            <p className="mt-4 max-w-[370px] text-[13px] leading-6 text-white/65">
              Search current UK vacancies, review clear job details and connect through the application route provided by the employer.
            </p>

            <div className="mt-5 flex items-center gap-2.5">
              <ShieldCheck className="h-[17px] w-[17px] shrink-0 text-[#f3b4bc]" />
              <span className="text-[12px] font-semibold text-white/75">
                Employer checks before posting access
              </span>
            </div>
          </div>

          <FooterColumn title="Job seekers">
            <FooterLink href="/jobs">Find jobs</FooterLink>
            <FooterLink href="/companies">Companies</FooterLink>
            <FooterLink href="/account">Saved jobs</FooterLink>
            <FooterLink href="/account/alerts">Job alerts</FooterLink>
            <FooterLink href="/account/applications">Applications</FooterLink>
          </FooterColumn>

          <FooterColumn title="Employers">
            <FooterLink href="/employers">For employers</FooterLink>
            <FooterLink href="/employer/verify">Company verification</FooterLink>
            <FooterLink href="/post-job">Post a job</FooterLink>
            <FooterLink href="/employer/jobs">Manage jobs</FooterLink>
            <FooterLink href="/how-it-works">How it works</FooterLink>
          </FooterColumn>

          <FooterColumn title="UKJobAlert">
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/faq">FAQ</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
          </FooterColumn>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="grid gap-4 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-12">
            <p className="whitespace-nowrap text-[11px] text-white/50">
              © {year} UKJobAlert.com. All rights reserved.
            </p>
            <p className="max-w-[680px] text-[10px] leading-[1.7] text-white/40 lg:justify-self-end lg:text-right">
              UKJobAlert is a job discovery platform. Employer verification does not constitute an endorsement or guarantee of any employer, vacancy or employment outcome.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
        {title}
      </p>
      <nav className="mt-4 flex flex-col items-start gap-3">{children}</nav>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="w-fit text-[13px] font-medium text-white/70 transition-colors duration-200 hover:text-white"
    >
      {children}
    </Link>
  );
}
