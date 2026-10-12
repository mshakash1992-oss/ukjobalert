"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BookmarkPlus, BookmarkCheck, MessageSquareText } from "lucide-react";
import { BriefcaseBusiness, CalendarDays, Search, SlidersHorizontal, UsersRound } from "lucide-react";
import styles from "./applications-list.module.css";

type Application = { id: string; status: string | null; applied_at: string | null; user_id: string; job_id: string };
type Job = { id: string; title: string };
const PAGE_SIZE = 10;

export default function ApplicationsList({ applications, jobs, employerId, initialShortlisted = [] }: { applications: Application[]; jobs: Job[]; employerId?: string; initialShortlisted?: string[] }) {
  const router = useRouter();
  const [messagingId, setMessagingId] = useState<string | null>(null);
  async function startConversation(application: Application) {
    if (!employerId || messagingId) return;
    setMessagingId(application.id);
    setActionError("");
    try {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || user?.id !== employerId) throw new Error("Please sign in again.");
      const { data: existing, error: lookupError } = await supabase.from("job_conversations")
        .select("id").eq("job_id", application.job_id).eq("candidate_id", application.user_id).maybeSingle();
      if (lookupError) throw lookupError;
      if (!existing) {
        const { error: createError } = await supabase.from("job_conversations").insert({
          job_id: application.job_id, employer_id: employerId, candidate_id: application.user_id,
        });
        if (createError && createError.code !== "23505") throw createError;
      }
      router.push("/employer/messages");
      router.refresh();
    } catch (error: unknown) {
      console.error("Start conversation failed:", error);
      if (error && typeof error === "object") {
        const e = error as { message?: string; code?: string; details?: string; hint?: string };
        const parts = [e.message, e.code ? `Code: ${e.code}` : "", e.details, e.hint ? `Hint: ${e.hint}` : ""].filter(Boolean);
        setActionError(parts.length ? parts.join(" | ") : JSON.stringify(error));
      } else {
        setActionError(error instanceof Error ? error.message : String(error ?? "Could not start conversation."));
      }
    } finally { setMessagingId(null); }
  }
  const [shortlisted, setShortlisted] = useState<string[]>(initialShortlisted);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  async function toggleShortlist(applicationId: string) {
    if (!employerId || savingId) return;
    setSavingId(applicationId); setActionError("");
    try {
      const supabase = createClient();
      if (shortlisted.includes(applicationId)) {
        const { error } = await supabase.from("employer_shortlists").delete().eq("employer_id", employerId).eq("application_id", applicationId);
        if (error) throw error;
        setShortlisted(prev => prev.filter(id => id !== applicationId));
      } else {
        const { error } = await supabase.from("employer_shortlists").insert({ employer_id: employerId, application_id: applicationId });
        if (error) throw error;
        setShortlisted(prev => [...prev, applicationId]);
      }
    } catch (error) { setActionError(error instanceof Error ? error.message : "Could not update shortlist."); }
    finally { setSavingId(null); }
  }
  const [search, setSearch] = useState("");
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const jobNames = useMemo(() => new Map(jobs.map(j => [j.id, j.title])), [jobs]);
  const statuses = useMemo(() => Array.from(new Set(applications.map(a => a.status || "Received"))).sort(), [applications]);
  const filtered = useMemo(() => applications.filter(a => {
    const text = `${jobNames.get(a.job_id) || ""} ${a.user_id} ${a.status || "Received"}`.toLowerCase();
    return (!jobId || a.job_id === jobId) &&
      (!status || (a.status || "Received") === status) &&
      text.includes(search.trim().toLowerCase());
  }).sort((a, b) => {
    const diff = (Date.parse(a.applied_at || "") || 0) - (Date.parse(b.applied_at || "") || 0);
    return sort === "oldest" ? diff : -diff;
  }), [applications, jobNames, jobId, status, search, sort]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const changeSearch = (value: string) => { setSearch(value); setPage(1); };
  const changeJob = (value: string) => { setJobId(value); setPage(1); };
  const changeStatus = (value: string) => { setStatus(value); setPage(1); };
  const changeSort = (value: string) => { setSort(value); setPage(1); };

  return <div className={styles.wrap}>
    <div className={styles.heading}><div><span className={styles.eyebrow}>EMPLOYER WORKSPACE</span><h1>Applicants</h1><p>Review applications received for your company's job postings.</p></div></div>
    <div className={styles.stats}>
      <div><span>Total Applications</span><strong>{applications.length}</strong></div>
      <div><span>Jobs with Applicants</span><strong>{new Set(applications.map(a => a.job_id)).size}</strong></div>
      <div><span>Matching Results</span><strong>{filtered.length}</strong></div>
    </div>
    <section className={styles.panel}>
      <div className={styles.panelHeader}><div><h2>Applicant List</h2><p>{filtered.length} {filtered.length === 1 ? "application" : "applications"} found</p></div></div>
      <div className={styles.toolbar}>
        <label className={styles.search}><Search size={18}/><input aria-label="Search applicants" value={search} onChange={e => changeSearch(e.target.value)} placeholder="Search job, applicant ID or status"/></label>
        <label className={styles.select}><BriefcaseBusiness size={17}/><select aria-label="Filter by job" value={jobId} onChange={e => changeJob(e.target.value)}><option value="">All Jobs</option>{jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}</select></label>
        <label className={styles.select}><SlidersHorizontal size={17}/><select aria-label="Filter by status" value={status} onChange={e => changeStatus(e.target.value)}><option value="">All Statuses</option>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</select></label>
        <label className={styles.select}>Sort by: <select aria-label="Sort applications" value={sort} onChange={e => changeSort(e.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option></select></label>
      </div>
      {actionError && <p role="alert" className={styles.actionError}>{actionError}</p>}
      {filtered.length === 0 ? <div className={styles.empty}><UsersRound size={34}/><h3>No applicants found</h3><p>{applications.length ? "Try changing your search or filters." : "Applications will appear here when candidates apply."}</p></div> :
        <div className={styles.list}>{visible.map(a => <article className={styles.card} key={a.id}>
          <div className={styles.icon}><UsersRound size={22}/></div>
          <div className={styles.info}><strong>{jobNames.get(a.job_id) || "Job application"}</strong><span>Applicant ID: {a.user_id.slice(0, 8)}…</span></div>
          <div className={styles.right}><span className={`${styles.badge} ${["received","pending"].includes((a.status || "Received").toLowerCase()) ? styles.pending : styles.neutral}`}>{a.status || "Received"}</span><span className={styles.date}><CalendarDays size={14}/>{a.applied_at ? new Date(a.applied_at).toLocaleDateString("en-GB") : "Date unavailable"}</span></div>
          {employerId && <button type="button" className={styles.shortlistButton} disabled={messagingId !== null} onClick={() => void startConversation(a)} aria-label="Message applicant">
            <MessageSquareText size={16}/> {messagingId === a.id ? "Opening..." : "Message"}
          </button>}
          {employerId && <button type="button" className={styles.shortlistButton} disabled={savingId !== null} onClick={() => void toggleShortlist(a.id)} aria-label={shortlisted.includes(a.id) ? "Remove from shortlist" : "Shortlist candidate"}>
            {shortlisted.includes(a.id) ? <BookmarkCheck size={16}/> : <BookmarkPlus size={16}/>} {savingId === a.id ? "Saving..." : shortlisted.includes(a.id) ? "Shortlisted" : "Shortlist"}
          </button>}
        </article>)}</div>}
      {filtered.length > PAGE_SIZE && <div className={styles.pagination}><span>Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}</span><div><button type="button" disabled={currentPage === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</button><span>Page {currentPage} of {totalPages}</span><button type="button" disabled={currentPage === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button></div></div>}
    </section>
    <p className={styles.note}>Applicant IDs and existing application statuses are displayed as stored. Candidate names, CV downloads, and status updates require additional verified backend support.</p>
  </div>;
}
