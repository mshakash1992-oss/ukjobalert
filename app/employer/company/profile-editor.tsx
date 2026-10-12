"use client";

import { useState } from "react";
import { Building2, CheckCircle2, Globe, ImagePlus, MapPin, Save, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import styles from "./profile-editor.module.css";

type Fields = {website:string;phone:string;teamSize:string;category:string;description:string;location:string;facebook:string;linkedin:string;twitter:string};
type Props = {companyName:string;companyNumber:string;verificationStatus:string;email:string;initial:Fields};
const fields: {key:keyof Fields;label:string;placeholder:string}[] = [
  {key:"website",label:"Website",placeholder:"https://example.com"},
  {key:"phone",label:"Phone",placeholder:"+44 ..."},
  {key:"teamSize",label:"Team Size",placeholder:"e.g. 11–50 employees"},
  {key:"category",label:"Industry / Category",placeholder:"e.g. Information Technology"},
  {key:"location",label:"Company Location",placeholder:"e.g. London, United Kingdom"},
];
export default function ProfileEditor({companyName,companyNumber,verificationStatus,email,initial}:Props){
  const [form,setForm]=useState<Fields>(initial);
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState("");
  const [error,setError]=useState(false);
  const update=(key:keyof Fields,value:string)=>setForm(prev=>({...prev,[key]:value}));
  async function save(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    setMessage("");setError(false);
    if(form.website && !/^https?:\/\//i.test(form.website)){setMessage("Website must start with https:// or http://");setError(true);return;}
    setSaving(true);
    try {
      const supabase=createClient();
      const {error:saveError}=await supabase.auth.updateUser({data:{
        company_website:form.website.trim(),company_phone:form.phone.trim(),
        company_team_size:form.teamSize.trim(),company_category:form.category.trim(),
        company_description:form.description.trim(),company_location:form.location.trim(),
        company_facebook:form.facebook.trim(),company_linkedin:form.linkedin.trim(),
        company_twitter:form.twitter.trim()
      }});
      if(saveError)throw saveError;
      setMessage("Profile details saved to your employer account.");
    } catch(err){setError(true);setMessage(err instanceof Error?err.message:"Unable to save profile.");}
    finally{setSaving(false);}
  }
  const verified=verificationStatus==="verified";
  return <div className={styles.page}>
    <div className={styles.heading}><div><span className={styles.eyebrow}>EMPLOYER PROFILE</span><h1>Company Profile</h1><p>Manage the information shown in your employer account.</p></div></div>
    <form onSubmit={save}>
      <section className={styles.cover}><div className={styles.coverPattern}/><div className={styles.logo}><Building2 size={40}/></div><div className={styles.coverText}><h2>{companyName}</h2><span>{verified?<><CheckCircle2 size={16}/> Verified UK Employer</>:<><ShieldCheck size={16}/> Verification: {verificationStatus}</>}</span></div></section>
      <section className={styles.panel}>
        <h2>Company Information</h2><p className={styles.hint}>Registered identity is managed through Companies House verification and cannot be changed here.</p>
        <div className={styles.grid}>
          <label>Registered Company Name<input value={companyName} readOnly className={styles.readonly}/></label>
          <label>Company Number<input value={companyNumber || "Not provided"} readOnly className={styles.readonly}/></label>
          <label>Account Email<input value={email} readOnly className={styles.readonly}/></label>
          <label>Verification Status<input value={verificationStatus} readOnly className={styles.readonly}/></label>
          {fields.map(f=><label key={f.key}>{f.label}<input value={form[f.key]} onChange={e=>update(f.key,e.target.value)} placeholder={f.placeholder} maxLength={200}/></label>)}
        </div>
      </section>
      <section className={styles.panel}><h2>About Company</h2><p className={styles.hint}>Write a clear description of your organisation.</p><textarea rows={7} value={form.description} onChange={e=>update("description",e.target.value)} maxLength={5000} placeholder="Describe your company, services and working culture..."/></section>
      <section className={styles.panel}><h2>Social Profiles</h2><div className={styles.grid}>
        <label>LinkedIn<input value={form.linkedin} onChange={e=>update("linkedin",e.target.value)} placeholder="https://linkedin.com/company/..."/></label>
        <label>Facebook<input value={form.facebook} onChange={e=>update("facebook",e.target.value)} placeholder="https://facebook.com/..."/></label>
        <label>X / Twitter<input value={form.twitter} onChange={e=>update("twitter",e.target.value)} placeholder="https://x.com/..."/></label>
      </div></section>
      <section className={styles.panel}><h2>Employer Location</h2><div className={styles.location}><MapPin size={24}/><span>{form.location||"Add your company location above."}</span></div></section>
      <section className={styles.panel}><h2>Company Logo, Cover & Office Photos</h2><div className={styles.photoNote}><ImagePlus size={26}/><div><strong>Image uploads are not enabled yet</strong><p>Storage and database fields must be configured before uploading files. Existing images will not be overwritten.</p></div></div></section>
      <div className={styles.footer}><span className={error?styles.error:styles.success} role="status">{message}</span><button type="submit" disabled={saving}><Save size={17}/>{saving?"Saving...":"Save Profile"}</button></div>
      <p className={styles.note}><Globe size={15}/> These editable fields are saved to your Supabase Auth user metadata. They are not yet published to the public company profile page.</p>
    </form>
  </div>;
}
