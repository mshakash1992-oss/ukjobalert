import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#06172b] text-white">
      <div className="mx-auto max-w-[1240px] px-6 py-10 md:px-8 lg:py-11">

        {/* MAIN */}

        <div className="grid gap-10 md:grid-cols-[1.35fr_.7fr_.7fr] md:gap-12 lg:gap-16">

          {/* BRAND */}

          <div className="max-w-[390px]">
            <Link
              href="/"
              aria-label="UKJobAlert home"
              className="inline-flex rounded-[8px] bg-white px-3 py-2"
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
              Search current UK vacancies and connect directly
              with employers through clear application routes.
            </p>

            <div className="mt-4 flex items-center gap-2.5">
              <ShieldCheck className="h-[17px] w-[17px] shrink-0 text-[#7fb0ff]" />

              <span className="text-[12px] font-semibold text-white/75">
                Employer verification built in
              </span>
            </div>
          </div>

          {/* EXPLORE */}

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
              Explore
            </p>

            <nav className="mt-4 flex flex-col items-start gap-3">
              <FooterLink href="/jobs">
                Find jobs
              </FooterLink>

              <FooterLink href="/how-it-works">
                How it works
              </FooterLink>

              <FooterLink href="/employers">
                For employers
              </FooterLink>

              <FooterLink href="/post-job">
                Post a job
              </FooterLink>
            </nav>
          </div>

          {/* UKJOBALERT */}

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">
              UKJobAlert
            </p>

            <nav className="mt-4 flex flex-col items-start gap-3">
              <FooterLink href="/about">
                About
              </FooterLink>

              <FooterLink href="/contact">
                Contact
              </FooterLink>

              <FooterLink href="/privacy">
                Privacy Policy
              </FooterLink>

              <FooterLink href="/terms">
                Terms of Service
              </FooterLink>
            </nav>
          </div>
        </div>

        {/* BOTTOM */}

        <div className="mt-9 border-t border-white/10 pt-6">
          <div className="grid gap-4 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-12">

            <p className="whitespace-nowrap text-[11px] text-white/50">
              © {year} UKJobAlert.com. All rights reserved.
            </p>

            <p className="max-w-[620px] text-[10px] leading-[1.7] text-white/40 lg:justify-self-end lg:text-right">
              UKJobAlert is a job discovery platform. Employer verification
              does not constitute an endorsement or guarantee of any employer,
              vacancy or employment outcome.
            </p>

          </div>
        </div>
      </div>
    </footer>
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