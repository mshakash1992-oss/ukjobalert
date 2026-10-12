"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import styles from "./settings.module.css";

export default function PasswordForm({email,userId}:{email:string;userId:string}) {
  const [oldPassword,setOldPassword]=useState("");
  const [newPassword,setNewPassword]=useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  const [visible,setVisible]=useState(false);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const [isError,setIsError]=useState(false);
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");setIsError(false);
    if(!email){setMessage("Your account has no email address. Use account recovery.");setIsError(true);return;}
    if(newPassword.length<8){setMessage("Use at least 8 characters for your new password.");setIsError(true);return;}
    if(newPassword!==confirmPassword){setMessage("The new passwords do not match.");setIsError(true);return;}
    if(oldPassword===newPassword){setMessage("Choose a password different from your current one.");setIsError(true);return;}
    setBusy(true);
    try {
      const supabase=createClient();
      const {data:sessionData,error:sessionError}=await supabase.auth.getUser();
      if(sessionError||sessionData.user?.id!==userId)throw new Error("Session expired. Please sign in again.");
      const {data:verified,error:verifyError}=await supabase.auth.signInWithPassword({email,password:oldPassword});
      if(verifyError||verified.user?.id!==userId)throw new Error("Current password is incorrect or password login is unavailable.");
      const {error:updateError}=await supabase.auth.updateUser({password:newPassword});
      if(updateError)throw updateError;
      setOldPassword("");setNewPassword("");setConfirmPassword("");
      setMessage("Your password has been updated successfully.");
    } catch(error) {
      setIsError(true);
      setMessage(error instanceof Error?error.message:"Unable to update password.");
    } finally {setBusy(false);}
  }
  return <form onSubmit={submit} className={styles.form}>
    <label htmlFor="current-password">Old Password</label>
    <div className={styles.field}><LockKeyhole size={18}/><input id="current-password" autoComplete="current-password" type={visible?"text":"password"} value={oldPassword} onChange={e=>setOldPassword(e.target.value)} required placeholder="Enter your current password"/></div>
    <label htmlFor="new-password">New Password</label>
    <div className={styles.field}><LockKeyhole size={18}/><input id="new-password" autoComplete="new-password" type={visible?"text":"password"} minLength={8} value={newPassword} onChange={e=>setNewPassword(e.target.value)} required placeholder="Enter your new password"/></div>
    <label htmlFor="confirm-password">Confirm New Password</label>
    <div className={styles.field}><LockKeyhole size={18}/><input id="confirm-password" autoComplete="new-password" type={visible?"text":"password"} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required placeholder="Retype your new password"/></div>
    <button type="button" className={styles.show} onClick={()=>setVisible(v=>!v)}>{visible?<EyeOff size={17}/>:<Eye size={17}/>} {visible?"Hide passwords":"Show passwords"}</button>
    <p className={styles.help}>Use at least 8 characters. For accounts without a password, use the <Link href="/forgot-password">password recovery flow</Link>.</p>
    {message&&<p role="status" className={isError?styles.error:styles.success}>{message}</p>}
    <button type="submit" disabled={busy} className={styles.submit}><Save size={17}/>{busy?"Updating...":"Update Password"}</button>
  </form>;
}
