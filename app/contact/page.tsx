"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, CircleHelp, Info, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";
import styles from "./contact.module.css";
export default function ContactPage(){const [sent,setSent]=useState(false);return <main className={styles.page}>
<header className={styles.header}><div className={styles.nav}>
<Link href="/" className={styles.logo}><img src="/images/ukjobalert-logo.png" alt="UKJobAlert"/></Link>
<nav><Link href="/jobs">Jobs</Link><Link href="/companies">Companies</Link><Link href="/candidates">Candidates</Link>
<div className={styles.drop}><button className={`${styles.dropButton} ${styles.active}`}>Pages <ChevronDown/></button><div className={styles.menu}><Link href="/about"><Info/>About Us</Link><Link href="/faq"><CircleHelp/>FAQ</Link><Link href="/contact"><Mail/>Contact</Link></div></div></nav>
<div className={styles.actions}><Link href="/login">Login</Link><Link href="/post-job">Post a Job</Link></div>
</div></header>
<section className={styles.hero}><div className={styles.container}><span>CONTACT</span><h1>Contact UKJobAlert</h1><p>Questions about the platform, employer verification or your account? Send us a message.</p></div></section>
<section className={styles.content}><div className={styles.container}><div className={styles.contactLayout}>
<div className={styles.contactInfo}><span className={styles.red}>GET IN TOUCH</span><h2 className={styles.sectionTitle}>How can we help?</h2><p className={styles.sectionText}>Use this form for general UKJobAlert enquiries. Please do not send passwords or sensitive account information.</p>
<div className={styles.infoBox}><Mail/><div><small>Email</small><strong>Official support email will be added here</strong></div></div>
<div className={styles.infoBox}><MapPin/><div><small>Service</small><strong>United Kingdom job platform</strong></div></div></div>
<form className={styles.form} onSubmit={e=>{e.preventDefault();setSent(true)}}>
<div className={styles.two}><label>Full Name<input required placeholder="Your name"/></label><label>Email Address<input required type="email" placeholder="you@example.com"/></label></div>
<label>Subject<input required placeholder="How can we help?"/></label>
<label>Message<textarea required rows={7} placeholder="Write your message..."/></label>
{sent&&<div className={styles.success}><CheckCircle2/>This form is not connected to message delivery yet. Please do not submit sensitive information.</div>}
<button type="submit"><Send/>Send Message</button>
</form></div></div></section></main>}
