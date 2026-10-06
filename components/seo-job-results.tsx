import Link from "next/link";

import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import MainHeader from "@/components/main-header";

type Job = {
  id: string;
  slug: string;
  company_name: string;
  company_logo_url: string | null;
  title: string;
  category: string;
  job_type: string;
  location: string;
  salary: string | null;
  created_at: string;
};

type SeoJobResultsProps = {
  eyebrow: string;
  title: string;
  description: string;
  mode: "remote" | "visa";
};

function timeAgo(date: string) {
  const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

function formatSalary(salary: string | null) {
  if (!salary?.trim()) return null;

  const cleaned = salary
    .trim()
    .replace(/^(?:\u00A3|Â\u00A3|â‚£|┬ú|Tú)\s*/i, "");

  return /^\d/.test(cleaned) ? `\u00A3${cleaned}` : salary.trim();
}

export default async function SeoJobResults({
  eyebrow,
  title,
  description,
  mode,
}: SeoJobResultsProps) {
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

  let query = supabase
    .from("jobs")
    .select(
      "id, slug, company_name, company_logo_url, title, category, job_type, location, salary, created_at"
    )
    .eq("status", "published")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });

  query =
    mode === "remote"
      ? query.eq("workplace_type", "Remote")
      : query.eq("visa_sponsorship_available", true);

  const { data, error } = await query;
  if (error) console.error(error);
  const jobs = (data || []) as Job[];

  const modeLabel = mode === "remote" ? "remote" : "visa sponsorship";

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-[#101828]">
      <MainHeader
        loggedIn={Boolean(user)}
        displayName={displayName}
        accountType={accountType}
        isAdmin={isAdmin}
      />

      <section className="border-b border-[#dfe3e8] bg-[#fbfbfa]">
        <div className="mx-auto max-w-[1280px] px-6 py-14 md:px-10 md:py-20 xl:px-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#d71920]">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-[860px] text-[42px] font-bold leading-[1.04] tracking-[-1.8px] text-[#07182d] sm:text-[54px]">
            {title}
          </h1>
          <p className="mt-5 max-w-[760px] text-[16px] leading-7 text-[#5d6673]">
            {description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-12 md:px-10 lg:py-16 xl:px-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[#cfd5dc] pb-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d71920]">
              Current vacancies
            </p>
            <h2 className="mt-2 text-[30px] font-bold tracking-[-1px] text-[#07182d]">
              {jobs.length} {jobs.length === 1 ? "role" : "roles"} available
            </h2>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 border border-[#cfd5dc] bg-white px-4 py-3 text-[12px] font-bold text-[#07182d] transition hover:border-[#07182d]"
          >
            Browse all jobs <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="border border-[#dfe3e8] bg-white px-7 py-16 text-center">
            <BriefcaseBusiness className="mx-auto h-7 w-7 text-[#667085]" />
            <h2 className="mt-5 text-[20px] font-bold text-[#07182d]">
              No {modeLabel} vacancies are available right now
            </h2>
            <p className="mx-auto mt-3 max-w-[560px] text-[14px] leading-6 text-[#667085]">
              New verified employer vacancies are added as they are published. Browse all current UK jobs or return soon for new opportunities.
            </p>
            <Link
              href="/jobs"
              className="mt-7 inline-flex min-h-[44px] items-center justify-center bg-[#ff9f1c] px-5 text-[13px] font-extrabold text-[#10203a] transition hover:bg-[#f28c00]"
            >
              Search all UK jobs
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#e1e5e9] border-b border-[#e1e5e9] bg-white">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.slug}`}
                className="group grid gap-5 px-5 py-6 transition hover:bg-[#fbfcfd] sm:grid-cols-[56px_minmax(0,1fr)_auto] sm:px-6"
              >
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden border border-[#dfe3e8] bg-[#f6f7f8] text-[13px] font-bold text-[#07182d]">
                  {job.company_logo_url ? (
                    <img
                      src={job.company_logo_url}
                      alt={`${job.company_name} logo`}
                      className="h-full w-full object-contain p-2"
                      loading="lazy"
                    />
                  ) : (
                    initials(job.company_name)
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[19px] font-bold tracking-[-0.35px] text-[#07182d] group-hover:text-[#d71920]">
                      {job.title}
                    </h3>
                    <ShieldCheck className="h-4 w-4 shrink-0 text-[#0b6b4b]" />
                  </div>
                  <p className="mt-1 text-[13px] font-semibold text-[#475467]">{job.company_name}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#667085]">
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                    <span>{job.job_type}</span>
                    <span>{job.category}</span>
                    {formatSalary(job.salary) && <span className="font-semibold text-[#344054]">{formatSalary(job.salary)}</span>}
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-[11px] text-[#98a2b3]">
                    <Clock3 className="h-3.5 w-3.5" /> Posted {timeAgo(job.created_at)}
                  </div>
                </div>
                <span className="inline-flex h-fit items-center gap-1.5 self-start border border-[#dbe4ed] bg-[#f6faf8] px-3 py-2 text-[11px] font-bold text-[#0b6b4b]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Verified employer
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
