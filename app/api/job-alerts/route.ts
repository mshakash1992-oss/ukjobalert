import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

function cleanValue(
  value: FormDataEntryValue | null
) {
  if (!value) {
    return null;
  }

  const cleaned = String(value)
    .trim()
    .replace(/\s+/g, " ");

  return cleaned || null;
}

/*
 * CREATE JOB ALERT
 */

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.redirect(
        new URL("/login", request.url),
        303
      );
    }

    if (
      user.user_metadata?.account_type ===
      "employer"
    ) {
      return NextResponse.redirect(
        new URL("/employer/jobs", request.url),
        303
      );
    }

    const formData =
      await request.formData();

    const keyword = cleanValue(
      formData.get("keyword")
    );

    const location = cleanValue(
      formData.get("location")
    );

    const category = cleanValue(
      formData.get("category")
    );

    const jobType = cleanValue(
      formData.get("job_type")
    );

    if (
      keyword &&
      keyword.length > 100
    ) {
      return NextResponse.redirect(
        new URL(
          "/account/alerts?error=invalid-keyword",
          request.url
        ),
        303
      );
    }

    if (
      location &&
      location.length > 100
    ) {
      return NextResponse.redirect(
        new URL(
          "/account/alerts?error=invalid-location",
          request.url
        ),
        303
      );
    }

    const allowedCategories = [
      "Technology",
      "Healthcare",
      "Finance",
      "Education",
      "Engineering",
      "Construction",
      "Retail",
      "Hospitality",
      "Transport",
      "Administration",
      "Sales",
      "Other",
    ];

    const allowedJobTypes = [
      "Full-time",
      "Part-time",
      "Contract",
      "Temporary",
      "Internship",
    ];

    if (
      category &&
      !allowedCategories.includes(category)
    ) {
      return NextResponse.redirect(
        new URL(
          "/account/alerts?error=invalid-category",
          request.url
        ),
        303
      );
    }

    if (
      jobType &&
      !allowedJobTypes.includes(jobType)
    ) {
      return NextResponse.redirect(
        new URL(
          "/account/alerts?error=invalid-job-type",
          request.url
        ),
        303
      );
    }

    /*
     * Do not allow a completely empty alert.
     */

    if (
      !keyword &&
      !location &&
      !category &&
      !jobType
    ) {
      return NextResponse.redirect(
        new URL(
          "/account/alerts?error=empty-alert",
          request.url
        ),
        303
      );
    }

    /*
     * Check for duplicate alerts.
     */

    const {
      data: existingAlerts,
      error: existingError,
    } = await supabase
      .from("job_alerts")
      .select(`
        id,
        keyword,
        location,
        category,
        job_type
      `)
      .eq("user_id", user.id);

    if (existingError) {
      console.error(
        "Job alert duplicate check error:",
        existingError
      );

      return NextResponse.redirect(
        new URL(
          "/account/alerts?error=create-failed",
          request.url
        ),
        303
      );
    }

    const duplicate = (
      existingAlerts || []
    ).some((alert) => {
      return (
        (alert.keyword || null) ===
          keyword &&
        (alert.location || null) ===
          location &&
        (alert.category || null) ===
          category &&
        (alert.job_type || null) ===
          jobType
      );
    });

    if (duplicate) {
      return NextResponse.redirect(
        new URL(
          "/account/alerts?error=duplicate",
          request.url
        ),
        303
      );
    }

    /*
     * Insert alert.
     */

    const { error: insertError } =
      await supabase
        .from("job_alerts")
        .insert({
          user_id: user.id,
          keyword,
          location,
          category,
          job_type: jobType,
          is_active: true,
        });

    if (insertError) {
      console.error(
        "Job alert insert error:",
        insertError
      );

      return NextResponse.redirect(
        new URL(
          "/account/alerts?error=create-failed",
          request.url
        ),
        303
      );
    }

    return NextResponse.redirect(
      new URL(
        "/account/alerts?created=1",
        request.url
      ),
      303
    );
  } catch (error) {
    console.error(
      "Job alert create API error:",
      error
    );

    return NextResponse.redirect(
      new URL(
        "/account/alerts?error=create-failed",
        request.url
      ),
      303
    );
  }
}

/*
 * DELETE JOB ALERT
 */

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error:
            "You must be logged in to delete a job alert.",
        },
        {
          status: 401,
        }
      );
    }

    if (
      user.user_metadata?.account_type ===
      "employer"
    ) {
      return NextResponse.json(
        {
          error:
            "Job alerts are available to job seeker accounts.",
        },
        {
          status: 403,
        }
      );
    }

    let body: {
      alertId?: string;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid request.",
        },
        {
          status: 400,
        }
      );
    }

    const alertId =
      body.alertId?.trim();

    if (!alertId) {
      return NextResponse.json(
        {
          error:
            "Job alert ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Confirm this alert belongs
     * to the current user.
     */

    const {
      data: alert,
      error: lookupError,
    } = await supabase
      .from("job_alerts")
      .select("id")
      .eq("id", alertId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (lookupError) {
      console.error(
        "Job alert lookup error:",
        lookupError
      );

      return NextResponse.json(
        {
          error:
            "Unable to check this job alert.",
        },
        {
          status: 500,
        }
      );
    }

    if (!alert) {
      return NextResponse.json(
        {
          error:
            "Job alert was not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Delete only this user's alert.
     */

    const { error: deleteError } =
      await supabase
        .from("job_alerts")
        .delete()
        .eq("id", alertId)
        .eq("user_id", user.id);

    if (deleteError) {
      console.error(
        "Job alert delete error:",
        deleteError
      );

      return NextResponse.json(
        {
          error:
            "Unable to delete this job alert.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      deleted: true,
    });
  } catch (error) {
    console.error(
      "Job alert delete API error:",
      error
    );

    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}