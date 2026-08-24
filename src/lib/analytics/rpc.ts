/**
 * Minimal Supabase RPC client.
 *
 * The analytics schema isn't exposed to PostgREST, so writes go through a
 * SECURITY DEFINER function that only service_role may execute. The app calls
 * exactly one of those (analytics_ingest), which is a small enough surface
 * that a plain fetch beats adding @supabase/supabase-js to the ingest path.
 */

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export function analyticsConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_KEY && process.env.ANALYTICS_SALT);
}

export async function rpc<T>(
  fn: string,
  args: Record<string, unknown> = {}
): Promise<T> {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error("Supabase env vars are missing");
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`${fn} failed (${res.status}): ${await res.text()}`);
  }

  return (await res.json()) as T;
}
