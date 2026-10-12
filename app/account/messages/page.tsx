"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageSquareText, RefreshCw, Send, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import styles from "./messages.module.css";

type Conversation = { id: string; job_id: string; employer_id: string; candidate_id: string; created_at: string };
type Message = { id: string; conversation_id: string; sender_id: string; message: string; created_at: string };
type Job = { id: string; title: string };

export default function CandidateMessagesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [jobTitles, setJobTitles] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) { router.replace("/login"); return; }
      if (user.user_metadata?.account_type === "employer") { router.replace("/employer/messages"); return; }
      setUserId(user.id);
      const { data: threads, error: threadsError } = await supabase.from("job_conversations")
        .select("id,job_id,employer_id,candidate_id,created_at")
        .eq("candidate_id", user.id).order("created_at", { ascending: false });
      if (threadsError) throw threadsError;
      const rows = (threads || []) as Conversation[];
      setConversations(rows);
      const ids = rows.map(c => c.id);
      const jobs = [...new Set(rows.map(c => c.job_id))];
      const [messageResult, jobResult] = await Promise.all([
        ids.length ? supabase.from("job_messages")
          .select("id,conversation_id,sender_id,message,created_at")
          .in("conversation_id", ids).order("created_at", { ascending: true }).limit(2000)
          : Promise.resolve({ data: [] as Message[], error: null }),
        jobs.length ? supabase.from("jobs").select("id,title").in("id", jobs)
          : Promise.resolve({ data: [] as Job[], error: null }),
      ]);
      if (messageResult.error) throw messageResult.error;
      // Job titles are optional: RLS may hide unpublished or expired jobs.
      setJobTitles(Object.fromEntries(((jobResult.data || []) as Job[]).map(j => [j.id, j.title])));
      setMessages((messageResult.data || []) as Message[]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load messages.");
    } finally { setLoading(false); }
  }, [router]);

  useEffect(() => { void load(); }, [load]);

  const activeId = conversations.some(c => c.id === selected) ? selected : (conversations[0]?.id || "");
  const active = conversations.find(c => c.id === activeId);
  const filtered = useMemo(() => conversations.filter(c =>
    `${jobTitles[c.job_id] || "Job conversation"} ${c.employer_id}`.toLowerCase().includes(search.toLowerCase())
  ), [conversations, jobTitles, search]);
  const thread = useMemo(() => messages.filter(m => m.conversation_id === activeId)
    .sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at)), [messages, activeId]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!activeId || !userId || !body || sending) return;
    if (body.length > 5000) { setError("Message cannot exceed 5,000 characters."); return; }
    setSending(true); setError("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.id !== userId) throw new Error("Session expired. Please sign in again.");
      const { data, error: insertError } = await supabase.from("job_messages")
        .insert({ conversation_id: activeId, sender_id: userId, message: body })
        .select("id,conversation_id,sender_id,message,created_at").single();
      if (insertError) throw insertError;
      setMessages(previous => [...previous, data as Message]);
      setDraft("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Message could not be sent.");
    } finally { setSending(false); }
  }

  return <main className={styles.page}>
    <div className={styles.container}>
      <div className={styles.top}><Link href="/account" className={styles.back}><ArrowLeft size={17}/> Back to Dashboard</Link>
        <button type="button" className={styles.refresh} onClick={() => void load()} disabled={loading}><RefreshCw size={16}/> Refresh</button></div>
      <div className={styles.heading}><span>JOB SEEKER DASHBOARD</span><h1>My Messages</h1><p>Read and reply to messages from employers about your applications.</p></div>
      {error && <div role="alert" className={styles.error}>{error}</div>}
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTitle}>Conversations <span>{conversations.length}</span></div>
          <label className={styles.search}><Search size={16}/><input aria-label="Search conversations" placeholder="Search jobs" value={search} onChange={e => setSearch(e.target.value)}/></label>
          <div className={styles.list}>{filtered.map(c => {
            const last = messages.filter(m => m.conversation_id === c.id).at(-1);
            return <button type="button" key={c.id} onClick={() => {setSelected(c.id);setError("");}} className={`${styles.item} ${activeId === c.id ? styles.selected : ""}`}>
              <span className={styles.avatar}><MessageSquareText size={20}/></span><span className={styles.itemText}>
                <strong>{jobTitles[c.job_id] || "Job conversation"}</strong>
                <small>Employer conversation</small><span>{last?.message || "No messages yet"}</span>
              </span></button>;
          })}{!loading && filtered.length === 0 && <p className={styles.noItems}>No conversations found.</p>}
          </div>
        </aside>
        <section className={styles.chat}>
          {loading ? <div className={styles.empty}>Loading messages…</div> : !active ?
            <div className={styles.empty}><MessageSquareText size={38}/><h2>No messages yet</h2><p>When an employer contacts you about an application, the conversation will appear here.</p></div> : <>
              <div className={styles.chatHeader}><strong>{jobTitles[active.job_id] || "Job conversation"}</strong><span>Employer conversation</span></div>
              <div className={styles.messages}>{thread.length === 0 ? <p className={styles.emptyThread}>No messages in this conversation yet.</p> : thread.map(m =>
                <div key={m.id} className={`${styles.bubbleRow} ${m.sender_id === userId ? styles.mine : ""}`}><div className={styles.bubble}>
                  <p>{m.message}</p><time>{new Date(m.created_at).toLocaleString("en-GB")}</time>
                </div></div>
              )}</div>
              <form className={styles.composer} onSubmit={send}><label htmlFor="candidate-reply">Reply to employer</label>
                <textarea id="candidate-reply" value={draft} maxLength={5000} rows={3} onChange={e => setDraft(e.target.value)} placeholder="Write your reply…" />
                <div className={styles.composerBottom}><span>{draft.length}/5000</span><button type="submit" disabled={sending || !draft.trim()}><Send size={16}/>{sending ? "Sending…" : "Send Reply"}</button></div>
              </form>
            </>}
        </section>
      </div>
      <p className={styles.note}>Only conversations linked to your signed-in account are requested. Employers initiate conversations about job applications.</p>
    </div>
  </main>;
}
