import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const jobId =
      typeof body.jobId === "string"
        ? body.jobId.trim()
        : "";

    if (!jobId) {
      return NextResponse.json(
        {
          error:
            "Job ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const admin =
      createAdminClient();

    const {
      data: job,
    } = await admin
      .from("jobs")
      .select(
        `
        id,
        status,
        expires_at
        `
      )
      .eq("id", jobId)
      .maybeSingle();

    if (!job) {
      return NextResponse.json(
        {
          error:
            "Job not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      job.status !==
      "published"
    ) {
      return NextResponse.json(
        {
          error:
            "Job is not active.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      new Date(
        job.expires_at
      ).getTime() <=
      Date.now()
    ) {
      return NextResponse.json(
        {
          error:
            "Job has expired.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      error,
    } = await admin.rpc(
      "increment_job_apply_click",
      {
        p_job_id:
          jobId,
      }
    );

    if (error) {
      console.error(error);
    }

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Unable to track click.",
      },
      {
        status: 500,
      }
    );
  }
}