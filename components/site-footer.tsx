import Image from "next/image";
import Link from "next/link";
import {ArrowRight,MapPin,ShieldCheck} from "lucide-react";
export default function SiteFooter(){const year=new Date().getFullYear();return <footer className="career-footer">
 <div className="footer-main career-wrap">
  <div className="footer-brand"><Link href="/"><Image src="/ukjobalert-logo.png" alt="UKJobAlert" width={190} height={52}/></Link><p>Search current UK vacancies from employers using UKJobAlert and apply through the route provided in each listing.</p><span><ShieldCheck/> Employer checks before posting access</span></div>
  <FooterCol title="For Candidates" links={[["Find Jobs","/jobs"],["Companies","/companies"],["Job Alerts","/account/alerts"],["Applications","/account/applications"]]}/>
  <FooterCol title="For Employers" links={[["Post a Job","/post-job"],["Verification","/employer/verify"],["Manage Jobs","/employer/jobs"],["How It Works","/how-it-works"]]}/>
  <FooterCol title="Quick Links" links={[["About Us","/about"],["FAQ","/faq"],["Contact","/contact"],["Privacy Policy","/privacy"],["Terms","/terms"]]}/>
 </div>
 <div className="footer-news"><div className="career-wrap"><div><b>Ready to find your next opportunity?</b><p>Explore the latest jobs across the United Kingdom.</p></div><Link href="/jobs">Browse Jobs <ArrowRight/></Link></div></div>
 <div className="footer-bottom"><div className="career-wrap"><span>© {year} UKJobAlert.com. All rights reserved.</span><span><MapPin/> United Kingdom</span></div></div>
 </footer>}
function FooterCol({title,links}:{title:string;links:string[][]}){return <div className="footer-col"><h3>{title}</h3>{links.map(([label,href])=><Link key={label} href={href}>{label}</Link>)}</div>}
