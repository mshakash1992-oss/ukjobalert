import { redirect } from "next/navigation";
import Link from "next/link";
import { BookmarkCheck, BriefcaseBusiness, CalendarDays, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import EmployerShell from "../employer-shell";
import RemoveShortlist from "./remove-shortlist";
import styles from "./shortlist.module.css";

type ShortlistRow={id:string;application_id:string;created_at:string};
type Application={id:string;user_id:string;job_id:string;status:string;applied_at:string};
export default async function ShortlistPage(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)redirect("/login");
  if(user.user_metadata?.account_type!=="employer")redirect("/");
  const admin=createAdminClient();
  const {data:verification}=await admin.from("employer_verifications").select("company_name").eq("user_id",user.id).maybeSingle();
  const {data:jobs,error:jobsError}=await admin.from("jobs").select("id,title").eq("employer_id",user.id);
  const ownedJobs=(jobs||[]).map(j=>({id:String(j.id),title:String(j.title||"Untitled job")}));
  const jobNames=new Map(ownedJobs.map(j=>[j.id,j.title]));
  const {data:rows,error:shortlistError}=await admin.from("employer_shortlists").select("id,application_id,created_at").eq("employer_id",user.id).order("created_at",{ascending:false});
  const shortlisted=(rows||[]) as ShortlistRow[];
  const applicationIds=shortlisted.map(r=>r.application_id);
  let applications:Application[]=[];
  let applicationError="";
  if(applicationIds.length){
    const {data,error}=await admin.from("job_applications").select("id,user_id,job_id,status,applied_at").in("id",applicationIds);
    applications=(data||[]) as Application[];
    applicationError=error?.message||"";
  }
  const applicationMap=new Map(applications.map(a=>[a.id,a]));
  const valid=shortlisted.filter(r=>{const a=applicationMap.get(r.application_id);return a&&jobNames.has(a.job_id)});
  const companyName=verification?.company_name||user.user_metadata?.full_name||"Employer";
  const error=jobsError?.message||shortlistError?.message||applicationError;
  return <EmployerShell companyName={companyName} active="shortlist">
    <div className={styles.wrap}>
      <span className={styles.eyebrow}>EMPLOYER WORKSPACE</span>
      <h1>Shortlist Candidates</h1><p className={styles.intro}>Applications you have saved for further review.</p>
      <div className={styles.panel}><div className={styles.head}><div><h2>Shortlisted Applications</h2><p>{valid.length} saved</p></div><Link href="/employer/applications"><ArrowLeft size={16}/> All Applicants</Link></div>
      {error?<p className={styles.empty} role="alert">Could not load shortlists: {error}</p>:valid.length===0?<div className={styles.empty}><BookmarkCheck size={34}/><p>No shortlisted applicants yet.</p><span>Visit Applicants to shortlist an application.</span></div>:valid.map(row=>{const a=applicationMap.get(row.application_id)!;return <article className={styles.item} key={row.id}>
        <div className={styles.icon}><BriefcaseBusiness size={22}/></div><div className={styles.info}><strong>{jobNames.get(a.job_id)}</strong><span>Applicant ID: {a.user_id.slice(0,8)}…</span><span>Status: {a.status}</span></div>
        <div className={styles.date}><CalendarDays size={15}/>{new Date(row.created_at).toLocaleDateString("en-GB")}</div><RemoveShortlist employerId={user.id} applicationId={a.id}/>
      </article>})}</div>
    </div>
  </EmployerShell>;
}
