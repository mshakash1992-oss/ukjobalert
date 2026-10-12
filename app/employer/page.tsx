import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertTriangle, ArrowRight, BriefcaseBusiness, Eye, UsersRound, Clock3, Star, BellRing, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import EmployerShell from "./employer-shell";
import styles from "./employer.module.css";

type Job={id:string;slug:string;title:string;status:string;apply_clicks:number|null;created_at:string};
type Application={id:string;job_id:string;created_at:string;status?:string|null};
export default async function EmployerDashboardPage(){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect("/login");
 if(user.user_metadata?.account_type!=="employer")redirect("/");
 const admin=createAdminClient();
 const {data:verification}=await admin.from("employer_verifications").select("company_name,company_number,verification_status").eq("user_id",user.id).maybeSingle();
 const {data:jobRows}=await admin.from("jobs").select("id,slug,title,status,apply_clicks,created_at").eq("employer_id",user.id).order("created_at",{ascending:false});
 const jobs=(jobRows||[]) as Job[];const jobIds=jobs.map(j=>j.id);
 let applications:Application[]=[];
 if(jobIds.length){const {data}=await admin.from("job_applications").select("id,job_id,created_at,status").in("job_id",jobIds).order("created_at",{ascending:false}).limit(1000);applications=(data||[]) as Application[];}
 const postedJobs=jobs.length;
 const activeJobs=jobs.filter(j=>j.status==="published").length;
 const clicks=jobs.reduce((n,j)=>n+Number(j.apply_clicks||0),0);
 const companyName=verification?.company_name||user.user_metadata?.full_name||user.email?.split("@")[0]||"Employer";
 const verified=verification?.verification_status==="verified";
 const recent=applications.slice(0,5);
 const jobNames=new Map(jobs.map(j=>[j.id,j.title]));
  return <EmployerShell companyName={companyName} active="dashboard">
         {!verified && <section className={styles.verificationAlert}>
       <div className={styles.alertIcon}><AlertTriangle /></div>
       <div className={styles.alertText}><h2>Company verification required</h2><p>Verify your company before publishing new jobs.</p></div>
       <Link href="/employer/verification">Verify company <ArrowRight size={16}/></Link>
     </section>}

     <section className={`${styles.dashboardBlock} ${styles.careerStatsBlock}`}>
       <h1 className={styles.careerSectionTitle}>Applications statistics</h1>
       <div className={styles.stats}>
         <article><div className={styles.statIcon}><Send /></div><div><strong>{postedJobs}</strong><span>Posted Jobs</span></div></article>
         <article><div className={styles.statIcon}><Star /></div><div><strong>{activeJobs}</strong><span>Published Jobs</span></div></article>
         <article><div className={styles.statIcon}><BellRing /></div><div><strong>{applications.length}</strong><span>Applications</span></div></article>
         <article><div className={styles.statIcon}><Eye /></div><div><strong>{clicks}</strong><span>Apply Clicks</span></div></article>
       </div>
       <p className={styles.statsNote}>Application total reflects up to 1,000 recent records. Apply clicks are not unique page views.</p>
     </section>

     <section className={`${styles.dashboardBlock} ${styles.careerApplicantsBlock}`}>
       <div className={styles.careerPanelTitle}><h2>Recent Applicants</h2><Link href="/employer/applications">View all <ArrowRight size={15}/></Link></div>
       {recent.length === 0
         ? <p className={styles.careerEmpty}>No applicants found.</p>
         : <div className={styles.applicantList}>{recent.map(a => <div className={styles.applicantRow} key={a.id}>
             <div className={styles.applicantSymbol}><UsersRound /></div>
             <div><strong>Application received</strong><span>{jobNames.get(a.job_id) || "Job vacancy"}</span></div>
             <span className={styles.applicantDate}><Clock3 size={14}/>{new Date(a.created_at).toLocaleDateString("en-GB")}</span>
           </div>)}</div>}
     </section>

     <section className={`${styles.dashboardBlock} ${styles.careerJobsBlock}`}>
       <div className={styles.careerPanelTitle}><h2>Recent Jobs</h2><Link href="/employer/jobs">My Jobs <ArrowRight size={15}/></Link></div>
       <div className={styles.jobList}>
         {jobs.slice(0,5).map(job => <article className={styles.job} key={job.id}>
           <div className={styles.jobIcon}><BriefcaseBusiness /></div>
           <div className={styles.jobInfo}><Link href={`/jobs/${job.slug}`}>{job.title}</Link><span>Posted {new Date(job.created_at).toLocaleDateString("en-GB")}</span></div>
           <span className={styles.status}>{job.status}</span>
           <div className={styles.metric}><Eye/><strong>{job.apply_clicks || 0}</strong><span>Clicks</span></div>
           <Link href={`/employer/jobs/${job.id}/edit`} className={styles.edit}>Edit</Link>
         </article>)}
         {jobs.length === 0 && <p className={styles.emptyJobs}>No jobs posted yet. <Link href={verified ? "/post-job" : "/employer/verification"}>{verified ? "Post a job" : "Verify your company"}</Link></p>}
       </div>
     </section>
</EmployerShell>;
}
