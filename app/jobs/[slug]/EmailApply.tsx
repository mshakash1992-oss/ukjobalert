"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import styles from "./job-details.module.css";

export default function EmailApply({ email, title, company, sidebar = false }: { email: string; title: string; company: string; sidebar?: boolean }) {
  const [copied, setCopied] = useState(false);
  const subject = `Application for ${title}${company ? ` - ${company}` : ""}`;
  const body = `Dear Hiring Team,\n\nI would like to apply for the ${title} position.\n\nKind regards,\n`;
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard can be blocked on insecure origins; show the address for manual copying.
      setCopied(false);
    }
  }
  return <div className={`${styles.emailApply} ${sidebar ? styles.sidebarEmailApply : ""}`}>
    <a className={styles.primary} href={gmail} target="_blank" rel="noopener noreferrer"><Mail size={17}/> Apply with Gmail <ArrowUpRight size={17}/></a>
    <a className={styles.emailSecondary} href={mailto}>Open email app</a>
    <div className={styles.emailCopy}><span title={email}>{email}</span><button type="button" onClick={copyEmail} aria-label="Copy employer email">{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? "Copied" : "Copy"}</button></div>
  </div>;
}
