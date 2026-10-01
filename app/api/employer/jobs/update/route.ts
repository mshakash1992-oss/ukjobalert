import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  deleteJobMedia,
  mediaFileFromForm,
  uploadJobMedia,
  validateJobMedia,
} from "@/lib/job-media";

const allowedCategories = ["Healthcare", "Construction", "Hospitality", "Driving", "Warehouse", "Retail", "IT & Tech", "Education", "Cleaning", "Office", "Other"];
const allowedJobTypes = ["Full Time", "Part Time", "Temporary", "Contract", "Apprenticeship", "Internship"];
function validEmail(value: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function validUrl(value: string) { try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:"; } catch { return false; } }
function text(form: FormData, key: string) { const value = form.get(key); return typeof value === "string" ? value.trim() : ""; }

export async function POST(request: Request) {
  const newlyUploaded: string[] = [];
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return NextResponse.json({ error: "Please log in first." }, { status: 401 });
    if (user.user_metadata?.account_type !== "employer") return NextResponse.json({ error: "Employer account required." }, { status: 403 });

    const form = await request.formData();
    const jobId = text(form, "jobId");
    const title = text(form, "title");
    const category = text(form, "category");
    const jobType = text(form, "jobType");
    const location = text(form, "location");
    const salary = text(form, "salary");
    const description = text(form, "description");
    const applyMethod = text(form, "applyMethod");
    const applyEmail = text(form, "applyEmail").toLowerCase();
    const applyUrl = text(form, "applyUrl");
    const removeCompanyLogo = text(form, "removeCompanyLogo") === "true";
    const removeJobImage = text(form, "removeJobImage") === "true";
    const companyLogo = mediaFileFromForm(form, "companyLogo");
    const jobImage = mediaFileFromForm(form, "jobImage");

    if (!jobId) return NextResponse.json({ error: "Job ID is missing." }, { status: 400 });
    if (title.length < 3 || title.length > 150) return NextResponse.json({ error: "Enter a valid job title." }, { status: 400 });
    if (!allowedCategories.includes(category)) return NextResponse.json({ error: "Select a valid category." }, { status: 400 });
    if (!allowedJobTypes.includes(jobType)) return NextResponse.json({ error: "Select a valid job type." }, { status: 400 });
    if (location.length < 2 || location.length > 150) return NextResponse.json({ error: "Enter a valid location." }, { status: 400 });
    if (description.length < 50) return NextResponse.json({ error: "Job description must contain at least 50 characters." }, { status: 400 });
    if (description.length > 10000) return NextResponse.json({ error: "Job description is too long." }, { status: 400 });
    if (applyMethod !== "email" && applyMethod !== "url") return NextResponse.json({ error: "Select a valid application method." }, { status: 400 });
    if (applyMethod === "email" && !validEmail(applyEmail)) return NextResponse.json({ error: "Enter a valid application email." }, { status: 400 });
    if (applyMethod === "url" && !validUrl(applyUrl)) return NextResponse.json({ error: "Enter a valid application URL." }, { status: 400 });
    const logoError = await validateJobMedia(companyLogo, "logo"); if (logoError) return NextResponse.json({ error: logoError }, { status: 400 });
    const imageError = await validateJobMedia(jobImage, "job"); if (imageError) return NextResponse.json({ error: imageError }, { status: 400 });

    const admin = createAdminClient();
    const { data: verification, error: verificationError } = await admin.from("employer_verifications").select("verification_status").eq("user_id", user.id).maybeSingle();
    if (verificationError || !verification || verification.verification_status !== "verified") return NextResponse.json({ error: "Your employer verification is not active." }, { status: 403 });

    const { data: existingJob, error: jobError } = await admin.from("jobs")
      .select("id,employer_id,status,company_logo_url,job_image_url")
      .eq("id", jobId).maybeSingle();
    if (jobError || !existingJob) return NextResponse.json({ error: "Job not found." }, { status: 404 });
    if (existingJob.employer_id !== user.id) return NextResponse.json({ error: "You cannot edit this job." }, { status: 403 });

    let companyLogoUrl = removeCompanyLogo ? null : existingJob.company_logo_url;
    let jobImageUrl = removeJobImage ? null : existingJob.job_image_url;
    if (companyLogo) { const uploaded = await uploadJobMedia(admin, user.id, companyLogo, "logo"); companyLogoUrl = uploaded.url; newlyUploaded.push(uploaded.url); }
    if (jobImage) { const uploaded = await uploadJobMedia(admin, user.id, jobImage, "job"); jobImageUrl = uploaded.url; newlyUploaded.push(uploaded.url); }

    const { data: updatedJob, error: updateError } = await admin.from("jobs").update({
      title, category, job_type: jobType, location, salary: salary || null, description,
      apply_method: applyMethod,
      apply_email: applyMethod === "email" ? applyEmail : null,
      apply_url: applyMethod === "url" ? applyUrl : null,
      company_logo_url: companyLogoUrl,
      job_image_url: jobImageUrl,
      updated_at: new Date().toISOString(),
    }).eq("id", jobId).eq("employer_id", user.id).select("id,slug,title,status").single();

    if (updateError) {
      console.error("Job update error:", updateError);
      for (const url of newlyUploaded) await deleteJobMedia(admin, url);
      return NextResponse.json({ error: "Unable to update job." }, { status: 500 });
    }

    if ((removeCompanyLogo || companyLogo) && existingJob.company_logo_url && existingJob.company_logo_url !== companyLogoUrl) await deleteJobMedia(admin, existingJob.company_logo_url);
    if ((removeJobImage || jobImage) && existingJob.job_image_url && existingJob.job_image_url !== jobImageUrl) await deleteJobMedia(admin, existingJob.job_image_url);

    return NextResponse.json({ success: true, message: "Job updated successfully.", job: updatedJob });
  } catch (error) {
    console.error("Employer edit job error:", error);
    try { const admin = createAdminClient(); for (const url of newlyUploaded) await deleteJobMedia(admin, url); } catch {}
    return NextResponse.json({ error: error instanceof Error && error.message.startsWith("Media upload failed") ? error.message : "Something went wrong while updating the job." }, { status: 500 });
  }
}
