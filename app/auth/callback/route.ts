import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function signInError(request: NextRequest) {
  const target = new URL("/login", request.url);
  target.searchParams.set("oauth_error", "google");
  return NextResponse.redirect(target);
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");

  if (!code || searchParams.has("error")) {
    return signInError(request);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return signInError(request);
  }

  const requestedType = searchParams.get("account_type");
  const accountType =
    requestedType === "employer"
      ? "employer"
      : requestedType === "jobseeker" || requestedType === "job_seeker"
        ? "jobseeker"
        : data.user.user_metadata?.account_type === "employer"
          ? "employer"
          : "jobseeker";

  if (requestedType || !data.user.user_metadata?.account_type) {
    const { error: metadataError } = await supabase.auth.updateUser({
      data: { account_type: accountType },
    });
    if (metadataError) {
      return signInError(request);
    }
  }

  const requestedNext = searchParams.get("next");
  const destination =
    requestedNext === "/post-job"
      ? requestedNext
      : accountType === "employer"
        ? "/employer/verification"
        : "/account";

  return NextResponse.redirect(new URL(destination, request.url));
}
