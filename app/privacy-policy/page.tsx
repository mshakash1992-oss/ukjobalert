"use client";
import Link from "next/link";
import styles from "./page.module.css";

export default function Page() {
  return <main className={styles.page}>
    <section className={styles.hero}><div className={styles.container}>
      <span>PRIVACY</span><h1>Privacy Policy</h1><p>How UKJobAlert handles information across job seeker and employer features.</p>
    </div></section>
    <section className={styles.content}><div className={styles.container}>
      <div className={styles.layout}>
        <aside className={styles.side}><strong>On this page</strong><a href="#overview">Overview</a><a href="#collect">Information We Collect</a><a href="#use">How We Use It</a><a href="#sharing">Sharing & Visibility</a><a href="#rights">Your Choices</a><a href="#updates">Policy Updates</a></aside>
        <article className={styles.article}>

<section id="overview"><h2>1. Overview</h2><p>This Privacy Policy explains how UKJobAlert handles information when job seekers, employers and visitors use the platform.</p><p>UKJobAlert is designed to connect job seekers with job opportunities and verified employers in the United Kingdom.</p></section>
<section id="collect"><h2>2. Information We May Collect</h2><h3>Account information</h3><p>This may include name, email address, account type and information provided in a user profile.</p><h3>Job seeker information</h3><p>This may include profile details, employment information, skills, saved jobs and application-related activity that the user chooses to provide.</p><h3>Employer information</h3><p>This may include company name, Companies House company number, employer verification information, company profile details and vacancy information.</p><h3>Technical information</h3><p>Basic technical and security information may be processed to operate, protect and improve the service.</p></section>
<section id="use"><h2>3. How Information May Be Used</h2><ul><li>Provide and maintain user accounts and platform features.</li><li>Display vacancies, employer profiles and candidate profiles where applicable.</li><li>Process employer verification and restrict job posting to eligible employer accounts.</li><li>Support job applications and application-related functionality.</li><li>Prevent fraud, abuse and misuse of the platform.</li><li>Respond to support or contact requests.</li></ul></section>
<section id="sharing"><h2>4. Sharing and Visibility</h2><p>Information may be visible to other users when a feature requires it, such as a public employer profile, vacancy or candidate profile. Users should only publish information they are authorised and comfortable to make available through the relevant feature.</p><p>UKJobAlert does not intend to sell personal information as part of its job-platform service.</p></section>
<section id="rights"><h2>5. Your Choices and Rights</h2><p>Users may be able to update account and profile information through their account area. Visit the Contact page for currently available support options for privacy enquiries.</p></section>
<section id="updates"><h2>6. Changes to This Policy</h2><p>This policy may be updated as UKJobAlert features and production services change. The current version should be displayed on this page.</p></section></article>
      </div>
    </div></section>
    <footer className={styles.footer}><div className={styles.container}>© UKJobAlert · <Link href="/">Home</Link></div></footer>
  </main>
}
