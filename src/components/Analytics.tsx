"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Cookieless analytics beacon.
 *
 * Sends a pageview on every route change and captures clicks through a single
 * delegated listener. Events are batched, and flushed with sendBeacon when the
 * page is hidden so the last click before someone leaves still lands.
 *
 * Links and buttons are captured automatically using their visible text. To
 * label one explicitly:
 *
 *   <a href="/resume.pdf" data-track="resume-download">Resume</a>
 *   <button data-track="hire-me" data-track-meta='{"variant":"hero"}'>...</button>
 */

const ENDPOINT = "/api/track";
const FLUSH_DELAY = 800;
const MAX_BATCH = 10;
const SESSION_KEY = "nr.sid";
const SESSION_IDLE_MS = 30 * 60 * 1000;

type Event = {
  type: "pageview" | "click" | "custom";
  path: string;
  query?: string;
  referrer?: string;
  name?: string;
  target?: string;
  href?: string;
  sid?: string;
  meta?: Record<string, unknown>;
};

let queue: Event[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

function enabled(): boolean {
  if (typeof window === "undefined") return false;
  if (navigator.doNotTrack === "1" || navigator.webdriver) return false;

  const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  return !local || process.env.NEXT_PUBLIC_ANALYTICS_LOCAL === "1";
}

/** Rolling 30-minute session id, kept only in sessionStorage. */
function sessionId(): string {
  const now = Date.now();
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const [id, last] = raw.split(":");
      if (id && now - Number(last) < SESSION_IDLE_MS) {
        sessionStorage.setItem(SESSION_KEY, `${id}:${now}`);
        return id;
      }
    }
    const id = crypto.randomUUID().slice(0, 16);
    sessionStorage.setItem(SESSION_KEY, `${id}:${now}`);
    return id;
  } catch {
    return "";
  }
}

function flush(useBeacon = false) {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (queue.length === 0) return;

  const body = JSON.stringify({ events: queue });
  queue = [];

  // sendBeacon survives the page being torn down; fetch is the in-page path.
  if (useBeacon && navigator.sendBeacon) {
    navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
    return;
  }

  fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    /* a failed beacon must never reach the visitor */
  });
}

function enqueue(event: Omit<Event, "path" | "query" | "sid">) {
  if (!enabled()) return;

  queue.push({
    ...event,
    path: location.pathname,
    query: location.search,
    sid: sessionId(),
  });

  if (queue.length >= MAX_BATCH) {
    flush();
    return;
  }
  if (!timer) timer = setTimeout(() => flush(), FLUSH_DELAY);
}

/** Fire a custom event from anywhere in the app. */
export function track(name: string, meta?: Record<string, unknown>) {
  enqueue({ type: "custom", name, meta });
}

function label(el: Element): string {
  const text =
    el.getAttribute("aria-label") ??
    el.getAttribute("title") ??
    el.textContent ??
    el.querySelector("img")?.getAttribute("alt") ??
    "";
  return text.replace(/\s+/g, " ").trim().slice(0, 80);
}

type Described = { target: string; href?: string; meta?: Record<string, unknown> };

function describeClick(node: Element): Described | null {
  const tagged = node.closest<HTMLElement>("[data-track]");
  if (tagged) {
    let meta: Record<string, unknown> | undefined;
    if (tagged.dataset.trackMeta) {
      try {
        meta = JSON.parse(tagged.dataset.trackMeta);
      } catch {
        /* ignore malformed data-track-meta */
      }
    }
    return {
      target: tagged.dataset.track || "unnamed",
      href: tagged.closest("a")?.href,
      meta,
    };
  }

  const link = node.closest("a");
  if (link?.href) {
    const outbound = link.hostname !== location.hostname;
    return {
      target: `${outbound ? "outbound" : "link"}:${label(link) || link.pathname}`,
      href: link.href,
      meta: outbound ? { outbound: true } : undefined,
    };
  }

  const button = node.closest("button, [role='button']");
  if (button) return { target: `button:${label(button) || "unlabeled"}` };

  // Everything else is background noise.
  return null;
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    enqueue({ type: "pageview", referrer: document.referrer || undefined });
  }, [pathname]);

  useEffect(() => {
    if (!enabled()) return;

    const onClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return;
      const click = describeClick(e.target);
      if (click) enqueue({ type: "click", ...click });
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") flush(true);
    };
    const onPageHide = () => flush(true);

    // Capture phase, so clicks whose handlers stop propagation are still seen.
    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
      flush(true);
    };
  }, []);

  return null;
}
