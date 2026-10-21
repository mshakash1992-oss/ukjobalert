"use client";
import Link from "next/link";
import styles from "./page.module.css";

export default function Page() {
  return <main className={styles.page}>
    <section className={styles.hero}><div className={styles.container}>
      <span>TERMS</span><h1>Terms of Service</h1><p>Rules and responsibilities for using UKJobAlert.</p>
    </div></section>
    <section className={styles.content}><div className={styles.container}>
      <div className={styles.layout}>
        <aside className={styles.side}><strong>On this page</strong><a href="#use">Using UKJobAlert</a><a href="#accounts">Accounts</a><a href="#employers">Employers</a><a href="#jobs">Job Listings</a><a href="#candidates">Candidates</a><a href="#liability">Recruitment Decisions</a><a href="#changes">Changes</a></aside>
        <article className={styles.article}>

<section id="use"><h2>1. Using UKJobAlert</h2><p>UKJobAlert provides job-search, employer, candidate and recruitment-related features. Users must use the platform lawfully and provide accurate information when creating accounts, profiles or listings.</p></section>
<section id="accounts"><h2>2. Accounts</h2><p>Users are responsible for maintaining the security of their account credentials and for activity carried out through their account. Account information must not intentionally impersonate another person or organisation.</p></section>
<section id="employers"><h2>3. Employers and Verification</h2><p>Job publishing is restricted to employer accounts that satisfy UKJobAlert's verification requirements. Employers may be required to provide a registered UK limited company name and Companies House company number. A company record being active does not permit misleading use of another company's identity.</p><p>UKJobAlert may restrict, suspend or remove employer access or listings where verification fails, information appears misleading, or platform rules are breached.</p></section>
<section id="jobs"><h2>4. Job Listings</h2><p>Employers must publish genuine vacancies with accurate titles, locations, compensation information where provided, responsibilities and application destinations. Fraudulent, misleading, duplicate, unlawful or deceptive listings are not permitted.</p></section>
<section id="candidates"><h2>5. Candidate Information</h2><p>Candidate information must only be used for legitimate recruitment purposes. Scraping, harassment, spam, resale of candidate information or unrelated marketing use is not permitted.</p></section>
<section id="liability"><h2>6. Third-Party Applications and Decisions</h2><p>Employers are responsible for their recruitment processes and hiring decisions. Job seekers should independently evaluate vacancies and employers before sharing sensitive information or accepting employment.</p></section>
<section id="changes"><h2>7. Changes and Enforcement</h2><p>UKJobAlert may update these terms as the service changes and may take reasonable action to protect users, platform integrity and compliance.</p></section></article>
      </div>
    </div></section>
    <footer className={styles.footer}><div className={styles.container}>© UKJobAlert · <Link href="/">Home</Link></div></footer>
  </main>
}
