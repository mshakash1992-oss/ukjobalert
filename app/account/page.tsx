"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  CircleUserRound,
  FileText,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageSquareText,
  Settings,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import styles from "./account.module.css";

type SavedJob = {
  id: string;
  title: string;
  slug: string;
  company: string;
  location: string;
  salary: string;
  type: string;
};

type Application = {
  id: string;
  jobId: string;
  title: string;
  slug: string;
  company: string;
  appliedAt: string;
  status: string;
};

type ProfileSections = {
  basic: boolean;
  contact: boolean;
  experience: boolean;
  skills: boolean;
};

const textValue = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

function getProfileCompletion(metadata: Record<string, unknown>) {
  const fields = [
    metadata.first_name,
    metadata.last_name,
    metadata.phone,
    metadata.location,
    metadata.job_title,
    metadata.experience,
    metadata.skills,
    metadata.work_type,
    metadata.profile_photo_path,
  ];
  const completed = fields.filter((value) => textValue(value).length > 0).length;
  return Math.round((completed / fields.length) * 100);
}

export default function AccountPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileName, setProfileName] = useState("My Account");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [profileSections, setProfileSections] = useState<ProfileSections>({ basic: false, contact: false, experience: false, skills: false });
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [applicationCount, setApplicationCount] = useState(0);
  const [activeApplicationCount, setActiveApplicationCount] = useState(0);
  const [savedJobCount, setSavedJobCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setLoadError("");

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!active) return;
      if (userError || !user) {
        router.replace("/login");
        return;
      }

      setSignedIn(true);
      const metadata = user.user_metadata ?? {};
      const fullName = [metadata.full_name, metadata.display_name, metadata.name]
        .find((value) => typeof value === "string" && value.trim());
      const firstLast = [metadata.first_name, metadata.last_name]
        .filter((value) => typeof value === "string" && value.trim())
        .join(" ");
      setProfileName(
        (typeof fullName === "string" && fullName.trim()) ||
          firstLast || user.email?.split("@")[0] || "My Account",
      );
      const photo = [metadata.avatar_url, metadata.profile_photo_url, metadata.profile_image_url, metadata.photo_url]
        .find((value) => typeof value === "string" && (value.startsWith("https://") || value.startsWith("/")));
      setProfilePhoto(typeof photo === "string" ? photo : "");
      setProfileCompletion(getProfileCompletion(metadata));
      setProfileSections({
        basic: Boolean(textValue(metadata.first_name) && textValue(metadata.last_name)),
        contact: Boolean(textValue(metadata.phone) && textValue(metadata.location)),
        experience: Boolean(textValue(metadata.job_title) && textValue(metadata.experience)),
        skills: Boolean(textValue(metadata.skills) && textValue(metadata.work_type)),
      });

      const [applicationResult, savedResult] = await Promise.all([
        supabase
          .from("job_applications")
          .select("id, job_id, status, applied_at")
          .eq("user_id", user.id)
          .order("applied_at", { ascending: false }),
        supabase
          .from("saved_jobs")
          .select("id, job_id, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      if (!active) return;
      if (applicationResult.error || savedResult.error) {
        console.error("Dashboard data load failed", applicationResult.error || savedResult.error);
        setLoadError("We couldn't load your account activity. Please refresh the page.");
        setLoading(false);
        return;
      }

      const applicationRows = applicationResult.data ?? [];
      const savedRows = savedResult.data ?? [];
      setApplicationCount(applicationRows.length);
      setActiveApplicationCount(applicationRows.filter(
        (row) => !["rejected", "withdrawn", "cancelled"].includes((row.status || "applied").toLowerCase()),
      ).length);
      setSavedJobCount(savedRows.length);

      const jobIds = [...new Set([
        ...applicationRows.map((row) => row.job_id),
        ...savedRows.map((row) => row.job_id),
      ])];

      if (jobIds.length) {
        const { data: jobs, error: jobsError } = await supabase
          .from("jobs")
          .select("id, title, slug, company_name, location, salary, job_type")
          .in("id", jobIds);

        if (!active) return;
        if (jobsError) {
          console.error("Dashboard job details load failed", jobsError);
          setLoadError("Your activity loaded, but some job details couldn't be shown.");
        }

        const jobsById = new Map((jobs ?? []).map((job) => [job.id, job]));
        setApplications(
          applicationRows.slice(0, 5).map((row) => {
            const job = jobsById.get(row.job_id);
            return {
              id: row.id,
              jobId: row.job_id,
              title: job?.title || "Job application",
              slug: job?.slug || row.job_id,
              company: job?.company_name || "Employer",
              appliedAt: row.applied_at,
              status: (row.status || "applied").replaceAll("_", " "),
            };
          }),
        );
        setSavedJobs(
          savedRows.slice(0, 5).flatMap((row) => {
            const job = jobsById.get(row.job_id);
            return job ? [{
              id: row.id,
              title: job.title,
              slug: job.slug || job.id,
              company: job.company_name || "Employer",
              location: job.location || "Location not listed",
              salary: job.salary || "Salary not listed",
              type: job.job_type || "Job",
            }] : [];
          }),
        );
      } else {
        setApplications([]);
        setSavedJobs([]);
      }

      setLoading(false);
    }

    void loadDashboard().catch((error) => {
      console.error("Dashboard load failed", error);
      if (active) {
        setLoadError("We couldn't load your account activity. Please refresh the page.");
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setSignedIn(false);
        router.replace("/login");
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const initials = profileName.split(/\s+/).filter(Boolean).slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "").join("") || "U";

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    const { error } = await createClient().auth.signOut();
    if (error) {
      console.error("Sign out failed", error);
      setSigningOut(false);
      return;
    }
    router.replace("/login");
    router.refresh();
  }

  const profileChecklist = [
    { label: "Basic information", done: profileSections.basic },
    { label: "Contact details", done: profileSections.contact },
    { label: "Work experience", done: profileSections.experience },
    { label: "Skills & preferences", done: profileSections.skills },
  ];

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.profile}>
            <div className={styles.profileAvatar}>
              {profilePhoto ? <img src={profilePhoto} alt="Profile" onError={() => setProfilePhoto("")} /> : initials}
            </div>
            <div><strong>{profileName}</strong><span>My account</span></div>
          </div>

          <nav className={styles.sideNav}>
            <Link href="/account" className={styles.active} onClick={() => setSidebarOpen(false)}><LayoutDashboard /> Dashboard</Link>
            <Link href="/account/profile" onClick={() => setSidebarOpen(false)}><UserRound /> My Profile</Link>
            <Link href="/account/applications" onClick={() => setSidebarOpen(false)}><FileText /> Applications <span className={styles.count}>{applicationCount}</span></Link>
            <Link href="/account/saved-jobs" onClick={() => setSidebarOpen(false)}><Heart /> Saved Jobs <span className={styles.count}>{savedJobCount}</span></Link>
            <Link href="/account/messages" onClick={() => setSidebarOpen(false)}><MessageSquareText /> Messages</Link>
            <Link href="/jobs" onClick={() => setSidebarOpen(false)}><BriefcaseBusiness /> Find Jobs</Link>
            <Link href="/account/settings" onClick={() => setSidebarOpen(false)}><Settings /> Account Settings</Link>
          </nav>

          <div className={styles.sideBottom}>
            <button type="button" onClick={signOut} disabled={!signedIn || signingOut}>
              <LogOut /> {signingOut ? "Signing Out..." : "Sign Out"}
            </button>
          </div>
        </aside>

        <section className={styles.content}>
          <button
            type="button"
            className={styles.mobileMenu}
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? "Close account menu" : "Open account menu"}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <X /> : <Menu />}
            <span>Account menu</span>
          </button>

          <div className={styles.welcome}>
            <div>
              <span>JOB SEEKER DASHBOARD</span>
              <h1>Welcome back, {profileName.split(" ")[0]}.</h1>
              <p>Manage your profile, saved jobs and applications from one place.</p>
            </div>
            <Link href="/jobs">Find New Jobs <ArrowRight /></Link>
          </div>

          {loadError && <p className={styles.loadError} role="status">{loadError}</p>}

          <div className={styles.stats} aria-busy={loading}>
            <article><div className={styles.statIcon}><FileText /></div><div><strong>{loading ? "—" : applicationCount}</strong><span>Applications</span></div></article>
            <article><div className={styles.statIcon}><Heart /></div><div><strong>{loading ? "—" : savedJobCount}</strong><span>Saved Jobs</span></div></article>
            <article><div className={styles.statIcon}><CircleUserRound /></div><div><strong>{loading ? "—" : `${profileCompletion}%`}</strong><span>Profile Complete</span></div></article>
            <article><div className={styles.statIcon}><CheckCircle2 /></div><div><strong>{loading ? "—" : activeApplicationCount}</strong><span>Active Applications</span></div></article>
          </div>

          <div className={styles.dashboardGrid}>
            <div className={styles.mainColumn}>
              <section className={styles.panel}>
                <div className={styles.panelHead}>
                  <div><h2>Recent Applications</h2><p>Track your latest job applications.</p></div>
                  <Link href="/account/applications">View All <ArrowRight /></Link>
                </div>
                <div className={styles.applicationList}>
                  {loading ? <p className={styles.emptyState}>Loading applications…</p> : applications.length === 0 ? <p className={styles.emptyState}>No applications yet. Your tracked applications will appear here.</p> : applications.map((item) => (
                    <article className={styles.application} key={item.id}>
                      <div className={styles.companyInitial}>{item.company.charAt(0)}</div>
                      <div className={styles.applicationInfo}><Link href={`/jobs/${item.slug}`}>{item.title}</Link><span>{item.company}</span></div>
                      <div className={styles.applicationDate}><span>Applied</span><strong>{new Date(item.appliedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</strong></div>
                      <span className={`${styles.status} ${item.status.toLowerCase().includes("review") ? styles.review : ""}`}>{item.status}</span>
                    </article>
                  ))}
                </div>
              </section>

              <section className={styles.panel}>
                <div className={styles.panelHead}>
                  <div><h2>Saved Jobs</h2><p>Jobs you may want to apply for later.</p></div>
                  <Link href="/account/saved-jobs">View All <ArrowRight /></Link>
                </div>
                <div className={styles.savedList}>
                  {loading ? <p className={styles.emptyState}>Loading saved jobs…</p> : savedJobs.length === 0 ? <p className={styles.emptyState}>No saved jobs yet. Save a vacancy to keep it here.</p> : savedJobs.map((job) => (
                    <article className={styles.savedJob} key={job.id}>
                      <div className={styles.companyInitial}>{job.company.charAt(0)}</div>
                      <div className={styles.savedInfo}>
                        <span className={styles.jobType}>{job.type}</span>
                        <Link href={`/jobs/${job.slug}`}>{job.title}</Link>
                        <p>{job.company}</p>
                        <div><span><MapPin />{job.location}</span><span><WalletCards />{job.salary}</span></div>
                      </div>
                      <Link href={`/jobs/${job.slug}`} className={styles.viewJob}>View Job</Link>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className={styles.rightColumn}>
              <section className={styles.profileCard}>
                <div className={styles.progressRing} style={{ background: `conic-gradient(#f00025 ${profileCompletion * 3.6}deg, #dde5f4 0deg)` }}>
                  <span>{loading ? "—" : `${profileCompletion}%`}</span>
                </div>
                <h2>{profileCompletion === 100 ? "Profile Complete" : "Complete Your Profile"}</h2>
                <p>A complete profile helps you keep your job search information organised.</p>
                <div className={styles.progressBar}><span style={{ width: `${profileCompletion}%` }} /></div>
                <ul>
                  {profileChecklist.map((item) => <li className={item.done ? styles.done : ""} key={item.label}>{item.done ? <CheckCircle2 /> : <CircleUserRound />}{item.label}</li>)}
                </ul>
                <Link href="/account/profile">{profileCompletion === 100 ? "View Profile" : "Complete Profile"} <ArrowRight /></Link>
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
