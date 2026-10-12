"use client";
import Link from "next/link";
import styles from "./page.module.css";

export default function Page() {
  return <main className={styles.page}>
    <header className={styles.header}><div className={`${styles.container} ${styles.nav}`}>
      <Link href="/" className={styles.logo}><img src="/images/ukjobalert-logo.png" alt="UKJobAlert"/></Link>
      <Link href="/" className={styles.back}>Back to Home</Link>
    </div></header>
    <section className={styles.hero}><div className={styles.container}>
      <span>NAVIGATION</span><h1>Site Map</h1><p>Find the main areas of UKJobAlert.</p>
    </div></section>
    <section className={styles.content}><div className={styles.container}>
      <div className={styles.layout}>
        <aside className={styles.side}><strong>On this page</strong><a href="#main">Main Pages</a><a href="#account">Accounts</a><a href="#help">Information & Help</a><a href="#legal">Legal</a></aside>
        <article className={styles.article}>
<section id="main"><h2>Main Pages</h2><div className={styles.grid}>
<Link className={styles.linkCard} href="/"><strong>Home</strong><span>UKJobAlert homepage and job search.</span></Link>
<Link className={styles.linkCard} href="/jobs"><strong>Find Jobs</strong><span>Browse current job opportunities.</span></Link>
<Link className={styles.linkCard} href="/companies"><strong>Employers</strong><span>Browse company and employer profiles.</span></Link>
<Link className={styles.linkCard} href="/candidates"><strong>Candidates</strong><span>Candidate directory and profiles.</span></Link>
</div></section>
<section id="account"><h2>Accounts</h2><div className={styles.grid}>
<Link className={styles.linkCard} href="/login"><strong>Login / Register</strong><span>Access your UKJobAlert account.</span></Link>
<Link className={styles.linkCard} href="/account"><strong>Job Seeker Account</strong><span>Applications, saved jobs and profile.</span></Link>
<Link className={styles.linkCard} href="/employer"><strong>Employer Dashboard</strong><span>Manage employer activity and vacancies.</span></Link>
<Link className={styles.linkCard} href="/employer/verification"><strong>Employer Verification</strong><span>UK limited company verification area.</span></Link>
</div></section>
<section id="help"><h2>Information & Help</h2><div className={styles.grid}>
<Link className={styles.linkCard} href="/about"><strong>About Us</strong><span>Learn about UKJobAlert.</span></Link>
<Link className={styles.linkCard} href="/faq"><strong>FAQ</strong><span>Common questions and answers.</span></Link>
<Link className={styles.linkCard} href="/contact"><strong>Contact</strong><span>Contact UKJobAlert.</span></Link>
<Link className={styles.linkCard} href="/security-privacy"><strong>Security & Privacy</strong><span>Account and platform safety information.</span></Link>
</div></section>
<section id="legal"><h2>Legal</h2><div className={styles.grid}>
<Link className={styles.linkCard} href="/privacy-policy"><strong>Privacy Policy</strong><span>How information is handled.</span></Link>
<Link className={styles.linkCard} href="/terms"><strong>Terms of Service</strong><span>Rules for using UKJobAlert.</span></Link>
</div></section></article>
      </div>
    </div></section>
    <footer className={styles.footer}><div className={styles.container}>© UKJobAlert · <Link href="/">Home</Link></div></footer>
  </main>
}
