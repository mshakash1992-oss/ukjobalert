import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type ApplicationBody = {
  jobId?: string;
};

/*
 * RECORD JOB APPLICATION
 */

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
          error:
            "You must be logged in to track an application.",
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
            "Application tracking is available to job seeker accounts.",
        },
        {
          status: 403,
        }
      );
    }

    let body: ApplicationBody;

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

    const jobId = body.jobId?.trim();

    if (!jobId) {
      return NextResponse.json(
        {
          error: "Job ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Make sure the vacancy is still live.
     */

    const {
      data: job,
      error: jobError,
    } = await supabase
      .from("jobs")
      .select(`
        id,
        title,
        slug,
        status,
        expires_at
      `)
      .eq("id", jobId)
      .eq("status", "published")
      .gt(
        "expires_at",
        new Date().toISOString()
      )
      .maybeSingle();

    if (jobError) {
      console.error(
        "Application job validation error:",
        jobError
      );

      return NextResponse.json(
        {
          error:
            "Unable to check this vacancy.",
        },
        {
          status: 500,
        }
      );
    }

    if (!job) {
      return NextResponse.json(
        {
          error:
            "This vacancy is no longer available.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Check whether this job has already
     * been recorded for this user.
     */

    const {
      data: existingApplication,
      error: existingError,
    } = await supabase
      .from("job_applications")
      .select(`
        id,
        status,
        applied_at
      `)
      .eq("user_id", user.id)
      .eq("job_id", jobId)
      .maybeSingle();

    if (existingError) {
      console.error(
        "Application lookup error:",
        existingError
      );

      return NextResponse.json(
        {
          error:
            "Unable to check your application.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Already tracked.
     * Return the existing application instead
     * of creating a duplicate.
     */

    if (existingApplication) {
      return NextResponse.json({
        success: true,
        alreadyApplied: true,
        application:
          existingApplication,
      });
    }

    /*
     * Create application record.
     */

    const {
      data: application,
      error: insertError,
    } = await supabase
      .from("job_applications")
      .insert({
        user_id: user.id,
        job_id: jobId,
        status: "applied",
      })
      .select(`
        id,
        status,
        applied_at
      `)
      .single();

    if (insertError) {
      console.error(
        "Application insert error:",
        insertError
      );

      return NextResponse.json(
        {
          error:
            "Unable to record your application.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      alreadyApplied: false,
      application,
    });
  } catch (error) {
    console.error(
      "Application tracking API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while tracking the application.",
      },
      {
        status: 500,
      }
    );
  }
}