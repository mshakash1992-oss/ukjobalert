const INDEXNOW_KEY = "5d1ca43766dec64676158cc3563b77fc";
const SITE_ORIGIN = "https://www.ukjobalert.com";
const KEY_LOCATION = `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`;

export function jobIndexUrl(slug: string): string {
  return new URL(`/jobs/${encodeURIComponent(slug)}`, SITE_ORIGIN).toString();
}

/**
 * Notify IndexNow about public job URLs. Submission failures must never block
 * an employer's publish/edit action; Vercel requests are bounded by a timeout.
 */
export async function submitIndexNow(urls: Array<string | null | undefined>) {
  const urlList = Array.from(new Set(
    urls.flatMap((value) => {
      if (!value) return [];
      try {
        const url = new URL(value);
        return url.protocol === "https:" && url.origin === SITE_ORIGIN ? [url.toString()] : [];
      } catch {
        return [];
      }
    }),
  ));

  if (urlList.length === 0) return;

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "www.ukjobalert.com",
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList,
      }),
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn("IndexNow URL submission was not accepted:", response.status);
    }
  } catch (error) {
    console.warn("IndexNow submission failed:", error);
  }
}
