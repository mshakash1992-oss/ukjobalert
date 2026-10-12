import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EmployerVerificationClient from "./EmployerVerificationClient";

export const dynamic = "force-dynamic";

export default async function EmployerVerificationPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  if (user.user_metadata?.account_type !== "employer") {
    redirect("/account");
  }

  return <EmployerVerificationClient />;
}
