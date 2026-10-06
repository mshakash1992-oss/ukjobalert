import type { Metadata } from "next";
import Link from "next/link";

import { ArrowRight, BriefcaseBusiness, FileSearch, ShieldCheck } from "lucide-react";

import MainHeader from "@/components/main-header";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Jobs in the UK for Foreigners: How to Search",
  description:
    "A practical guide to searching for UK jobs as an international applicant, including roles where an employer has stated visa sponsorship may be available.",
  alternates: { canonical: "/guides/jobs-in-uk-for-foreigners" },
  openGraph: {
    title: "Jobs in the UK for Foreigners | UKJobAlert",
    description: "A practical guide for international applicants searching for UK jobs.",
    url: "/guides/jobs-in-uk-for-foreigners",
    type: "article",
  },
};

export default async function JobsInUkForForeignersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const accountType = user?.user_metadata?.account_type;
  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "My Account";
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const isAdmin = Boolean(
    user?.email && adminEmails.includes(user.email.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#101828]">
      <MainHeader
        loggedIn={Boolean(user)}
        displayName={displayName}
        accountType={accountType}
        isAdmin={isAdmin}
      />

      <article>
        <header className="border-b border-[#dfe3e8] bg-[#fbfbfa]">
          <div className="mx-auto max-w-[960px] px-6 py-14 md:px-10 md:py-20">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#d71920]">Job search guide</p>
            <h1 className="mt-4 text-[42px] font-bold leading-[1.04] tracking-[-1.8px] text-[#07182d] sm:text-[56px]">
              Jobs in the UK for foreigners
            </h1>
            <p className="mt-6 max-w-[760px] text-[17px] leading-8 text-[#5d6673]">
              A practical starting point for international applicants looking for current UK vacancies. Search roles carefully, check every requirement and apply only through the employer’s stated application route.
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-[960px] px-6 py-12 md:px-10 lg:py-16">
          <section className="border-l-4 border-[#d71920] bg-white p-7 sm:p-8">
            <h2 className="text-[24px] font-bold tracking-[-.6px] text-[#07182d]">Start with suitable vacancies</h2>
            <p className="mt-4 text-[15px] leading-7 text-[#475467]">
              Use clear search terms for your occupation, location and experience. A vacancy may have specific right-to-work, qualification, registration or language requirements, so read the full job description before applying.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/jobs/visa-sponsorship" className="inline-flex min-h-[44px] items-center gap-2 bg-[#ff9f1c] px-5 text-[13px] font-extrabold text-[#10203a] transition hover:bg-[#f28c00]">
                Browse sponsorship vacancies <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/jobs" className="inline-flex min-h-[44px] items-center gap-2 border border-[#cfd5dc] bg-white px-5 text-[13px] font-bold text-[#07182d] hover:bg-[#f8f9fa]">
                Search all UK jobs
              </Link>
            </div>
          </section>

          <section className="mt-10 grid gap-5 sm:grid-cols-3">
            <GuideCard icon={FileSearch} title="Read the full listing" text="Confirm the location, job type, skills and application instructions before spending time on an application." />
            <GuideCard icon={ShieldCheck} title="Check the employer" text="Review the company details and use only the application email or website shown on the vacancy." />
            <GuideCard icon={BriefcaseBusiness} title="Apply carefully" text="Keep your CV relevant to the role and never pay a fee to secure a job or interview." />
          </section>

          <section className="mt-12 border-t border-[#dfe3e8] pt-10">
            <h2 className="text-[27px] font-bold tracking-[-.7px] text-[#07182d]">About visa sponsorship</h2>
            <p className="mt-4 text-[15px] leading-7 text-[#475467]">
              A visa-sponsorship label on UKJobAlert means the employer has indicated that sponsorship may be available for that vacancy. It is not a guarantee of eligibility, sponsorship, an offer of employment or an immigration outcome. Confirm all details directly with the employer and use official UK government guidance for immigration rules.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}

function GuideCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof FileSearch;
  title: string;
  text: string;
}) {
  return (
    <div className="border border-[#dfe3e8] bg-white p-6">
      <Icon className="h-5 w-5 text-[#d71920]" />
      <h3 className="mt-5 text-[17px] font-bold text-[#07182d]">{title}</h3>
      <p className="mt-3 text-[13px] leading-6 text-[#667085]">{text}</p>
    </div>
  );
}
