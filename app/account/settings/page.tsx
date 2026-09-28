import Link from "next/link";
import { redirect } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import MainHeader from "@/components/main-header";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Account Settings",
  description: "Manage your UKJobAlert account settings.",
};

export default async function AccountSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (
    user.user_metadata?.account_type ===
    "employer"
  ) {
    redirect("/employer/jobs");
  }

  const fullName =
    user.user_metadata?.full_name || "";

  const email = user.email || "";

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <MainHeader />

      {/* HERO */}

      <section className="relative overflow-hidden bg-[#07182d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(23,92,211,0.18),transparent_34%)]" />

        <div className="relative mx-auto max-w-[1280px] px-6 py-16 sm:px-8 lg:px-10 lg:py-20">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-[13px] font-semibold transition hover:text-white"
            style={{
              color: "rgba(255,255,255,.62)",
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to account
          </Link>

          <div className="mt-9 flex items-center gap-2.5">
            <div className="h-[2px] w-7 bg-[#3b82f6]" />

            <p
              className="text-[11px] font-bold uppercase tracking-[0.17em]"
              style={{
                color: "#9ec2ff",
              }}
            >
              Account settings
            </p>
          </div>

          <h1
            className="mt-6 text-[42px] font-bold leading-[1.04] tracking-[-1.7px] sm:text-[52px]"
            style={{
              color: "#ffffff",
            }}
          >
            Manage your account.
          </h1>

          <p
            className="mt-5 max-w-[620px] text-[15px] leading-7"
            style={{
              color: "rgba(255,255,255,.64)",
            }}
          >
            Keep your personal details accurate and review
            the security information connected to your
            UKJobAlert account.
          </p>
        </div>
      </section>

      {/* CONTENT */}

      <section>
        <div className="mx-auto grid max-w-[1160px] gap-8 px-6 py-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_330px] lg:px-10 lg:py-18">

          {/* LEFT */}

          <div className="space-y-6">

            {/* PERSONAL INFORMATION */}

            <div className="overflow-hidden border border-[#e4e7ec] bg-white">
              <div className="border-b border-[#e4e7ec] px-7 py-6 sm:px-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[9px] bg-[#eef4ff]">
                    <UserRound className="h-5 w-5 text-[#175cd3]" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#667085]">
                      Profile
                    </p>

                    <h2 className="mt-1 text-[20px] font-bold tracking-[-0.4px] text-[#101828]">
                      Personal information
                    </h2>
                  </div>
                </div>
              </div>

              <form
                action="/api/account/profile"
                method="POST"
                className="px-7 py-8 sm:px-8 sm:py-9"
              >
                <div className="max-w-[590px]">
                  <label
                    htmlFor="full_name"
                    className="block text-[12px] font-bold text-[#344054]"
                  >
                    Full name
                  </label>

                  <div className="relative mt-2.5">
                    <UserRound className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#98a2b3]" />

                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      required
                      minLength={2}
                      maxLength={100}
                      defaultValue={fullName}
                      autoComplete="name"
                      className="min-h-[52px] w-full rounded-[7px] border border-[#d0d5dd] bg-white py-3 pl-11 pr-4 text-[14px] font-medium text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[#175cd3] focus:ring-2 focus:ring-[#175cd3]/10"
                    />
                  </div>

                  <p className="mt-2.5 text-[11px] leading-5 text-[#667085]">
                    This name is used across your UKJobAlert
                    account.
                  </p>

                  <div className="mt-7 flex items-center gap-4 border-t border-[#eaecf0] pt-6">
                    <button
                      type="submit"
                      className="inline-flex min-h-[46px] items-center justify-center rounded-[7px] bg-[#175cd3] px-6 text-[13px] font-bold text-white transition hover:bg-[#154fb7]"
                    >
                      Save changes
                    </button>

                    <Link
                      href="/account"
                      className="inline-flex min-h-[46px] items-center justify-center px-2 text-[13px] font-semibold text-[#667085] transition hover:text-[#101828]"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </form>
            </div>

            {/* EMAIL */}

            <div className="border border-[#e4e7ec] bg-white px-7 py-7 sm:px-8 sm:py-8">
              <div className="flex items-start gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#f5f8ff]">
                  <Mail className="h-[18px] w-[18px] text-[#175cd3]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#667085]">
                      Email address
                    </p>

                    {user.email_confirmed_at && (
                      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#ecfdf3] px-2.5 py-1 text-[10px] font-bold text-[#027a48]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    )}
                  </div>

                  <p className="mt-3 break-all text-[15px] font-bold text-[#101828]">
                    {email}
                  </p>

                  <p className="mt-2 max-w-[590px] text-[12px] leading-6 text-[#667085]">
                    Your email address is used for login and
                    account security. Email changes are not
                    currently available from this page.
                  </p>
                </div>
              </div>
            </div>

            {/* PASSWORD */}

            <div className="border border-[#e4e7ec] bg-white px-7 py-7 sm:px-8 sm:py-8">
              <div className="flex items-start gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#f5f8ff]">
                  <LockKeyhole className="h-[18px] w-[18px] text-[#175cd3]" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#667085]">
                    Password
                  </p>

                  <h2 className="mt-3 text-[17px] font-bold tracking-[-0.25px] text-[#101828]">
                    Need a new password?
                  </h2>

                  <p className="mt-2 max-w-[590px] text-[12px] leading-6 text-[#667085]">
                    Use the secure password recovery flow to
                    create a new password for your account.
                  </p>

                  <Link
                    href="/forgot-password"
                    className="mt-5 inline-flex min-h-[42px] items-center justify-center rounded-[7px] border border-[#d0d5dd] bg-white px-4 text-[12px] font-bold text-[#344054] transition hover:border-[#98a2b3] hover:bg-[#f9fafb]"
                  >
                    Reset password
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <aside className="space-y-6">
            <div className="relative overflow-hidden bg-[#07182d] p-7">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[#175cd3]/10 blur-2xl" />

              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-white/5">
                  <ShieldCheck
                    className="h-5 w-5"
                    style={{
                      color: "#7fb0ff",
                    }}
                  />
                </div>

                <p
                  className="mt-6 text-[10px] font-bold uppercase tracking-[0.15em]"
                  style={{
                    color: "rgba(255,255,255,.48)",
                  }}
                >
                  Account security
                </p>

                <h2
                  className="mt-3 text-[21px] font-bold leading-[1.25] tracking-[-0.4px]"
                  style={{
                    color: "#ffffff",
                  }}
                >
                  Keep your details current.
                </h2>

                <p
                  className="mt-4 text-[12px] leading-6"
                  style={{
                    color: "rgba(255,255,255,.62)",
                  }}
                >
                  Use an accurate name and keep access to the
                  email address connected to your account.
                </p>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <SecurityItem>
                    Email verified
                  </SecurityItem>

                  <SecurityItem>
                    Password protected
                  </SecurityItem>

                  <SecurityItem>
                    Job seeker account
                  </SecurityItem>
                </div>
              </div>
            </div>

            <div className="border border-[#e4e7ec] bg-white p-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#667085]">
                Account
              </p>

              <h3 className="mt-3 text-[17px] font-bold text-[#101828]">
                Job seeker
              </h3>

              <p className="mt-2 text-[12px] leading-6 text-[#667085]">
                Search, save and apply for current UK
                vacancies.
              </p>

              <Link
                href="/account"
                className="mt-6 inline-flex items-center gap-2 text-[12px] font-bold text-[#175cd3] transition hover:text-[#154fb7]"
              >
                <ArrowLeft className="h-4 w-4" />
                My account
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function SecurityItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3.5 flex first:mt-0 items-center gap-2.5">
      <CheckCircle2
        className="h-4 w-4 shrink-0"
        style={{
          color: "#7fb0ff",
        }}
      />

      <span
        className="text-[11px] font-semibold"
        style={{
          color: "rgba(255,255,255,.78)",
        }}
      >
        {children}
      </span>
    </div>
  );
}