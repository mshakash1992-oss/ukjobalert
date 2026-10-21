import { QUARANTINED_JOB_SLUGS } from "@/lib/job-publication";
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const parts = request.nextUrl.pathname.split("/").filter(Boolean);
  if (parts.length === 2 && parts[0] === "jobs" && QUARANTINED_JOB_SLUGS.has(parts[1])) {
    return new NextResponse("This test vacancy is no longer available.", {
      status: 410, headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex, nofollow" },
    });
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};