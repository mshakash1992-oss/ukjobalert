"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  AlertCircle,
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
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

export default function LoginPage() {
  const router = useRouter();

  const [accountType, setAccountType] =
    useState<AccountType>("job_seeker");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const {
        data,
        error: loginError,
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      if (!data.user) {
        setError("Unable to login.");
        return;
      }

      const storedAccountType =
        data.user.user_metadata?.account_type;

      if (
        storedAccountType &&
        storedAccountType !== accountType
      ) {
        await supabase.auth.signOut();

        setError(
          accountType === "employer"
            ? "This account is registered as a Job Seeker."
            : "This account is registered as an Employer."
        );

        return;
      }

      router.push("/");
      router.refresh();
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

          {/* LONDON BACKGROUND */}

          <Image
            src="/login-london-bg.jpg"
            alt=""
            fill
            priority
            sizes="52vw"
            className="object-cover object-center"
          />

          {/* LIGHT OVERLAY */}

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(4,18,35,.48) 0%, rgba(4,18,35,.25) 52%, rgba(4,18,35,.08) 100%)",
            }}
          />

          {/* BOTTOM GRADIENT */}

          <div
            className="absolute inset-x-0 bottom-0 h-[35%]"
            style={{
              background:
                "linear-gradient(0deg, rgba(4,18,35,.40) 0%, rgba(4,18,35,0) 100%)",
            }}
          />

          {/* CONTENT */}

          <div className="relative z-10 flex w-full flex-col justify-between px-[7%] py-12">

            {/* LOGIN-ONLY WHITE LOGO */}

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

            {/* HERO CONTENT */}

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

                UK jobs and employer accounts
              </div>

              <h1
                className="mt-8 max-w-[590px] text-[54px] font-bold leading-[1.02] tracking-[-2.3px] xl:text-[64px]"
                style={{
                  color: "#ffffff",
                  textShadow:
                    "0 3px 20px rgba(0,0,0,.38)",
                }}
              >
                Your job search
                <br />
                starts here.
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
                Sign in to search vacancies or manage
                jobs from your employer account.
              </p>

              <div className="mt-10 grid max-w-[570px] gap-3 sm:grid-cols-2">

                <FeatureCard
                  icon={BriefcaseBusiness}
                  title="Job seekers"
                  text="Search current vacancies across the UK."
                />

                <FeatureCard
                  icon={Building2}
                  title="Employers"
                  text="Manage company vacancies and applications."
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

        {/* LOGIN SIDE */}

        <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:px-14">

          <div className="w-full max-w-[500px]">

            {/* MOBILE LOGO */}
            {/* ORIGINAL LOGO - NO LONDON BACKGROUND */}

            <div className="mb-9 flex justify-center lg:hidden">

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

            {/* LOGIN CARD */}

            <div className="rounded-[8px] border border-[#e1e5eb] bg-white p-7 shadow-[0_8px_24px_rgba(16,24,40,.06)] sm:p-10">

              <div className="text-center">

                <p className="text-[12px] font-semibold text-[#d71920]">
                  Welcome back
                </p>

                <h2 className="mt-2 text-[32px] font-bold tracking-[-1.1px] text-[#101828]">
                  Log in to your account
                </h2>

                <p className="mt-2 text-[13px] text-[#667085]">
                  Continue to UKJobAlert.com
                </p>

              </div>

              {/* ACCOUNT TYPE */}

              <div className="mt-8 grid grid-cols-2 rounded-[8px] bg-[#f2f4f7] p-1">

                <button
                  type="button"
                  onClick={() =>
                    setAccountType("job_seeker")
                  }
                  className={`flex min-h-[48px] items-center justify-center gap-2 rounded-[8px] text-[13px] font-semibold transition ${
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
                  className={`flex min-h-[48px] items-center justify-center gap-2 rounded-[8px] text-[13px] font-semibold transition ${
                    accountType === "employer"
                      ? "bg-white text-[#d71920] shadow-[0_1px_3px_rgba(16,24,40,.10)]"
                      : "text-[#667085]"
                  }`}
                >
                  <Building2 className="h-[17px] w-[17px]" />
                  Employer
                </button>

              </div>

              {/* EMPLOYER INFO */}

              {accountType === "employer" && (
                <div className="mt-5 flex items-start gap-3 rounded-[8px] border border-[#f1d2d4] bg-[#fff7f6] p-4">

                  <ShieldCheck className="mt-[1px] h-[18px] w-[18px] shrink-0 text-[#d71920]" />

                  <p className="text-[12px] leading-5 text-[#475467]">
                    Employer accounts require business
                    verification before job posting access
                    is enabled.
                  </p>

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

              {/* FORM */}

              <form
                onSubmit={handleLogin}
                className="mt-7"
              >

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

                <div className="mt-5">

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
                      placeholder="Enter your password"
                      autoComplete="current-password"
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
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-transparent text-[#98a2b3] transition hover:bg-[#f2f4f7] hover:text-[#344054]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-[18px] w-[18px]" />
                      ) : (
                        <Eye className="h-[18px] w-[18px]" />
                      )}
                    </button>

                  </div>
                </div>

                {/* REMEMBER / FORGOT */}

                <div className="mt-5 flex items-center justify-between gap-4 text-[12px]">

                  <label className="flex cursor-pointer items-center gap-2.5 text-[#667085]">

                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) =>
                        setRememberMe(
                          event.target.checked
                        )
                      }
                      className="h-4 w-4 rounded border-[#d0d5dd]"
                    />

                    Remember me

                  </label>

                  <Link
                    href="/forgot-password"
                    className="font-semibold text-[#d71920] transition hover:text-[#b91319]"
                  >
                    Forgot password?
                  </Link>

                </div>

                {/* LOGIN BUTTON */}

                <button
                  disabled={loading}
                  type="submit"
                  className="mt-7 flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-[8px] bg-[#07182d] px-6 text-[14px] font-semibold transition hover:bg-[#102a4c] disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    color: "#ffffff",
                  }}
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="h-[18px] w-[18px] animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LockKeyhole className="h-[17px] w-[17px]" />
                      Log in
                    </>
                  )}
                </button>

              </form>

              <div className="my-7 h-px bg-[#eaecf0]" />

              {/* CREATE ACCOUNT */}

              <p className="text-center text-[13px] text-[#667085]">

                Don&apos;t have an account?{" "}

                <Link
                  href="/signup"
                  className="font-semibold text-[#d71920] transition hover:text-[#b91319]"
                >
                  Create account
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

/* FEATURE CARD */

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