"use client";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {Menu, Search, ChevronDown} from "lucide-react";
import {createClient} from "@/lib/supabase/client";
export default function Header(){
 const pathname=usePathname(); const router=useRouter();
 const employer=pathname==="/employer" || pathname.startsWith("/employer/");
 const candidate=pathname==="/account" || pathname.startsWith("/account/");
 const dashboard=employer||candidate;
 const links=[["Home","/"],["Jobs","/jobs"],["Companies","/companies"],["Employers","/employer"],["About","/about"],["Contact","/contact"]];
 const current=(href:string)=>href==="/"?pathname==="/":pathname===href||pathname.startsWith(href+"/");
 async function signOut(){await createClient().auth.signOut();router.replace("/login");router.refresh();}
 return <header className="grow-header"><div className="grow-nav-inner">
  <Link href="/" className="grow-brand" aria-label="UKJobAlert home"><img className="grow-custom-logo" src="/ukjobalert-logo.png" alt="UKJobAlert.com" width="240" height="55"/></Link>
  <nav className="grow-desktop-links" aria-label="Main navigation">{links.map(([label,href])=><Link key={href} href={href} aria-current={current(href)?"page":undefined}>{label}</Link>)}</nav>
  <div className="grow-header-actions"><Link href="/jobs" aria-label="Search jobs"><Search size={21}/></Link>{dashboard?<details className="grow-account"><summary>{employer?"Employer":"My Account"}<ChevronDown size={15}/></summary><div><Link href={employer?"/employer":"/account"}>Dashboard</Link><Link href={employer?"/employer/company":"/account/profile"}>Profile</Link><Link href={employer?"/employer/messages":"/account/messages"}>Messages</Link><button onClick={signOut}>Sign Out</button></div></details>:<><Link className="grow-login" href="/login">Login</Link><Link className="grow-signup" href="/register">Sign Up</Link></>}</div>
  <details className="grow-mobile-nav" key={pathname}><summary aria-label="Open navigation"><Menu/></summary><nav aria-label="Mobile navigation">{links.map(([label,href])=><Link key={href} href={href} aria-current={current(href)?"page":undefined}>{label}</Link>)}<Link href="/account">Candidate Dashboard</Link><Link href="/employer">Employer Dashboard</Link>{dashboard?<button onClick={signOut}>Sign Out</button>:<><Link href="/login">Login</Link><Link href="/register">Sign Up</Link></>}</nav></details>
 </div></header>;
}
