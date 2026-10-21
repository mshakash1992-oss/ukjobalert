import CompanyLogo from "@/components/CompanyLogo";
import { pageMetadata } from "@/lib/seo";
import { isPublicJob } from "@/lib/job-publication";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Clock3, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import styles from "./jobs.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = Record<string, string | string[] | undefined>;
type Props = { searchParams: Promise<Params> };
type JobRow = {
  id: string;
  company_logo_url: string | null;
  slug: string | null;
  title: string | null;
  location: string | null;
  category: string | null;
  job_type: string | null;
  salary: string | number | null;
  employer_id: string | null;
  created_at: string | null;
  expires_at: string | null;
};

const types = ["Full Time", "Part Time", "Remote"];
const categories = [
  "Design & Multimedia", "Education Training", "Accounting / Finance",
  "Human Resource", "Telecommunications", "Restaurant / Food Service",
  "Construction / Facilities", "Health", "IT & Tech",
];

function param(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value ?? "").trim().slice(0, 200);
}
function salaryText(value: string | number | null): string {
  if (value === null || value === "") return "Salary not specified";
  const text = String(value).trim();
  return /^(£|\$|€)/.test(text) ? text : `£${text}`;
}
function salaryNumber(value: string | number | null): number {
  const match = String(value ?? "").replace(/,/g, "").match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : -1;
}
function buildUrl(current: { keyword: string; location: string; category: string; type: string; sort: string }, changes: Record<string, string>) {
  const next = { ...current, ...changes };
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(next)) if (value) query.set(key, value);
  const suffix = query.toString();
  return `/jobs${suffix ? `?${suffix}` : ""}`;
}

export async function generateMetadata({ searchParams }: Props) {
  const params = await searchParams;
  const filtered = ["keyword", "location", "category", "type", "sort"].some(key => Boolean(param(params[key])));
  return { ...pageMetadata("Find UK Jobs & Current Vacancies", "Browse current UK vacancies by job title, location, category and employment type. Apply directly to verified employers.", "/jobs"),
    robots: { index: !filtered, follow: true } };
}

export default async function JobsPage({ searchParams }: Props) {
  const p = await searchParams;
  const keyword = param(p.keyword);
  const location = param(p.location);
  const category = param(p.category);
  const type = param(p.type);
  const sort = param(p.sort) === "salary" ? "salary" : "newest";
  const current = { keyword, location, category, type, sort: sort === "salary" ? "salary" : "" };

  let jobs: JobRow[] = [];
  let companies = new Map<string, string>();
  let loadError = false;

  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("jobs")
      .select("id,slug,title,location,category,job_type,salary,employer_id,created_at,expires_at,company_logo_url")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    const valid = ((data ?? []) as JobRow[]).filter((j) =>
      j.employer_id && isPublicJob(j)
    );
    const ownerIds = [...new Set(valid.map((j) => j.employer_id).filter((v): v is string => Boolean(v)))];
    if (ownerIds.length) {
      const { data: verified, error: verificationError } = await db
        .from("employer_verifications")
        .select("user_id,company_name")
        .in("user_id", ownerIds)
        .eq("verification_status", "verified");
      if (verificationError) throw verificationError;
      companies = new Map((verified ?? []).map((v) => [String(v.user_id), String(v.company_name || "Verified employer")]));
    }
    jobs = valid.filter((j) => companies.has(String(j.employer_id)));
  } catch (error) {
    console.error("Jobs server search failed:", error);
    loadError = true;
  }

  const q = keyword.toLocaleLowerCase();
  const l = location.toLocaleLowerCase().replace(/,\s*(gb|uk|united kingdom)$/, "");
  const filtered = jobs.filter((job) => {
    const company = companies.get(String(job.employer_id)) ?? "";
    return (!q || `${job.title ?? ""} ${company} ${job.category ?? ""}`.toLocaleLowerCase().includes(q)) &&
      (!l || (job.location ?? "").toLocaleLowerCase().includes(l)) &&
      (!category || job.category === category) &&
      (!type || job.job_type === type);
  });
  if (sort === "salary") filtered.sort((a, b) => salaryNumber(b.salary) - salaryNumber(a.salary));

  return (
    <main className={styles.page}>
      <section className={styles.pageHero}>
        <div className={styles.container}>
          <div className={styles.heroRow}>
            <div><h1>Find Jobs</h1><p>Discover opportunities from verified employers across the United Kingdom.</p></div>
            <div className={styles.breadcrumb}><Link href="/">Home</Link><span>/</span><strong>Jobs</strong></div>
          </div>
        </div>
      </section>

      <section className={styles.searchSection}>
        <div className={styles.container}>
          <form className={styles.searchBar} action="/jobs" method="get">
            <label><Search aria-hidden="true" /><input name="keyword" defaultValue={keyword} placeholder="Job title, keywords or company" aria-label="Job title, keywords or company" /></label>
            <label className={styles.locationField}><MapPin aria-hidden="true" /><input name="location" defaultValue={location} placeholder="Location" aria-label="Location" /></label>
            {category && <input type="hidden" name="category" value={category} />}
            {type && <input type="hidden" name="type" value={type} />}
            {sort === "salary" && <input type="hidden" name="sort" value="salary" />}
            <button type="submit" className={styles.searchButton}>Search Jobs</button>
          </form>
        </div>
      </section>

      <section className={styles.jobsArea}>
        <div className={styles.container}>
          <details className="uja-native-mobile-filters">
            <summary><SlidersHorizontal size={17} /> Filters</summary>
            <div className="uja-native-mobile-filter-links">
              <strong>Category</strong>
              <Link href={buildUrl(current, { category: "" })}>All Categories</Link>
              {categories.map((c) => <Link key={c} href={buildUrl(current, { category: c })}>{c}</Link>)}
              <strong>Job Type</strong>
              <Link href={buildUrl(current, { type: "" })}>All Job Types</Link>
              {types.map((t) => <Link key={t} href={buildUrl(current, { type: t })}>{t}</Link>)}
            </div>
          </details>
          <div className={styles.layout}>
            <aside className={styles.sidebar}>
              <div className={styles.filterHead}><h2>Filter Jobs</h2><Link href="/jobs">Clear All</Link></div>
              <div className={styles.filterGroup}>
                <h3>Category</h3>
                <Link className={styles.radioRow} href={buildUrl(current, { category: "" })}>{!category ? "◉" : "○"} All Categories</Link>
                {categories.map((c) => <Link key={c} className={styles.radioRow} href={buildUrl(current, { category: c })}>{category === c ? "◉" : "○"} {c}</Link>)}
              </div>
              <div className={styles.filterGroup}>
                <h3>Job Type</h3>
                <Link className={styles.radioRow} href={buildUrl(current, { type: "" })}>{!type ? "◉" : "○"} All Job Types</Link>
                {types.map((t) => <Link key={t} className={styles.radioRow} href={buildUrl(current, { type: t })}>{type === t ? "◉" : "○"} {t}</Link>)}
              </div>
            </aside>

            <div className={styles.results}>
              <div className={styles.resultsHead}>
                <div><h2>Latest Jobs</h2><p>{loadError ? "Vacancies temporarily unavailable" : `${filtered.length} jobs found`}</p></div>
                <div className={styles.sort}>
                  <span>Sort by:</span>
                  <Link href={buildUrl(current, { sort: "" })} style={{ color: sort === "newest" ? "#c8102e" : "#555" }}>Newest</Link>
                  <span> / </span>
                  <Link href={buildUrl(current, { sort: "salary" })} style={{ color: sort === "salary" ? "#c8102e" : "#555" }}>Salary High</Link>
                </div>
              </div>
              <div className={styles.jobList}>
                {filtered.map((job) => (
                  <article className={styles.jobCard} key={job.id}>
                    <div className={styles.companyLogo} aria-label="Company"><CompanyLogo src={job.company_logo_url} name={companies.get(String(job.employer_id)) ?? "Verified employer"} /></div>
                    <div className={styles.jobInfo}>
                      <div className={styles.jobTop}><span className={styles.jobType}>{job.job_type || "Not specified"}</span></div>
                      <Link href={`/jobs/${encodeURIComponent(job.slug || job.id)}`} className={styles.jobTitle}>{job.title || "Untitled job"}</Link>
                      <p className={styles.company}>{companies.get(String(job.employer_id))}</p>
                      <div className={styles.meta}>
                        <span><MapPin />{job.location || "United Kingdom"}</span>
                        <span><BriefcaseBusiness />{salaryText(job.salary)}</span>
                        <span><Clock3 />{job.created_at ? new Date(job.created_at).toLocaleDateString("en-GB") : ""}</span>
                      </div>
                    </div>
                    <Link href={`/jobs/${encodeURIComponent(job.slug || job.id)}`} className={styles.viewJob}>View Job <ArrowRight /></Link>
                  </article>
                ))}
                {(loadError || filtered.length === 0) && (
                  <div className={styles.empty}>
                    <Search />
                    <h3>{loadError ? "Unable to load jobs right now" : "No jobs found"}</h3>
                    <p>{loadError ? "Please refresh or try again shortly." : "Try changing your keywords or filters."}</p>
                    <Link href="/jobs" style={{ display: "inline-block", marginTop: 18, color: "#c8102e", fontWeight: 600 }}>Reset Filters</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <style>{`
        .uja-native-mobile-filters{display:none}
        @media(max-width:800px){
          .uja-native-mobile-filters{display:block;margin-bottom:18px;background:#fff;border:1px solid #e2e5ea}
          .uja-native-mobile-filters>summary{display:flex;align-items:center;gap:9px;padding:13px 16px;cursor:pointer;color:#012169;font-weight:600;list-style:none}
          .uja-native-mobile-filters>summary::-webkit-details-marker{display:none}
          .uja-native-mobile-filter-links{padding:10px 16px 18px;display:flex;flex-direction:column;gap:12px}
          .uja-native-mobile-filter-links strong{margin-top:8px;color:#012169}
          .uja-native-mobile-filter-links a{color:#4b5563;font-size:13px}
        }
      `}</style>
    </main>
  );
}
