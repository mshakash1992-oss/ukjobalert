import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type RequestBody = {
  jobId?: string;
};

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
          error: "You must be logged in to save a job.",
        },
        {
          status: 401,
        }
      );
    }

    if (user.user_metadata?.account_type === "employer") {
      return NextResponse.json(
        {
          error:
            "Saved jobs are available to job seeker accounts.",
        },
        {
          status: 403,
        }
      );
    }

    const body = (await request.json()) as RequestBody;

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
     * Confirm that the vacancy exists and is still
     * publicly available before saving it.
     */

    const {
      data: job,
      error: jobError,
    } = await supabase
      .from("jobs")
      .select("id")
      .eq("id", jobId)
      .eq("status", "published")
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (jobError) {
      console.error(
        "Saved job validation error:",
        jobError
      );

      return NextResponse.json(
        {
          error: "Unable to check this vacancy.",
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
     * Check first so duplicate saves return a clean
     * successful response.
     */

    const {
      data: existing,
      error: existingError,
    } = await supabase
      .from("saved_jobs")
      .select("id")
      .eq("user_id", user.id)
      .eq("job_id", jobId)
      .maybeSingle();

    if (existingError) {
      console.error(
        "Saved job lookup error:",
        existingError
      );

      return NextResponse.json(
        {
          error: "Unable to save this job.",
        },
        {
          status: 500,
        }
      );
    }

    if (existing) {
      return NextResponse.json({
        success: true,
        saved: true,
      });
    }

    const { error: insertError } = await supabase
      .from("saved_jobs")
      .insert({
        user_id: user.id,
        job_id: jobId,
      });

    if (insertError) {
      console.error(
        "Saved job insert error:",
        insertError
      );

      return NextResponse.json(
        {
          error: "Unable to save this job.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      saved: true,
    });
  } catch (error) {
    console.error("Save job API error:", error);

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
            "You must be logged in to remove a saved job.",
        },
        {
          status: 401,
        }
      );
    }

    const body = (await request.json()) as RequestBody;

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

    const { error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("user_id", user.id)
      .eq("job_id", jobId);

    if (deleteError) {
      console.error(
        "Saved job delete error:",
        deleteError
      );

      return NextResponse.json(
        {
          error: "Unable to remove this saved job.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      saved: false,
    });
  } catch (error) {
    console.error("Remove saved job API error:", error);

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