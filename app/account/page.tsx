"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  CircleUserRound,
  FileText,
  Heart,
  LayoutDashboard,
  MessageSquareText,
  LogOut,
  MapPin,
  Menu,
  Search,
  Settings,
  UserRound,
  WalletCards,
  X,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import styles from "./account.module.css";

const savedJobs: Array<{id:string;title:string;company:string;location:string;salary:string;type:string}> = [];

const applications: Array<{id:string;title:string;company:string;date:string;status:string}> = [];

export default function AccountPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileName, setProfileName] = useState("My Account");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    const updateProfile = (user: { email?: string; user_metadata?: Record<string, unknown> } | null) => {
      if (!active) return;
      setSignedIn(Boolean(user));
      if (!user) {
        setProfileName("My Account");
        setProfilePhoto("");
        return;
      }
      const meta = user.user_metadata ?? {};
      const name = [meta.full_name, meta.display_name, meta.name,
        [meta.first_name, meta.last_name].filter(Boolean).join(" ")]
        .find((value) => typeof value === "string" && value.trim());
      setProfileName(typeof name === "string" ? name.trim() : (user.email?.split("@")[0] || "My Account"));
      const photo = [meta.avatar_url, meta.profile_photo_url, meta.profile_image_url, meta.photo_url]
        .find((value) => typeof value === "string" && (value.startsWith("https://") || value.startsWith("/")));
      setProfilePhoto(typeof photo === "string" ? photo : "");
    };
    supabase.auth.getUser().then(({ data }) => updateProfile(data.user)).catch(() => updateProfile(null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      updateProfile(session?.user ?? null);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  const initials = profileName.split(/\s+/).filter(Boolean).slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "").join("") || "U";

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed", error);
      setSigningOut(false);
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logo}>
            <img src="/images/ukjobalert-logo.png" alt="UKJobAlert" />
          </Link>

          <div className={styles.headerSearch}>
            <Search />
            <input placeholder="Search jobs..." />
          </div>

          <div className={styles.headerActions}>
            <button className={styles.notification} aria-label="Notifications">
              <Bell />
            </button>
            <div className={styles.userMini}>
              <div className={styles.avatar}>{profilePhoto ? <img src={profilePhoto} alt="Profile" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} onError={() => setProfilePhoto("")} /> : initials}</div>
              <div>
                <strong>{profileName}</strong>
                <span>My Account</span>
              </div>
              <ChevronDown />
            </div>
            <button
              className={styles.mobileMenu}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle account menu"
            >
              {sidebarOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <div className={styles.shell}>
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.profile}>
            <div className={styles.profileAvatar}>{profilePhoto ? <img src={profilePhoto} alt="Profile" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} onError={() => setProfilePhoto("")} /> : initials}</div>
            <div>
              <strong>{profileName}</strong>
              <span>My account</span>
            </div>
          </div>

          <nav className={styles.sideNav}>
            <Link href="/account" className={styles.active}>
              <LayoutDashboard /> Dashboard
            </Link>
            <Link href="/account/profile">
              <UserRound /> My Profile
            </Link>
            <Link href="/account/applications">
              <FileText /> Applications <span className={styles.count}>0</span>
            </Link>
            <Link href="/account/saved-jobs">
              <Heart /> Saved Jobs <span className={styles.count}>0</span>
            </Link>
            <Link href="/account/messages">
              <MessageSquareText /> Messages
            </Link>
            <Link href="/jobs">
              <BriefcaseBusiness /> Find Jobs
            </Link>
            <Link href="/account/settings">
              <Settings /> Account Settings
            </Link>
          </nav>

          <div className={styles.sideBottom}>
            <button type="button" onClick={signOut} disabled={!signedIn || signingOut}><LogOut /> {signingOut ? "Signing Out..." : "Sign Out"}</button>
          </div>
        </aside>

        <section className={styles.content}>
          <div className={styles.welcome}>
            <div>
              <span>JOB SEEKER DASHBOARD</span>
              <h1>Welcome back</h1>
              <p>Manage your profile, saved jobs and applications from one place.</p>
            </div>
            <Link href="/jobs">Find New Jobs <ArrowRight /></Link>
          </div>

          <div className={styles.stats}>
            <article>
              <div className={styles.statIcon}><FileText /></div>
              <div><strong>0</strong><span>Applications</span></div>
            </article>
            <article>
              <div className={styles.statIcon}><Heart /></div>
              <div><strong>0</strong><span>Saved Jobs</span></div>
            </article>
            <article>
              <div className={styles.statIcon}><CircleUserRound /></div>
              <div><strong>—</strong><span>Profile Complete</span></div>
            </article>
            <article>
              <div className={styles.statIcon}><CheckCircle2 /></div>
              <div><strong>0</strong><span>Active Applications</span></div>
            </article>
          </div>

          <div className={styles.dashboardGrid}>
            <div className={styles.mainColumn}>
              <section className={styles.panel}>
                <div className={styles.panelHead}>
                  <div>
                    <h2>Recent Applications</h2>
                    <p>Track your latest job applications.</p>
                  </div>
                  <Link href="/account/applications">View All <ArrowRight /></Link>
                </div>

                <div className={styles.applicationList}>
                  {applications.length === 0 && <p style={{padding:"24px",color:"#667085"}}>No recorded applications to display.</p>}
                  {applications.map((item) => (
                    <article className={styles.application} key={item.id}>
                      <div className={styles.companyInitial}>{item.company.charAt(0)}</div>
                      <div className={styles.applicationInfo}>
                        <Link href={`/jobs/${item.id}`}>{item.title}</Link>
                        <span>{item.company}</span>
                      </div>
                      <div className={styles.applicationDate}>
                        <span>Applied</span>
                        <strong>{item.date}</strong>
                      </div>
                      <span className={`${styles.status} ${item.status === "In Review" ? styles.review : ""}`}>
                        {item.status}
                      </span>
                    </article>
                  ))}
                </div>
              </section>

              <section className={styles.panel}>
                <div className={styles.panelHead}>
                  <div>
                    <h2>Saved Jobs</h2>
                    <p>Jobs you may want to apply for later.</p>
                  </div>
                  <Link href="/account/saved-jobs">View All <ArrowRight /></Link>
                </div>

                <div className={styles.savedList}>
                  {savedJobs.length === 0 && <p style={{padding:"24px",color:"#667085"}}>No saved jobs to display.</p>}
                  {savedJobs.map((job) => (
                    <article className={styles.savedJob} key={job.id}>
                      <div className={styles.companyInitial}>{job.company.charAt(0)}</div>
                      <div className={styles.savedInfo}>
                        <span className={styles.jobType}>{job.type}</span>
                        <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                        <p>{job.company}</p>
                        <div>
                          <span><MapPin />{job.location}</span>
                          <span><WalletCards />{job.salary}</span>
                        </div>
                      </div>
                      <Link href={`/jobs/${job.id}`} className={styles.viewJob}>View Job</Link>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className={styles.rightColumn}>
              <section className={styles.profileCard}>
                <div className={styles.progressRing}>
                  <span>—</span>
                </div>
                <h2>Complete Your Profile</h2>
                <p>Complete your profile to keep your job search information organised.</p>

                <div className={styles.progressBar}><span /></div>

                <ul>
                  <li><CircleUserRound /> Basic information</li>
                  <li><CircleUserRound /> Contact details</li>
                  <li><CircleUserRound /> Work experience</li>
                  <li><CircleUserRound /> Skills & preferences</li>
                </ul>

                <Link href="/account/profile">Complete Profile <ArrowRight /></Link>
              </section>

              <section className={styles.tipCard}>
                <BriefcaseBusiness />
                <h3>Looking for your next role?</h3>
                <p>Browse current vacancies from UK employers and filter by role, location and category.</p>
                <Link href="/jobs">Browse Jobs</Link>
              </section>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
