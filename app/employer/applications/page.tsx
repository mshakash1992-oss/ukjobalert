import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import EmployerShell from "../employer-shell";
import ApplicationsList from "./applications-list";

type App = {id:string;status:string|null;applied_at:string|null;user_id:string;job_id:string};
export default async function ApplicationsPage(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/login");
  if(user.user_metadata?.account_type!=="employer") redirect("/");
  const admin=createAdminClient();
  const {data:verification}=await admin.from("employer_verifications").select("company_name").eq("user_id",user.id).maybeSingle();
  const {data:jobs}=await admin.from("jobs").select("id,title").eq("employer_id",user.id);
  const ownedJobs=(jobs||[]).map(j=>({id:String(j.id),title:String(j.title||"Untitled job")}));
  const ids=ownedJobs.map(j=>j.id);
  let applications:App[]=[];
  if(ids.length){
    const {data}=await admin.from("job_applications").select("id,status,applied_at,user_id,job_id").in("job_id",ids).order("applied_at",{ascending:false});
    applications=(data||[]) as App[];
  }
  // Load the employer's saved application IDs so existing shortlists appear on first render.
  let shortlisted: string[] = [];
  if (applications.length) {
    const { data: shortlistRows, error: shortlistError } = await admin
      .from("employer_shortlists")
      .select("application_id")
      .eq("employer_id", user.id)
      .in("application_id", applications.map(application => application.id));
    if (shortlistError) throw new Error(`Could not load shortlists: ${shortlistError.message}`);
    shortlisted = (shortlistRows || []).map(row => String(row.application_id));
  }
  const name=verification?.company_name||user.user_metadata?.full_name||"Employer";
  return <EmployerShell companyName={name} active="applications">
    <ApplicationsList applications={applications} jobs={ownedJobs} employerId={user.id} initialShortlisted={shortlisted}/>
  </EmployerShell>;
}
