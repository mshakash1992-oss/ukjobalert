import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const allowedCategories = [
  "Healthcare",
  "Construction",
  "Hospitality",
  "Driving",
  "Warehouse",
  "Retail",
  "IT & Tech",
  "Education",
  "Cleaning",
  "Office",
  "Other",
];

const allowedJobTypes = [
  "Full Time",
  "Part Time",
  "Temporary",
  "Contract",
  "Apprenticeship",
  "Internship",
];

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validUrl(value: string) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" ||
      url.protocol === "http:"
    );
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "Please log in first.",
        },
        {
          status: 401,
        }
      );
    }

    if (
      user.user_metadata?.account_type !==
      "employer"
    ) {
      return NextResponse.json(
        {
          error: "Employer account required.",
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json();

    const jobId =
      typeof body.jobId === "string"
        ? body.jobId.trim()
        : "";

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const category =
      typeof body.category === "string"
        ? body.category.trim()
        : "";

    const jobType =
      typeof body.jobType === "string"
        ? body.jobType.trim()
        : "";

    const location =
      typeof body.location === "string"
        ? body.location.trim()
        : "";

    const salary =
      typeof body.salary === "string"
        ? body.salary.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const applyMethod =
      typeof body.applyMethod === "string"
        ? body.applyMethod.trim()
        : "";

    const applyEmail =
      typeof body.applyEmail === "string"
        ? body.applyEmail
            .trim()
            .toLowerCase()
        : "";

    const applyUrl =
      typeof body.applyUrl === "string"
        ? body.applyUrl.trim()
        : "";

    if (!jobId) {
      return NextResponse.json(
        {
          error: "Job ID is missing.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      title.length < 3 ||
      title.length > 150
    ) {
      return NextResponse.json(
        {
          error: "Enter a valid job title.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !allowedCategories.includes(category)
    ) {
      return NextResponse.json(
        {
          error: "Select a valid category.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !allowedJobTypes.includes(jobType)
    ) {
      return NextResponse.json(
        {
          error: "Select a valid job type.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      location.length < 2 ||
      location.length > 150
    ) {
      return NextResponse.json(
        {
          error: "Enter a valid location.",
        },
        {
          status: 400,
        }
      );
    }

    if (description.length < 50) {
      return NextResponse.json(
        {
          error:
            "Job description must contain at least 50 characters.",
        },
        {
          status: 400,
        }
      );
    }

    if (description.length > 10000) {
      return NextResponse.json(
        {
          error: "Job description is too long.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      applyMethod !== "email" &&
      applyMethod !== "url"
    ) {
      return NextResponse.json(
        {
          error:
            "Select a valid application method.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      applyMethod === "email" &&
      !validEmail(applyEmail)
    ) {
      return NextResponse.json(
        {
          error:
            "Enter a valid application email.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      applyMethod === "url" &&
      !validUrl(applyUrl)
    ) {
      return NextResponse.json(
        {
          error:
            "Enter a valid application URL.",
        },
        {
          status: 400,
        }
      );
    }

    const admin = createAdminClient();

    const {
      data: verification,
      error: verificationError,
    } = await admin
      .from("employer_verifications")
      .select(
        `
        verification_status
        `
      )
      .eq("user_id", user.id)
      .maybeSingle();

    if (
      verificationError ||
      !verification ||
      verification.verification_status !==
        "verified"
    ) {
      return NextResponse.json(
        {
          error:
            "Your employer verification is not active.",
        },
        {
          status: 403,
        }
      );
    }

    const {
      data: existingJob,
      error: jobError,
    } = await admin
      .from("jobs")
      .select(
        `
        id,
        employer_id,
        status
        `
      )
      .eq("id", jobId)
      .maybeSingle();

    if (
      jobError ||
      !existingJob
    ) {
      return NextResponse.json(
        {
          error: "Job not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      existingJob.employer_id !==
      user.id
    ) {
      return NextResponse.json(
        {
          error:
            "You cannot edit this job.",
        },
        {
          status: 403,
        }
      );
    }

    const {
      data: updatedJob,
      error: updateError,
    } = await admin
      .from("jobs")
      .update({
        title,

        category,

        job_type: jobType,

        location,

        salary:
          salary || null,

        description,

        apply_method:
          applyMethod,

        apply_email:
          applyMethod === "email"
            ? applyEmail
            : null,

        apply_url:
          applyMethod === "url"
            ? applyUrl
            : null,

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", jobId)
      .eq("employer_id", user.id)
      .select(
        `
        id,
        slug,
        title,
        status
        `
      )
      .single();

    if (updateError) {
      console.error(
        "Job update error:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Unable to update job.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,

      message:
        "Job updated successfully.",

      job: updatedJob,
    });
  } catch (error) {
    console.error(
      "Employer edit job error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while updating the job.",
      },
      {
        status: 500,
      }
    );
  }
}