import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteJobMedia } from "@/lib/job-media";

export async function POST(
  request: Request
) {
  try {
    const supabase =
      await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Please log in first.",
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
            "Employer account required.",
        },
        {
          status: 403,
        }
      );
    }

    const body =
      await request.json();

    const jobId =
      typeof body.jobId === "string"
        ? body.jobId.trim()
        : "";

    const action =
      typeof body.action === "string"
        ? body.action.trim()
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

    if (
      ![
        "close",
        "reopen",
        "delete",
      ].includes(action)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid job action.",
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
        employer_id,
        title,
        status,
        company_logo_url,
        job_image_url
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
      job.employer_id !==
      user.id
    ) {
      return NextResponse.json(
        {
          error:
            "You cannot manage this job.",
        },
        {
          status: 403,
        }
      );
    }

    if (
      action === "delete"
    ) {
      const {
        error,
      } = await admin
        .from("jobs")
        .delete()
        .eq("id", jobId);

      if (error) {
        return NextResponse.json(
          {
            error:
              "Unable to delete job.",
          },
          {
            status: 500,
          }
        );
      }

      await deleteJobMedia(admin, job.company_logo_url);
      await deleteJobMedia(admin, job.job_image_url);

      return NextResponse.json({
        success: true,
        message:
          "Job deleted.",
      });
    }


    if (
      action === "reopen"
    ) {
      const {
        data: verification,
      } = await admin
        .from(
          "employer_verifications"
        )
        .select(
          "verification_status"
        )
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();

      if (
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

      const newExpiry =
        new Date(
          Date.now() +
            30 *
              24 *
              60 *
              60 *
              1000
        ).toISOString();

      const {
        error,
      } = await admin
        .from("jobs")
        .update({
          status:
            "published",

          expires_at:
            newExpiry,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          jobId
        );

      if (error) {
        return NextResponse.json(
          {
            error:
              "Unable to reopen job.",
          },
          {
            status: 500,
          }
        );
      }

      return NextResponse.json({
        success: true,
        message:
          "Job reopened for 30 days.",
      });
    }


    const {
      error,
    } = await admin
      .from("jobs")
      .update({
        status:
          "closed",

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        jobId
      );

    if (error) {
      return NextResponse.json(
        {
          error:
            "Unable to close job.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Job closed.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}