"use client";
import { FormEvent, useEffect, useMemo, useState } from "react";
import AccountNav from "@/components/AccountNav";
import { createClient } from "@/lib/supabase/client";
import styles from "../accountSubpage.module.css";

export default function SettingsPage(){
 const supabase=useMemo(()=>createClient(),[]);
 const [email,setEmail]=useState("");
 const [password,setPassword]=useState("");
 const [message,setMessage]=useState("");
 useEffect(()=>{supabase.auth.getUser().then(({data})=>setEmail(data.user?.email??""));},[supabase]);
 const save=async(e:FormEvent)=>{e.preventDefault();setMessage("");if(!password){setMessage("Enter a new password first.");return;}const {error}=await supabase.auth.updateUser({password});setMessage(error?error.message:"Password updated successfully.");if(!error)setPassword("");};
 return <main className={styles.page}><div className={styles.shell}><AccountNav/><section className={styles.content}>
  <div className={styles.head}><span>JOB SEEKER</span><h1>Account Settings</h1><p>Manage your account security.</p></div>
  <form className={`${styles.card} ${styles.form}`} onSubmit={save}>
   <label><span>Email address</span><input value={email} disabled /></label>
   <label><span>New password</span><input type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={6} placeholder="Enter a new password" /></label>
   {message&&<div className={styles.message}>{message}</div>}
   <button type="submit">Update Password</button>
  </form>
 </section></div></main>
}