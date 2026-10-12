"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, CheckCircle2, CircleHelp, Search, ShieldCheck, UsersRound } from "lucide-react";
import styles from "./about.module.css";

const principles = [
  { number: "01", title: "Clarity", icon: Search, description: "Vacancies should make the role, location, job type and application route easy to understand." },
  { number: "02", title: "Employer checks", icon: ShieldCheck, description: "Posting access requires company information to pass UKJobAlert's verification process." },
  { number: "03", title: "Responsible discovery", icon: BadgeCheck, description: "Verification adds context, while job seekers are still encouraged to assess every opportunity carefully." },
];

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <span className={styles.eyebrow}>ABOUT UKJOBALERT</span>
          <h1>Built for a UK job search <em>that feels easier to trust.</em></h1>
          <p>UKJobAlert is a completely free job-discovery and job-posting platform focused on clear vacancy information, practical employer checks and direct application routes.</p>
          <div className={styles.heroActions}>
            <Link href="/jobs" className={styles.primaryButton}>Explore jobs <ArrowRight /></Link>
            <Link href="/employer" className={styles.outlineButton}>For employers <ArrowRight /></Link>
          </div>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.freeGrid}>
            <article className={styles.freeCard}><Search /><span>FOR JOB SEEKERS</span><h2>100% Free Job Hunting</h2><p>Search vacancies, explore opportunities and follow employers' application routes without paying UKJobAlert a fee.</p><Link href="/jobs">Browse free jobs <ArrowRight /></Link></article>
            <article className={styles.freeCard}><BriefcaseBusiness /><span>FOR VERIFIED EMPLOYERS</span><h2>100% Free Job Posting</h2><p>Eligible verified UK employers can publish and manage vacancies for free. No job-posting fees or paid subscription required.</p><Link href="/post-job">Post a free job <ArrowRight /></Link></article>
          </div>

          <section className={styles.principle}>
            <span className={styles.eyebrowDark}>THE PRINCIPLE</span>
            <h2>Useful job information should be easy to find, easy to understand and connected to a clear way to apply.</h2>
            <p>That principle shapes how vacancies are presented and how employer posting access is handled.</p>
          </section>

          <section className={styles.story}>
            <div><span className={styles.eyebrowDark}>WHY WE EXIST</span><h2>Job hunting already takes effort. <span>The platform should not add confusion.</span></h2></div>
            <div><p>People looking for work need the essentials quickly: what the role is, where it is, what kind of work it offers and how to apply.</p><p>Employers need a straightforward, free way to publish genuine opportunities without turning a vacancy into a marketing page. UKJobAlert is being built around those two needs.</p><p>We prioritise structured job details, employer-account checks and a focused application journey over unnecessary features or distractions.</p></div>
          </section>

          <section className={styles.focus}>
            <span className={styles.eyebrowDark}>WHAT WE FOCUS ON</span><h2>Three things that matter.</h2><p className={styles.intro}>The platform is designed around useful information rather than decorative features.</p>
            <div className={styles.values}>{principles.map(({number,title,icon:Icon,description})=><article key={number}><div className={styles.valueTop}><span>{number}</span><Icon /></div><h3>{title}</h3><p>{description}</p></article>)}</div>
          </section>

          <section className={styles.verification}>
            <div><span className={styles.eyebrow}>EMPLOYER VERIFICATION</span><h2>An extra check before an employer starts posting.</h2><p>Employer accounts must provide company information before job-posting access is enabled. Relevant details can be checked against publicly available Companies House information, with some cases requiring additional review.</p><p className={styles.disclaimer}>Verification confirms specified information at the time of the check. It does not constitute an endorsement or guarantee of an employer, vacancy or employment outcome.</p><Link href="/employer/verification">Read the employer verification process <ArrowRight /></Link></div>
            <div className={styles.verifyIcon}><ShieldCheck /></div>
          </section>

          <div className={styles.audienceGrid}>
            <article><UsersRound /><h2>For job seekers</h2><h3>A focused place to discover current vacancies.</h3><p>Search roles, review the important details and follow the employer's stated application route when the opportunity fits. Job hunting on UKJobAlert is free.</p><Link href="/jobs">Browse jobs <ArrowRight /></Link></article>
            <article><BriefcaseBusiness /><h2>For employers</h2><h3>A structured, free way to publish and manage vacancies.</h3><p>Complete the required company checks, create clear listings and manage published jobs through your employer account without posting fees.</p><Link href="/employer">Employer information <ArrowRight /></Link></article>
          </div>

          <section className={styles.bottomCta}><div><span className={styles.eyebrowDark}>CURRENT VACANCIES</span><h2>See what employers are hiring for now.</h2><p>Explore UK opportunities from employers using the platform.</p></div><Link href="/jobs" className={styles.primaryButton}>Find jobs <ArrowRight /></Link></section>
          <div className={styles.note}><CheckCircle2 /><span>Free access does not remove the need to check individual job details carefully.</span><Link href="/faq"><CircleHelp /> FAQ</Link></div>
        </div>
      </section>
    </main>
  );
}
