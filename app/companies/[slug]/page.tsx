import { isPublicJob } from "@/lib/job-publication";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, ArrowRight, BriefcaseBusiness, Building2, CalendarDays,
  CheckCircle2, ExternalLink, Globe2, Mail, MapPin, Users, Wallet,
  Clock3, ImageIcon, ShieldCheck
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import styles from "./company-profile.module.css";

export const dynamic = "force-dynamic";
type Row = Record<string, unknown>;
const str = (v: unknown) => typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "";
const get = (r: Row, keys: string[]) => keys.map(k => str(r[k])).find(Boolean) || "";
const safeHttp = (v: unknown) => { const s = str(v); return /^https?:\/\//i.test(s) ? s : ""; };
const salary = (j: Row) => {
  const amount = get(j,["salary","salary_range","salary_display"]) ||
    [get(j,["salary_min","min_salary"]),get(j,["salary_max","max_salary"])].filter(Boolean).join(" – ");
  if (!amount) return "";
  const currency = get(j,["currency","salary_currency"]);
  return /[£$€]/.test(amount) || (currency && currency.toUpperCase() !== "GBP") ? amount : `£${amount}`;
};
const dateText = (v: unknown) => {
  const d = new Date(str(v));
  return Number.isNaN(d.getTime()) ? "" : new Intl.DateTimeFormat("en-GB", {day:"numeric",month:"short",year:"numeric"}).format(d);
};
function cleanText(v: unknown) {
  return str(v).replace(/<[^>]+>/g, " ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").trim();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(slug)) return { title: "Company not found", robots: { index: false } };
  const { data } = await createAdminClient().from("employer_verifications").select("company_name,verification_status").eq("user_id", slug).maybeSingle();
  if (!data || data.verification_status !== "verified") return { title: "Company not found", robots: { index: false } };
  return pageMetadata(`${data.company_name} Jobs`, `Browse current vacancies and employer information for ${data.company_name}.`, `/companies/${encodeURIComponent(slug)}`);
}
export default async function CompanyProfile({params}:{params:Promise<{slug:string}>}) {
  const {slug: employerId} = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(employerId)) notFound();
  const db = createAdminClient();
  const {data: employerData, error: employerError} = await db.from("employer_verifications")
    .select("*").eq("user_id", employerId).maybeSingle();
  if (employerError) { console.error("Company lookup:",employerError.message); throw new Error("Unable to load company profile"); }
  const employer = employerData as Row | null;
  if (!employer || str(employer.verification_status) !== "verified") notFound();
  const {data: jobData, error: jobsError} = await db.from("jobs")
    .select("*").eq("employer_id",employerId).eq("status","published")
    .order("created_at",{ascending:false});
  const jobs = ((jobData || []) as Row[]).filter(j => isPublicJob(j));
  const company = get(employer,["company_name","legal_name"]) || "Verified UK Employer";
  const description = cleanText(get(employer,["company_description","description","about","about_company","company_about"]));
  const location = get(employer,["location","company_location","city","address","registered_address"])
    || get(jobs[0] || {},["location"]);
  const website = safeHttp(get(employer,["website","company_website","website_url"]));
  const logo = safeHttp(get(employer,["logo_url","company_logo","company_logo_url"]));
  const sector = get(employer,["industry","sector","category","company_industry"]);
  const companyNumber = get(employer,["company_number","registration_number"]);
  const size = get(employer,["company_size","team_size","employee_count"]);
  const founded = get(employer,["founded_year","year_founded","established"]);
  const email = get(employer,["public_email","contact_email","company_email"]);
  const safeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
  const photoKeys = ["office_photo_1","office_photo_2","office_photo_3","office_image_1","office_image_2","office_image_3"];
  const photos = photoKeys.map(k => safeHttp(employer[k])).filter(Boolean).slice(0,3);
  const categories = [...new Set(jobs.map(j=>get(j,["category","industry","sector"])).filter(Boolean))];

  return <main className={styles.page}><div className={styles.container}>
    <nav className={styles.breadcrumb}><Link href="/companies"><ArrowLeft size={15}/> Companies</Link><span>/</span><span>{company}</span></nav>
    <section className={styles.hero}>
      <div className={styles.logo}>{logo ? <img src={logo} alt={`${company} logo`}/> : <Building2 size={37}/>}</div>
      <div className={styles.heroText}>
        <h1>{company}</h1><span className={styles.verified}><ShieldCheck size={15}/> Verified UK Employer</span>
        <div className={styles.heroMeta}>
          {location && <span><MapPin size={14}/>{location}</span>}
          {website && <a href={website} target="_blank" rel="noopener noreferrer"><Globe2 size={14}/> Website <ExternalLink size={12}/></a>}
          {safeEmail && <a href={`mailto:${safeEmail}`}><Mail size={14}/>{safeEmail}</a>}
        </div>
      </div>
      <div className={styles.heroAction}><a href="#open-positions" className={styles.primary}>View open positions <ArrowRight size={17}/></a></div>
    </section>

    <div className={styles.layout}>
      <div className={styles.mainColumn}>
        <section className={styles.section}>
          <h2>Company Information</h2>
          <div className={styles.facts}>
            <div><BriefcaseBusiness/><span>Open Positions<strong>{jobs.length}</strong></span></div>
            {location && <div><MapPin/><span>Location<strong>{location}</strong></span></div>}
            {sector && <div><Building2/><span>Industry<strong>{sector}</strong></span></div>}
            {size && <div><Users/><span>Team Size<strong>{size}</strong></span></div>}
            {founded && <div><CalendarDays/><span>Established<strong>{founded}</strong></span></div>}
            {companyNumber && <div><ShieldCheck/><span>Company Number<strong>{companyNumber}</strong></span></div>}
          </div>
        </section>
        <section className={styles.section}>
          <h2>Employer Description</h2>
          {description ? <p className={styles.description}>{description}</p> : <p className={styles.empty}>This verified employer has not added a company description yet.</p>}
        </section>
        {photos.length > 0 && <section className={styles.section}><h2>Office Photos</h2><div className={styles.photos}>{photos.map((photo,i)=><img key={photo} src={photo} alt={`${company} office ${i+1}`}/>)}</div></section>}
        <section className={styles.section} id="open-positions">
          <div className={styles.sectionHead}><h2>Open Positions</h2><span>{jobs.length} {jobs.length === 1 ? "job" : "jobs"}</span></div>
          {jobsError ? <p className={styles.empty}>Jobs are temporarily unavailable.</p> : jobs.length === 0 ? <p className={styles.empty}>This company has no active published jobs at the moment.</p> :
          <div className={styles.jobs}>{jobs.map(job => <Link className={styles.job} key={str(job.id)} href={`/jobs/${encodeURIComponent(get(job,["slug"]) || str(job.id))}`}>
            <div className={styles.jobLogo}>{logo ? <img src={logo} alt=""/> : <Building2 size={24}/>}</div>
            <div className={styles.jobBody}><span className={styles.jobType}>{get(job,["job_type","employment_type"]) || "Job Opportunity"}</span>
              <h3>{get(job,["title"]) || "Job Opportunity"}</h3>
              <div className={styles.jobMeta}>{get(job,["location"]) && <span><MapPin size={13}/>{str(job.location)}</span>}{salary(job) && <span><Wallet size={13}/>{salary(job)}</span>}{Boolean(job.created_at) && <span><Clock3 size={13}/>{dateText(job.created_at)}</span>}</div>
            </div><ArrowRight className={styles.jobArrow} size={19}/>
          </Link>)}</div>}
        </section>
      </div>
      <aside className={styles.sidebar}>
        <section className={styles.sideSection}><h2>Employer Location</h2><div className={styles.location}><MapPin size={26}/><strong>{location || "United Kingdom"}</strong><small>Location information provided by the employer</small></div></section>
        <section className={styles.sideSection}><h2>Company Information</h2><div className={styles.sideCard}>
          <div><CheckCircle2/><span>Verification<strong>Verified UK Employer</strong></span></div>
          <div><BriefcaseBusiness/><span>Open Positions<strong>{jobs.length}</strong></span></div>
          {size && <div><Users/><span>Team Size<strong>{size}</strong></span></div>}
          {sector && <div><Building2/><span>Industry<strong>{sector}</strong></span></div>}
          {companyNumber && <div><ShieldCheck/><span>Company Number<strong>{companyNumber}</strong></span></div>}
          {categories.length > 0 && <div><BriefcaseBusiness/><span>Hiring Categories<strong>{categories.join(", ")}</strong></span></div>}
        </div></section>
        {(website || safeEmail) && <section className={styles.sideSection}><h2>Contact Company</h2><div className={styles.contactCard}>
          {website && <a href={website} target="_blank" rel="noopener noreferrer"><Globe2 size={17}/> Visit company website <ExternalLink size={14}/></a>}
          {safeEmail && <a href={`mailto:${safeEmail}`}><Mail size={17}/> Email company <ArrowRight size={14}/></a>}
        </div></section>}
      </aside>
    </div>
  </div></main>;
}
