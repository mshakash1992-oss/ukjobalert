"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { MessageSquareText, RefreshCw, Search, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import styles from "./messages.module.css";

type Conversation = { id: string; jobTitle: string; candidateId: string; createdAt: string };
type Message = { id: string; conversationId: string; senderId: string; message: string; createdAt: string };

export default function MessagesClient({ userId, conversations, messages, error, truncated }: {
  userId: string; conversations: Conversation[]; messages: Message[]; error: string; truncated: boolean;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const activeId = conversations.some(c => c.id === selected) ? selected : (conversations[0]?.id || "");
  const active = conversations.find(c => c.id === activeId);
  const allMessages = useMemo(() => {
    const serverIds = new Set(messages.map(m => m.id));
    return [...messages, ...localMessages.filter(m => !serverIds.has(m.id))];
  }, [messages, localMessages]);
  const visible = conversations.filter(c =>
    `${c.jobTitle} ${c.candidateId}`.toLowerCase().includes(search.toLowerCase())
  );
  const thread = allMessages.filter(m => m.conversationId === activeId)
    .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!activeId || !body || busy) return;
    if (body.length > 5000) { setNotice("Maximum 5,000 characters."); return; }
    setBusy(true); setNotice("");
    try {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || user?.id !== userId) throw new Error("Session expired. Please sign in again.");
      const { data, error: sendError } = await supabase.from("job_messages")
        .insert({ conversation_id: activeId, sender_id: userId, message: body })
        .select("id,conversation_id,sender_id,message,created_at").single();
      if (sendError) throw sendError;
      setLocalMessages(previous => [...previous, {
        id: data.id, conversationId: data.conversation_id,
        senderId: data.sender_id, message: data.message, createdAt: data.created_at,
      }]);
      setDraft("");
      router.refresh();
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Message could not be sent.");
    } finally { setBusy(false); }
  }

  return <div className={styles.page}>
    <div className={styles.header}><div><span className={styles.eyebrow}>EMPLOYER WORKSPACE</span>
      <h1>Messages</h1><p>Communicate with applicants about your vacancies.</p></div>
      <button className={styles.refresh} type="button" onClick={() => router.refresh()}><RefreshCw size={17}/> Refresh</button>
    </div>
    {error && <p className={styles.error} role="alert">Unable to load messages: {error}</p>}
    {truncated && <p className={styles.warning}>Showing the first 2,000 messages. Older conversations may have incomplete history.</p>}
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Conversations <span>{conversations.length}</span></div>
        <label className={styles.search}><Search size={17}/><input aria-label="Search conversations" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations"/></label>
        <div className={styles.conversationList}>{visible.map(c => {
          const last = allMessages.filter(m => m.conversationId === c.id).at(-1);
          return <button type="button" key={c.id} onClick={() => {setSelected(c.id);setNotice("");}} className={`${styles.conversation} ${c.id === activeId ? styles.active : ""}`}>
            <span className={styles.avatar}>{c.jobTitle.charAt(0).toUpperCase()}</span>
            <span className={styles.conversationText}><strong>{c.jobTitle}</strong><small>Applicant {c.candidateId.slice(0,8)}…</small><span>{last?.message || "No messages yet"}</span></span>
          </button>;
        })}{visible.length === 0 && <p className={styles.emptyList}>No conversations found.</p>}</div>
      </aside>
      <section className={styles.chat}>
        {!active ? <div className={styles.empty}><MessageSquareText size={37}/><h2>No conversations yet</h2><p>Conversations will appear here after you start messaging an applicant.</p></div> :
          <>
            <div className={styles.chatHeader}><strong>{active.jobTitle}</strong><span>Applicant ID: {active.candidateId.slice(0,8)}…</span></div>
            <div className={styles.messages}>{thread.length === 0 ? <p className={styles.emptyThread}>No messages yet. Send the first message below.</p> : thread.map(m =>
              <div key={m.id} className={`${styles.bubbleWrap} ${m.senderId === userId ? styles.mine : ""}`}>
                <div className={styles.bubble}><p>{m.message}</p><time>{new Date(m.createdAt).toLocaleString("en-GB")}</time></div>
              </div>
            )}</div>
            <form className={styles.composer} onSubmit={send}><label htmlFor="employer-message">Reply to applicant</label>
              <textarea id="employer-message" rows={3} maxLength={5000} value={draft} onChange={e => setDraft(e.target.value)} placeholder="Write a message..." />
              {notice && <p role="alert" className={styles.error}>{notice}</p>}
              <div className={styles.composerFooter}><span>{draft.length}/5000</span><button type="submit" disabled={busy || !draft.trim()}><Send size={16}/>{busy ? "Sending..." : "Send Message"}</button></div>
            </form>
          </>}
      </section>
    </div>
  </div>;
}
