import { after } from "next/server";

const INDEXNOW_KEY = "5d1ca43766dec64676158cc3563b77fc";
const SITE_ORIGIN = "https://www.ukjobalert.com";
const KEY_LOCATION = `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`;
const SUBMISSION_TIMEOUT_MS = 15_000;
const MAX_ATTEMPTS = 2;

export function jobIndexUrl(slug: string): string {
  return new URL(`/jobs/${encodeURIComponent(slug)}`, SITE_ORIGIN).toString();
}

/**
 * Schedule notifications after a successful job mutation. Next.js keeps the
 * Vercel invocation alive until this task settles, without delaying the response.
 */
export async function submitIndexNow(urls: Array<string | null | undefined>) {
  const urlList = Array.from(new Set(
    urls.flatMap((value) => {
      if (!value) return [];
      try {
        const url = new URL(value);
        if (url.origin !== SITE_ORIGIN || url.username || url.password) return [];
        url.hash = "";
        return [url.toString()];
      } catch {
        return [];
      }
    }),
  ));

  if (urlList.length === 0) return;

  const body = JSON.stringify({
    host: "www.ukjobalert.com",
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  });

  after(async () => {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      try {
        const response = await fetch("https://api.indexnow.org/indexnow", {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body,
          signal: AbortSignal.timeout(SUBMISSION_TIMEOUT_MS),
          cache: "no-store",
        });

        if (response.status === 200 || response.status === 202) {
          console.info("IndexNow submission received:", {
            status: response.status,
            urlCount: urlList.length,
            attempt,
            keyValidationPending: response.status === 202,
          });
          return;
        }

        console.warn("IndexNow submission was not accepted:", {
          status: response.status,
          urlCount: urlList.length,
          attempt,
        });

        // Do not repeat invalid requests or rate-limited submissions.
        if (response.status < 500 || attempt === MAX_ATTEMPTS) return;

        // Honor Retry-After when supplied; defer long delays to a future update.
        const retryAfter = response.headers.get("retry-after");
        if (retryAfter) {
          const seconds = Number(retryAfter);
          const delay = Number.isFinite(seconds)
            ? seconds * 1000 : Date.parse(retryAfter) - Date.now();
          if (!Number.isFinite(delay) || delay > 5000) return;
          await new Promise(resolve => setTimeout(resolve, Math.max(1000, delay)));
          continue;
        }
      } catch (error) {
        console.warn("IndexNow submission failed:", {
          message: error instanceof Error ? error.message : String(error),
          urlCount: urlList.length,
          attempt,
        });
        if (attempt === MAX_ATTEMPTS) return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  });
}
