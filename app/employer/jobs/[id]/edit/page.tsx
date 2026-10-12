import {notFound,redirect} from "next/navigation";
import Link from "next/link";
import {createClient} from "@/lib/supabase/server";
import {createAdminClient} from "@/lib/supabase/admin";
import EmployerJobForm from "@/components/EmployerJobForm";
import styles from "@/app/post-job/post-job.module.css";
export const dynamic="force-dynamic";
export default async function EditJobPage({params}:{params:Promise<{id:string}>}){const {id}=await params;const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect("/login");if(user.user_metadata?.account_type!=="employer")redirect("/");const db=createAdminClient();const {data:v}=await db.from("employer_verifications").select("company_name,verification_status").eq("user_id",user.id).maybeSingle();if(v?.verification_status!=="verified")redirect("/employer/verification");const {data:job}=await db.from("jobs").select("id,title,category,job_type,location,salary,description,apply_url,apply_email,status").eq("id",id).eq("employer_id",user.id).maybeSingle();if(!job)notFound();return <main className={styles.page}><section className={styles.hero}><div className={styles.container}><Link href="/employer/jobs" className={styles.back}>← Manage Jobs</Link><div className={styles.heroRow}><div><span>EMPLOYER</span><h1>Edit Job</h1><p>Update your real vacancy information.</p></div></div></div></section><section className={styles.content}><div className={styles.container}><EmployerJobForm initial={job} companyName={v.company_name||"Employer"}/></div></section></main>}
