import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import AuthMainHeader from "@/components/auth-main-header";
import { createAdminClient } from "@/lib/supabase/admin";

type CompanyJob = {
  company_name: string;
  company_number: string | null;
  location: string;
};

type Company = {
  name: string;
  number: string | null;
  count: number;
  locations: string[];
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

export default async function CompaniesPage() {
  const admin = createAdminClient();
  const now = new Date().toISOString();

  const { data, error } = await admin
    .from("jobs")
    .select("company_name, company_number, location")
    .eq("status", "published")
    .gt("expires_at", now)
    .order("company_name", { ascending: true });

  if (error) {
    console.error("Company directory error:", error);
  }

  const companiesMap = new Map<string, Company>();

  for (const row of (data || []) as CompanyJob[]) {
    const key = `${row.company_name}::${row.company_number || ""}`;
    const current = companiesMap.get(key);

    if (current) {
      current.count += 1;
      if (row.location && !current.locations.includes(row.location)) {
        current.locations.push(row.location);
      }
    } else {
      companiesMap.set(key, {
        name: row.company_name,
        number: row.company_number,
        count: 1,
        locations: row.location ? [row.location] : [],
      });
    }
  }

  const companies = Array.from(companiesMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <main className="min-h-screen bg-[#f5f6f7] text-[#101828]">
      <AuthMainHeader />

      <section className="border-b border-[#dfe3e8] bg-white">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-6 py-14 md:px-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end lg:py-18 xl:px-12">
          <div className="max-w-[820px]">
            <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#d71920]">
              <span className="h-px w-9 bg-[#d71920]" />
              Company directory
            </div>
            <h1 className="mt-5 font-serif text-[44px] font-semibold leading-[1.02] tracking-[-1.7px] text-[#07182d] sm:text-[56px] lg:text-[64px]">
              Companies with current UK vacancies.
            </h1>
            <p className="mt-5 max-w-[720px] text-[16px] leading-7 text-[#5d6673]">
              Browse employers that currently have live jobs on UKJobAlert. Open a company to see the vacancies available now.
            </p>
          </div>

          <div className="border-l-4 border-[#d71920] bg-[#07182d] p-6 sm:p-7">
            <Building2 className="h-5 w-5 text-white/70" />
            <p className="mt-5 text-[32px] font-bold tracking-[-1px] text-white">
              {companies.length}
            </p>
            <p className="mt-1 text-[13px] leading-6 text-white/65">
              {companies.length === 1 ? "company has" : "companies have"} active vacancies right now.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1360px] px-6 py-12 md:px-10 lg:py-16 xl:px-12">
        {companies.length === 0 ? (
          <div className="border border-[#dfe3e8] bg-white px-8 py-16 text-center">
            <Building2 className="mx-auto h-7 w-7 text-[#98a2b3]" />
            <h2 className="mt-4 text-[20px] font-bold text-[#07182d]">No companies to show yet</h2>
            <p className="mt-2 text-[14px] text-[#667085]">
              Companies will appear here when they have a current published vacancy.
            </p>
          </div>
        ) : (
          <div className="grid gap-px border border-[#dfe3e8] bg-[#dfe3e8] md:grid-cols-2 xl:grid-cols-3">
            {companies.map((company) => (
              <Link
                key={`${company.name}-${company.number || "company"}`}
                href={`/jobs?company=${encodeURIComponent(company.name)}`}
                className="group bg-white p-6 transition hover:bg-[#fbfbfa]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-[#dfe3e8] bg-[#f6f7f8] text-[13px] font-bold text-[#07182d]">
                    {initials(company.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate text-[17px] font-bold text-[#07182d] transition group-hover:text-[#d71920]">
                        {company.name}
                      </h2>
                      <ShieldCheck className="h-4 w-4 shrink-0 text-[#0b6b4b]" />
                    </div>
                    {company.number && (
                      <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#98a2b3]">
                        Company No. {company.number}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#eaecf0] pt-5 text-[12px] text-[#667085]">
                  <span className="flex items-center gap-1.5">
                    <BriefcaseBusiness className="h-3.5 w-3.5" />
                    {company.count} {company.count === 1 ? "live job" : "live jobs"}
                  </span>
                  {company.locations[0] && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {company.locations[0]}
                      {company.locations.length > 1 ? ` +${company.locations.length - 1}` : ""}
                    </span>
                  )}
                </div>

                <div className="mt-5 inline-flex items-center gap-2 text-[12px] font-bold text-[#d71920]">
                  View current jobs <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
