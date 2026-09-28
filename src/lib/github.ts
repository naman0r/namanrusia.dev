import type { Day } from "@/lib/stage";

/**
 * The last year of contributions, read from the calendar fragment GitHub serves for every
 * public profile. No token, no snapshot to commit: the landing page revalidates on a timer,
 * so the graph keeps itself current. Returns null if GitHub is down or changes its markup,
 * and the Activity section quietly steps aside.
 */
export async function getContributions(user: string): Promise<Day[] | null> {
  try {
    const res = await fetch(`https://github.com/users/${user}/contributions`, {
      headers: { "User-Agent": "namanrusia.dev" },
      next: { revalidate: 21600 },
    });
    if (!res.ok) return null;
    const html = await res.text();

    // Each day is a <td data-date id> cell; its count lives in a <tool-tip for={id}>.
    const dates = new Map<string, string>();
    for (const [cell] of html.matchAll(/<td\b[^>]*data-date="[^"]+"[^>]*>/g)) {
      const date = /data-date="(\d{4}-\d{2}-\d{2})"/.exec(cell)?.[1];
      const id = /\bid="([^"]+)"/.exec(cell)?.[1];
      if (date && id) dates.set(id, date);
    }
    const days: Day[] = [];
    for (const [, id, count] of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>\s*(No|[\d,]+) contributions?/g)) {
      const date = dates.get(id);
      if (date) days.push([date, count === "No" ? 0 : Number(count.replace(/,/g, ""))]);
    }
    if (days.length < 300) return null;
    return days.sort((a, b) => a[0].localeCompare(b[0]));
  } catch {
    return null;
  }
}
