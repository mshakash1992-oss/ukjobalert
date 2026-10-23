"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "./GoogleAuthButton.module.css";

type AccountType = "jobseeker" | "job_seeker" | "employer";

type GoogleAuthButtonProps = {
  accountType?: AccountType;
  termsAccepted?: boolean;
  disabled?: boolean;
  onError: (message: string) => void;
};

export function GoogleAuthButton({
  accountType,
  termsAccepted,
  disabled = false,
  onError,
}: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);

  async function continueWithGoogle() {
    onError("");

    if (termsAccepted === false) {
      onError("Please accept the Terms and Privacy Policy before continuing.");
      return;
    }

    setLoading(true);
    try {
      const callbackUrl = new URL("/auth/callback", window.location.origin);
      if (accountType) {
        callbackUrl.searchParams.set("account_type", accountType);
      } else if (new URLSearchParams(window.location.search).get("next") === "/post-job") {
        callbackUrl.searchParams.set("next", "/post-job");
      }

      const { error } = await createClient().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callbackUrl.toString() },
      });

      if (error) {
        onError(error.message);
        setLoading(false);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      onError("Unable to connect to Google sign-in. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.button}
        type="button"
        onClick={continueWithGoogle}
        disabled={disabled || loading}
      >
        <svg className={styles.icon} viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.9 6-15z" />
          <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.7-5.1c-1.8 1.2-4 1.9-6.8 1.9-5.2 0-9.6-3.5-11.2-8.2H5.9v5.3A20 20 0 0 0 24 44z" />
          <path fill="#FBBC05" d="M12.8 27.8a12 12 0 0 1 0-7.6v-5.3H5.9a20 20 0 0 0 0 18.2l6.9-5.3z" />
          <path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6 29.5 4 24 4A20 20 0 0 0 5.9 14.9l6.9 5.3C14.4 15.5 18.8 12 24 12z" />
        </svg>
        <span>{loading ? "Connecting to Google..." : "Continue with Google"}</span>
      </button>
      <div className={styles.divider}><span>or continue with email</span></div>
    </div>
  );
}
