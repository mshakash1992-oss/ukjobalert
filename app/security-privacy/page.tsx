"use client";
import Link from "next/link";
import styles from "./page.module.css";

export default function Page() {
  return <main className={styles.page}>
    <section className={styles.hero}><div className={styles.container}>
      <span>TRUST & SAFETY</span><h1>Security & Privacy</h1><p>How UKJobAlert approaches account security, employer verification and safer recruitment.</p>
    </div></section>
    <section className={styles.content}><div className={styles.container}>
      <div className={styles.layout}>
        <aside className={styles.side}><strong>On this page</strong><a href="#approach">Security Approach</a><a href="#verification">Employer Verification</a><a href="#accounts">Account Safety</a><a href="#jobseekers">Job Seeker Safety</a><a href="#privacy">Privacy by Feature</a><a href="#report">Report a Concern</a></aside>
        <article className={styles.article}>
<section id="approach"><h2>1. Our Security Approach</h2><p>UKJobAlert is being designed with role-based access, employer verification and controlled job-publishing permissions. Security controls should be enforced by the production backend rather than by visual interface elements alone.</p></section>
<section id="verification"><h2>2. Employer Verification</h2><p>Employer accounts must complete the required verification flow before job posting is unlocked. The production workflow is intended to validate the supplied UK limited company information against Companies House data and require an active company status.</p><p>A “Verified Employer” badge must only reflect the actual stored verification status; it must not be granted solely because a company name appears legitimate.</p></section>
<section id="accounts"><h2>3. Account Safety</h2><ul><li>Use a strong, unique password for your account.</li><li>Do not share login codes, reset links or passwords.</li><li>Be cautious of messages asking for money or sensitive credentials.</li><li>Report suspicious vacancies or account activity through the appropriate support channel.</li></ul></section>
<section id="jobseekers"><h2>4. Safety for Job Seekers</h2><p>Job seekers should verify unusual requests before providing sensitive personal or financial information. Legitimate recruitment should not require users to disclose passwords or unrelated account credentials.</p></section>
<section id="privacy"><h2>5. Privacy by Feature</h2><p>Profile and recruitment information should only be exposed where required by the relevant feature and the user's chosen settings. Candidate contact information should be used only for legitimate recruitment purposes.</p></section>
<section id="report"><h2>6. Reporting Security Concerns</h2><p>Visit the Contact page for available support options. Do not include passwords or login codes in a report.</p></section></article>
      </div>
    </div></section>
    <footer className={styles.footer}><div className={styles.container}>© UKJobAlert · <Link href="/">Home</Link></div></footer>
  </main>
}
