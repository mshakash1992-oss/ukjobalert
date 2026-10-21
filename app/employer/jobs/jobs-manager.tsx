"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BriefcaseBusiness, CalendarDays, Eye, MapPin, Pencil, Plus, Search, SlidersHorizontal } from "lucide-react";
import styles from "./jobs-manager.module.css";
import JobActions from "./job-actions";

type Job={id:string;slug:string;title:string;location:string|null;job_type:string|null;status:string;apply_clicks:number|null;created_at:string};
export default function JobsManager({jobs,verified,loadError}:{jobs:Job[];verified:boolean;loadError:string}){
  const [query,setQuery]=useState("");
  const [status,setStatus]=useState("all");
  const [sort,setSort]=useState("newest");
  const statuses=Array.from(new Set(jobs.map(j=>j.status).filter(Boolean)));
  const shown=useMemo(()=>jobs.filter(j=>(status==="all"||j.status===status)&&
    `${j.title} ${j.location||""} ${j.job_type||""}`.toLowerCase().includes(query.trim().toLowerCase())
  ).sort((a,b)=>sort==="oldest"?(Date.parse(a.created_at)||0)-(Date.parse(b.created_at)||0):
    sort==="title"?a.title.localeCompare(b.title):(Date.parse(b.created_at)||0)-(Date.parse(a.created_at)||0)
  ),[jobs,query,status,sort]);
  const published=jobs.filter(j=>j.status==="published").length;
  const drafts=jobs.filter(j=>j.status==="draft").length;
  return <div className={styles.page}>
    <div className={styles.header}>
      <div><span className={styles.eyebrow}>EMPLOYER WORKSPACE</span><h1>My Jobs</h1><p>Manage and review all vacancies posted by your company.</p></div>
      {verified?<Link href="/post-job" className={styles.post}><Plus size={18}/> Submit Job</Link>:<Link href="/employer/verification" className={styles.verify}>Verify to Post</Link>}
    </div>
    <div className={styles.summary}>
      <div><strong>{jobs.length}</strong><span>Total Jobs</span></div>
      <div><strong>{published}</strong><span>Published</span></div>
      <div><strong>{drafts}</strong><span>Drafts</span></div>
    </div>
    <section className={styles.panel}>
      <div className={styles.panelHead}><div><h2>Manage Jobs</h2><p>{shown.length} {shown.length===1?"vacancy":"vacancies"} found</p></div></div>
      <div className={styles.filters}>
        <label className={styles.search}><Search size={19}/><input aria-label="Search jobs" placeholder="Search jobs..." value={query} onChange={e=>setQuery(e.target.value)}/></label>
        <label className={styles.select}><SlidersHorizontal size={17}/><select aria-label="Filter by status" value={status} onChange={e=>setStatus(e.target.value)}><option value="all">All Statuses</option>{statuses.map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}</select></label>
        <label className={styles.select}>Sort by: <select aria-label="Sort jobs" value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="title">Job Title</option></select></label>
      </div>
      {loadError?<div className={styles.empty} role="alert">Unable to load jobs: {loadError}</div>:shown.length===0?<div className={styles.empty}><BriefcaseBusiness size={34}/><h3>No jobs found</h3><p>{jobs.length?"Try another search or status filter.":"You haven't posted any jobs yet."}</p></div>:<div className={styles.list}>{shown.map(job=><article key={job.id} className={styles.job}>
        <div className={styles.jobIcon}><BriefcaseBusiness size={24}/></div>
        <div className={styles.details}><Link href={`/jobs/${job.slug}`} className={styles.title}>{job.title}</Link><div className={styles.meta}><span><MapPin size={15}/>{job.location||"Location not specified"}</span><span><BriefcaseBusiness size={15}/>{job.job_type||"Not specified"}</span><span><CalendarDays size={15}/>{job.created_at?new Date(job.created_at).toLocaleDateString("en-GB"):"—"}</span></div></div>
        <span className={`${styles.status} ${job.status==="published"?styles.published:job.status==="draft"?styles.draft:styles.other}`}>{job.status}</span>
        <span className={styles.clicks} title="Apply clicks, not unique views"><Eye size={17}/>{job.apply_clicks||0} clicks</span>
        <div className="flex flex-wrap items-center gap-2">
          <Link className={styles.edit} href={`/employer/jobs/${job.id}/edit`}><Pencil size={16}/> Edit</Link>
          <JobActions jobId={job.id} title={job.title} status={job.status}/>
        </div>
      </article>)}</div>}
    </section>
  </div>;
}
