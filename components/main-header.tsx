"use client";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";
import {BriefcaseBusiness,ChevronDown,LogOut,Menu,ShieldCheck,UserRound,X} from "lucide-react";
type Props={loggedIn?:boolean;displayName?:string;accountType?:string;isAdmin?:boolean};
export default function MainHeader({loggedIn=false,displayName="Account",accountType,isAdmin=false}:Props){
 const pathname=usePathname(),[open,setOpen]=useState(false);
 const employer=loggedIn&&accountType==="employer",postHref=employer?"/post-job":"/signup";
 const nav=[["Home","/"],["Find Jobs","/jobs"],["Companies","/companies"],["Employers",employer?"/employer/jobs":"/employers"],["How It Works","/how-it-works"],["About","/about"]];
 const active=(href:string)=>href==="/"?pathname==="/":pathname===href||pathname.startsWith(href+"/");
 return <header className="career-header"><div className="career-nav">
  <Link href="/" className="career-logo" aria-label="UKJobAlert home"><Image src="/ukjobalert-logo.png" alt="UKJobAlert" width={190} height={52} priority/></Link>
  <nav className="career-links">{nav.map(([label,href])=><Link key={label} href={href} className={active(href)?"active":""}>{label}{label==="Find Jobs"||label==="Employers"?<ChevronDown size={13}/>:null}</Link>)}</nav>
  <div className="career-actions">{loggedIn?<><Link href={isAdmin?"/admin":employer?"/employer/jobs":"/account"} className="career-login"><UserRound size={16}/>{displayName}</Link><form action="/auth/signout" method="POST"><button className="career-icon" aria-label="Log out"><LogOut size={17}/></button></form></>:<Link href="/login" className="career-login">Login</Link>}{(!loggedIn||employer)&&<Link href={postHref} className="career-post"><BriefcaseBusiness size={17}/>Post a Job</Link>}</div>
  <button className="career-menu" onClick={()=>setOpen(v=>!v)} aria-label="Menu">{open?<X/>:<Menu/>}</button>
 </div>{open&&<div className="career-mobile">{nav.map(([label,href])=><Link key={label} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}{loggedIn&&isAdmin&&<Link href="/admin"><ShieldCheck size={16}/> Admin Dashboard</Link>}<Link href={loggedIn?(employer?"/employer/jobs":"/account"):"/login"}>{loggedIn?displayName:"Login"}</Link>{(!loggedIn||employer)&&<Link href={postHref} className="career-post">Post a Job</Link>}</div>}</header>
}