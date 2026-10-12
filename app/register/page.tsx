"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import styles from "./register.module.css";

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<"jobseeker" | "employer">("jobseeker");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError("");
    setSuccess("");

    const name = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (!name || !cleanEmail || !password) {
      setError("Complete all required fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }
    if (!agreed) {
      setError("Please accept the Terms and Privacy Policy.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: { full_name: name, account_type: accountType },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      if (!data.user) {
        setError("Unable to create your account. Please try again.");
        return;
      }
      if (data.session) {
        setSuccess("Account created successfully. You can now sign in to UKJobAlert.");
      } else {
        setSuccess("Registration submitted. Check your email for the confirmation link, then sign in.");
      }
      setPassword("");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Unable to connect to the registration service. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.visual}>
        <Link href="/" className={styles.brand}>
          <img src="/images/ukjobalert-logo.png" alt="UKJobAlert" />
        </Link>
        <div className={styles.visualContent}>
          <span>JOIN UKJOBALERT</span>
          <h1>{accountType === "employer" ? "Hire with a verified employer profile." : "Your UK job search starts here."}</h1>
          <p>
            {accountType === "employer"
              ? "Employer accounts must complete UK limited company verification before publishing jobs."
              : "Create a free account to save vacancies and manage your job applications."}
          </p>
        </div>
      </section>

      <section className={styles.formSide}>
        <div className={styles.mobileBrand}>
          <Link href="/"><img src="/images/ukjobalert-logo.png" alt="UKJobAlert" /></Link>
        </div>

        <div className={styles.card}>
          <div className={styles.heading}>
            <span>CREATE ACCOUNT</span>
            <h2>Join UKJobAlert</h2>
            <p>Choose your account type to get started.</p>
          </div>

          <div className={styles.accountTypes}>
            <button
              type="button"
              className={accountType === "jobseeker" ? styles.selected : ""}
              onClick={() => setAccountType("jobseeker")}
            >
              <UserRound />
              <div><strong>Job Seeker</strong><span>Find and save UK jobs</span></div>
            </button>

            <button
              type="button"
              className={accountType === "employer" ? styles.selected : ""}
              onClick={() => setAccountType("employer")}
            >
              <Building2 />
              <div><strong>Employer</strong><span>Post jobs after verification</span></div>
            </button>
          </div>

          {accountType === "employer" && (
            <div className={styles.notice}>
              <BriefcaseBusiness />
              <p>
                Employer accounts require an active UK limited company to be verified before job posting is enabled.
              </p>
            </div>
          )}

          <form onSubmit={handleRegister}>
            <label className={styles.label}>Full Name</label>
            <div className={styles.inputWrap}>
              <UserRound />
              <input type="text" placeholder="Your full name" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={loading} />
            </div>

            <label className={styles.label}>Email Address</label>
            <div className={styles.inputWrap}>
              <Mail />
              <input type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
            </div>

            <label className={styles.label}>Password</label>
            <div className={styles.inputWrap}>
              <LockKeyhole />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
                disabled={loading}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Show or hide password">
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <label className={styles.agree}>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} required disabled={loading} />
              <span>I agree to the <Link href="/terms">Terms</Link> and <Link href="/privacy-policy">Privacy Policy</Link>.</span>
            </label>

            {error && <p role="alert" style={{ color: "#b91c1c", fontSize: 14, margin: "12px 0" }}>{error}</p>}
            {success && <p role="status" style={{ color: "#166534", fontSize: 14, margin: "12px 0" }}>{success}</p>}
            <button className={styles.submit} type="submit" disabled={loading}>
              {loading ? "Creating Account..." : `Create ${accountType === "employer" ? "Employer" : "Job Seeker"} Account`}
              {!loading && <ArrowRight />}
            </button>
          </form>

          <div className={styles.signin}>
            Already have an account? <Link href="/login">Sign In</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
