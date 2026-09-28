import { randomUUID } from "crypto";
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

const allowedExpiryDays = [
  7,
  14,
  30,
  60,
  90,
];

function createSlug(title: string) {
  const clean = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);

  const random = randomUUID()
    .replace(/-/g, "")
    .slice(0, 7);

  return `${clean || "job"}-${random}`;
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  );
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

export async function POST(
  request: Request
) {
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
          error:
            "Only Employer accounts can post jobs.",
        },
        {
          status: 403,
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
        id,
        user_id,
        company_name,
        company_number,
        verification_status
        `
      )
      .eq("user_id", user.id)
      .maybeSingle();

    if (
      verificationError ||
      !verification
    ) {
      return NextResponse.json(
        {
          error:
            "Verify your business before posting jobs.",
        },
        {
          status: 403,
        }
      );
    }

    if (
      verification.verification_status !==
      "verified"
    ) {
      return NextResponse.json(
        {
          error:
            "Your employer account is not verified.",
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json();

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

    const expiryDays =
      Number(body.expiryDays);

    if (
      title.length < 3 ||
      title.length > 150
    ) {
      return NextResponse.json(
        {
          error:
            "Enter a valid job title.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !allowedCategories.includes(
        category
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Select a valid category.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !allowedJobTypes.includes(
        jobType
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Select a valid job type.",
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
          error:
            "Enter a valid location.",
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

    if (
      applyMethod !== "email" &&
      applyMethod !== "url"
    ) {
      return NextResponse.json(
        {
          error:
            "Select an application method.",
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

    if (
      !allowedExpiryDays.includes(
        expiryDays
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Select a valid job expiry period.",
        },
        {
          status: 400,
        }
      );
    }

    const expiresAt =
      new Date(
        Date.now() +
          expiryDays *
            24 *
            60 *
            60 *
            1000
      ).toISOString();

    const slug =
      createSlug(title);

    const {
      data: job,
      error: insertError,
    } = await admin
      .from("jobs")
      .insert({
        employer_id:
          user.id,

        employer_verification_id:
          verification.id,

        company_name:
          verification.company_name,

        company_number:
          verification.company_number,

        title,

        slug,

        category,

        job_type:
          jobType,

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

        expires_at:
          expiresAt,

        status:
          "published",

        updated_at:
          new Date().toISOString(),
      })
      .select(
        `
        id,
        slug,
        title
        `
      )
      .single();

    if (insertError) {
      console.error(
        insertError
      );

      return NextResponse.json(
        {
          error:
            "Unable to publish this job.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,

      message:
        "Job published successfully.",

      job,
    });
  } catch (error) {
    console.error(
      "Post job error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while publishing the job.",
      },
      {
        status: 500,
      }
    );
  }
}