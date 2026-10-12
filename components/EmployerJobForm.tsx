"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, ExternalLink, FileText, MapPin, ShieldCheck } from "lucide-react";
import styles from "./EmployerJobForm.module.css";

type Job = {id?:string;title?:string;category?:string;job_type?:string;location?:string;salary?:string|null;description?:string;apply_url?:string|null;apply_email?:string|null;status?:string};
const categories=["Accounting / Finance","Administration","Construction","Customer Service","Design & Multimedia","Education","Engineering","Healthcare","Hospitality","Human Resources","IT & Technology","Logistics","Marketing","Retail","Sales","Other"];
const types=["Full Time","Part Time","Contract","Temporary","Remote","Internship","Apprenticeship"];
const detailsMarker="\n\n--- Additional Job Details ---\n";
function parseDescription(value:string){const at=value.indexOf(detailsMarker);if(at<0)return {description:value,extras:{} as Record<string,string>};const extras:Record<string,string>={};for(const line of value.slice(at+detailsMarker.length).split("\n")){const colon=line.indexOf(": ");if(colon>0)extras[line.slice(0,colon)]=line.slice(colon+2);}return {description:value.slice(0,at),extras};}
export default function EmployerJobForm({initial,companyName}:{initial?:Job;companyName:string}){
 const router=useRouter();const formRef=useRef<HTMLFormElement>(null);
 const parsed=parseDescription(initial?.description||"");
 const [busy,setBusy]=useState(false);const [error,setError]=useState("");
 const [method,setMethod]=useState<"url"|"email">(initial?.apply_email?"email":"url");
 const [destination,setDestination]=useState(initial?.apply_email||initial?.apply_url||"");
 const [location,setLocation]=useState(initial?.location||"");
 const [salaryType,setSalaryType]=useState(parsed.extras["Salary Type"]||"Yearly");
 const [minSalary,setMinSalary]=useState(parsed.extras["Minimum Salary"]||"");
 const [maxSalary,setMaxSalary]=useState(parsed.extras["Maximum Salary"]||"");
 const [salaryText,setSalaryText]=useState(initial?.salary||"");
 const [description,setDescription]=useState(parsed.description);
 const [preview,setPreview]=useState(false);
 const [formatError,setFormatError]=useState("");
 function editor(action:"bold"|"italic"|"list"){
  const el=document.getElementById("job-description") as HTMLTextAreaElement|null;if(!el)return;
  const start=el.selectionStart,end=el.selectionEnd;const selected=description.slice(start,end)||"text";
  const replacement=action==="bold"?`**${selected}**`:action==="italic"?`*${selected}*`:`\n- ${selected}`;
  const updated=description.slice(0,start)+replacement+description.slice(end);setDescription(updated);
  requestAnimationFrame(()=>{el.focus();el.setSelectionRange(start+replacement.length,start+replacement.length);});
 }
 async function save(status:"draft"|"published"){
  const form=formRef.current;if(!form||!form.reportValidity())return;
  setBusy(true);setError("");setFormatError("");
  const data=new FormData(form);
  const extraKeys:[[string,string],...[string,string][]]=[["Application Deadline","deadline"],["Minimum Salary","minSalary"],["Maximum Salary","maxSalary"],["Salary Type","salaryType"],["Experience","experience"],["Industry","industry"],["Qualification","qualification"],["Career Level","careerLevel"],["Full Address","address"],["Tags","tags"]];
  const extras=extraKeys.map(([label,key])=>[label,key==="minSalary"?minSalary:key==="maxSalary"?maxSalary:key==="salaryType"?salaryType:String(data.get(key)||"").trim()] as const).filter(([,value])=>value);
  const finalDescription=description.trim()+(extras.length?detailsMarker+extras.map(([key,value])=>`${key}: ${value}`).join("\n"):"");
  if(finalDescription.length>30000){setFormatError("Description and additional details must be under 30,000 characters.");setBusy(false);return;}
  const body={title:String(data.get("title")||"").trim(),category:String(data.get("category")||"").trim(),job_type:String(data.get("job_type")||"").trim(),location:location.trim(),salary:salaryText.trim()||null,description:finalDescription,apply_url:method==="url"?destination.trim():null,apply_email:method==="email"?destination.trim():null,status};
  try{const response=await fetch(initial?.id?`/api/employer/jobs/${encodeURIComponent(initial.id)}`:"/api/employer/jobs",{method:initial?.id?"PATCH":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const result=await response.json();if(!response.ok)throw new Error(result.error||"Unable to save job");router.push("/employer/jobs");router.refresh();}
  catch(err){setError(err instanceof Error?err.message:"Unable to save job");}finally{setBusy(false);}
 }
 function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();void save("published");}
 const field=(name:string,label:string,options:string[],defaultValue="")=><div className={styles.field}><label htmlFor={name}>{label}</label><select id={name} name={name} defaultValue={defaultValue}><option value="">Select {label.toLowerCase()}</option>{options.map(x=><option key={x} value={x}>{x}</option>)}</select></div>;
 return <div className={styles.wrapper}><form ref={formRef} className={styles.form} onSubmit={submit}>
 <div className={styles.heading}><div><span className={styles.eyebrow}>EMPLOYER / JOB MANAGEMENT</span><h1>{initial?.id?"Edit Job":"Submit a Job"}</h1><p>Complete the details below to publish a vacancy from {companyName}.</p></div><Link href="/employer/jobs" className={styles.back}><ArrowLeft size={16}/> My Jobs</Link></div>
 <section className={styles.card}><div className={styles.sectionTitle}><BriefcaseBusiness/><div><h2>Job Information</h2><p>Describe the vacancy clearly and accurately.</p></div></div>
 <div className={styles.two}><div className={styles.field}><label htmlFor="title">Job Title <b>*</b></label><input id="title" name="title" required maxLength={160} defaultValue={initial?.title||""} placeholder="e.g. Finance Manager"/></div>{field("job_type","Job Type *",types,initial?.job_type||"")}</div>
 <div className={styles.field}><label htmlFor="job-description">Description <b>*</b></label><div className={styles.editor}><div className={styles.toolbar}><button type="button" onClick={()=>editor("bold")} title="Bold"><strong>B</strong></button><button type="button" onClick={()=>editor("italic")} title="Italic"><em>I</em></button><button type="button" onClick={()=>editor("list")} title="Bullet list">☷</button><span className={styles.toolbarSpacer}/><button type="button" onClick={()=>setPreview(!preview)}>{preview?"Edit":"Preview"}</button></div>{preview?<div className={styles.preview}>{description||"Nothing to preview"}</div>:<textarea id="job-description" name="description" required minLength={30} maxLength={29000} rows={9} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Responsibilities, requirements, benefits and how to succeed in this role..."/>}</div><small>Use the formatting buttons for simple Markdown. Minimum 30 characters.</small></div>
 <div className={styles.two}>{field("category","Categories *",categories,initial?.category||"")}<div className={styles.field}><label htmlFor="deadline">Application Deadline</label><input type="date" id="deadline" name="deadline" defaultValue={parsed.extras["Application Deadline"]||""}/></div></div>
 <div className={styles.two}><div className={styles.field}><label htmlFor="salaryText">Salary / Pay</label><input id="salaryText" value={salaryText} onChange={e=>setSalaryText(e.target.value)} maxLength={120} placeholder="e.g. £30,000–£40,000 per year"/></div><div className={styles.field}><label htmlFor="salaryType">Salary Type</label><select id="salaryType" value={salaryType} onChange={e=>setSalaryType(e.target.value)}>{["Yearly","Monthly","Weekly","Daily","Hourly"].map(x=><option key={x}>{x}</option>)}</select></div></div>
 <div className={styles.two}><div className={styles.field}><label htmlFor="minSalary">Min. Salary (£)</label><input id="minSalary" inputMode="decimal" value={minSalary} onChange={e=>setMinSalary(e.target.value)} placeholder="e.g. 30000"/></div><div className={styles.field}><label htmlFor="maxSalary">Max. Salary (£)</label><input id="maxSalary" inputMode="decimal" value={maxSalary} onChange={e=>setMaxSalary(e.target.value)} placeholder="e.g. 40000"/></div></div>
 <div className={styles.two}>{field("experience","Experience",["Fresh","Less than 1 year","1–2 years","3–5 years","5–10 years","10+ years"],parsed.extras.Experience)}<div className={styles.field}><label htmlFor="tags">Tags</label><input id="tags" name="tags" defaultValue={parsed.extras.Tags||""} placeholder="e.g. PHP, Developer, CSS"/></div></div>
 <div className={styles.two}>{field("industry","Industry",["Healthcare","Technology","Finance","Education","Construction","Retail","Hospitality","Logistics","Manufacturing","Other"],parsed.extras.Industry)}{field("qualification","Qualification",["No formal qualification","GCSE / Equivalent","A-Level / Equivalent","Certificate","Diploma","Bachelor's Degree","Master's Degree","Doctorate"],parsed.extras.Qualification)}</div>
 {field("careerLevel","Career Level",["Entry Level","Junior","Mid Level","Senior","Manager","Executive","Director"],parsed.extras["Career Level"])}
 </section>
 <section className={styles.card}><div className={styles.sectionTitle}><MapPin/><div><h2>Location</h2><p>Help applicants find where the job is based.</p></div></div>
 <div className={styles.field}><label htmlFor="location">City / Location <b>*</b></label><input id="location" name="location" required maxLength={180} value={location} onChange={e=>setLocation(e.target.value)} placeholder="e.g. Manchester, UK"/></div>
 <div className={styles.field}><label htmlFor="address">Full Address</label><input id="address" name="address" defaultValue={parsed.extras["Full Address"]||""} placeholder="Street, town, postcode"/></div>
 <div className={styles.mapPreview}><MapPin size={28}/><strong>Map Location</strong><p>Use the location above to view the area on OpenStreetMap.</p>{location.trim()&&<a href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(location.trim())}`} target="_blank" rel="noopener noreferrer">View location on map <ExternalLink size={14}/></a>}</div>
 </section>
 <section className={styles.card}><div className={styles.sectionTitle}><FileText/><div><h2>Application Details</h2><p>Choose how candidates should apply.</p></div></div><div className={styles.methodButtons}><button type="button" className={method==="url"?styles.methodActive:""} onClick={()=>{setMethod("url");setDestination("");}}>Application URL</button><button type="button" className={method==="email"?styles.methodActive:""} onClick={()=>{setMethod("email");setDestination("");}}>Application Email</button></div><div className={styles.field}><label htmlFor="destination">{method==="url"?"Application URL *":"Application Email *"}</label><input id="destination" type={method==="url"?"url":"email"} required maxLength={2048} value={destination} onChange={e=>setDestination(e.target.value)} placeholder={method==="url"?"https://example.com/careers":"jobs@example.com"}/></div></section>
 {(error||formatError)&&<div className={styles.error} role="alert">{error||formatError}</div>}
 <div className={styles.actions}><button type="button" disabled={busy} className={styles.draft} onClick={()=>void save("draft")}>Save as Draft</button><button type="submit" disabled={busy} className={styles.publish}><CheckCircle2 size={17}/>{busy?"Saving...":initial?.id?"Save & Publish":"Submit Job"}</button></div>
 <p className={styles.note}>Additional fields are stored with the job description so they work with your existing database. Featured-image upload and an interactive map picker require a separate storage/database integration.</p>
 </form><aside className={styles.sidebar}><div className={styles.sideCard}><ShieldCheck size={27}/><span>VERIFIED EMPLOYER</span><h3>{companyName}</h3><p>Only verified UK employers can publish jobs. Posting is free.</p></div><div className={styles.sideCard}><h3>Posting guidelines</h3><p>Describe a genuine vacancy. Never ask job seekers to pay application fees.</p></div></aside></div>;
}
