"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bell,
  Building2,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  FileCheck2,
  HelpCircle,
  Landmark,
  LoaderCircle,
  LockKeyhole,
  Search,
  ShieldCheck,
} from "lucide-react";

import styles from "./verification.module.css";

type CompanyResult = {
  companyNumber: string;
  companyName: string;
  companyStatus: string;
  companyStatusDetail: string;
  companyType: string;
  dateOfCreation: string | null;
  registeredOfficeAddress: Record<string, string> | null;
  hasInsolvencyHistory: boolean;
  canFile: boolean | null;
};

function formatAddress(
  address: Record<string, string> | null
) {
  if (!address) {
    return "United Kingdom";
  }

  return [
    address.premises,
    address.address_line_1,
    address.address_line_2,
    address.locality,
    address.region,
    address.postal_code,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export default function EmployerVerificationClient() {
  const [companyName, setCompanyName] = useState("");
  const [companyNumber, setCompanyNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [result, setResult] =
    useState<CompanyResult | null>(null);

  const [recommendation, setRecommendation] =
    useState<"auto" | "manual" | "reject" | null>(null);

  const [verificationStatus, setVerificationStatus] =
    useState<string | null>(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function checkCompany(event: FormEvent) {
    event.preventDefault();

    setError("");
    setMessage("");
    setResult(null);
    setRecommendation(null);

    const number = companyNumber
      .trim()
      .replace(/\s+/g, "")
      .toUpperCase();

    if (!number) {
      setError(
        "Enter your Companies House company number."
      );
      return;
    }

    if (!/^[A-Z0-9]{8}$/.test(number)) {
      setError(
        "Enter a valid 8-character Companies House number."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/company-check",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyNumber: number,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to check this company."
        );
        return;
      }

      setResult(data.company);
      setRecommendation(data.recommendation);

      setCompanyNumber(
        data.company.companyNumber
      );

      setCompanyName(
        data.company.companyName
      );

      if (data.recommendation === "auto") {
        setMessage(
          "Active company found. Review the official Companies House details below."
        );
      } else if (
        data.recommendation === "manual"
      ) {
        setMessage(
          "Company found, but this record requires manual review."
        );
      } else {
        setMessage(
          "Company found, but its current Companies House status is not eligible for verification."
        );
      }
    } catch {
      setError(
        "Unable to connect to Companies House verification."
      );
    } finally {
      setLoading(false);
    }
  }

  async function submitVerification() {
    if (!result) {
      setError("Check the company first.");
      return;
    }

    if (recommendation === "reject") {
      setError(
        "This company is not eligible for employer verification."
      );
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "/api/employer-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyNumber:
              result.companyNumber,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to submit verification."
        );
        return;
      }

      setVerificationStatus(data.status);

      setMessage(
        data.message ||
          "Verification submitted successfully."
      );

      if (data.status === "verified") {
        setTimeout(() => {
          window.location.href = "/employer";
        }, 1200);
      }
    } catch {
      setError(
        "Unable to submit employer verification."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const isVerified =
    verificationStatus === "verified";

  const isPending =
    verificationStatus === "pending";

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logo}>
            <img
              src="/images/ukjobalert-logo.png"
              alt="UKJobAlert"
            />
          </Link>

          <div className={styles.headerActions}>
            <button
              className={styles.notification}
              aria-label="Notifications"
            >
              <Bell />
            </button>

            <div className={styles.userMini}>
              <div className={styles.avatar}>
                UK
              </div>

              <div>
                <strong>Employer Account</strong>
                <span>UKJobAlert</span>
              </div>

              <ChevronDown />
            </div>
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.container}>
          <Link
            href="/employer"
            className={styles.back}
          >
            <ArrowLeft />
            Employer Dashboard
          </Link>

          <div className={styles.heroRow}>
            <div>
              <span>
                EMPLOYER VERIFICATION
              </span>

              <h1>
                Verify Your UK Limited Company
              </h1>

              <p>
                Verify your company details
                before publishing vacancies on
                UKJobAlert.
              </p>
            </div>

            <div className={styles.security}>
              <ShieldCheck />

              <div>
                <strong>
                  {isVerified
                    ? "Employer Verified"
                    : isPending
                    ? "Review Pending"
                    : "Verification Required"}
                </strong>

                <span>
                  {isVerified
                    ? "Job posting is unlocked"
                    : isPending
                    ? "Verification is being reviewed"
                    : "Job posting is currently locked"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.layout}>
            <div className={styles.mainColumn}>
              <section className={styles.statusCard}>
                <div className={styles.statusIcon}>
                  {isVerified ? (
                    <CheckCircle2 />
                  ) : (
                    <LockKeyhole />
                  )}
                </div>

                <div>
                  <span>CURRENT STATUS</span>

                  <h2>
                    {isVerified
                      ? "Employer Verified"
                      : isPending
                      ? "Verification Pending"
                      : "Company Not Verified"}
                  </h2>

                  <p>
                    {isVerified
                      ? "Your employer account can publish vacancies."
                      : isPending
                      ? "Your company is awaiting manual review."
                      : "Complete the Companies House check below to unlock employer job posting."}
                  </p>
                </div>

                <strong>
                  {isVerified
                    ? "VERIFIED"
                    : isPending
                    ? "PENDING"
                    : "NOT VERIFIED"}
                </strong>
              </section>

              {!isVerified && (
                <section className={styles.formCard}>
                  <div className={styles.cardHead}>
                    <div className={styles.step}>
                      1
                    </div>

                    <div>
                      <h2>
                        Companies House Details
                      </h2>

                      <p>
                        Enter your Companies House
                        number. The legal company
                        details will be retrieved
                        directly from Companies
                        House.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={checkCompany}>
                    <label>
                      Registered Company Name
                    </label>

                    <div className={styles.inputWrap}>
                      <Building2 />

                      <input
                        value={companyName}
                        readOnly={Boolean(result)}
                        onChange={(event) =>
                          setCompanyName(
                            event.target.value
                          )
                        }
                        placeholder="Company name will be confirmed by Companies House"
                      />
                    </div>

                    <label>
                      Companies House Company
                      Number
                    </label>

                    <div className={styles.inputWrap}>
                      <Landmark />

                      <input
                        value={companyNumber}
                        onChange={(event) => {
                          setCompanyNumber(
                            event.target.value
                          );
                          setResult(null);
                          setRecommendation(null);
                          setMessage("");
                        }}
                        placeholder="e.g. 12345678"
                        maxLength={8}
                      />
                    </div>

                    <div className={styles.help}>
                      <HelpCircle />

                      <p>
                        The company name, status,
                        type and registered address
                        are checked directly against
                        Companies House. Browser
                        supplied company details are
                        not trusted for approval.
                      </p>
                    </div>

                    {error && (
                      <div className={styles.error}>
                        <CircleAlert />
                        {error}
                      </div>
                    )}

                    <button
                      className={styles.checkButton}
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <LoaderCircle
                          className={styles.spin}
                        />
                      ) : (
                        <Search />
                      )}

                      {loading
                        ? "Checking Company..."
                        : "Check Company"}
                    </button>
                  </form>
                </section>
              )}

              {message && (
                <div
                  style={{
                    marginTop: "18px",
                    padding: "14px 16px",
                    border: "1px solid #d9dee7",
                    background: "#f8fafc",
                    color: "#07182d",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {message}
                </div>
              )}

              {result && !isVerified && (
                <section className={styles.resultCard}>
                  <div className={styles.resultHead}>
                    <div
                      className={
                        styles.successIcon
                      }
                    >
                      <CheckCircle2 />
                    </div>

                    <div>
                      <span>COMPANY FOUND</span>

                      <h2>
                        Review the company details
                      </h2>
                    </div>
                  </div>

                  <div
                    className={styles.companyResult}
                  >
                    <div>
                      <span>
                        Registered Name
                      </span>

                      <strong>
                        {result.companyName}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Company Number
                      </span>

                      <strong>
                        {result.companyNumber}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Company Status
                      </span>

                      <strong
                        className={
                          result.companyStatus ===
                          "active"
                            ? styles.active
                            : undefined
                        }
                      >
                        {result.companyStatus}
                      </strong>
                    </div>

                    <div>
                      <span>Company Type</span>

                      <strong>
                        {result.companyType ||
                          "Not available"}
                      </strong>
                    </div>

                    <div
                      className={styles.full}
                    >
                      <span>
                        Registered Location
                      </span>

                      <strong>
                        {formatAddress(
                          result.registeredOfficeAddress
                        )}
                      </strong>
                    </div>
                  </div>

                  {recommendation === "auto" && (
                    <div
                      className={
                        styles.confirmBox
                      }
                    >
                      <BadgeCheck />

                      <div>
                        <h3>
                          Active company found
                        </h3>

                        <p>
                          Confirm that this is the
                          company you represent
                          before submitting
                          verification.
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    className={
                      styles.submitVerification
                    }
                    onClick={
                      submitVerification
                    }
                    disabled={
                      submitting ||
                      recommendation === "reject"
                    }
                  >
                    {submitting ? (
                      <>
                        <LoaderCircle
                          className={styles.spin}
                        />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Submit for Verification
                        <ArrowRight />
                      </>
                    )}
                  </button>
                </section>
              )}
            </div>

            <aside className={styles.sidebar}>
              <section className={styles.stepsCard}>
                <h2>
                  Verification Process
                </h2>

                <div
                  className={
                    styles.processStep
                  }
                >
                  <span
                    className={
                      styles.currentStep
                    }
                  >
                    1
                  </span>

                  <div>
                    <strong>
                      Enter Company Details
                    </strong>

                    <p>
                      Provide your Companies House
                      number.
                    </p>
                  </div>
                </div>

                <div className={styles.line} />

                <div
                  className={
                    styles.processStep
                  }
                >
                  <span>2</span>

                  <div>
                    <strong>
                      Companies House Check
                    </strong>

                    <p>
                      We check the official company
                      registration and status.
                    </p>
                  </div>
                </div>

                <div className={styles.line} />

                <div
                  className={
                    styles.processStep
                  }
                >
                  <span>3</span>

                  <div>
                    <strong>
                      Employer Verified
                    </strong>

                    <p>
                      Approved employers can publish
                      vacancies.
                    </p>
                  </div>
                </div>
              </section>

              <section
                className={styles.requirements}
              >
                <FileCheck2 />

                <h3>
                  Verification Requirements
                </h3>

                <ul>
                  <li>
                    <CheckCircle2 />
                    UK registered limited company
                  </li>

                  <li>
                    <CheckCircle2 />
                    Correct Companies House number
                  </li>

                  <li>
                    <CheckCircle2 />
                    Company status must be Active
                  </li>

                  <li>
                    <CheckCircle2 />
                    Employer account must represent
                    the company
                  </li>
                </ul>
              </section>

              <section className={styles.lockCard}>
                <LockKeyhole />

                <h3>
                  Why is Post Job locked?
                </h3>

                <p>
                  Only verified employers are
                  allowed to publish jobs on
                  UKJobAlert.
                </p>

                <Link href="/employer">
                  Back to Dashboard
                </Link>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}