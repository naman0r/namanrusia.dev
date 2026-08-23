import { createHash } from "node:crypto";

import { SITE_TIMEZONE } from "./config";

const DAY_PARTS = new Intl.DateTimeFormat("en-US", {
  timeZone: SITE_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/**
 * Today's date in the site's timezone, as YYYY-MM-DD. Assembled from parts so
 * the format can't shift with the runtime's locale data.
 */
export function siteDay(now = new Date()): string {
  const parts = Object.fromEntries(
    DAY_PARTS.formatToParts(now).map((p) => [p.type, p.value])
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/**
 * A per-day, per-visitor pseudonymous id.
 *
 * Because the day is part of the hash, the same person gets a different id
 * tomorrow: we can count unique visitors within a day, but nobody -- including
 * us -- can link those ids across days, and the IP is never stored. Same
 * approach Plausible and Fathom use, and why the site needs no cookie banner.
 */
export function visitorId(ip: string, userAgent: string, salt: string): string {
  return createHash("sha256")
    .update(`${salt}:${siteDay()}:${ip}:${userAgent}`)
    .digest("hex")
    .slice(0, 32);
}

/**
 * Best-effort client IP. Vercel and most proxies put the real client first in
 * x-forwarded-for. The fallback means a missing header degrades to "one shared
 * visitor" instead of throwing.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "0.0.0.0";
}
