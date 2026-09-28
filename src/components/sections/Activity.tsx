import { ActivityScene } from "@/components/ActivityScene";
import { Heading, Section } from "@/components/Section";
import { profile } from "@/content/profile";
import type { Day } from "@/lib/stage";
import { HEAT, heatLevel } from "@/scene/palette";

const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { timeZone: "UTC", ...opts });

function longestStreak(days: Day[]) {
  let best = 0;
  let run = 0;
  for (const [, n] of days) {
    run = n > 0 ? run + 1 : 0;
    best = Math.max(best, run);
  }
  return best;
}

export function Activity({ days }: { days: Day[] }) {
  const first = new Date(`${days[0][0]}T00:00:00Z`).getUTCDay();
  const cells: (Day | null)[] = [...Array<null>(first).fill(null), ...days];
  const weeks = Math.ceil(cells.length / 7);
  const total = days.reduce((a, [, n]) => a + n, 0);
  const busiest = days.reduce((a, b) => (b[1] > a[1] ? b : a));
  // A month label over the first week column that starts in that month.
  const months: { col: number; label: string }[] = [];
  for (let w = 0; w < weeks; w++) {
    const day = cells.slice(w * 7, w * 7 + 7).find(Boolean);
    const label = day && fmt(day[0], { month: "short" });
    if (label && label !== months.at(-1)?.label) months.push({ col: w, label });
  }

  const stats = [
    { value: total.toLocaleString("en-US"), label: "contributions in the last year", tone: "text-accent" },
    { value: String(days.filter(([, n]) => n > 0).length), label: "days with at least one", tone: "text-bone" },
    { value: `${longestStreak(days)}d`, label: "longest streak", tone: "text-bone" },
    { value: String(busiest[1]), label: `on ${fmt(busiest[0], { month: "short", day: "numeric" })}, the busiest day`, tone: "text-bone" },
  ];

  return (
    <Section id="activity" shot="city" className="pb-28 pt-28 md:pb-[50vh] md:pt-40">
      <ActivityScene days={days} />
      <Heading id="activity" index="05" title="Activity" kicker="Live from GitHub" tone="lime" />
      <dl className="grid grid-cols-2 gap-6 bg-ink/85 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <span className={`font-display block text-5xl ${s.tone}`}>{s.value}</span>
              <span className="mt-1 block text-sm text-dust">{s.label}</span>
            </dd>
          </div>
        ))}
      </dl>

      <figure
        className="mt-10 border-2 border-line bg-ink p-4"
        aria-label={`GitHub contribution calendar: ${total} contributions in the last year`}
      >
        <div data-lenis-prevent-horizontal className="overflow-x-auto [scrollbar-width:thin]">
          <div className="min-w-[680px]">
            <div className="label mb-1.5 grid text-[10px] text-dust" style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}>
              {months.map((m) => (
                <span key={m.col} style={{ gridColumnStart: m.col + 1 }} className="whitespace-nowrap">
                  {m.label}
                </span>
              ))}
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-[3px]" style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}>
              {cells.map((c, i) =>
                c ? (
                  <span
                    key={c[0]}
                    title={`${c[1]} on ${fmt(c[0], { month: "short", day: "numeric", year: "numeric" })}`}
                    className="aspect-square"
                    style={{ background: HEAT[heatLevel(c[1])] }}
                  />
                ) : (
                  <span key={`pad-${i}`} className="aspect-square" />
                ),
              )}
            </div>
          </div>
        </div>
        <figcaption className="label mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-dust">
          <a href={profile.links.github} target="_blank" rel="noreferrer" className="hover:text-bone">
            github.com/{profile.handle} · refreshes itself every six hours
          </a>
          <span className="flex items-center gap-1">
            less
            {HEAT.map((c) => (
              <span key={c} className="size-[11px]" style={{ background: c }} />
            ))}
            more
          </span>
        </figcaption>
      </figure>
    </Section>
  );
}
