import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

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

    const fullName = String(
      formData.get("full_name") || ""
    )
      .trim()
      .replace(/\s+/g, " ");

    if (
      fullName.length < 2 ||
      fullName.length > 100
    ) {
      return NextResponse.redirect(
        new URL(
          "/account/settings?error=invalid-name",
          request.url
        ),
        303
      );
    }

    const { error: updateError } =
      await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          full_name: fullName,
        },
      });

    if (updateError) {
      console.error(
        "Profile update error:",
        updateError
      );

      return NextResponse.redirect(
        new URL(
          "/account/settings?error=update-failed",
          request.url
        ),
        303
      );
    }

    return NextResponse.redirect(
      new URL(
        "/account/settings?updated=1",
        request.url
      ),
      303
    );
  } catch (error) {
    console.error(
      "Account profile API error:",
      error
    );

    return NextResponse.redirect(
      new URL(
        "/account/settings?error=update-failed",
        request.url
      ),
      303
    );
  }
}