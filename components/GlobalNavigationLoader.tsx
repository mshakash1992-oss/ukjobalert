"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./GlobalNavigationLoader.module.css";

export default function GlobalNavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = useRef(false);

  useEffect(() => {
    // Next.js has committed the destination route.
    active.current = false;
    setLoading(false);
    if (timeout.current) clearTimeout(timeout.current);
  }, [pathname, searchParams]);

  useEffect(() => {
    const start = () => {
      active.current = true;
      setLoading(true);
      if (timeout.current) clearTimeout(timeout.current);
      // Safety: never leave an overlay blocking the website.
      timeout.current = setTimeout(() => {
        active.current = false;
        setLoading(false);
      }, 8000);
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
          event.ctrlKey || event.shiftKey || event.altKey) return;
      const element = event.target;
      if (!(element instanceof Element)) return;
      const link = element.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const current = new URL(window.location.href);
      if (url.pathname === current.pathname && url.search === current.search) return;
      start();
    };

    const onPopState = () => start();
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPopState);
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  return loading ? (
    <div className={styles.overlay} role="status" aria-live="polite" aria-label="Loading page">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.visuallyHidden}>Loading page...</span>
    </div>
  ) : null;
}
