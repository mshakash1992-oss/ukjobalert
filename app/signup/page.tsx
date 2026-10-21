"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  AlertCircle,
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type AccountType = "job_seeker" | "employer";

function SignupForm() {
  const searchParams = useSearchParams();

  const urlError = searchParams.get("error");

  const [accountType, setAccountType] =
    useState<AccountType>("job_seeker");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [termsAccepted, setTermsAccepted] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(
    urlError ? decodeURIComponent(urlError) : ""
  );

  const [success, setSuccess] = useState("");

  async function handleSignup(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      setError(
        "Please accept the Terms of Service and Privacy Policy."
      );
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const {
        data,
        error: signupError,
      } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            account_type: accountType,
          },
        },
      });

      if (signupError) {
        setError(signupError.message);
        return;
      }

      if (data.session) {
        setSuccess(
          "Your account has been created successfully."
        );
      } else {
        setSuccess(
          "Account created. Please check your email and confirm your email address."
        );
      }

      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTermsAccepted(false);
    } catch {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <div className="grid min-h-screen lg:grid-cols-[1.02fr_.98fr]">

        {/* DESKTOP LONDON SIDE */}

        <section className="relative hidden min-h-screen overflow-hidden lg:flex">

          <Image
            src="/login-london-bg.jpg"
            alt=""
            fill
            priority
            sizes="52vw"
            className="object-cover object-center"
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(4,18,35,.48) 0%, rgba(4,18,35,.25) 52%, rgba(4,18,35,.08) 100%)",
            }}
          />

          <div
            className="absolute inset-x-0 bottom-0 h-[35%]"
            style={{
              background:
                "linear-gradient(0deg, rgba(4,18,35,.40) 0%, rgba(4,18,35,0) 100%)",
            }}
          />

          <div className="relative z-10 flex w-full flex-col justify-between px-[7%] py-12">

            {/* LOGIN/SIGNUP WHITE LOGO */}

            <Link
              href="/"
              className="block w-fit"
              aria-label="UKJobAlert home"
            >
              <Image
                src="/login-logo.png"
                alt="UKJobAlert.com"
                width={1920}
                height={768}
                priority
                className="h-auto w-[290px] object-contain"
              />
            </Link>

            {/* HERO */}

            <div className="max-w-[620px] py-14">

              <div
                className="inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-[12px] font-semibold backdrop-blur-sm"
                style={{
                  borderColor:
                    "rgba(255,255,255,.28)",
                  backgroundColor:
                    "rgba(7,24,45,.28)",
                  color:
                    "rgba(255,255,255,.96)",
                }}
              >
                <ShieldCheck
                  className="h-4 w-4"
                  style={{
                    color: "#fde8e8",
                  }}
                />

                Trusted UK job platform
              </div>

              <h1
                className="mt-8 max-w-[590px] text-[54px] font-bold leading-[1.02] tracking-[-2.3px] xl:text-[64px]"
                style={{
                  color: "#ffffff",
                  textShadow:
                    "0 3px 20px rgba(0,0,0,.38)",
                }}
              >
                Create your
                <br />
                account.
              </h1>

              <p
                className="mt-6 max-w-[520px] text-[16px] leading-7"
                style={{
                  color:
                    "rgba(255,255,255,.95)",
                  textShadow:
                    "0 2px 14px rgba(0,0,0,.38)",
                }}
              >
                Search UK vacancies as a job seeker
                or create an employer account to
                publish verified job opportunities.
              </p>

              <div className="mt-10 grid max-w-[570px] gap-3 sm:grid-cols-2">

                <FeatureCard
                  icon={BriefcaseBusiness}
                  title="Job seekers"
                  text="Create an account and find current UK vacancies."
                />

                <FeatureCard
                  icon={Building2}
                  title="Employers"
                  text="Verify your business before publishing jobs."
                />

              </div>
            </div>

            <p
              className="text-[12px]"
              style={{
                color:
                  "rgba(255,255,255,.82)",
                textShadow:
                  "0 1px 8px rgba(0,0,0,.4)",
              }}
            >
              © 2026 UKJobAlert.com
            </p>

          </div>
        </section>

        {/* SIGNUP SIDE */}

        <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:px-12">

          {/* BIGGER FORM WIDTH */}

          <div className="w-full max-w-[590px]">

            {/* MOBILE LOGO */}

            <div className="mb-8 flex justify-center lg:hidden">

              <Link
                href="/"
                aria-label="UKJobAlert home"
              >
                <Image
                  src="/ukjobalert-logo.png"
                  alt="UKJobAlert.com"
                  width={600}
                  height={180}
                  priority
                  className="h-auto w-[220px] object-contain"
                />
              </Link>

            </div>

            {/* SIGNUP CARD */}

            <div className="rounded-[8px] border border-[#e1e5eb] bg-white p-7 shadow-[0_8px_24px_rgba(16,24,40,.06)] sm:p-10">

              {/* HEADER */}

              <div className="text-center">

                <p className="text-[12px] font-semibold text-[#d71920]">
                  Get started
                </p>

                <h2 className="mt-2 text-[32px] font-bold tracking-[-1.1px] text-[#101828]">
                  Create your account
                </h2>

                <p className="mt-2 text-[13px] text-[#667085]">
                  Join UKJobAlert.com
                </p>

              </div>

              {/* ACCOUNT TYPE */}

              <div className="mt-8 grid grid-cols-2 rounded-[8px] bg-[#f2f4f7] p-1">

                <button
                  type="button"
                  onClick={() =>
                    setAccountType("job_seeker")
                  }
                  className={`flex min-h-[50px] items-center justify-center gap-2 rounded-[8px] text-[13px] font-semibold transition ${
                    accountType === "job_seeker"
                      ? "bg-white text-[#d71920] shadow-[0_1px_3px_rgba(16,24,40,.10)]"
                      : "text-[#667085]"
                  }`}
                >
                  <UserRound className="h-[17px] w-[17px]" />
                  Job Seeker
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setAccountType("employer")
                  }
                  className={`flex min-h-[50px] items-center justify-center gap-2 rounded-[8px] text-[13px] font-semibold transition ${
                    accountType === "employer"
                      ? "bg-white text-[#d71920] shadow-[0_1px_3px_rgba(16,24,40,.10)]"
                      : "text-[#667085]"
                  }`}
                >
                  <Building2 className="h-[17px] w-[17px]" />
                  Employer
                </button>

              </div>

              {/* EMPLOYER NOTICE */}

              {accountType === "employer" && (
                <div className="mt-5 flex items-start gap-3 rounded-[8px] border border-[#f1d2d4] bg-[#fff7f6] p-4">

                  <ShieldCheck className="mt-[1px] h-[18px] w-[18px] shrink-0 text-[#d71920]" />

                  <div>

                    <p className="text-[12px] font-semibold text-[#b91319]">
                      Employer verification required
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-[#475467]">
                      After registration, verify your UK
                      company before publishing jobs.
                    </p>

                  </div>
                </div>
              )}

              {/* ERROR */}

              {error && (
                <div className="mt-5 flex items-start gap-3 rounded-[8px] border border-[#fecdca] bg-[#fef3f2] p-4">

                  <AlertCircle className="mt-[1px] h-[18px] w-[18px] shrink-0 text-[#d92d20]" />

                  <p className="text-[12px] font-medium leading-5 text-[#b42318]">
                    {error}
                  </p>

                </div>
              )}

              {/* SUCCESS */}

              {success && (
                <div className="mt-5 flex items-start gap-3 rounded-[8px] border border-[#abefc6] bg-[#ecfdf3] p-4">

                  <CheckCircle2 className="mt-[1px] h-[18px] w-[18px] shrink-0 text-[#067647]" />

                  <p className="text-[12px] font-medium leading-5 text-[#067647]">
                    {success}
                  </p>

                </div>
              )}

              {/* FORM */}

              <form
                onSubmit={handleSignup}
                className="mt-7 space-y-5"
              >

                {/* FULL NAME */}

                <div>

                  <label className="mb-2 block text-[12px] font-semibold text-[#344054]">
                    Full name
                  </label>

                  <div className="flex min-h-[54px] items-center rounded-[8px] border border-[#d0d5dd] bg-white px-4 transition focus-within:border-[#d71920] focus-within:ring-[3px] focus-within:ring-[#d71920]/10">

                    <UserRound className="h-[18px] w-[18px] shrink-0 text-[#98a2b3]" />

                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(event) =>
                        setFullName(
                          event.target.value
                        )
                      }
                      placeholder="Your full name"
                      autoComplete="name"
                      className="w-full bg-transparent px-3 text-[14px] text-[#101828] outline-none placeholder:text-[#98a2b3]"
                    />

                  </div>
                </div>

                {/* EMAIL */}

                <div>

                  <label className="mb-2 block text-[12px] font-semibold text-[#344054]">
                    Email address
                  </label>

                  <div className="flex min-h-[54px] items-center rounded-[8px] border border-[#d0d5dd] bg-white px-4 transition focus-within:border-[#d71920] focus-within:ring-[3px] focus-within:ring-[#d71920]/10">

                    <Mail className="h-[18px] w-[18px] shrink-0 text-[#98a2b3]" />

                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(
                          event.target.value
                        )
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full bg-transparent px-3 text-[14px] text-[#101828] outline-none placeholder:text-[#98a2b3]"
                    />

                  </div>
                </div>

                {/* PASSWORD */}

                <div>

                  <label className="mb-2 block text-[12px] font-semibold text-[#344054]">
                    Password
                  </label>

                  <div className="flex min-h-[54px] items-center rounded-[8px] border border-[#d0d5dd] bg-white px-4 transition focus-within:border-[#d71920] focus-within:ring-[3px] focus-within:ring-[#d71920]/10">

                    <LockKeyhole className="h-[18px] w-[18px] shrink-0 text-[#98a2b3]" />

                    <input
                      required
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
                      className="w-full bg-transparent px-3 text-[14px] text-[#101828] outline-none placeholder:text-[#98a2b3]"
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() =>
                        setShowPassword(
                          (current) =>
                            !current
                        )
                      }
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#98a2b3] transition hover:bg-[#f2f4f7] hover:text-[#344054]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-[18px] w-[18px]" />
                      ) : (
                        <Eye className="h-[18px] w-[18px]" />
                      )}
                    </button>

                  </div>
                </div>

                {/* CONFIRM PASSWORD */}

                <div>

                  <label className="mb-2 block text-[12px] font-semibold text-[#344054]">
                    Confirm password
                  </label>

                  <div className="flex min-h-[54px] items-center rounded-[8px] border border-[#d0d5dd] bg-white px-4 transition focus-within:border-[#d71920] focus-within:ring-[3px] focus-within:ring-[#d71920]/10">

                    <LockKeyhole className="h-[18px] w-[18px] shrink-0 text-[#98a2b3]" />

                    <input
                      required
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      className="w-full bg-transparent px-3 text-[14px] text-[#101828] outline-none placeholder:text-[#98a2b3]"
                    />

                    <button
                      type="button"
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) =>
                            !current
                        )
                      }
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#98a2b3] transition hover:bg-[#f2f4f7] hover:text-[#344054]"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-[18px] w-[18px]" />
                      ) : (
                        <Eye className="h-[18px] w-[18px]" />
                      )}
                    </button>

                  </div>
                </div>

                {/* TERMS */}

                <label className="flex cursor-pointer items-start gap-3 pt-1 text-[12px] leading-5 text-[#667085]">

                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(event) =>
                      setTermsAccepted(
                        event.target.checked
                      )
                    }
                    className="mt-[2px] h-4 w-4 shrink-0 rounded border-[#d0d5dd]"
                  />

                  <span>
                    I agree to the{" "}

                    <Link
                      href="/terms"
                      className="font-semibold text-[#d71920]"
                    >
                      Terms of Service
                    </Link>

                    {" "}and{" "}

                    <Link
                      href="/privacy"
                      className="font-semibold text-[#d71920]"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>

                </label>

                {/* CREATE ACCOUNT */}

                <button
                  disabled={loading}
                  type="submit"
                  className="flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-[8px] bg-[#07182d] px-6 text-[14px] font-semibold transition hover:bg-[#102a4c] disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    color: "#ffffff",
                  }}
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="h-[18px] w-[18px] animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      {accountType === "employer" ? (
                        <Building2 className="h-[17px] w-[17px]" />
                      ) : (
                        <UserRound className="h-[17px] w-[17px]" />
                      )}

                      {accountType === "employer"
                        ? "Create Employer Account"
                        : "Create Job Seeker Account"}
                    </>
                  )}
                </button>

              </form>

              {/* LOGIN */}

              <div className="my-7 h-px bg-[#eaecf0]" />

              <p className="text-center text-[13px] text-[#667085]">
                Already have an account?{" "}

                <Link
                  href="/login"
                  className="font-semibold text-[#d71920] transition hover:text-[#b91319]"
                >
                  Log in
                </Link>
              </p>

            </div>

            {/* BACK HOME */}

            <Link
              href="/"
              className="mx-auto mt-6 flex w-fit items-center gap-2 text-[12px] font-semibold text-[#667085] transition hover:text-[#101828]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to homepage
            </Link>

          </div>
        </section>

      </div>
    </main>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof BriefcaseBusiness;
  title: string;
  text: string;
}) {
  return (
    <div
      className="rounded-[8px] border p-5 backdrop-blur-[6px]"
      style={{
        borderColor:
          "rgba(255,255,255,.28)",
        backgroundColor:
          "rgba(7,24,45,.36)",
      }}
    >

      <div
        className="flex h-10 w-10 items-center justify-center rounded-[8px]"
        style={{
          backgroundColor:
            "rgba(255,255,255,.16)",
        }}
      >
        <Icon
          className="h-[19px] w-[19px]"
          style={{
            color: "#ffffff",
          }}
        />
      </div>

      <p
        className="mt-5 text-[14px] font-semibold"
        style={{
          color: "#ffffff",
        }}
      >
        {title}
      </p>

      <p
        className="mt-1.5 text-[12px] leading-5"
        style={{
          color:
            "rgba(255,255,255,.88)",
        }}
      >
        {text}
      </p>

    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <main
          className="min-h-screen bg-[#f7f8fa] p-8"
          role="status"
        >
          Loading signup...
        </main>
      }
    >
      <SignupForm />
    </Suspense>
  );
}