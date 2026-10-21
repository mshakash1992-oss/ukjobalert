import { jobContentError, QUARANTINED_JOB_SLUGS } from "@/lib/job-publication";
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
    if (body && typeof body === "object" && "action" in body) {
      const action = body.action;
      const jobId = body.jobId;
      if (!["close", "reopen", "delete"].includes(action) ||
          typeof jobId !== "string" ||
          !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(jobId)) {
        return NextResponse.json({ error: "Invalid job action or ID." }, { status: 400 });
      }

      // The server authenticates the employer and scopes every operation to its own jobs.
      const owned = await auth.db.from("jobs")
        .select("id,status,slug,title,description").eq("id", jobId).eq("employer_id", auth.user.id).maybeSingle();
      if (owned.error) {
        console.error("Job ownership check failed:", owned.error);
        return NextResponse.json({ error: "Unable to check job ownership." }, { status: 500 });
      }
      if (!owned.data) {
        return NextResponse.json({ error: "Job not found or access denied." }, { status: 404 });
      }

      if (action === "delete") {
        const removed = await auth.db.from("jobs").delete()
          .eq("id", jobId).eq("employer_id", auth.user.id).select("id").maybeSingle();
        if (removed.error) {
          console.error("Job deletion failed:", removed.error);
          return NextResponse.json({
            error: "Unable to delete this job. It may have linked applications or other records."
          }, { status: 409 });
        }
        if (!removed.data) {
          return NextResponse.json({ error: "Job was not deleted." }, { status: 404 });
        }
        return NextResponse.json({ success: true, action });
      }

      if (action === "reopen") {
        const contentError = jobContentError(owned.data.title || "", owned.data.description || "");
        if (QUARANTINED_JOB_SLUGS.has(owned.data.slug) || contentError) return NextResponse.json({ error: contentError || "This test vacancy is quarantined. Create a new real vacancy." }, { status: 400 });
      }
      // 'draft' is an existing supported status; closing removes the public published state.
      const nextStatus = action === "close" ? "draft" : "published";
      const changed = await auth.db.from("jobs").update({ status: nextStatus })
        .eq("id", jobId).eq("employer_id", auth.user.id).select("id,status").maybeSingle();
      if (changed.error) {
        console.error("Job status update failed:", changed.error);
        return NextResponse.json({ error: "Unable to change job status." }, { status: 500 });
      }
      if (!changed.data) {
        return NextResponse.json({ error: "Job was not updated." }, { status: 404 });
      }
      return NextResponse.json({ success: true, job: changed.data });
    }

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
