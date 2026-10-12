import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight, ArrowUpRight, BriefcaseBusiness,
  CheckCircle2, Clock3, GraduationCap, MapPin,
  ShieldCheck, Users, Wallet, Tag
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import JobActions from "./JobActions";
import styles from "./job-details.module.css";

export const dynamic = "force-dynamic";
type RecordData = Record<string, unknown>;
const value = (v: unknown) => typeof v === "string" && v.trim() ? v.trim() : typeof v === "number" ? String(v) : "";
const first = (row: RecordData, keys: string[]) => keys.map(k => value(row[k])).find(Boolean) || "";

function salaryText(job: RecordData) {
  const raw = first(job, ["salary", "salary_range", "salary_display"]);
  const min = first(job, ["salary_min", "min_salary"]);
  const max = first(job, ["salary_max", "max_salary"]);
  const amount = raw || (min && max ? `${min} - ${max}` : min || max);
  if (!amount) return "";
  const currency = first(job, ["currency", "salary_currency"]);
  const formatted = /[£$€]/.test(amount) || (currency && currency.toUpperCase() !== "GBP")
    ? amount : `£${amount}`;
  const period = first(job, ["salary_period", "pay_period"]);
  return `${formatted}${period ? ` / ${period}` : ""}`;
}
function prettyDate(input: unknown) {
  const v = value(input);
  if (!v) return "";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "" : new Intl.DateTimeFormat("en-GB", {
    day: "numeric", month: "long", year: "numeric"
  }).format(d);
}
function detailFromDescription(description: string, label: string) {
  const lines = description.split(/\r?\n/);
  const match = lines.find(line => new RegExp(`^\\s*${label}\\s*:`, "i").test(line));
  return match ? match.replace(new RegExp(`^\\s*${label}\\s*:`, "i"), "").trim() : "";
}
function plainText(input: string) {
  return input.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
}

// Some older posts appended structured job fields inside description.
// They belong in the overview, not repeated beneath the job description.
function cleanDescription(input: string) {
  const text = plainText(input);
  const lines = text.split(/\r?\n/);
  const heading = lines.findIndex(line =>
    /^\s*(?:[-–—]+\s*)?Additional Job Details\s*(?:[-–—]+)?\s*$/i.test(line)
  );
  if (heading < 0) return text.trim();
  const tail = lines.slice(heading + 1).filter(line => line.trim());
  const fields = /^(?:Application Deadline|Minimum Salary|Maximum Salary|Salary Type|Experience|Industry|Qualification|Career Level|Tags|Gender)\s*:/i;
  // Remove only when the block is genuinely the generated metadata section.
  if (!tail.length || tail.every(line => fields.test(line.trim()))) {
    return lines.slice(0, heading).join("\n").trim();
  }
  return text.trim();
}

export default async function JobDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = createAdminClient();
  const { data, error } = await db.from("jobs").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  const job = data as RecordData | null;
  if (error || !job || (job.expires_at && new Date(String(job.expires_at)).getTime() <= Date.now())) notFound();

  const { data: employer } = await db.from("employer_verifications")
    .select("company_name,verification_status")
    .eq("user_id", job.employer_id).maybeSingle();
  if (!employer || employer.verification_status !== "verified") notFound();

  const applyUrl = value(job.apply_url);
  const safeUrl = /^https?:\/\//i.test(applyUrl) ? applyUrl : "";
  const applyEmail = value(job.apply_email);
  const safeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applyEmail) ? applyEmail : "";
  const title = value(job.title) || "Job opportunity";
  const location = value(job.location);
  const type = first(job, ["job_type", "employment_type"]);
  const salary = salaryText(job);
  const description = value(job.description);
  const expiry = prettyDate(job.expires_at);
  const experience = first(job, ["experience", "experience_level", "required_experience"]) || detailFromDescription(description, "Experience");
  const qualification = first(job, ["qualification", "education", "education_level"]) || detailFromDescription(description, "Qualification");
  const category = first(job, ["category", "industry", "sector"]);
  const industry = detailFromDescription(description, "Industry") || first(job, ["industry", "sector"]);
  const careerLevel = first(job, ["career_level"]) || detailFromDescription(description, "Career Level");
  const gender = first(job, ["gender"]) || detailFromDescription(description, "Gender");
  const companyName = employer.company_name || "Verified UK Employer";
  const companyInitial = companyName.slice(0, 1).toUpperCase();
  const companyHref = `/companies/${encodeURIComponent(value(job.employer_id))}`;

  // Related vacancies are optional; failure here must never break the job details page.
  let related: RecordData[] = [];
  try {
    const { data: candidates } = await db.from("jobs")
      .select("id,slug,title,location,job_type,salary,category,employer_id,expires_at")
      .eq("status", "published").neq("id", job.id)
      .order("created_at", { ascending: false }).limit(30);
    const matches = ((candidates ?? []) as RecordData[])
      .filter(j => !j.expires_at || new Date(String(j.expires_at)).getTime() > Date.now())
      .sort((a, b) => Number(value(a.category) === category) - Number(value(b.category) === category))
      .reverse();
    const owners = [...new Set(matches.map(j => value(j.employer_id)).filter(Boolean))];
    if (owners.length) {
      const { data: approved } = await db.from("employer_verifications")
        .select("user_id").in("user_id", owners).eq("verification_status", "verified");
      const approvedIds = new Set((approved ?? []).map(v => String(v.user_id)));
      related = matches.filter(j => approvedIds.has(value(j.employer_id))).slice(0, 3);
    }
  } catch (e) { console.error("Related jobs unavailable:", e); }

  const actions = <JobActions title={title} company={companyName} url={safeUrl} email={safeEmail} jobId={value(job.id) || slug} deadline={expiry} />;

  return (
    <main className={styles.page}>
      <div className={styles.container}>


        <div className={styles.layout}>
          <div className={styles.left}>
            <section className={styles.jobHeader}>
              <div className={styles.headerTop}>

                <div className={styles.headerText}>
                  <span className={styles.verified}>{type || "Job Opportunity"}</span>
                  <h1>{title}</h1>
                  <p className={styles.companyName}>Posted by <Link href={companyHref} style={{color:"#C8102E",fontWeight:600,textDecoration:"none"}}>{companyName}</Link></p>
                </div>
              </div>
              <div className={styles.meta}>
                {type && <span><BriefcaseBusiness size={16}/>{type}</span>}
                {location && <span><MapPin size={16}/>{location}</span>}
                {salary && <span><Wallet size={16}/>{salary}</span>}
              </div>
              <div className={styles.headerActions}>
                {actions}

              </div>
            </section>

            <section className={styles.overview}>

              <div className={styles.overviewGrid}>
                {salary && <div className={styles.overviewItem}><Wallet/><div><span>Offered Salary</span><strong>{salary}</strong></div></div>}
                {experience && <div className={styles.overviewItem}><Clock3/><div><span>Experience</span><strong>{experience}</strong></div></div>}
                {gender && <div className={styles.overviewItem}><Users/><div><span>Gender</span><strong>{gender}</strong></div></div>}
                {(industry || category) && <div className={styles.overviewItem}><BriefcaseBusiness/><div><span>Industry</span><strong>{industry || category}</strong></div></div>}
                {qualification && <div className={styles.overviewItem}><GraduationCap/><div><span>Qualification</span><strong>{qualification}</strong></div></div>}
                {careerLevel && <div className={styles.overviewItem}><Tag/><div><span>Career Level</span><strong>{careerLevel}</strong></div></div>}
              </div>
            </section>

            <section className={styles.descriptionSection}>
              <h2>Job Description</h2>
              {description ? <div className={styles.description}>{cleanDescription(description)}</div> :
                <p className={styles.muted}>The employer has not provided a job description.</p>}
              <div className={styles.disclaimer}><ShieldCheck size={19}/><p>Employer verification checks company information; it does not guarantee a vacancy or employment outcome. Always assess opportunities carefully.</p></div>
            </section>
          </div>

          <aside className={styles.right}>
            <section className={styles.sideCard}>
              <div className={styles.sideCompany}>
                <div className={styles.sideLogo}>{companyInitial}</div>
                <div><h2><Link href={companyHref} style={{color:"inherit",textDecoration:"none"}}>{companyName}</Link></h2><span className={styles.sideVerified}><CheckCircle2 size={14}/> Verified UK Employer</span></div>
              </div>
              <Link href={companyHref} className={styles.companyJobs}>View company jobs <ArrowRight size={15}/></Link>
            </section>
            <section className={`${styles.sideCard} ${styles.facts}`}>
              <h2>Job Information</h2>
              <div className={styles.infoList}>
                {experience && <div><Clock3/><span><strong>{experience}</strong> Experience</span></div>}
                {type && <div><BriefcaseBusiness/><span><strong>{type}</strong> Employment</span></div>}
                {salary && <div><Wallet/><span><strong>{salary}</strong> Salary</span></div>}
              </div>

            </section>
            <section className={`${styles.sideCard} ${styles.mapSection}`}>
              <h2>Job Location</h2>
              <div className={styles.locationBox}><MapPin size={25}/><strong>{location || "United Kingdom"}</strong><span>Location provided by the employer</span></div>
              {expiry && <p className={styles.sidebarDeadline}>Application ends: {expiry}</p>}
              <JobActions title={title} company={companyName} url={safeUrl} email={safeEmail} jobId={value(job.id) || slug} compact />
            </section>
          </aside>
        </div>

        {related.length > 0 && <section className={styles.related}>
          <div className={styles.relatedHeading}><h2>Related Jobs</h2><Link href="/jobs">View all jobs <ArrowRight size={16}/></Link></div>
          <div className={styles.relatedGrid}>{related.map(j => (
            <Link key={value(j.id)} className={styles.relatedCard} href={`/jobs/${encodeURIComponent(value(j.slug) || value(j.id))}`}>
              <div className={styles.relatedLogo}><BriefcaseBusiness size={24}/></div>
              <div className={styles.relatedContent}>
                <span className={styles.relatedType}>{value(j.job_type) || "Job Opportunity"}</span>
                <h3>{value(j.title) || "Untitled job"}</h3>
                <p><MapPin size={14}/>{value(j.location) || "United Kingdom"}</p>
                <span className={styles.relatedSalary}>{salaryText(j)}</span>
              </div><ArrowUpRight className={styles.relatedArrow} size={18}/>
            </Link>
          ))}</div>
        </section>}
      </div>
    </main>
  );
}
