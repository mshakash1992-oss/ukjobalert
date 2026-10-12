"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  FileText,
  Heart,
  LayoutDashboard,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import styles from "./AccountNav.module.css";

const items = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/account/profile", label: "My Profile", icon: UserRound },
  { href: "/account/applications", label: "Applications", icon: FileText },
  { href: "/account/saved-jobs", label: "Saved Jobs", icon: Heart },
  { href: "/jobs", label: "Find Jobs", icon: BriefcaseBusiness },
  { href: "/account/settings", label: "Account Settings", icon: Settings },
];

export default function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  return (
    <aside className={styles.sidebar}>
      <nav>
        {items.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={active ? styles.active : ""}>
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>
      <button type="button" onClick={signOut}><LogOut /> Sign Out</button>
    </aside>
  );
}
