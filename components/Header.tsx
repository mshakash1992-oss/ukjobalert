"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  CircleHelp,
  FileText,
  Info,
  LayoutDashboard,
  Mail,
  Menu,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const employerDashboard = pathname === "/employer" || pathname.startsWith("/employer/");

  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const pagesActive = [
    "/about",
    "/faq",
    "/contact",
    "/site-map",
    "/privacy-policy",
    "/terms",
    "/security-privacy",
  ].some((path) => pathname.startsWith(path));

  return (
    <header className="uja-header">
      <div className="container uja-nav">
        <Link href="/" className="uja-logo">
          <Image
            src="/images/ukjobalert-logo.png"
            alt="UKJobAlert"
            width={240}
            height={64}
            priority
          />
        </Link>

        <nav className="uja-desktop-nav" aria-label="Main navigation">
          <Link href="/" className={isActive("/") ? "active" : ""}>
            Home
          </Link>

          <div className="uja-menu">
            <span
              className={`uja-menu-trigger ${isActive("/jobs") ? "active" : ""}`}
              aria-haspopup="true"
            >
              Jobs <ChevronDown />
            </span>

            <div className="uja-dropdown">
              <Link href="/jobs">
                <Search />
                <span>
                  <strong>Browse Jobs</strong>
                  <small>Search current UK vacancies</small>
                </span>
              </Link>

              <Link href="/post-job">
                <BriefcaseBusiness />
                <span>
                  <strong>Post a Job</strong>
                  <small>For verified employers</small>
                </span>
              </Link>
            </div>
          </div>

          <div className="uja-menu">
            <span
              className={`uja-menu-trigger ${
                isActive("/companies") ||
                isActive("/employer") ||
                isActive("/post-job")
                  ? "active"
                  : ""
              }`}
              aria-haspopup="true"
            >
              Employers <ChevronDown />
            </span>

            <div className="uja-dropdown uja-dropdown-wide">
              <Link href="/companies">
                <Building2 />
                <span>
                  <strong>Companies</strong>
                  <small>Browse UK employers</small>
                </span>
              </Link>

              <Link href="/employer">
                <LayoutDashboard />
                <span>
                  <strong>Employer Dashboard</strong>
                  <small>Manage your employer account</small>
                </span>
              </Link>

              <Link href="/employer/jobs">
                <FileText />
                <span>
                  <strong>Manage Jobs</strong>
                  <small>Manage your vacancies</small>
                </span>
              </Link>

              <Link href="/employer/verification">
                <ShieldCheck />
                <span>
                  <strong>LTD Verification</strong>
                  <small>Verify your UK company</small>
                </span>
              </Link>
            </div>
          </div>

          <div className="uja-menu">
            <span
              className={`uja-menu-trigger ${
                isActive("/account") || isActive("/candidates") ? "active" : ""
              }`}
              aria-haspopup="true"
            >
              Candidates <ChevronDown />
            </span>

            <div className="uja-dropdown">
              <Link href="/account">
                <UserRound />
                <span>
                  <strong>My Account</strong>
                  <small>Candidate dashboard</small>
                </span>
              </Link>

              <Link href="/jobs">
                <Search />
                <span>
                  <strong>Browse Jobs</strong>
                  <small>Find UK vacancies</small>
                </span>
              </Link>
            </div>
          </div>

          <div className="uja-menu">
            <span
              className={`uja-menu-trigger ${pagesActive ? "active" : ""}`}
              aria-haspopup="true"
            >
              Pages <ChevronDown />
            </span>

            <div className="uja-dropdown">
              <Link href="/about">
                <Info />
                <span>
                  <strong>About</strong>
                  <small>About UKJobAlert</small>
                </span>
              </Link>

              <Link href="/faq">
                <CircleHelp />
                <span>
                  <strong>FAQ</strong>
                  <small>Frequently asked questions</small>
                </span>
              </Link>

              <Link href="/contact">
                <Mail />
                <span>
                  <strong>Contact</strong>
                  <small>Contact UKJobAlert</small>
                </span>
              </Link>

              <Link href="/security-privacy">
                <ShieldCheck />
                <span>
                  <strong>Security &amp; Privacy</strong>
                  <small>Security information</small>
                </span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="uja-actions">
          <button type="button" className="uja-bell" aria-label="Notifications">
            <Bell />
          </button>

          {employerDashboard ? (
            <div className="uja-employer-account">
              <span className="uja-login uja-employer-trigger" tabIndex={0}>Employer <ChevronDown size={15} /></span>
              <div className="uja-employer-account-menu">
                <Link href="/employer">Dashboard</Link>
                <Link href="/employer/company">Company Profile</Link>
                <Link href="/employer/messages">Messages</Link>
                <button type="button" onClick={signOut}>Sign Out</button>
              </div>
            </div>
          ) : <Link href="/login" className="uja-login">Login / Register</Link>}

          <Link href="/post-job" className="uja-post-job">
            Post a Job
          </Link>

        </div>
      </div>

      <details className="uja-native-mobile">
        <summary className="uja-mobile-toggle uja-fixed-mobile-toggle" aria-label="Toggle navigation menu">
          <Menu aria-hidden="true" />
          <span className="uja-native-close" aria-hidden="true">×</span>
        </summary>
        <nav className="uja-mobile-menu uja-fixed-mobile-menu" aria-label="Mobile navigation">
          <div className="container">
            <Link href="/">Home</Link>
            <details className="uja-native-section">
              <summary className="uja-mobile-section-button">Jobs <ChevronDown /></summary>
              <div className="uja-mobile-submenu">
                <Link href="/jobs">Browse Jobs</Link>
                <Link href="/post-job">Post a Job</Link>
              </div>
            </details>
            <details className="uja-native-section">
              <summary className="uja-mobile-section-button">Employers <ChevronDown /></summary>
              <div className="uja-mobile-submenu">
                <Link href="/companies">Companies</Link>
                <Link href="/employer">Employer Dashboard</Link>
                <Link href="/employer/jobs">Manage Jobs</Link>
                <Link href="/employer/verification">LTD Verification</Link>
              </div>
            </details>
            <details className="uja-native-section">
              <summary className="uja-mobile-section-button">Candidates <ChevronDown /></summary>
              <div className="uja-mobile-submenu">
                <Link href="/account">My Account</Link>
                <Link href="/jobs">Browse Jobs</Link>
              </div>
            </details>
            <details className="uja-native-section">
              <summary className="uja-mobile-section-button">Pages <ChevronDown /></summary>
              <div className="uja-mobile-submenu">
                <Link href="/about">About</Link>
                <Link href="/faq">FAQ</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/security-privacy">Security &amp; Privacy</Link>
              </div>
            </details>
            {employerDashboard ? <>
              <Link href="/employer">Employer Dashboard</Link>
              <Link href="/employer/messages">Messages</Link>
              <button type="button" className="uja-mobile-signout" onClick={signOut}>Sign Out</button>
            </> : <Link href="/login">Login / Register</Link>}
            <Link href="/post-job" className="uja-mobile-post">Post a Job</Link>
          </div>
        </nav>
      </details>
      <style>{`
        .uja-employer-account { position: relative; color: #fff; display: flex; align-items: center; min-height: 48px; }
        .uja-employer-trigger { display: inline-flex !important; align-items: center; gap: 6px; cursor: default; border: 0 !important; outline-offset: 4px; }
        .uja-employer-account-menu { position: absolute; top: 100%; right: 0; z-index: 10050; min-width: 200px; padding: 8px; background: #fff; color: #012169; border: 1px solid #e2e8f0; border-radius: 7px; box-shadow: 0 14px 35px rgba(0,0,0,.15); opacity: 0; visibility: hidden; pointer-events: none; transform: translateY(7px); transition: opacity .18s ease, transform .18s ease, visibility .18s; }
        .uja-employer-account:hover .uja-employer-account-menu, .uja-employer-account:focus-within .uja-employer-account-menu { opacity: 1; visibility: visible; pointer-events: auto; transform: translateY(0); }
        .uja-employer-account-menu a, .uja-employer-account-menu button { display: block; width: 100%; text-align: left; padding: 11px 12px; color: #012169; border: 0; background: none; font: inherit; font-size: 13px; cursor: pointer; border-radius: 4px; text-decoration: none; }
        .uja-employer-account-menu a:hover, .uja-employer-account-menu button:hover { background: #f0f4fb; }
        .uja-mobile-signout { width: 100%; padding: 12px; color: #fff; border: 0; background: none; text-align: left; font: inherit; }

        .uja-native-mobile { display: none; }
        @media (max-width: 1024px) {
          .uja-header { position: relative !important; z-index: 10000 !important; }
          .uja-native-mobile { display: block !important; }
          .uja-native-mobile > summary {
            display: inline-flex !important; align-items: center !important; justify-content: center !important;
            position: absolute !important; top: 50% !important; right: 16px !important;
            transform: translateY(-50%) !important; z-index: 10003 !important;
            width: 44px !important; height: 44px !important; cursor: pointer !important;
            list-style: none !important; pointer-events: auto !important;
          }
          .uja-native-mobile > summary::-webkit-details-marker,
          .uja-native-section > summary::-webkit-details-marker { display: none; }
          .uja-native-mobile > summary::marker,
          .uja-native-section > summary::marker { content: ''; }
          .uja-native-mobile > summary svg { width: 23px; height: 23px; }
          .uja-native-close { display: none; font-size: 30px; line-height: 1; }
          .uja-native-mobile[open] > summary svg { display: none; }
          .uja-native-mobile[open] > summary .uja-native-close { display: inline; }
          .uja-header .uja-native-mobile .uja-fixed-mobile-menu {
            display: block !important; visibility: visible !important; opacity: 1 !important;
            position: absolute !important; left: 0 !important; right: 0 !important; top: 100% !important;
            width: 100% !important; max-height: calc(100dvh - 75px) !important;
            overflow-y: auto !important; background: #012169 !important; color: #ffffff !important;
            z-index: 10002 !important; box-shadow: 0 14px 35px rgba(0,24,67,.18) !important;
            padding: 12px 0 20px !important;
          }
          .uja-header .uja-native-mobile .uja-fixed-mobile-menu .container {
            display: flex !important; flex-direction: column !important; align-items: stretch !important;
            width: 100% !important; max-width: 100% !important; padding: 0 20px !important;
          }
          .uja-header .uja-native-mobile .uja-fixed-mobile-menu a,
          .uja-header .uja-native-mobile .uja-mobile-section-button {
            display: flex !important; align-items: center !important; justify-content: space-between !important;
            width: 100% !important; min-height: 46px !important; padding: 12px 10px !important;
            color: #ffffff !important; background: transparent !important; border: 0 !important;
            border-bottom: 1px solid rgba(255,255,255,.18) !important; text-align: left !important;
            font: inherit !important; text-decoration: none !important; cursor: pointer !important;
            list-style: none !important;
          }
          .uja-header .uja-native-mobile .uja-fixed-mobile-menu a:hover,
          .uja-header .uja-native-mobile .uja-mobile-section-button:hover {
            background: #c8102e !important; color: #ffffff !important;
          }
          .uja-header .uja-native-mobile .uja-native-section { width: 100% !important; }
          .uja-header .uja-native-mobile .uja-native-section[open] > summary svg { transform: rotate(180deg); }
          .uja-header .uja-native-mobile .uja-mobile-submenu {
            display: flex !important; flex-direction: column !important;
            padding: 2px 0 8px 14px !important; background: #00194f !important;
          }
          .uja-header .uja-native-mobile .uja-mobile-submenu a { font-size: 14px !important; min-height: 40px !important; }
          .uja-header .uja-native-mobile .uja-mobile-post {
            background: #c8102e !important; color: #fff !important; border-radius: 8px !important;
            justify-content: center !important; margin-top: 12px !important;
          }
        }
      `}</style>
    </header>
  );
}
