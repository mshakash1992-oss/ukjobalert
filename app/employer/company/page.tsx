import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import EmployerShell from "../employer-shell";
import ProfileEditor from "./profile-editor";

export default async function CompanyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (user.user_metadata?.account_type !== "employer") redirect("/");
  const admin = createAdminClient();
  const { data: verification } = await admin.from("employer_verifications")
    .select("company_name,company_number,verification_status")
    .eq("user_id", user.id).maybeSingle();
  const name = verification?.company_name || user.user_metadata?.full_name || "Employer";
  const meta = user.user_metadata || {};
  return <EmployerShell companyName={name} active="company">
    <ProfileEditor companyName={name} companyNumber={verification?.company_number || ""}
      verificationStatus={verification?.verification_status || "not verified"}
      email={user.email || ""} initial={{
        website: typeof meta.company_website === "string" ? meta.company_website : "",
        phone: typeof meta.company_phone === "string" ? meta.company_phone : "",
        teamSize: typeof meta.company_team_size === "string" ? meta.company_team_size : "",
        category: typeof meta.company_category === "string" ? meta.company_category : "",
        description: typeof meta.company_description === "string" ? meta.company_description : "",
        location: typeof meta.company_location === "string" ? meta.company_location : "",
        facebook: typeof meta.company_facebook === "string" ? meta.company_facebook : "",
        linkedin: typeof meta.company_linkedin === "string" ? meta.company_linkedin : "",
        twitter: typeof meta.company_twitter === "string" ? meta.company_twitter : ""
      }} />
  </EmployerShell>;
}
