"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, UserRound, ClipboardPenLine, BadgeCheck, UsersRound,
  MessageSquareText, LockKeyhole, LogOut, Trash2, Menu, X,
  ChevronDown, Building2, ShieldCheck, Settings, BriefcaseBusiness, Bell,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import styles from "./employer.module.css";

export default function EmployerShell({ companyName, active, children }: {
  companyName: string;
  active: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const initial = (companyName || "E").trim().charAt(0).toUpperCase();

  const items = [
    { href: "/employer", label: "Dashboard", Icon: LayoutDashboard, key: "dashboard" },
    { href: "/employer/company", label: "Profile", Icon: UserRound, key: "company" },
    { href: "/post-job", label: "Submit Job", Icon: ClipboardPenLine, key: "post" },
    { href: "/employer/applications", label: "Applicants", Icon: BadgeCheck, key: "applications" },
    { href: "/employer/shortlist", label: "Shortlist Candidates", Icon: UsersRound, key: "shortlist" },
    { href: "/employer/jobs", label: "My Jobs", Icon: BriefcaseBusiness, key: "jobs" },
    { href: "", label: "Packages", Icon: BriefcaseBusiness, key: "packages" },
    { href: "/employer/messages", label: "Messages", Icon: MessageSquareText, key: "messages" },
    { href: "/employer/settings", label: "Change Password", Icon: LockKeyhole, key: "password" },
  ] as const;

  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  function nav() {
    return items.map(({ href, label, Icon, key }) => {
      const isActive = (key === "dashboard" ? pathname === "/employer" :
        key === "post" ? pathname === "/post-job" :
        key === "company" ? pathname === "/employer/company" :
        key === "jobs" ? pathname.startsWith("/employer/jobs") :
        key === "applications" ? pathname.startsWith("/employer/applications") :
        key === "shortlist" ? pathname.startsWith("/employer/shortlist") :
        key === "messages" ? pathname.startsWith("/employer/messages") :
        key === "password" ? pathname.startsWith("/employer/settings") : false);
      return href ? (
        <Link key={key} href={href} onClick={() => setOpen(false)} className={`${styles.referenceNavItem} ${isActive ? styles.referenceNavActive : ""}`} aria-current={isActive ? "page" : undefined}>
          <Icon aria-hidden="true" strokeWidth={1.35} /> <span>{label}</span>
        </Link>
      ) : (
        <span key={key} className={`${styles.referenceNavItem} ${styles.referenceNavDisabled}`} title="Coming soon" aria-disabled="true">
          <Icon aria-hidden="true" strokeWidth={1.35} /> <span>{label}</span>
        </span>
      );
    });
  }

  return <main className={styles.page}>
    <div className={styles.shell}>
      <button type="button" className={styles.dashboardMobileMenu} onClick={() => setOpen(!open)} aria-label={open ? "Close employer navigation" : "Open employer navigation"} aria-expanded={open}>{open ? <X /> : <Menu />} <span>Employer menu</span></button>
      {open && <button type="button" className={styles.mobileOverlay} aria-label="Close navigation" onClick={() => setOpen(false)} />}
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
        <div className={styles.company}><div className={styles.companyLogo}>{initial}</div><div><strong>{companyName}</strong><span>Employer Account</span></div></div>
        <nav className={styles.sideNav} aria-label="Employer navigation">{nav()}</nav>
        <div className={styles.sideBottom}>
          <button type="button" className={styles.referenceNavItem} onClick={signOut}><LogOut strokeWidth={1.35} /><span>Logout</span></button>
          <span className={`${styles.referenceNavItem} ${styles.referenceNavDisabled}`} title="Account deletion is not available here" aria-disabled="true"><Trash2 strokeWidth={1.35} /><span>Delete Profile</span></span>
          <Link href="/employer/verification" className={styles.referenceSecondary}><Building2 size={16} strokeWidth={1.5} /> LTD Verification</Link>
          <Link href="/employer/settings" className={styles.referenceSecondary}><BriefcaseBusiness size={16} strokeWidth={1.5} /> Settings</Link>
        </div>
      </aside>
      <section className={styles.content}>{children}</section>
    </div>
    <footer className={styles.careerFooter}><div className={styles.careerFooterInner}><Link href="/" className={styles.careerFooterBrand}>UKJobAlert</Link><span>UK job opportunities from verified employers.</span><div><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy-policy">Privacy</Link></div></div></footer>
  </main>;
}
