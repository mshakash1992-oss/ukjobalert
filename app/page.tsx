import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowRight,
  BellRing,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import MainHeader from "@/components/main-header";

export const metadata: Metadata = {
  title: "UK Jobs: Latest Jobs in the UK",
  description:
    "Search UK jobs and current vacancies from verified employers. Find jobs in the UK by title, location, sector and employment type on UKJobAlert.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "UKJobAlert",
    title: "UK Jobs: Latest Jobs in the UK | UKJobAlert",
    description:
      "Search UK jobs and current vacancies from verified employers across the United Kingdom.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Jobs: Latest Jobs in the UK | UKJobAlert",
    description:
      "Search UK jobs and current vacancies from verified employers across the United Kingdom.",
  },
  robots: { index: true, follow: true },
};

type Job = {
  id: string;
  slug: string;
  company_name: string;
  company_logo_url: string | null;
  company_number: string;
  title: string;
  category: string;
  job_type: string;
  location: string;
  salary: string | null;
  created_at: string;
};

const sectors = [
  { name: "Healthcare", icon: "https://cdn-icons-png.flaticon.com/512/5405/5405344.png" },
  { name: "Hospitality", icon: "https://cdn-icons-png.flaticon.com/512/4488/4488970.png" },
  { name: "Construction", icon: "https://cdn-icons-png.flaticon.com/512/16235/16235921.png" },
  { name: "Driving", icon: "https://cdn-icons-png.flaticon.com/512/6104/6104007.png" },
  { name: "Cleaning", icon: "https://cdn-icons-png.flaticon.com/512/12003/12003562.png" },
  { name: "Warehouse", icon: "https://cdn-icons-png.flaticon.com/512/17452/17452560.png" },
  { name: "Office", icon: "https://cdn-icons-png.flaticon.com/512/9973/9973985.png" },
  { name: "Retail", icon: "https://cdn-icons-png.flaticon.com/512/12315/12315929.png" },
];

const jobTypes = [
  "Full Time",
  "Part Time",
  "Temporary",
  "Contract",
  "Apprenticeship",
  "Internship",
];

function timeAgo(date: string) {
  const difference = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(difference / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
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
  if (!salary?.trim()) return "Salary not specified";

  const cleaned = salary
    .trim()
    .replace(/^(?:\u00A3|Â\u00A3|â‚£|┬ú|Tú)\s*/i, "");

  return /^\d/.test(cleaned) ? `\u00A3${cleaned}` : salary.trim();
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const loggedIn = Boolean(user);
  const accountType = user?.user_metadata?.account_type;
  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Account";
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const isAdmin = Boolean(
    user?.email && adminEmails.includes(user.email.toLowerCase())
  );
  const now = new Date().toISOString();

  const { data: jobsData, error: jobsError } = await supabase
    .from("jobs")
    .select(`
      id,
      slug,
      company_name,
      company_logo_url,
      company_number,
      title,
      category,
      job_type,
      location,
      salary,
      created_at
    `)
    .eq("status", "published")
    .gt("expires_at", now)
    .order("created_at", { ascending: false })
    .limit(6);

  if (jobsError) console.error(jobsError);
  const jobs = (jobsData || []) as Job[];

  const admin = createAdminClient();
  const [liveJobsResult, ...sectorResults] = await Promise.all([
    admin
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .gt("expires_at", now),
    ...sectors.map((sector) =>
      admin
        .from("jobs")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .eq("category", sector.name)
        .gt("expires_at", now)
    ),
  ]);

  const liveJobsCount = liveJobsResult.count || 0;
  const sectorData = sectors.map((sector, index) => ({
    ...sector,
    count: sectorResults[index]?.count || 0,
  }));

  const typeResults = await Promise.all(
    jobTypes.map((jobType) =>
      admin
        .from("jobs")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .eq("job_type", jobType)
        .gt("expires_at", now)
    )
  );

  const jobTypeData = jobTypes.map((name, index) => ({
    name,
    count: typeResults[index]?.count || 0,
  }));

  const seekerBaseHref = !loggedIn ? "/signup" : accountType === "employer" ? "/jobs" : "/account";

  return (
    <main className="career-page">
      <MainHeader loggedIn={loggedIn} displayName={displayName} accountType={accountType} isAdmin={isAdmin}/>
      <section className="career-hero">
        <div className="career-hero-bg"/>
        <div className="career-hero-inner">
          <p className="career-kicker">Find your next opportunity</p>
          <h1>Find The Job That Fits Your Life</h1>
          <p className="career-lead">Search current vacancies from verified UK employers. Find roles by title, location, sector and employment type.</p>
          <form action="/jobs" method="GET" className="career-search">
            <label><Search/><input name="q" placeholder="Job title, keywords..."/></label>
            <label><MapPin/><input name="location" placeholder="City or postcode"/></label>
            <label><BriefcaseBusiness/><select name="category" defaultValue=""><option value="">All Categories</option>{sectors.map(s=><option key={s.name}>{s.name}</option>)}</select></label>
            <button>Search Job</button>
          </form>
          <div className="career-popular"><b>Popular Searches:</b>{["Care Assistant","Driver","Warehouse","Cleaner","Office"].map(k=><Link key={k} href={"/jobs?q="+encodeURIComponent(k)}>{k}</Link>)}</div>
        </div>
      </section>

      <section className="career-section career-categories"><div className="career-wrap">
        <div className="career-heading"><h2>Popular Job Categories</h2><p>Explore opportunities across the UK's most active employment sectors.</p></div>
        <div className="category-grid">{sectorData.map(({name,count})=><Link href={"/jobs?category="+encodeURIComponent(name)} key={name} className="category-card"><span className="category-icon"><BriefcaseBusiness/></span><div><h3>{name}</h3><p>{count} {count===1?"Job":"Jobs"} Available</p></div><ChevronRight/></Link>)}</div>
        <div className="center-link"><Link href="/jobs">Browse All Categories <ArrowRight/></Link></div>
      </div></section>

      <section className="career-section how-section"><div className="career-wrap">
        <div className="career-heading"><h2>How It Works?</h2><p>Job hunting made simple, secure and straightforward.</p></div>
        <div className="steps">
          <div className="step"><span><ClipboardList/></span><h3>Create An Account</h3><p>Sign up for free and set up your UKJobAlert account in minutes.</p></div>
          <div className="step"><span><Search/></span><h3>Search Jobs</h3><p>Browse current vacancies from employers across the United Kingdom.</p></div>
          <div className="step"><span><CheckCircle2/></span><h3>Apply For Job</h3><p>Review the details and apply using the route supplied by the employer.</p></div>
        </div>
      </div></section>

      <section className="career-section featured-section"><div className="career-wrap">
        <div className="career-heading"><h2>Featured Jobs</h2><p>Discover the latest vacancies from employers using UKJobAlert.</p></div>
        {jobs.length===0?<div className="empty-jobs">New vacancies will appear here when published.</div>:<div className="featured-grid">{jobs.map(job=><Link href={"/jobs/"+job.slug} key={job.id} className="featured-card">
          <div className="job-card-top"><div className="company-logo">{job.company_logo_url?<img src={job.company_logo_url} alt={job.company_name+" logo"}/>:initials(job.company_name)}</div><span className="verified"><ShieldCheck/> Verified</span></div>
          <h3>{job.title}</h3><p className="company">{job.company_name}</p>
          <div className="job-meta"><span><MapPin/>{job.location}</span><span><Clock3/>{job.job_type}</span><span><BriefcaseBusiness/>{formatSalary(job.salary)}</span></div>
          <div className="job-bottom"><span>{timeAgo(job.created_at)}</span><b>View Job <ArrowRight/></b></div>
        </Link>)}</div>}
        <div className="center-link"><Link href="/jobs">Browse All Jobs <ArrowRight/></Link></div>
      </div></section>

      <section className="local-section"><div className="career-wrap local-grid">
        <div className="local-copy"><p className="career-kicker">Jobs across the UK</p><h2>Browse Local Jobs</h2><p>Find opportunities in major UK cities and surrounding areas.</p><Link href="/jobs">Explore All Jobs <ArrowRight/></Link></div>
        <div className="city-grid">{["London","Manchester","Birmingham","Leeds","Glasgow","Liverpool","Bristol","Edinburgh"].map(city=><Link href={"/jobs?location="+encodeURIComponent(city)} key={city}><MapPin/><span>{city}<small>View vacancies</small></span><ChevronRight/></Link>)}</div>
      </div></section>

      <section className="career-stats"><div className="career-wrap stats-grid">
        <div><strong>{liveJobsCount}+</strong><span>Live Jobs</span></div><div><strong>100%</strong><span>UK Focused</span></div><div><strong>Verified</strong><span>Employer Checks</span></div><div><strong>24/7</strong><span>Job Search</span></div>
      </div></section>
    </main>
  );
}
}
