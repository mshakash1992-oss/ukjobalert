"use client";

import { useState } from "react";
import { ArrowRight, Bookmark, Share2 } from "lucide-react";
import styles from "./job-details.module.css";

type Props = { title: string; company: string; url: string; email: string; jobId: string; compact?: boolean; deadline?: string };

export default function JobActions({ title, company, url, email, jobId, compact = false, deadline = "" }: Props) {
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const subject = encodeURIComponent(`Application for ${title} - ${company}`);
  const href = url || (email ? `mailto:${email}?subject=${subject}` : "");
  const toggleSave = () => {
    try {
      const key = "ukjobalert:saved-jobs";
      const current: string[] = JSON.parse(localStorage.getItem(key) || "[]");
      const next = current.includes(jobId) ? current.filter(id => id !== jobId) : [...current, jobId];
      localStorage.setItem(key, JSON.stringify(next));
      setSaved(next.includes(jobId));
    } catch { setSaved(!saved); }
  };
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); setShared(true); }
    } catch { /* User cancelled share. */ }
  };
  return <div className={`${styles.actions} ${compact ? styles.actionsCompact : ""}`}>
    <div className={styles.actionPrimary}>
      {href ? <a className={styles.applyButton} href={href} target={url ? "_blank" : undefined} rel={url ? "noopener noreferrer" : undefined}>Apply Now <ArrowRight size={17}/></a> : <span className={styles.noApply}>Application details unavailable</span>}
      {deadline && <span className={styles.deadline}>Application ends: <strong>{deadline}</strong></span>}
    </div>
    <div className={styles.secondaryActions}>
      <button type="button" onClick={toggleSave} className={styles.shortlist}><Bookmark size={17}/>{saved ? "Saved" : "Shortlist"}</button>
      {!compact && <button type="button" onClick={share} className={styles.share}><Share2 size={17}/>{shared ? "Link copied" : "Share"}</button>}
    </div>
  </div>;
}
