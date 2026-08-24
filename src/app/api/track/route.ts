import type { NextRequest } from "next/server";
import { analyticsConfigured, rpc } from "@/lib/analytics/rpc";
import { isBot, parseUserAgent } from "@/lib/analytics/ua";
import { clientIp, visitorId } from "@/lib/analytics/visitor";

// Needs node:crypto for hashing and the real client IP headers.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_EVENTS = 20;
const MAX_LEN = 512;
const MAX_META_BYTES = 1024;
const EVENT_TYPES = new Set(["pageview", "click", "custom"]);

type Incoming = {
  type?: unknown;
  path?: unknown;
  query?: unknown;
  referrer?: unknown;
  name?: unknown;
  target?: unknown;
  href?: unknown;
  sid?: unknown;
  meta?: unknown;
};

const noContent = () => new Response(null, { status: 204 });

function clip(value: unknown, max = MAX_LEN): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function hostOf(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

/** Only accept beacons fired from our own pages. */
function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // some browsers omit Origin on sendBeacon

  const from = hostOf(origin);
  const self = (req.headers.get("host") ?? "")
    .split(":")[0]
    .replace(/^www\./, "")
    .toLowerCase();

  return Boolean(from && self && from === self);
}

function utmFrom(query: string | null) {
  if (!query) return {};
  const params = new URLSearchParams(
    query.startsWith("?") ? query.slice(1) : query
  );
  return {
    utm_source: clip(params.get("utm_source"), 120),
    utm_medium: clip(params.get("utm_medium"), 120),
    utm_campaign: clip(params.get("utm_campaign"), 120),
  };
}

function sanitizeMeta(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const json = JSON.stringify(value);
  if (json.length > MAX_META_BYTES) return null;
  return value as Record<string, unknown>;
}

export async function POST(req: NextRequest) {
  // Every path below returns 204: a broken tracker must never break the site,
  // and a caller shouldn't learn why its payload was dropped.
  if (!analyticsConfigured() || !sameOrigin(req)) return noContent();

  const userAgent = req.headers.get("user-agent") ?? "";
  if (isBot(userAgent)) return noContent();

  let body: { events?: unknown };
  try {
    body = await req.json();
  } catch {
    return noContent();
  }

  const incoming = Array.isArray(body?.events)
    ? (body.events as Incoming[]).slice(0, MAX_EVENTS)
    : [];
  if (incoming.length === 0) return noContent();

  // analyticsConfigured() above already checked this is set.
  const salt = process.env.ANALYTICS_SALT as string;
  const vid = visitorId(clientIp(req.headers), userAgent, salt);
  const { device, browser, os } = parseUserAgent(userAgent);
  const country = clip(req.headers.get("x-vercel-ip-country"), 2);
  const selfHost = (req.headers.get("host") ?? "")
    .split(":")[0]
    .replace(/^www\./, "")
    .toLowerCase();

  const rows = incoming
    .filter((e) => typeof e?.type === "string" && EVENT_TYPES.has(e.type))
    .map((e) => {
      const referrerHost = hostOf(clip(e.referrer, 2048));
      return {
        event_type: e.type as string,
        name: clip(e.name, 120),
        visitor_id: vid,
        session_id: clip(e.sid, 64),
        path: clip(e.path) ?? "/",
        // Self-referrals are just internal navigation, not an acquisition source.
        referrer_host: referrerHost === selfHost ? null : referrerHost,
        target: clip(e.target, 200),
        target_href: clip(e.href, 1024),
        country,
        device,
        browser,
        os,
        ...utmFrom(clip(e.query, 1024)),
        meta: sanitizeMeta(e.meta),
      };
    });

  if (rows.length === 0) return noContent();

  try {
    await rpc<number>("analytics_ingest", { p_events: rows });
  } catch (error) {
    console.error("[analytics] ingest failed", error);
  }

  return noContent();
}
