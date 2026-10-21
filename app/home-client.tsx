"use client";

import "./home-premium.css";
import CompanyLogo from "@/components/CompanyLogo";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  HandHeart,
  LockKeyhole,
  LocateFixed,
  MapPin,
  PenTool,
  RadioTower,
  Search,
  TrendingUp,
  Trophy,
  UserRoundSearch,
  UsersRound,
  Utensils,
  Wrench,
} from "lucide-react";

const categories = [
  {
    name: "Design & Multimedia",
    count: "Browse opportunities",
    icon: PenTool,
  },
  {
    name: "Education Training",
    count: "Browse opportunities",
    icon: GraduationCap,
  },
  {
    name: "Accounting / Finance",
    count: "Browse opportunities",
    icon: TrendingUp,
  },
  {
    name: "Human Resource",
    count: "Browse opportunities",
    icon: UsersRound,
  },
  {
    name: "Telecommunications",
    count: "Browse opportunities",
    icon: RadioTower,
  },
  {
    name: "Restaurant / Food Service",
    count: "Browse opportunities",
    icon: Utensils,
  },
  {
    name: "Construction / Facilities",
    count: "Browse opportunities",
    icon: Wrench,
  },
  {
    name: "Health",
    count: "Browse opportunities",
    icon: HandHeart,
  },
];

export type HomeJob = {id:string;slug:string;company:string;title:string;location:string;salary:string;type:string;time:string;logo:string;featured:boolean;urgent:boolean};

const cities = [
  {
    name: "London",
    count: "Browse opportunities",
    image: "/london-hero.webp",
  },
  {
    name: "Manchester",
    count: "Browse opportunities",
    image: "/cities/manchester.jpg",
  },
  {
    name: "Birmingham",
    count: "Browse opportunities",
    image: "/cities/birmingham.jpg",
  },
  {
    name: "Liverpool",
    count: "Browse opportunities",
    image: "/cities/liverpool.jpg",
  },
  {
    name: "Leeds",
    count: "Browse opportunities",
    image: "/cities/leeds.jpg",
  },
  {
    name: "Glasgow",
    count: "Browse opportunities",
    image: "/cities/glasgow.jpg",
  },
];

export default function Home({ initialJobs, loadError = false }: { initialJobs: HomeJob[]; loadError?: boolean }) {
  const jobs = initialJobs;
  const jobsLoading = false;
  // Failure remains distinguishable from an empty feed.
  const feedStatus = loadError ? "Vacancies are temporarily unavailable. Please try again shortly." : null;
  const [location, setLocation] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation || isLocating) return;

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}&zoom=10&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );

          if (!response.ok) throw new Error("Location lookup failed");

          const data = await response.json();
          const address = data.address ?? {};
          const place =
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            address.county ||
            address.state_district ||
            address.state;

          const country = address.country_code
            ? String(address.country_code).toUpperCase()
            : "";

          if (place) {
            setLocation(country ? `${place}, ${country}` : place);
          }
        } catch {
          // Leave the current input unchanged if the city lookup fails.
        } finally {
          setIsLocating(false);
        }
      },
      () => setIsLocating(false),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };
  return (
    <main className="grow-home">
      <section className="gh-premium-hero">
        <picture>
          <source media="(max-width: 700px)" srcSet="/images/grow-team-header-mobile.webp" />
          <img className="gh-hero-image" src="/images/grow-team-hero-2172.webp" srcSet="/images/grow-team-hero-960.webp 960w, /images/grow-team-hero-1440.webp 1440w, /images/grow-team-hero-2172.webp 2172w" sizes="100vw" alt="" aria-hidden="true" width="2172" height="724" loading="eager" fetchPriority="high" decoding="sync" />
        </picture>
        <div className="gh-premium-hero-overlay" />

        <div className="container gh-premium-hero-content">
          <h1 className="grow-title">GROW<br />YOUR<br /><span className="grow-title-team">TEAM<span className="grow-title-dot">.</span></span></h1>
          <Link href="/post-job" className="grow-post-cta">POST JOBS FOR FREE</Link>
          <p className="grow-subtitle">For UK employers &amp; recruiters</p>

          <form className="gh-premium-search-box" action="/jobs" method="get">
            <label className="gh-premium-search-field gh-keyword-field">
              <Search />
              <input
                type="text"
                name="keyword"
                placeholder="Job title, keywords or company"
                aria-label="Job Title or Keywords"
              />
            </label>

            <label className="gh-premium-search-field gh-location-field">
              <MapPin />
              <input
                type="text"
                placeholder={isLocating ? "Detecting location..." : "Location"}
                name="location"
                aria-label="Location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />

              <button
                type="button"
                className={`gh-premium-location-detect${isLocating ? " is-locating" : ""}`}
                onClick={detectLocation}
                aria-label="Use my current location"
                title="Use my current location"
              >
                <LocateFixed />
              </button>
            </label>

            <label className="gh-premium-search-field grow-category-field">
              <BriefcaseBusiness />
              <select name="category" aria-label="Job category">
                <option value="">All Categories</option>
                {categories.map(category => <option key={category.name} value={category.name}>{category.name}</option>)}
              </select>
            </label>
            
              <Search size={18} strokeWidth={2.4} />
              <span>Search Jobs</span>
            
          </form>

        </div>
      </section>

      <section className="section gh-categories-section">
        <div className="container">
          <div className="grow-section-heading"><h2>Browse by Category</h2><Link href="/jobs">View all categories <ArrowRight /></Link></div>

          <div className="gh-reference-category-grid">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  href={`/jobs?category=${encodeURIComponent(category.name)}`}
                  className="gh-reference-category-card"
                  key={category.name}
                >
                  <div className="gh-reference-category-icon">
                    <Icon strokeWidth={1.45} />
                  </div>

                  <h3>{category.name}</h3>

                  <p>{category.count}</p>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      <section className="section gh-local-jobs">
        <div className="container">
          <div className="local-jobs-title">
            <h2>Popular Cities</h2><Link href="/jobs">View all cities <ArrowRight /></Link>
          </div>

          <div className="gh-local-city-grid">
            {cities.map((city) => (
              <Link
                href={`/jobs?location=${encodeURIComponent(city.name)}`}
                className="gh-local-city-card"
                key={city.name}
                style={{ backgroundImage: `url("${city.image}")` }}
              >
                <span className="gh-local-city-overlay" />

                <div className="gh-local-city-content">
                  <h3><MapPin />{city.name}</h3>
                  <p>{city.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section jobs-section">
        <div className="container">
          <div className="gh-featured-heading">
            <h2>Featured Jobs</h2>{feedStatus && <p role="status">{feedStatus}</p>}

            <Link href="/jobs" className="gh-featured-all-link">
              Browse All Jobs
              <ArrowRight />
            </Link>
          </div>

          {jobsLoading && <p style={{padding:"24px 0",color:"#667085"}}>Loading current vacancies…</p>}
          {!jobsLoading && !loadError && jobs.length === 0 && <p style={{padding:"24px 0",color:"#667085"}}>No vacancies are currently displayed here. Browse jobs for the latest listings.</p>}
          <div className="gh-featured-job-list">
            {jobs.map((job) => (
              <Link href={`/jobs/${job.slug}`} className="gh-featured-job-card" key={job.id}>
                {job.urgent && <span className="urgent-ribbon">URGENT</span>}

                <div className="gh-featured-company-logo">
                  <CompanyLogo src={job.logo} name={job.company} />
                </div>

                <div className="gh-featured-job-content">
                  <span className="gh-featured-job-type">{job.type}</span>

                  <h3>
                    {job.title}
                    {job.featured && <span className="featured-star">★</span>}
                  </h3>

                  <p className="gh-featured-posted">
                    posted {job.time} by <strong>{job.company}</strong>
                  </p>

                  <div className="gh-featured-meta">
                    <span>
                      <MapPin />
                      {job.location}
                    </span>

                    <span>
                      <BriefcaseBusiness />
                      {job.salary}
                    </span>
                  </div>
                </div>

                <span className="gh-featured-browse-button">Browse Job</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section how" id="how-it-works">
        <div className="container">
          <div className="section-title">
            <h2>How It Works?</h2>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-visual">
                <div className="step-icon">
                  <LockKeyhole />
                </div>
                <b className="step-number">1</b>
              </div>

              <h3>Create An Account</h3>
              <p>
                Create your free account and start your UK job search.
              </p>
            </div>

            <div className="step">
              <div className="step-visual">
                <div className="step-icon">
                  <UserRoundSearch />
                </div>
                <b className="step-number">2</b>
              </div>

              <h3>Search Jobs</h3>
              <p>
                Browse UK vacancies and find opportunities that match your skills.
              </p>
            </div>

            <div className="step">
              <div className="step-visual">
                <div className="step-icon">
                  <Trophy />
                </div>
                <b className="step-number">3</b>
              </div>

              <h3>Save &amp; Apply</h3>
              <p>
                Save the jobs you like and apply directly to verified UK employers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="footer-stats">
        <div className="container footer-stats-inner">
          <Link href="/" className="footer-stats-logo">
            <Image
              src="/images/ukjobalert-logo.png"
              alt="UKJobAlert"
              width={190}
              height={52}
            />
          </Link>

          <div className="footer-stat">
            <strong>Free</strong>
            <span>Job Search</span>
          </div>
          <div className="footer-stat">
            <strong>Free</strong>
            <span>Job Posting</span>
          </div>
          <div className="footer-stat">
            <strong>Free</strong>
            <span>Employer Access</span>
          </div>
          <div className="footer-stat">
            <strong>Free</strong>
            <span>Job Seeker Access</span>
          </div>

          <div className="footer-social"><Link href="/post-job" className="grow-footer-post">Post a job for free <ArrowRight size={16}/></Link></div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-main-grid">
          <FooterColumn
            title="Quick Links"
            links={[
              { label: "Browse Jobs", href: "/jobs" },
              { label: "Companies", href: "/companies" },
              { label: "About Us", href: "/about" },
              { label: "Contact Us", href: "/contact" },
              { label: "FAQ", href: "/faq" },
              { label: "How It Works", href: "/#how-it-works" },
            ]}
          />

          <FooterColumn
            title="For Candidates"
            links={[
              { label: "Candidate Dashboard", href: "/account" },
              { label: "Browse Jobs", href: "/jobs" },
              { label: "Saved Jobs", href: "/account/saved-jobs" },
              { label: "Applications", href: "/account/applications" },
              { label: "Job Alerts", href: "/account/alerts" },
            ]}
          />

          <FooterColumn
            title="For Employers"
            links={[
              { label: "Post a Job", href: "/post-job" },
              { label: "Employer Login", href: "/login" },
              { label: "Employer Dashboard", href: "/employer" },
              { label: "Manage Jobs", href: "/employer/jobs" },
              { label: "Verification", href: "/employer/verification" },
            ]}
          />

          <div className="footer-newsletter">
            <h3>Find your next opportunity</h3>
            <p>Set up job alerts in your account and discover UK vacancies that match your interests.</p>
            <Link href="/account/alerts" className="grow-footer-post">Create a job alert <ArrowRight size={16}/></Link>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <span>© 2026 UKJobAlert. All Rights Reserved.</span>
            <div>
              <a href="/photo-credits.html">Photo Credits</a>
              <Link href="/site-map">Site Map</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/security-privacy">Security &amp; Privacy</Link>
            </div>
          </div>
        </div>
      </footer>


    </main>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="footer-column">
      <h3>{title}</h3>

      {links.map((link) => (
        <Link href={link.href} key={`${title}-${link.label}`}>
          {link.label}
        </Link>
      ))}
    </div>
  );
}
