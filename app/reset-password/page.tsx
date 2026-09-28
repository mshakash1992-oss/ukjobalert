"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [checkingLink, setCheckingLink] =
    useState(true);

  const [linkReady, setLinkReady] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function prepareRecoverySession() {
      try {
        const supabase = createClient();

        const params =
          new URLSearchParams(
            window.location.search
          );

        const code = params.get("code");

        if (code) {
          const {
            error: exchangeError,
          } =
            await supabase.auth.exchangeCodeForSession(
              code
            );

          if (exchangeError) {
            setError(
              "This password reset link is invalid or has expired. Please request a new reset link."
            );

            setCheckingLink(false);
            return;
          }

          setLinkReady(true);
          setCheckingLink(false);
          return;
        }

        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        if (session) {
          setLinkReady(true);
        } else {
          setError(
            "This password reset link is invalid or has expired. Please request a new reset link."
          );
        }
      } catch {
        setError(
          "Unable to verify the password reset link. Please request a new reset link."
        );
      } finally {
        setCheckingLink(false);
      }
    }

    prepareRecoverySession();
  }, []);

  async function handleResetPassword(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!linkReady) {
      setError(
        "Please open a valid password reset link from your email."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error: updateError } =
        await supabase.auth.updateUser({
          password,
        });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(
        "Your password has been updated successfully. Redirecting to login..."
      );

      setPassword("");
      setConfirmPassword("");

      await supabase.auth.signOut();

      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 1800);
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
                    color: "#dceaff",
                  }}
                />

                Secure password update
              </div>

              <h1
                className="mt-8 max-w-[590px] text-[54px] font-bold leading-[1.02] tracking-[-2.3px] xl:text-[64px]"
                style={{
                  color: "#ffffff",
                  textShadow:
                    "0 3px 20px rgba(0,0,0,.38)",
                }}
              >
                Choose a new
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
                Create a new secure password for
                your UKJobAlert.com account.
              </p>

              <div
                className="mt-10 max-w-[570px] rounded-[13px] border p-5 backdrop-blur-[6px]"
                style={{
                  borderColor:
                    "rgba(255,255,255,.28)",
                  backgroundColor:
                    "rgba(7,24,45,.36)",
                }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-[9px]"
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
                  Keep your account secure
                </p>

                <p
                  className="mt-1.5 text-[12px] leading-5"
                  style={{
                    color:
                      "rgba(255,255,255,.88)",
                  }}
                >
                  Use at least 8 characters and
                  avoid reusing an old password.
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

        {/* RESET SIDE */}

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

            <div className="rounded-[18px] border border-[#e1e5eb] bg-white p-7 shadow-[0_24px_65px_rgba(16,24,40,.08)] sm:p-10">

              <div className="mx-auto flex h-[58px] w-[58px] items-center justify-center rounded-[14px] bg-[#f2f7ff]">
                {checkingLink ? (
                  <LoaderCircle className="h-6 w-6 animate-spin text-[#175cd3]" />
                ) : (
                  <KeyRound className="h-6 w-6 text-[#175cd3]" />
                )}
              </div>

              <div className="mt-6 text-center">

                <p className="text-[12px] font-semibold text-[#175cd3]">
                  Account security
                </p>

                <h2 className="mt-2 text-[32px] font-bold tracking-[-1.1px] text-[#101828]">
                  Set new password
                </h2>

                <p className="mx-auto mt-3 max-w-[370px] text-[13px] leading-6 text-[#667085]">
                  {checkingLink
                    ? "Verifying your password reset link..."
                    : "Enter your new password below to regain access to your account."}
                </p>

              </div>

              {/* ERROR */}

              {error && (
                <div className="mt-6 flex items-start gap-3 rounded-[10px] border border-[#fecdca] bg-[#fef3f2] p-4">

                  <AlertCircle className="mt-[1px] h-[18px] w-[18px] shrink-0 text-[#d92d20]" />

                  <p className="text-[12px] font-medium leading-5 text-[#b42318]">
                    {error}
                  </p>

                </div>
              )}

              {/* SUCCESS */}

              {success && (
                <div className="mt-6 flex items-start gap-3 rounded-[10px] border border-[#abefc6] bg-[#ecfdf3] p-4">

                  <CheckCircle2 className="mt-[1px] h-[18px] w-[18px] shrink-0 text-[#067647]" />

                  <div>
                    <p className="text-[12px] font-semibold text-[#067647]">
                      Password updated
                    </p>

                    <p className="mt-1 text-[12px] leading-5 text-[#067647]">
                      {success}
                    </p>
                  </div>

                </div>
              )}

              {/* FORM */}

              {!checkingLink && linkReady && !success && (
                <form
                  onSubmit={handleResetPassword}
                  className="mt-7 space-y-5"
                >

                  {/* PASSWORD */}

                  <div>

                    <label className="mb-2 block text-[12px] font-semibold text-[#344054]">
                      New password
                    </label>

                    <div className="flex min-h-[54px] items-center rounded-[9px] border border-[#d0d5dd] bg-white px-4 transition focus-within:border-[#175cd3] focus-within:ring-[3px] focus-within:ring-[#175cd3]/10">

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
                      Confirm new password
                    </label>

                    <div className="flex min-h-[54px] items-center rounded-[9px] border border-[#d0d5dd] bg-white px-4 transition focus-within:border-[#175cd3] focus-within:ring-[3px] focus-within:ring-[#175cd3]/10">

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
                        placeholder="Confirm new password"
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

                  {/* UPDATE */}

                  <button
                    disabled={loading}
                    type="submit"
                    className="flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-[8px] bg-[#07182d] px-6 text-[14px] font-semibold transition hover:bg-[#102a4c] disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      color: "#ffffff",
                    }}
                  >
                    {loading ? (
                      <>
                        <LoaderCircle className="h-[18px] w-[18px] animate-spin" />
                        Updating password...
                      </>
                    ) : (
                      <>
                        <KeyRound className="h-[17px] w-[17px]" />
                        Update password
                      </>
                    )}
                  </button>

                </form>
              )}

              {/* INVALID LINK */}

              {!checkingLink &&
                !linkReady &&
                !success && (
                  <div className="mt-6">

                    <Link
                      href="/forgot-password"
                      className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[8px] bg-[#07182d] px-6 text-[14px] font-semibold"
                      style={{
                        color: "#ffffff",
                      }}
                    >
                      <KeyRound className="h-[17px] w-[17px]" />
                      Request new reset link
                    </Link>

                  </div>
                )}

              <div className="my-7 h-px bg-[#eaecf0]" />

              <Link
                href="/login"
                className="mx-auto flex w-fit items-center gap-2 text-[13px] font-semibold text-[#175cd3] transition hover:text-[#154fb7]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>

            </div>

          </div>
        </section>

      </div>
    </main>
  );
}