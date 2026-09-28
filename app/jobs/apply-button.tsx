"use client";

import {
  ExternalLink,
  Mail,
} from "lucide-react";

type Props = {
  jobId: string;
  title: string;

  applyMethod:
    | "email"
    | "url";

  applyEmail:
    | string
    | null;

  applyUrl:
    | string
    | null;
};

export default function ApplyButton({
  jobId,
  title,
  applyMethod,
  applyEmail,
  applyUrl,
}: Props) {
  /*
   * Record the employer-facing apply click.
   *
   * This remains separate from application
   * tracking so analytics continues to work.
   */
  function trackApplyClick() {
    fetch(
      "/api/jobs/apply-click",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          jobId,
        }),

        keepalive: true,
      }
    ).catch(() => {
      /*
       * Never block the user from applying
       * if analytics tracking fails.
       */
    });
  }

  /*
   * Record this vacancy in the logged-in
   * job seeker's application history.
   *
   * If the visitor is logged out, is an
   * employer, or tracking fails, the normal
   * application flow still continues.
   */
  function trackApplication() {
    fetch(
      "/api/applications",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          jobId,
        }),

        keepalive: true,
      }
    ).catch(() => {
      /*
       * Application tracking must never
       * prevent the user from applying.
       */
    });
  }

  function handleApply() {
    trackApplyClick();
    trackApplication();
  }

  /*
   * EMAIL APPLICATION
   */

  if (
    applyMethod === "email" &&
    applyEmail
  ) {
    return (
      <a
        href={`mailto:${applyEmail}?subject=${encodeURIComponent(
          `Application for ${title}`
        )}`}
        onClick={handleApply}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-500"
      >
        <Mail className="h-5 w-5" />

        Apply by Email
      </a>
    );
  }

  /*
   * EXTERNAL APPLICATION URL
   */

  if (
    applyMethod === "url" &&
    applyUrl
  ) {
    return (
      <a
        href={applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleApply}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-500"
      >
        <ExternalLink className="h-5 w-5" />

        Apply Now
      </a>
    );
  }

  return null;
}