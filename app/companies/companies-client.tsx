"use client";

export type PublicCompany = {id:string;name:string;initial:string;industry:string;location:string;jobs:number;size?:string;verified:boolean;description?:string};

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  MapPin,
  Search,
  SlidersHorizontal,
  UsersRound,
} from "lucide-react";
import styles from "./companies.module.css";



export default function CompaniesClient({ companies }: { companies: PublicCompany[] }) {
  const industries = useMemo(
    () => Array.from(new Set(companies.map((company) => company.industry).filter(Boolean)))
      .sort((a, b) => a.localeCompare(b)),
    [companies],
  );
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [sort, setSort] = useState("Most Jobs");
  const [mobileFilters, setMobileFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = companies.filter((company) => {
      const q = keyword.trim().toLowerCase();
      const l = location.trim().toLowerCase();
      return (
        (!q ||
          company.name.toLowerCase().includes(q) ||
          company.industry.toLowerCase().includes(q)) &&
        (!l || company.location.toLowerCase().includes(l)) &&
        (!industry || company.industry === industry)
      );
    });

    if (sort === "Most Jobs") result = [...result].sort((a, b) => b.jobs - a.jobs);
    if (sort === "A-Z") result = [...result].sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [companies, keyword, location, industry, sort]);

  const reset = () => {
    setKeyword("");
    setLocation("");
    setIndustry("");
  };

  return (
    <main className={styles.page}>

      <section className={styles.pageHero}>
        <div className={styles.container}>
          <div className={styles.heroRow}>
            <div>
              <h1>Browse Employers</h1>
              <p>Explore verified employers and discover their latest UK job opportunities.</p>
            </div>
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link><span>/</span><strong>Employers</strong>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.searchSection}>
        <div className={styles.container}>
          <div className={styles.searchBar}>
            <label>
              <Search />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Company name or industry"
              />
            </label>

            <label className={styles.locationField}>
              <MapPin />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
              />
            </label>

            <button className={styles.searchButton}>Search Employers</button>
          </div>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          <button
            className={styles.mobileFilter}
            onClick={() => setMobileFilters(!mobileFilters)}
          >
            <SlidersHorizontal /> Filters
          </button>

          <div className={styles.layout}>
            <aside className={`${styles.sidebar} ${mobileFilters ? styles.sidebarOpen : ""}`}>
              <div className={styles.filterHead}>
                <h2>Filter Employers</h2>
                <button onClick={reset}>Clear All</button>
              </div>

              <div className={styles.filterGroup}>
                <h3>Industry</h3>
                <label className={styles.radioRow}>
                  <input
                    type="radio"
                    name="industry"
                    checked={!industry}
                    onChange={() => setIndustry("")}
                  />
                  <span>All Industries</span>
                </label>

                {industries.map((item) => (
                  <label className={styles.radioRow} key={item}>
                    <input
                      type="radio"
                      name="industry"
                      checked={industry === item}
                      onChange={() => setIndustry(item)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              <div className={styles.verifiedBox}>
                <BadgeCheck />
                <h3>Verified Employers</h3>
                <p>Employer profiles shown here are presented with a verified status indicator.</p>
              </div>
            </aside>

            <div className={styles.results}>
              <div className={styles.resultsHead}>
                <div>
                  <h2>UK Employers</h2>
                  <p>{filtered.length} employers found</p>
                </div>

                <label className={styles.sort}>
                  <span>Sort by:</span>
                  <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option>Most Jobs</option>
                    <option>A-Z</option>
                  </select>
                </label>
              </div>

              <div className={styles.companyGrid}>
                {filtered.map((company) => (
                  <article className={styles.companyCard} key={company.id}>
                    <div className={styles.cardTop}>
                      <div className={styles.companyLogo}>{company.initial}</div>
                      {company.verified && (
                        <span className={styles.verified}>
                          <BadgeCheck /> Verified
                        </span>
                      )}
                    </div>

                    <div className={styles.companyInfo}>
                      <Link href={`/companies/${company.id}`} className={styles.companyName}>
                        {company.name}
                      </Link>
                      {company.industry && <p className={styles.industry}>{company.industry}</p>}

                      <div className={styles.meta}>
                        {company.location && <span><MapPin />{company.location}</span>}
                        {company.size && <span><UsersRound />{company.size} employees</span>}
                      </div>

                      {company.description && <p className={styles.description}>{company.description}</p>}
                    </div>

                    <div className={styles.cardFooter}>
                      <span><BriefcaseBusiness /> {company.jobs} Open Jobs</span>
                      <Link href={`/companies/${company.id}`}>
                        View Profile <ArrowRight />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className={styles.empty}>
                  <Building2 />
                  <h3>No employers found</h3>
                  <p>Try changing the company name, location or industry filter.</p>
                  <button onClick={reset}>Reset Filters</button>
                </div>
              )}

              {filtered.length > 0 && (
                <div className={styles.pagination}>
                  <button aria-label="Previous page"><ArrowLeft /></button>
                  <button className={styles.current}>1</button>
                  <button>2</button>
                  <button>3</button>
                  <span>...</span>
                  <button>6</button>
                  <button aria-label="Next page"><ArrowRight /></button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
