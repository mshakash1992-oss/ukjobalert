"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  LoaderCircle,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleReset(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const origin = window.location.origin;

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo: `${origin}/reset-password`,
          }
        );

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSuccess(
        "Password reset link sent. Please check your email inbox."
      );
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

            {/* WHITE LOGO */}

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

                Secure account recovery
              </div>

              <h1
                className="mt-8 max-w-[590px] text-[54px] font-bold leading-[1.02] tracking-[-2.3px] xl:text-[64px]"
                style={{
                  color: "#ffffff",
                  textShadow:
                    "0 3px 20px rgba(0,0,0,.38)",
                }}
              >
                Reset your
                <br />
                password.
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
                Enter the email address linked to your
                UKJobAlert.com account and we&apos;ll send
                you a secure password reset link.
              </p>

              <div
                className="mt-10 max-w-[570px] rounded-[8px] border p-5 backdrop-blur-[6px]"
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
                  <KeyRound
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
                  Password recovery
                </p>

                <p
                  className="mt-1.5 text-[12px] leading-5"
                  style={{
                    color:
                      "rgba(255,255,255,.88)",
                  }}
                >
                  A secure reset link will be sent to
                  your registered email address.
                </p>
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

        {/* RESET FORM SIDE */}

        <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-[500px]">

            {/* MOBILE LOGO */}

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

            {/* CARD */}

            <div className="rounded-[8px] border border-[#e1e5eb] bg-white p-7 shadow-[0_8px_24px_rgba(16,24,40,.06)] sm:p-10">

              <div className="mx-auto flex h-[58px] w-[58px] items-center justify-center rounded-[8px] bg-[#fff7f6]">
                <KeyRound className="h-6 w-6 text-[#d71920]" />
              </div>

              <div className="mt-6 text-center">
                <p className="text-[12px] font-semibold text-[#d71920]">
                  Account recovery
                </p>

                <h2 className="mt-2 text-[32px] font-bold tracking-[-1.1px] text-[#101828]">
                  Forgot your password?
                </h2>

                <p className="mx-auto mt-3 max-w-[370px] text-[13px] leading-6 text-[#667085]">
                  Enter your account email and we&apos;ll
                  send you a link to choose a new password.
                </p>
              </div>

              {/* ERROR */}

              {error && (
                <div className="mt-6 rounded-[8px] border border-[#fecdca] bg-[#fef3f2] p-4">
                  <p className="text-[12px] font-medium leading-5 text-[#b42318]">
                    {error}
                  </p>
                </div>
              )}

              {/* SUCCESS */}

              {success && (
                <div className="mt-6 flex items-start gap-3 rounded-[8px] border border-[#abefc6] bg-[#ecfdf3] p-4">
                  <CheckCircle2 className="mt-[1px] h-[18px] w-[18px] shrink-0 text-[#067647]" />

                  <div>
                    <p className="text-[12px] font-semibold text-[#067647]">
                      Check your email
                    </p>

                    <p className="mt-1 text-[12px] leading-5 text-[#067647]">
                      {success}
                    </p>
                  </div>
                </div>
              )}

              {/* FORM */}

              <form
                onSubmit={handleReset}
                className="mt-7"
              >
                <label
                  htmlFor="recovery-email"
                  className="mb-2 block text-[12px] font-semibold text-[#344054]"
                >
                  Email address
                </label>

                {/* EMAIL FIELD */}

                <div className="group flex min-h-[54px] items-center overflow-hidden rounded-[8px] border border-[#d0d5dd] bg-white px-4 transition focus-within:border-[#d71920] focus-within:ring-[3px] focus-within:ring-[#d71920]/10">

                  <Mail className="pointer-events-none h-[18px] w-[18px] shrink-0 text-[#98a2b3]" />

                  <input
                    id="recovery-email"
                    required
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    spellCheck={false}
                    className="block min-h-[52px] w-full appearance-none border-0 bg-transparent px-3 py-0 text-[14px] text-[#101828] shadow-none outline-none ring-0 placeholder:text-[#98a2b3] focus:border-0 focus:outline-none focus:ring-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0"
                    style={{
                      WebkitAppearance: "none",
                      outline: "none",
                      boxShadow: "none",
                    }}
                  />
                </div>

                {/* BUTTON */}

                <button
                  disabled={loading}
                  type="submit"
                  className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-[8px] bg-[#07182d] px-6 text-[14px] font-semibold transition hover:bg-[#102a4c] disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    color: "#ffffff",
                  }}
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="h-[18px] w-[18px] animate-spin" />
                      Sending link...
                    </>
                  ) : (
                    <>
                      <Mail className="h-[17px] w-[17px]" />
                      Send reset link
                    </>
                  )}
                </button>
              </form>

              <div className="my-7 h-px bg-[#eaecf0]" />

              <Link
                href="/login"
                className="mx-auto flex w-fit items-center gap-2 text-[13px] font-semibold text-[#d71920] transition hover:text-[#b91319]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </div>

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