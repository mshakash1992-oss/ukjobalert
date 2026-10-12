"use client";

import "./home-premium.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  Send,
  ShieldCheck,
  Users,
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

type HomeJob = {id:string;slug:string;company:string;title:string;location:string;salary:string;type:string;time:string;logo:string;featured:boolean;urgent:boolean};

const cities = [
  {
    name: "London",
    count: "Browse opportunities",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=88",
  },
  {
    name: "Manchester",
    count: "Browse opportunities",
    image:
      "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=900&q=88",
  },
  {
    name: "Birmingham",
    count: "Browse opportunities",
    image:
      "https://images.unsplash.com/photo-1597933534024-debb6104af8e?auto=format&fit=crop&w=900&q=88",
  },
  {
    name: "Liverpool",
    count: "Browse opportunities",
    image:
      "https://images.unsplash.com/photo-1571504211935-1c936b327411?auto=format&fit=crop&w=900&q=88",
  },
  {
    name: "Leeds",
    count: "Browse opportunities",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=88",
  },
  {
    name: "Glasgow",
    count: "Browse opportunities",
    image:
      "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=900&q=88",
  },
];

export default function Home() {
  const [jobs, setJobs] = useState<HomeJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  useEffect(() => {
    // Ignore late responses after unmount without aborting an in-flight request.
    // This avoids noisy AbortError messages during React development remounts.
    let active = true;

    fetch("/api/public-jobs")
      .then((response) => {
        if (!response.ok) throw new Error("Jobs unavailable");
        return response.json();
      })
      .then((data) => {
        if (active) setJobs(Array.isArray(data.jobs) ? data.jobs.slice(0, 6) : []);
      })
      .catch(() => {
        if (active) setJobs([]);
      })
      .finally(() => {
        if (active) setJobsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);
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
    <main>
      <section className="premium-hero">
        <div className="premium-hero-overlay" />

        <div className="container premium-hero-content">
          <div className="premium-verified-pill">
            <span className="premium-uk-mark" aria-hidden="true">UK</span>
            <span>Jobs from verified UK employers</span>
            <ShieldCheck />
          </div>

          <h1>
            Find The Job That
            <br />
            Fits Your <span>Life</span>
          </h1>

          <p className="premium-hero-description">
            Search current UK jobs and vacancies from verified employers. Find
            jobs in the UK by title, location, sector and employment type.
          </p>

          <div className="premium-benefits">
            <div className="premium-benefit">
              <span className="premium-benefit-icon"><ShieldCheck /></span>
              <span>
                <strong>Verified Employers</strong>
                <small>Trusted UK companies</small>
              </span>
            </div>

            <div className="premium-benefit">
              <span className="premium-benefit-icon"><BriefcaseBusiness /></span>
              <span>
                <strong>Real Opportunities</strong>
                <small>Latest job vacancies</small>
              </span>
            </div>

            <div className="premium-benefit">
              <span className="premium-benefit-icon"><Users /></span>
              <span>
                <strong>Build Your Career</strong>
                <small>Take the next step</small>
              </span>
            </div>
          </div>

          <form className="premium-search-box">
            <label className="premium-search-field premium-keyword-field">
              <Search />
              <input
                type="text"
                placeholder="Job Title or Keywords"
                aria-label="Job Title or Keywords"
              />
            </label>

            <label className="premium-search-field premium-location-field">
              <MapPin />
              <input
                type="text"
                placeholder={isLocating ? "Detecting location..." : "Location"}
                aria-label="Location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />

              <button
                type="button"
                className={`premium-location-detect${isLocating ? " is-locating" : ""}`}
                onClick={detectLocation}
                aria-label="Use my current location"
                title="Use my current location"
              >
                <LocateFixed />
              </button>
            </label>

            <button type="submit" className="premium-search-button">
              <span>Search Jobs</span>
              <ArrowRight />
            </button>
          </form>

          <div className="premium-trending">
            <TrendingUp />
            <strong>Trending Keywords:</strong>
            <span>Designer, Developer, Web, IOS, PHP, Senior, Engineer</span>
          </div>
        </div>
      </section>

      <section className="section categories-section">
        <div className="container">
          <div className="section-title">
            <h2>Popular Job Categories</h2>

            <p>
              Explore jobs across the most popular industries in the UK.
            </p>
          </div>

          <div className="reference-category-grid">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  href={`/jobs?category=${encodeURIComponent(category.name)}`}
                  className="reference-category-card"
                  key={category.name}
                >
                  <div className="reference-category-icon">
                    <Icon strokeWidth={1.45} />
                  </div>

                  <h3>{category.name}</h3>

                  <p>{category.count}</p>
                </Link>
              );
            })}
          </div>

          <div className="center">
            <Link href="/jobs" className="orange-button">
              Browse All Categories
              <ArrowRight />
            </Link>
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

      <section className="section jobs-section">
        <div className="container">
          <div className="featured-heading">
            <h2>Featured Jobs</h2>

            <Link href="/jobs" className="featured-all-link">
              Browse All Jobs
              <ArrowRight />
            </Link>
          </div>

          {jobsLoading && <p style={{padding:"24px 0",color:"#667085"}}>Loading current vacancies…</p>}
          {!jobsLoading && jobs.length === 0 && <p style={{padding:"24px 0",color:"#667085"}}>No vacancies are currently displayed here. Browse jobs for the latest listings.</p>}
          <div className="featured-job-list">
            {jobs.map((job) => (
              <Link href={`/jobs/${job.slug}`} className="featured-job-card" key={job.id}>
                {job.urgent && <span className="urgent-ribbon">URGENT</span>}

                <div className="featured-company-logo">
                  <span>{job.logo}</span>
                </div>

                <div className="featured-job-content">
                  <span className="featured-job-type">{job.type}</span>

                  <h3>
                    {job.title}
                    {job.featured && <span className="featured-star">★</span>}
                  </h3>

                  <p className="featured-posted">
                    posted {job.time} by <strong>{job.company}</strong>
                  </p>

                  <div className="featured-meta">
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

                <span className="featured-browse-button">Browse Job</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section local-jobs">
        <div className="container">
          <div className="local-jobs-title">
            <h2>Browse Local Jobs</h2>
          </div>

          <div className="local-city-grid">
            {cities.map((city) => (
              <Link
                href="/jobs"
                className="local-city-card"
                key={city.name}
                style={{ backgroundImage: `url("${city.image}")` }}
              >
                <span className="local-city-overlay" />

                <div className="local-city-content">
                  <h3>{city.name}</h3>
                  <p>{city.count}</p>
                </div>
              </Link>
            ))}
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

          <div className="footer-social">
            <span>Follow Us</span>
            <div className="footer-social-icons">
              <Link href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v2H6v4h3v7h4v-7h3.2l.8-4H13V9c0-.7.3-1 1-1Z" fill="currentColor" stroke="none" />
                </svg>
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5.2 8.3H2V22h3.2V8.3ZM3.6 2A1.9 1.9 0 1 0 3.6 5.8 1.9 1.9 0 0 0 3.6 2ZM22 13.6c0-4.1-2.2-6-5.1-6-2.4 0-3.4 1.3-4 2.2V8.3H9.7V22h3.2v-6.8c0-1.8.3-3.6 2.6-3.6 2.2 0 2.3 2.1 2.3 3.7V22H21v-7.6l1-.8Z" fill="currentColor" stroke="none" />
                </svg>
              </Link>
              <Link href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
                </svg>
              </Link>
            </div>
          </div>
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
              { label: "Saved Jobs", href: "/account" },
              { label: "Applications", href: "/account" },
              { label: "Job Alerts", href: "/account" },
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
            <h3>Newsletter</h3>
            <p>
              Subscribe to UKJobAlert to get the latest UK jobs and career
              updates delivered to your inbox.
            </p>

            <form className="footer-newsletter-form" onSubmit={(event) => event.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                aria-label="Email address"
              />
              <button type="submit" aria-label="Subscribe" title="Newsletter signup coming soon">
                <Send />
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <span>© 2026 UKJobAlert. All Rights Reserved.</span>
            <div>
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
