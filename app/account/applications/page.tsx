"use client";
import Link from "next/link";
import { FileText } from "lucide-react";
import AccountNav from "@/components/AccountNav";
import styles from "../accountSubpage.module.css";

export default function ApplicationsPage(){
 return <main className={styles.page}><div className={styles.shell}><AccountNav/><section className={styles.content}>
  <div className={styles.head}><span>JOB SEEKER</span><h1>Applications</h1><p>Your submitted applications will appear here.</p></div>
  <div className={`${styles.card} ${styles.empty}`}><FileText/><h2>No applications to show</h2><p>This page does not invent demo applications. Applications recorded through UKJobAlert will be shown here once the applications backend is connected to this view.</p><Link href="/jobs">Browse Jobs</Link></div>
 </section></div></main>
}