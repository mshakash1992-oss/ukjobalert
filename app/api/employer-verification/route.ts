import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

import {
  getCompaniesHouseCompany,
  getVerificationRecommendation,
  normalizeCompanyNumber,
} from "@/lib/companies-house";

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
            "Please sign in to your employer account first.",
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
            "Only employer accounts can complete company verification.",
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json();

    const companyNumber =
      typeof body?.companyNumber === "string"
        ? normalizeCompanyNumber(
            body.companyNumber
          )
        : "";

    if (
      !/^[A-Z0-9]{8}$/.test(companyNumber)
    ) {
      return NextResponse.json(
        {
          error:
            "Enter a valid Companies House company number.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * IMPORTANT:
     * Never trust the company name/status sent
     * from the browser.
     *
     * We fetch the official company record again
     * on the server before writing to Supabase.
     */
    const company =
      await getCompaniesHouseCompany(
        companyNumber
      );

    const recommendation =
      getVerificationRecommendation(company);

    if (recommendation === "reject") {
      return NextResponse.json(
        {
          error:
            "This company is not currently Active on Companies House and cannot be verified.",
        },
        {
          status: 400,
        }
      );
    }

    const verificationStatus =
      recommendation === "auto"
        ? "verified"
        : "pending";

    const admin = createAdminClient();

    const {
      data: existingVerification,
      error: existingError,
    } = await admin
      .from("employer_verifications")
      .select("id,user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingError) {
      console.error(existingError);

      return NextResponse.json(
        {
          error:
            "Unable to read your existing verification record.",
        },
        {
          status: 500,
        }
      );
    }

    const businessEmail = user.email?.trim().toLowerCase();

    if (!businessEmail) {
      return NextResponse.json(
        { error: "Your employer account must have an email address." },
        { status: 400 }
      );
    }

    const verificationData = {
      user_id: user.id,
      business_email: businessEmail,
      company_name: company.companyName,
      company_number: company.companyNumber,
      verification_status:
        verificationStatus,
      updated_at: new Date().toISOString(),
    };

    let saveError = null;

    if (existingVerification) {
      const { error } = await admin
        .from("employer_verifications")
        .update(verificationData)
        .eq("id", existingVerification.id);

      saveError = error;
    } else {
      const { error } = await admin
        .from("employer_verifications")
        .insert(verificationData);

      saveError = error;
    }

    if (saveError) {
      console.error(
        "Verification save error:",
        saveError
      );

      return NextResponse.json(
        {
          error:
            "Company was found, but the verification record could not be saved.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      status: verificationStatus,
      company: {
        companyName: company.companyName,
        companyNumber:
          company.companyNumber,
        companyStatus:
          company.companyStatus,
      },
      message:
        verificationStatus === "verified"
          ? "Your employer account has been verified successfully."
          : "Your company verification has been submitted for manual review.",
    });
  } catch (error) {
    console.error(
      "Employer verification error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to complete employer verification.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}