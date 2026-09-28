import { NextResponse } from "next/server";

import { getAdminUser } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const adminUser = await getAdminUser();

    if (!adminUser) {
      return NextResponse.json(
        {
          error: "Admin access required.",
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json();

    const id =
      typeof body.id === "string"
        ? body.id.trim()
        : "";

    const action =
      typeof body.action === "string"
        ? body.action.trim()
        : "";

    const reason =
      typeof body.reason === "string"
        ? body.reason.trim()
        : "";

    if (!id) {
      return NextResponse.json(
        {
          error: "Verification ID is missing.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      action !== "approve" &&
      action !== "reject"
    ) {
      return NextResponse.json(
        {
          error: "Invalid action.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      action === "reject" &&
      !reason
    ) {
      return NextResponse.json(
        {
          error:
            "Please enter a rejection reason.",
        },
        {
          status: 400,
        }
      );
    }

    const admin = createAdminClient();

    const {
      data: verification,
      error: findError,
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
      .eq("id", id)
      .maybeSingle();

    if (findError) {
      console.error(findError);

      return NextResponse.json(
        {
          error:
            "Unable to find verification request.",
        },
        {
          status: 500,
        }
      );
    }

    if (!verification) {
      return NextResponse.json(
        {
          error:
            "Verification request not found.",
        },
        {
          status: 404,
        }
      );
    }

    const now =
      new Date().toISOString();

    if (action === "approve") {
      const {
        error: updateError,
      } = await admin
        .from("employer_verifications")
        .update({
          verification_status:
            "verified",

          auto_approved:
            false,

          verification_method:
            "manual_admin",

          review_notes:
            `Manually approved by ${adminUser.email}.`,

          reviewed_at:
            now,

          updated_at:
            now,
        })
        .eq("id", id);

      if (updateError) {
        console.error(updateError);

        return NextResponse.json(
          {
            error:
              "Unable to approve employer.",
          },
          {
            status: 500,
          }
        );
      }

      return NextResponse.json({
        success: true,

        status: "verified",

        message:
          `${verification.company_name} approved successfully.`,
      });
    }

    const {
      error: rejectError,
    } = await admin
      .from("employer_verifications")
      .update({
        verification_status:
          "rejected",

        auto_approved:
          false,

        verification_method:
          "manual_admin",

        review_notes:
          reason,

        reviewed_at:
          now,

        updated_at:
          now,
      })
      .eq("id", id);

    if (rejectError) {
      console.error(rejectError);

      return NextResponse.json(
        {
          error:
            "Unable to reject employer.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,

      status: "rejected",

      message:
        `${verification.company_name} rejected.`,
    });
  } catch (error) {
    console.error(
      "Admin employer verification error:",
      error
    );

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