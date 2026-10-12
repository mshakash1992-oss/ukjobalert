import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getVerifiedEmployer, validateJob } from "@/lib/employer-jobs";

export async function POST(request: Request) {
  try {
    const auth = await getVerifiedEmployer();
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const checked = validateJob(body);
    if ("error" in checked) {
      return NextResponse.json({ error: checked.error }, { status: 400 });
    }

    // Use the server-side verified record, never company details supplied by a browser.
    const { data: verification, error: verificationError } = await auth.db
      .from("employer_verifications")
      .select("id, company_name, company_number, verification_status")
      .eq("user_id", auth.user.id)
      .eq("verification_status", "verified")
      .maybeSingle();

    if (verificationError) {
      console.error("Job verification lookup failed:", verificationError);
      return NextResponse.json({ error: "Unable to confirm employer verification." }, { status: 500 });
    }
    if (!verification) {
      return NextResponse.json({ error: "Verified employer required." }, { status: 403 });
    }

    const slugBase = checked.value.title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 65) || "job";
    const slug = `${slugBase}-${randomUUID().slice(0, 8)}`;

    const { data, error } = await auth.db
      .from("jobs")
      .insert({
        ...checked.value,
        slug,
        employer_id: auth.user.id,
        employer_verification_id: verification.id,
        company_name: verification.company_name,
        company_number: verification.company_number,
        apply_method: checked.value.apply_email ? "email" : "url",
        workplace_type: "On-site",
      })
      .select("slug")
      .single();

    if (error) {
      console.error("Job insert failed:", error);
      return NextResponse.json({ error: "Unable to save job. Check server logs for the database error." }, { status: 500 });
    }

    return NextResponse.json({ job: data }, { status: 201 });
  } catch (error) {
    console.error("Job create request failed:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
