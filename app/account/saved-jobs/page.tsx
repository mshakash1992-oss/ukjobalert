"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import AccountNav from "@/components/AccountNav";
import styles from "../accountSubpage.module.css";

export default function SavedJobsPage(){
 return <main className={styles.page}><div className={styles.shell}><AccountNav/><section className={styles.content}>
  <div className={styles.head}><span>JOB SEEKER</span><h1>Saved Jobs</h1><p>Jobs you save will be available here.</p></div>
  <div className={`${styles.card} ${styles.empty}`}><Heart/><h2>No saved jobs to show</h2><p>No fake saved jobs are displayed. When the real saved-jobs backend is connected, your saved vacancies will appear here.</p><Link href="/jobs">Find Jobs</Link></div>
 </section></div></main>
}