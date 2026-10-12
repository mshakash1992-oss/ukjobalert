import { NextResponse } from "next/server";

import {
  getCompaniesHouseCompany,
  getVerificationRecommendation,
  normalizeCompanyNumber,
} from "@/lib/companies-house";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const companyNumber =
      typeof body?.companyNumber === "string"
        ? normalizeCompanyNumber(
            body.companyNumber
          )
        : "";

    if (!companyNumber) {
      return NextResponse.json(
        {
          error:
            "Enter your Companies House company number.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !/^[A-Z0-9]{8}$/.test(companyNumber)
    ) {
      return NextResponse.json(
        {
          error:
            "Enter a valid 8-character Companies House company number.",
        },
        {
          status: 400,
        }
      );
    }

    const company =
      await getCompaniesHouseCompany(
        companyNumber
      );

    const recommendation =
      getVerificationRecommendation(company);

    return NextResponse.json({
      success: true,
      company,
      recommendation,
    });
  } catch (error) {
    console.error(
      "Companies House check error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to check this company.";

    let status = 500;

    if (
      message.includes("not found") ||
      message.includes("valid Companies House")
    ) {
      status = 404;
    }

    if (
      message.includes(
        "API authentication failed"
      )
    ) {
      status = 502;
    }

    return NextResponse.json(
      {
        error: message,
      },
      {
        status,
      }
    );
  }
}