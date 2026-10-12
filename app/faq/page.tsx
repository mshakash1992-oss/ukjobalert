"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Home,
  Search,
} from "lucide-react";
import styles from "./faq.module.css";

const faqs = [
  {
    question: "Is UKJobAlert free for job seekers?",
    answer:
      "Yes. Job seekers can browse current UK vacancies and use UKJobAlert's job-search features without employer verification.",
  },
  {
    question: "Who can post jobs on UKJobAlert?",
    answer:
      "Only verified employer accounts can publish vacancies. Employers must complete UKJobAlert's verification requirements before job posting is enabled.",
  },
  {
    question: "How does employer verification work?",
    answer:
      "Employers provide their registered UK limited company details. UKJobAlert checks the company information against Companies House and requires an eligible active company before automatic verification can be completed.",
  },
  {
    question: "Can an unverified employer publish a job?",
    answer:
      "No. The Post a Job area remains restricted until the employer verification requirement has been completed successfully.",
  },
  {
    question: "How do I apply for a job?",
    answer:
      "Open a vacancy and select the Apply action. Depending on the employer, you may be directed to an application URL or the employer's approved application method.",
  },
  {
    question: "Can I view my job applications?",
    answer:
      "Yes. Sign in to your job seeker account and open your account area to view applications that are tracked through UKJobAlert.",
  },
  {
    question: "How can employers manage their vacancies?",
    answer:
      "Verified employers can use the Employer Dashboard and Manage Jobs area to manage vacancies associated with their account.",
  },
  {
    question: "How can I find jobs in a specific UK location?",
    answer:
      "Use the job search to enter a job title or keyword together with a UK location. You can also browse available vacancies from the Jobs page.",
  },
  {
    question: "Why does UKJobAlert verify employers?",
    answer:
      "Employer verification helps improve trust on the platform by restricting job publishing to employers that have completed UKJobAlert's verification process.",
  },
  {
    question: "What should I do if a vacancy looks suspicious?",
    answer:
      "Do not send money, passwords, login codes or other sensitive information. Stop the application process and contact UKJobAlert through the Contact page with details of the vacancy.",
  },
  {
    question: "How can I contact UKJobAlert?",
    answer:
      "Use the Contact page to send a message to UKJobAlert. Official support contact information can also be published there when available.",
  },
];

export default function FAQPage() {
  const [openQuestion, setOpenQuestion] = useState<string>(
    faqs[0].question
  );
  const [search, setSearch] = useState("");

  const filteredFaqs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return faqs;
    }

    return faqs.filter((faq) => {
      return (
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      );
    });
  }, [search]);

  const recentQuestions = faqs.slice(0, 5);

  const openRecentQuestion = (question: string) => {
    setSearch("");
    setOpenQuestion(question);

    window.setTimeout(() => {
      document
        .getElementById("frequently-asked-questions")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 0);
  };

  return (
    <main>
      {/* =====================================================
          SAME HEADER AS HOMEPAGE
      ===================================================== */}

      <header className="topbar">
        <div className="container nav">
          <Link href="/" className="logo">
            <Image
              src="/images/ukjobalert-logo.png"
              alt="UKJobAlert"
              width={190}
              height={52}
              priority
            />
          </Link>

          <nav className="desktop-nav">
            <Link href="/">
              Home
            </Link>

            <Link href="/jobs">
              Jobs <ChevronDown />
            </Link>

            <Link href="/companies">
              Employers <ChevronDown />
            </Link>

            <Link href="/candidates">
              Candidates
            </Link>

            <Link href="/about" className="active">
              Pages <ChevronDown />
            </Link>
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="bell"
              aria-label="Notifications"
            >
              <Bell />
            </button>

            <Link href="/login" className="login">
              Login / Register
            </Link>

            <Link href="/post-job" className="post-job">
              Post a Job
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================
          FAQ PAGE TITLE
      ===================================================== */}

      <section className={styles.titleBar}>
        <div className={styles.container}>
          <h1>FAQ</h1>

          <div className={styles.breadcrumb}>
            <Link href="/">
              <Home />
              <span>Home</span>
            </Link>

            <ChevronRight />

            <span>FAQ</span>
          </div>
        </div>
      </section>

      {/* =====================================================
          FAQ MAIN CONTENT
      ===================================================== */}

      <section className={styles.faqSection}>
        <div className={`${styles.container} ${styles.faqLayout}`}>
          {/* LEFT SIDEBAR */}

          <aside className={styles.sidebar}>
            <div className={styles.searchBox}>
              <input
                type="search"
                value={search}
                placeholder="Search"
                aria-label="Search frequently asked questions"
                onChange={(event) => {
                  setSearch(event.target.value);

                  const value = event.target.value
                    .trim()
                    .toLowerCase();

                  if (!value) {
                    setOpenQuestion(faqs[0].question);
                    return;
                  }

                  const firstMatch = faqs.find((faq) => {
                    return (
                      faq.question
                        .toLowerCase()
                        .includes(value) ||
                      faq.answer
                        .toLowerCase()
                        .includes(value)
                    );
                  });

                  setOpenQuestion(
                    firstMatch ? firstMatch.question : ""
                  );
                }}
              />

              <Search aria-hidden="true" />
            </div>

            <h2>Recent Questions</h2>

            <div className={styles.recentCard}>
              {recentQuestions.map((faq) => (
                <button
                  key={faq.question}
                  type="button"
                  onClick={() =>
                    openRecentQuestion(faq.question)
                  }
                >
                  {faq.question}
                </button>
              ))}
            </div>
          </aside>

          {/* RIGHT FAQ CONTENT */}

          <div
            className={styles.content}
            id="frequently-asked-questions"
          >
            <h2>Frequently Asked Questions</h2>

            <div className={styles.questions}>
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => {
                  const isOpen =
                    openQuestion === faq.question;

                  return (
                    <article
                      key={faq.question}
                      className={`${styles.question} ${
                        isOpen
                          ? styles.questionOpen
                          : ""
                      }`}
                    >
                      <button
                        type="button"
                        className={styles.questionButton}
                        aria-expanded={isOpen}
                        onClick={() => {
                          setOpenQuestion(
                            isOpen ? "" : faq.question
                          );
                        }}
                      >
                        <span>{faq.question}</span>

                        <ChevronDown
                          className={styles.chevron}
                          aria-hidden="true"
                        />
                      </button>

                      {isOpen && (
                        <div className={styles.answer}>
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </article>
                  );
                })
              ) : (
                <div className={styles.noResults}>
                  <Search aria-hidden="true" />

                  <h3>No questions found</h3>

                  <p>
                    Try another keyword or clear the
                    search field.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}