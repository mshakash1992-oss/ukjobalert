"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, Building2, CircleHelp, Mail, MapPin, Send } from "lucide-react";
import styles from "./contact.module.css";

const configuredEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "";
const supportEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configuredEmail) ? configuredEmail : "";

export default function ContactPage() {
  const [notice, setNotice] = useState("");

  function openEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supportEmail) return;
    const form = new FormData(event.currentTarget);
    const subject = String(form.get("subject") || "UKJobAlert enquiry");
    const body = `${String(form.get("message") || "")}\n\nName: ${String(form.get("name") || "")}\nReply email: ${String(form.get("email") || "")}`;
    window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setNotice("Your email app will open with your message. Review it there and press Send to contact us.");
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Contact</span></div>
          <span className={styles.eyebrow}>WE’RE HERE TO HELP</span>
          <h1>Let’s talk.</h1>
          <p>Questions about UKJobAlert? Find help with your job search, employer account or company verification.</p>
        </div>
      </section>

      <section className={styles.content} aria-label="Contact and support">
        <div className={`${styles.container} ${styles.layout}`}>
          <aside className={styles.info}>
            <span className={styles.kicker}>GET IN TOUCH</span>
            <h2>How can we help?</h2>
            <p>Choose the right place to get help, or send an enquiry when email support is available.</p>
            <Link href="/faq" className={styles.helpCard}><span className={styles.icon}><CircleHelp /></span><span><strong>Help centre</strong><small>Answers to common questions</small></span><ArrowRight className={styles.arrow} /></Link>
            <Link href="/employer/verification" className={styles.helpCard}><span className={styles.icon}><Building2 /></span><span><strong>Employer verification</strong><small>Help with your UK company account</small></span><ArrowRight className={styles.arrow} /></Link>
            {supportEmail && <a href={`mailto:${supportEmail}`} className={styles.helpCard}><span className={styles.icon}><Mail /></span><span><strong>Email support</strong><small>{supportEmail}</small></span><ArrowRight className={styles.arrow} /></a>}
            <div className={styles.location}><MapPin /><span>Helping job seekers and employers<br /><strong>Across the United Kingdom</strong></span></div>
          </aside>

          <div className={styles.formCard}>
            <div className={styles.formHeading}><span className={styles.icon}><Mail /></span><div><h2>Send an enquiry</h2><p>Tell us how we can help.</p></div></div>
            {!supportEmail && <div className={styles.notice} role="status">Online enquiries are currently unavailable. Please visit our <Link href="/faq">help centre</Link> for support.</div>}
            <form onSubmit={openEmail}>
              <div className={styles.twoColumns}>
                <label htmlFor="contact-name">Full name<input id="contact-name" name="name" autoComplete="name" placeholder="Your full name" required maxLength={120} /></label>
                <label htmlFor="contact-email">Email address<input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} /></label>
              </div>
              <label htmlFor="contact-subject">Subject<input id="contact-subject" name="subject" placeholder="What would you like help with?" required maxLength={200} /></label>
              <label htmlFor="contact-message">Your message<textarea id="contact-message" name="message" rows={6} placeholder="Tell us a little more about your enquiry…" required maxLength={5000} /></label>
              <div className={styles.formBottom}><p>Please don’t include passwords or sensitive account details.</p><button type="submit" disabled={!supportEmail}><Send size={17} />{supportEmail ? "Open email app" : "Enquiries unavailable"}</button></div>
              {notice && <p className={styles.status} role="status">{notice}</p>}
            </form>
          </div>
        </div>
      </section>
      <footer className={styles.footer}><div className={styles.container}><span>© 2026 UKJobAlert</span><nav aria-label="Contact page footer"><Link href="/about">About</Link><Link href="/faq">Help centre</Link><Link href="/privacy-policy">Privacy policy</Link></nav></div></footer>
    </main>
  );
}
