import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import EmployerShell from "../employer-shell";
import JobsManager from "./jobs-manager";

type Job = {id:string;slug:string;title:string;location:string|null;job_type:string|null;status:string;apply_clicks:number|null;created_at:string};
export default async function JobsPage(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)redirect("/login");
  if(user.user_metadata?.account_type!=="employer")redirect("/");
  const admin=createAdminClient();
  const {data:verification}=await admin.from("employer_verifications")
    .select("company_name,verification_status").eq("user_id",user.id).maybeSingle();
  const {data,error}=await admin.from("jobs")
    .select("id,slug,title,location,job_type,status,apply_clicks,created_at")
    .eq("employer_id",user.id).order("created_at",{ascending:false});
  const jobs=(data||[]) as Job[];
  const name=verification?.company_name||user.user_metadata?.full_name||"Employer";
  return <EmployerShell companyName={name} active="jobs">
    <JobsManager jobs={jobs} verified={verification?.verification_status==="verified"} loadError={error?.message||""}/>
  </EmployerShell>;
}
