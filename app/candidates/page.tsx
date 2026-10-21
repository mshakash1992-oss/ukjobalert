"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BriefcaseBusiness, ChevronDown, Filter, GraduationCap, LocateFixed,
  MapPin, Search, SlidersHorizontal, UserRound, X
} from "lucide-react";
import styles from "./candidates.module.css";

const candidates: Array<{id:string;name:string;role:string;location:string;category:string;experience:string;education:string;skills:string[];initials:string}> = [];

const categories=["All Categories","Design & Multimedia","Health","Telecommunications","Accounting / Finance","Construction / Facilities","Human Resource"];

export default function CandidatesPage(){
  const [keyword,setKeyword]=useState("");
  const [location,setLocation]=useState("");
  const [category,setCategory]=useState("All Categories");
  const [mobileFilters,setMobileFilters]=useState(false);
  const [locating,setLocating]=useState(false);

  const filtered=useMemo(()=>candidates.filter(c=>{
    const q=keyword.toLowerCase();
    return (!q || `${c.name} ${c.role} ${c.skills.join(" ")}`.toLowerCase().includes(q))
      && (!location || c.location.toLowerCase().includes(location.toLowerCase()))
      && (category==="All Categories" || c.category===category);
  }),[keyword,location,category]);

  async function detectLocation(){
    if(!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(async pos=>{
      try{
        const r=await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&zoom=10&addressdetails=1`);
        const d=await r.json();
        const a=d.address||{};
        const city=a.city||a.town||a.village||a.county||"";
        const country=(a.country_code||"").toUpperCase();
        setLocation([city,country].filter(Boolean).join(", "));
      }finally{setLocating(false)}
    },()=>setLocating(false));
  }

  return <main className={styles.page}>

    <section className={styles.hero}>
      <div className={styles.container}>
        <span>CANDIDATE DIRECTORY</span>
        <h1>Find Skilled Candidates</h1>
        <p>Discover job seekers by profession, skills and location across the United Kingdom.</p>
        <div className={styles.searchBox}>
          <label><Search/><input value={keyword} onChange={e=>setKeyword(e.target.value)} placeholder="Candidate name, role or skills"/></label>
          <label><MapPin/><input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Location"/><button onClick={detectLocation} className={locating?styles.locating:""}><LocateFixed/></button></label>
          <button>Search Candidates</button>
        </div>
      </div>
    </section>

    <section className={styles.content}>
      <div className={styles.container}>
        <button className={styles.mobileFilter} onClick={()=>setMobileFilters(!mobileFilters)}>{mobileFilters?<X/>:<Filter/>} Filters</button>
        <div className={styles.layout}>
          <aside className={`${styles.filters} ${mobileFilters?styles.showFilters:""}`}>
            <div className={styles.filterTitle}><SlidersHorizontal/><h2>Filter Candidates</h2></div>
            <div className={styles.filterGroup}><h3>Profession / Category</h3>
              {categories.map(c=><button key={c} className={category===c?styles.selected:""} onClick={()=>setCategory(c)}>{c}</button>)}
            </div>
            <div className={styles.filterGroup}><h3>Experience Level</h3>
              {["Entry Level","1–2 Years","3–5 Years","5+ Years"].map(x=><label key={x}><input type="checkbox"/><span>{x}</span></label>)}
            </div>
            <div className={styles.filterGroup}><h3>Availability</h3>
              <label><input type="checkbox"/><span>Available Now</span></label>
              <label><input type="checkbox"/><span>Open to Opportunities</span></label>
            </div>
          </aside>

          <div className={styles.results}>
            <div className={styles.resultHead}><div><h2>Candidates</h2><p>{filtered.length} profiles found</p></div><select><option>Most Relevant</option><option>Newest Profiles</option><option>Experience</option></select></div>
            <div className={styles.cards}>
              {filtered.map(c=><article className={styles.card} key={c.id}>
                <div className={styles.avatar}>{c.initials}</div>
                <div className={styles.info}>
                  <span className={styles.available}>OPEN TO WORK</span>
                  <h3>{c.name}</h3><strong>{c.role}</strong>
                  <div className={styles.meta}><span><MapPin/>{c.location}</span><span><BriefcaseBusiness/>{c.experience}</span><span><GraduationCap/>{c.education}</span></div>
                  <div className={styles.skills}>{c.skills.map(s=><span key={s}>{s}</span>)}</div>
                </div>
                <div className={styles.cardAction}><UserRound/><Link href={`/candidates/${c.id}`}>View Profile</Link></div>
              </article>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
}
