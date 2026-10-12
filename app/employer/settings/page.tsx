import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import EmployerShell from "../employer-shell";
import PasswordForm from "./password-form";
import styles from "./settings.module.css";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (user.user_metadata?.account_type !== "employer") redirect("/");
  const admin = createAdminClient();
  const { data: verification } = await admin.from("employer_verifications")
    .select("company_name").eq("user_id", user.id).maybeSingle();
  const name = verification?.company_name || user.user_metadata?.full_name || "Employer";
  return <EmployerShell companyName={name} active="settings">
    <div className={styles.page}>
      <span className={styles.eyebrow}>ACCOUNT SECURITY</span>
      <h1>Change Password</h1>
      <p className={styles.intro}>Update your password to keep your employer account secure.</p>
      <div className={styles.card}>
        <h2>Change Password</h2>
        <p className={styles.description}>Enter your current password and choose a new one.</p>
        <PasswordForm email={user.email || ""} userId={user.id}/>
      </div>
      <div className={styles.account}><h2>Account Information</h2><div><span>Email Address</span><strong>{user.email || "Not available"}</strong></div><div><span>Account Type</span><strong>Employer</strong></div></div>
    </div>
  </EmployerShell>;
}
