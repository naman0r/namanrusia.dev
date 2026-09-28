import { experience, NOW, roleEnd, TIMELINE_END, TIMELINE_START } from "@/content/experience";

const span = TIMELINE_END - TIMELINE_START;
const pct = (y: number) => `${((y - TIMELINE_START) / span) * 100}%`;

// A tick every January and July inside the window.
const ticks: { y: number; label: string }[] = [];
for (let y = Math.ceil(TIMELINE_START * 2) / 2; y <= TIMELINE_END; y += 0.5) {
  ticks.push({ y, label: `${y % 1 ? "Jul" : "Jan"} ${String(Math.floor(y)).slice(2)}` });
}

/** Every role on its org's lane. Each lane links down to that org's entry. */
export function Gantt() {
  return (
    <figure className="border-2 border-line bg-ink p-4 md:p-5" aria-label="Timeline of every role">
      <div className="label relative ml-[92px] h-5 text-[10px] text-dust md:ml-[148px]">
        {ticks.map((t, i) => (
          <span key={t.label} className={`absolute -translate-x-1/2 ${i % 2 ? "max-sm:hidden" : ""}`} style={{ left: pct(t.y) }}>
            {t.label}
          </span>
        ))}
      </div>
      <div className="relative">
        {experience.map((org) => (
          <a key={org.id} href={`#${org.id}`} className="group flex h-7 items-center">
            <span className="label w-[92px] shrink-0 truncate pr-3 text-[10px] text-dust group-hover:text-bone md:w-[148px]">
              {org.org}
            </span>
            <span className="relative h-full flex-1 border-l border-line">
              {org.roles.map((r) => (
                <span
                  key={r.title}
                  title={`${org.org}: ${r.title}, ${r.period}`}
                  className="absolute top-1/2 h-3 -translate-y-1/2 border border-ink transition-[height] group-hover:h-4"
                  style={{
                    left: pct(r.start),
                    width: `calc(${pct(roleEnd(r))} - ${pct(r.start)})`,
                    background: org.color,
                    opacity: 0.35 + 0.65 / org.roles.length,
                  }}
                />
              ))}
            </span>
          </a>
        ))}
        <div className="pointer-events-none absolute inset-y-0 left-[92px] right-0 md:left-[148px]">
          <div className="absolute inset-y-0 w-0 border-l-2 border-dashed border-accent" style={{ left: pct(Math.min(NOW, TIMELINE_END)) }}>
            <span className="label absolute -top-1 right-1.5 whitespace-nowrap bg-accent px-1 text-[9px] text-ink">Now</span>
          </div>
        </div>
      </div>
    </figure>
  );
}
