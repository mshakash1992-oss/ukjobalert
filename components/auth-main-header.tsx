import MainHeader from "@/components/main-header";
import { createClient } from "@/lib/supabase/server";

export default async function AuthMainHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  const isAdmin = Boolean(
    user?.email && adminEmails.includes(user.email.toLowerCase())
  );

  return (
    <MainHeader
      loggedIn={Boolean(user)}
      displayName={
        user?.user_metadata?.full_name?.trim() ||
        user?.email?.split("@")[0] ||
        "Account"
      }
      accountType={user?.user_metadata?.account_type}
      isAdmin={isAdmin}
    />
  );
}
