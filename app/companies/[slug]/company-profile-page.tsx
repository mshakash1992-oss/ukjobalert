import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Building2, CheckCircle2, MapPin } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type Job = { id: string; slug: string | null; title: string | null; location: string | null; job_type: string | null; expires_at: string | null };

export default async function CompanyProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Employer IDs are UUIDs; reject unexpected input rather than querying arbitrary records.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)) notFound();
  const db = createAdminClient();
  const { data: company, error } = await db.from("employer_verifications")
    .select("company_name,verification_status,user_id")
    .eq("user_id", slug).eq("verification_status", "verified").maybeSingle();
  if (error || !company) notFound();
  const { data: rawJobs } = await db.from("jobs")
    .select("id,slug,title,location,job_type,expires_at")
    .eq("employer_id", slug).eq("status", "published")
    .order("created_at", { ascending: false }).limit(100);
  const jobs = ((rawJobs || []) as Job[]).filter(j => !j.expires_at || new Date(j.expires_at).getTime() > Date.now());
  const name = company.company_name || "Verified UK Employer";
  return (
    <main style={{background:"#f7f9fc",minHeight:"75vh",padding:"40px 20px 80px",color:"#102a4c"}}>
      <div style={{maxWidth:1080,margin:"0 auto"}}>
        <Link href="/companies" style={{display:"inline-flex",alignItems:"center",gap:8,color:"#17365d",textDecoration:"none",fontSize:14,marginBottom:24}}><ArrowLeft size={16}/> All Companies</Link>
        <section style={{background:"white",border:"1px solid #e1e7ef",borderRadius:8,padding:"32px",display:"flex",alignItems:"center",gap:22,flexWrap:"wrap"}}>
          <div style={{height:76,width:76,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",background:"#f0f4fa",color:"#012169"}}><Building2 size={38}/></div>
          <div>
            <h1 style={{fontSize:"clamp(25px,3vw,34px)",fontWeight:700,margin:"0 0 10px"}}>{name}</h1>
            <p style={{display:"flex",alignItems:"center",gap:7,color:"#C8102E",fontSize:14,margin:0}}><CheckCircle2 size={17}/> Verified UK Employer</p>
          </div>
        </section>
        <section style={{marginTop:32}}>
          <h2 style={{fontSize:23,marginBottom:8}}>Jobs at {name}</h2>
          <p style={{fontSize:14,color:"#667085",marginBottom:22}}>{jobs.length} active {jobs.length === 1 ? "vacancy" : "vacancies"}</p>
          {jobs.length ? <div style={{display:"grid",gap:13}}>{jobs.map(j => <Link key={j.id} href={`/jobs/${encodeURIComponent(j.slug || j.id)}`} style={{display:"flex",alignItems:"center",gap:16,padding:"20px 22px",background:"white",border:"1px solid #e1e7ef",borderRadius:7,textDecoration:"none",color:"#102a4c"}}>
            <BriefcaseBusiness size={24} color="#C8102E"/>
            <div style={{flex:1,minWidth:0}}><strong style={{fontSize:17}}>{j.title || "Job Opportunity"}</strong><div style={{display:"flex",gap:15,flexWrap:"wrap",color:"#667085",fontSize:13,marginTop:8}}>{j.location && <span style={{display:"inline-flex",alignItems:"center",gap:5}}><MapPin size={13}/>{j.location}</span>}{j.job_type && <span>{j.job_type}</span>}</div></div>
            <ArrowRight size={19} color="#C8102E"/>
          </Link>)}</div> : <div style={{background:"white",padding:28,border:"1px solid #e1e7ef",borderRadius:7,color:"#667085"}}>This company has no active published vacancies at the moment.</div>}
        </section>
      </div>
    </main>
  );
}
