"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {Menu, X, Search, ChevronDown} from "lucide-react";
import {createClient} from "@/lib/supabase/client";
export default function Header(){
 const pathname=usePathname(); const router=useRouter();
 const [openPath, setOpenPath] = useState<string | null>(null);
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [authChecked, setAuthChecked] = useState(false);
 useEffect(() => {
  const supabase = createClient();
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
   setIsAuthenticated(Boolean(session?.user));
   setAuthChecked(true);
  });
  return () => subscription.unsubscribe();
 }, []);
 const menuOpen = openPath === pathname;
 const employer=pathname==="/employer" || pathname.startsWith("/employer/");
 const candidate=pathname==="/account" || pathname.startsWith("/account/");
 const dashboard=employer||candidate;
 const showAccount=authChecked ? isAuthenticated : dashboard;
 const links=[["Home","/"],["Jobs","/jobs"],["Companies","/companies"],["Employers","/employer"],["About","/about"],["Contact","/contact"]];
 const current=(href:string)=>href==="/" ? pathname==="/" : pathname===href||pathname.startsWith(href+"/");
 async function signOut(){await createClient().auth.signOut();router.replace("/login");router.refresh();}
 return <header className="grow-header"><div className="grow-nav-inner">
  <Link href="/" className="grow-brand" aria-label="UKJobAlert home"><img className="grow-custom-logo" src="/ukjobalert-logo-web.webp" fetchPriority="high" loading="eager" alt="UKJobAlert.com" width="240" height="55"/></Link>
  <nav className="grow-desktop-links" aria-label="Main navigation">{links.map(([label,href])=><Link key={href} href={href} aria-current={current(href)?"page":undefined}>{label}</Link>)}</nav>
  <div className="grow-header-actions"><Link href="/jobs" aria-label="Search jobs"><Search size={21}/></Link>{showAccount?<details className="grow-account" onMouseEnter={event=>{event.currentTarget.open=true;}} onMouseLeave={event=>{event.currentTarget.open=false;}}><summary onClick={event=>{if(window.matchMedia("(hover: hover)").matches && event.detail>0) event.preventDefault();}}>{employer?"Employer":"My Account"}<ChevronDown size={15}/></summary><div><Link href={employer?"/employer":"/account"}>Dashboard</Link><Link href={employer?"/employer/company":"/account/profile"}>Profile</Link><Link href={employer?"/employer/messages":"/account/messages"}>Messages</Link><button onClick={signOut}>Sign Out</button></div></details>:<><Link className="grow-login" href="/login">Login</Link><Link className="grow-signup" href="/register">Sign Up</Link></>}</div>
  <div className="grow-mobile-controls"><button type="button" className="grow-menu-toggle" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="grow-mobile-menu" onClick={() => setOpenPath(menuOpen ? null : pathname)}>{menuOpen ? <X aria-hidden="true"/> : <Menu aria-hidden="true"/>}</button></div>
  {menuOpen && <nav id="grow-mobile-menu" className="grow-mobile-panel" aria-label="Mobile navigation" onKeyDown={event => { if(event.key === "Escape") { setOpenPath(null); document.querySelector<HTMLButtonElement>(".grow-menu-toggle")?.focus(); } }}>
    {links.map(([label,href])=><Link key={href} href={href} aria-current={current(href)?"page":undefined} onClick={() => setOpenPath(null)}>{label}</Link>)}
    <div className="grow-mobile-account-actions">{showAccount ? <><Link href={employer ? "/employer" : "/account"} onClick={() => setOpenPath(null)}>My Dashboard</Link><button type="button" onClick={signOut}>Sign Out</button></> : <><Link href="/login" onClick={() => setOpenPath(null)}>Login</Link><Link href="/register" className="grow-mobile-register" onClick={() => setOpenPath(null)}>Sign Up</Link></>}</div>
  </nav>}
 </div></header>;
}
