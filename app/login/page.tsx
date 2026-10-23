"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import styles from "./login.module.css";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";

export default function LoginPage() {
  const router = useRouter();
  // Login redirects only to an explicitly supported internal route.
  const getSafeNext = () => {
    if (typeof window === "undefined") return null;
    const requestedNext = new URLSearchParams(window.location.search).get("next");
    return requestedNext === "/post-job" ? requestedNext : null;
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("oauth_error") === "google") {
      setError("Google sign-in could not be completed. Please try again.");
    }
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Enter your email address and password.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (!data.user || !data.session) {
        setError("Unable to sign in. Please try again.");
        return;
      }

      const accountType =
        data.user.user_metadata?.account_type;

      router.refresh();

      if (accountType === "employer") {
        router.replace(getSafeNext() ?? "/employer");
        return;
      }

      router.replace("/account");
    } catch (err) {
      console.error("Login error:", err);

      setError(
        "Unable to connect to the authentication service. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.visual}>
        <Link href="/" className={styles.brand}>
          <img
            src="/images/ukjobalert-logo.png"
            alt="UKJobAlert"
          />
        </Link>

        <div className={styles.visualContent}>
          <span className={styles.eyebrow}>THE UK JOB MARKETPLACE</span>

          <h1>
            Your next chapter starts here.
          </h1>

          <p>
            Discover opportunities from verified UK employers, track your applications, and move your career forward with confidence.
          </p>
        </div>
      </section>

      <section className={styles.formSide}>
        <div className={styles.card}>
          <div className={styles.heading}>
            <span>WELCOME BACK</span>

            <h2>Welcome back<span className={styles.headingDot}>.</span></h2>

            <p>
              Sign in to manage your career and discover what’s next.
            </p>
          </div>

          <GoogleAuthButton onError={setError} disabled={loading} />

          <form onSubmit={handleLogin}>
            <label
              className={styles.label}
              htmlFor="email"
            >
              Email Address
            </label>

            <div className={styles.inputWrap}>
              <Mail />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>

            <div className={styles.passwordLabel}>
              <label
                className={styles.label}
                htmlFor="password"
              >
                Password
              </label>

              <Link href="/forgot-password">
                Forgot password?
              </Link>
            </div>

            <div className={styles.inputWrap}>
              <LockKeyhole />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                disabled={loading}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <label className={styles.remember}>
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            {error && (
              <div className={styles.error}>
                <AlertCircle
                  size={18}
                  style={{
                    flexShrink: 0,
                    marginTop: "1px",
                  }}
                />

                <span>{error}</span>
              </div>
            )}

            <button
              className={styles.submit}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight />
                </>
              )}
            </button>
          </form>

          <div className={styles.divider}>
            <span>New to UKJobAlert?</span>
          </div>

          <Link
            href="/register"
            className={styles.create}
          >
            Create an Account
          </Link>

          <p className={styles.terms}>
            By continuing, you agree to our{" "}
            <Link href="/terms">Terms</Link> and{" "}
            <Link href="/privacy-policy">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}