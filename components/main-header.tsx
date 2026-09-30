"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  BriefcaseBusiness,
  LogOut,
  Menu,
  Search,
  UserRound,
  X,
} from "lucide-react";

type MainHeaderProps = {
  loggedIn?: boolean;
  displayName?: string;
  accountType?: string;
  isAdmin?: boolean;
};

export default function MainHeader({
  loggedIn = false,
  displayName = "Account",
  accountType,
}: MainHeaderProps) {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const isEmployer =
    loggedIn &&
    accountType === "employer";

  const postJobHref =
    isEmployer
      ? "/post-job"
      : "/signup";

  const employersHref =
    isEmployer
      ? "/employer/jobs"
      : "/employers";

  const accountHref =
    isEmployer
      ? "/employer/jobs"
      : "/account";

  const navigation = [
    {
      label: "Find jobs",
      href: "/jobs",
    },
    {
      label: "Companies",
      href: "/companies",
    },
    ...(!loggedIn || isEmployer
      ? [
          {
            label: "Post a job",
            href: postJobHref,
          },
        ]
      : []),
    {
      label: "Employers",
      href: employersHref,
    },
    {
      label: "How it works",
      href: "/how-it-works",
    },
    {
      label: "About",
      href: "/about",
    },
  ];

  function isActive(
    label: string,
    href: string
  ) {
    if (label === "Find jobs") {
      return (
        pathname === "/jobs" ||
        pathname.startsWith("/jobs/")
      );
    }

    if (label === "Companies") {
      return pathname === "/companies";
    }

    if (label === "Post a job") {
      return pathname === "/post-job";
    }

    if (label === "Employers") {
      if (isEmployer) {
        return pathname.startsWith(
          "/employer"
        );
      }

      return pathname === "/employers";
    }

    if (label === "How it works") {
      return pathname === "/how-it-works";
    }

    if (label === "About") {
      return pathname === "/about";
    }

    return false;
  }

  return (
    <header className="relative z-50 border-b border-[#e4e7ec] bg-white">
      <div className="mx-auto flex h-[74px] max-w-[1360px] items-center px-6 md:px-10 xl:px-12">

        {/* LOGO */}
        <Link
          href="/"
          aria-label="UKJobAlert home"
          className="flex shrink-0 items-center"
        >
          <Image
            src="/ukjobalert-logo.png"
            alt="UKJobAlert"
            width={190}
            height={52}
            priority
            className="h-auto w-[158px] object-contain md:w-[174px]"
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="ml-12 hidden h-full items-center gap-8 lg:flex">
          {navigation.map((item) => {
            const active = isActive(
              item.label,
              item.href
            );

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative flex h-full items-center text-[14px] font-semibold transition ${
                  active
                    ? "text-[#07182d]"
                    : "text-[#475467] hover:text-[#07182d]"
                }`}
              >
                {item.label}

                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d71920]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* DESKTOP RIGHT */}
        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <Link
            href="/jobs"
            aria-label="Search jobs"
            className="flex h-[44px] w-[44px] items-center justify-center rounded-full text-[#475467] transition hover:bg-[#f2f4f7] hover:text-[#07182d]"
          >
            <Search className="h-[19px] w-[19px]" />
          </Link>

          {loggedIn ? (
            <>
              <Link
                href={accountHref}
                className="flex min-h-[44px] items-center gap-2.5 rounded-[8px] px-3 text-[13px] font-semibold text-[#344054] transition hover:bg-[#f2f4f7]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f2f4f7]">
                  <UserRound className="h-[16px] w-[16px] text-[#475467]" />
                </div>

                <span className="max-w-[145px] truncate">
                  {displayName}
                </span>
              </Link>

              <form
                action="/auth/signout"
                method="POST"
              >
                <button
                  type="submit"
                  aria-label="Log out"
                  className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-transparent text-[#667085] transition hover:bg-[#f2f4f7] hover:text-[#07182d]"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="px-3 py-2 text-[14px] font-semibold text-[#344054] transition hover:text-[#07182d]"
            >
              Log in
            </Link>
          )}

          {(!loggedIn || isEmployer) && (
            <Link
              href={postJobHref}
              className="ml-1 inline-flex min-h-[44px] items-center gap-2 rounded-[7px] bg-[#d71920] px-[18px] text-[13px] font-bold transition hover:bg-[#b91319]"
              style={{
                color: "#ffffff",
              }}
            >
              <BriefcaseBusiness className="h-[17px] w-[17px]" />
              Post a job
            </Link>
          )}
        </div>

        {/* MOBILE */}
        <div className="ml-auto flex items-center lg:hidden">
          <button
            type="button"
            aria-label={
              menuOpen
                ? "Close menu"
                : "Open menu"
            }
            onClick={() =>
              setMenuOpen(
                (current) => !current
              )
            }
            className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-transparent text-[#344054]"
          >
            {menuOpen ? (
              <X className="h-[22px] w-[22px]" />
            ) : (
              <Menu className="h-[22px] w-[22px]" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-full border-t border-[#eaecf0] bg-white shadow-[0_8px_24px_rgba(16,24,40,.08)] lg:hidden">
          <div className="px-5 py-5">
            <nav className="flex flex-col">
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="flex min-h-[52px] items-center border-b border-[#f0f2f5] text-[15px] font-semibold text-[#344054] last:border-b-0"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-5 border-t border-[#eaecf0] pt-5">
              {loggedIn ? (
                <div className="space-y-3">
                  <Link
                    href={accountHref}
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="flex min-h-[48px] items-center gap-3 rounded-[8px] border border-[#d0d5dd] px-4 text-[14px] font-semibold text-[#344054]"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f2f4f7]">
                      <UserRound className="h-[16px] w-[16px] text-[#475467]" />
                    </div>

                    <span className="truncate">
                      {displayName}
                    </span>
                  </Link>

                  <form
                    action="/auth/signout"
                    method="POST"
                  >
                    <button
                      type="submit"
                      className="flex min-h-[48px] w-full items-center gap-3 rounded-[8px] bg-transparent px-4 text-left text-[14px] font-semibold text-[#667085]"
                    >
                      <LogOut className="h-[17px] w-[17px]" />
                      Log out
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="flex min-h-[48px] items-center justify-center rounded-[8px] border border-[#d0d5dd] text-[14px] font-semibold text-[#344054]"
                >
                  Log in
                </Link>
              )}

              {(!loggedIn || isEmployer) && (
                <Link
                  href={postJobHref}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="mt-3 flex min-h-[48px] items-center justify-center gap-2 rounded-[7px] bg-[#d71920] px-4 text-[14px] font-bold"
                  style={{
                    color: "#ffffff",
                  }}
                >
                  <BriefcaseBusiness className="h-[17px] w-[17px]" />
                  Post a job
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
