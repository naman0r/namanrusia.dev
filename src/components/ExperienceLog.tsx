"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { experience, months, orgPeriod, type Track } from "@/content/experience";

const TRACKS: { track: Track; label: string }[] = [
  { track: "work", label: "Internships" },
  { track: "studio", label: "Studio" },
  { track: "campus", label: "Campus" },
];

/** One collapsed headline per org; open one, or all of them, for every role and bullet. */
export function ExperienceLog() {
  const [open, setOpen] = useState<Set<string>>(new Set());

  // Rows on the landing page link here with a hash: open that org and bring it into view.
  useEffect(() => {
    const sync = () => {
      const id = location.hash.slice(1);
      if (!experience.some((o) => o.id === id)) return;
      setOpen((s) => new Set(s).add(id));
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const all = open.size === experience.length;
  const toggle = (id: string, on: boolean) =>
    setOpen((s) => {
      const next = new Set(s);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="label text-dust">Click a team for every role, bullet and stack</p>
        <button
          type="button"
          onClick={() => setOpen(all ? new Set() : new Set(experience.map((o) => o.id)))}
          className="label shrink-0 border-2 border-line px-3 py-1.5 text-bone hover:border-bone"
        >
          {all ? "Collapse all" : "Expand all"}
        </button>
      </div>

      {TRACKS.map(({ track, label }) => (
        <section key={track} className="mb-10">
          <h2 className="label mb-2 text-accent">{label}</h2>
          <ol className="border-2 border-bone bg-ink">
            {experience
              .filter((o) => o.track === track)
              .map((o) => (
                <li key={o.id} id={o.id} className="scroll-mt-24 border-t-2 border-line first:border-t-0">
                  <details open={open.has(o.id)} onToggle={(e) => toggle(o.id, e.currentTarget.open)} className="group">
                    <summary className="grid cursor-pointer list-none grid-cols-[4px_1fr_auto] items-start gap-x-4 px-4 py-4 hover:bg-coal sm:grid-cols-[4px_2.5rem_1fr_auto] [&::-webkit-details-marker]:hidden">
                      <span className="h-full min-h-10 w-1" style={{ background: o.color }} aria-hidden />
                      {o.logo && (
                        <span className="relative hidden size-10 bg-bone sm:block">
                          <Image src={o.logo} alt="" fill sizes="40px" className="object-contain p-1" />
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-baseline gap-x-3">
                          <span className="font-display text-lg text-bone sm:text-xl">{o.org}</span>
                          <span className="label text-[10px] text-dust">
                            {o.location}
                            {o.note && <> · {o.note}</>}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-sm text-bone/80">
                          {o.roles[0].title}
                          {o.roles.length > 1 && <span className="text-dust"> · {o.roles.length} roles</span>}
                        </span>
                        <span className="mt-2 block max-w-2xl text-[15px] leading-snug text-dust">{o.impact}</span>
                      </span>
                      <span className="flex flex-col items-end gap-2 text-right">
                        <span className="label whitespace-nowrap text-[10px] text-bone sm:text-xs">{orgPeriod(o)}</span>
                        <span
                          aria-hidden
                          className="font-display grid size-6 place-items-center border-2 border-line text-sm text-dust group-hover:border-bone group-hover:text-bone"
                        >
                          <span className="inline-block transition-transform group-open:rotate-45">+</span>
                        </span>
                      </span>
                    </summary>

                    <ol className="space-y-6 border-t-2 border-dashed border-line bg-coal/60 px-4 py-5 sm:pl-[calc(4px+2.5rem+3rem)] sm:pr-6">
                      {o.roles.map((r) => (
                        <li key={r.title} className={o.roles.length > 1 ? "border-l-2 border-line pl-4" : ""}>
                          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                            <h3 className="font-semibold text-bone">
                              {r.link ? (
                                <a
                                  href={r.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="decoration-2 underline-offset-4 hover:text-accent hover:underline"
                                >
                                  {r.title} ↗
                                </a>
                              ) : (
                                r.title
                              )}
                            </h3>
                            <span className="label text-[10px] text-dust">
                              {r.period}
                              {r.ongoing ? <span className="ml-2 bg-lime px-1 text-ink">Now</span> : <> · {months(r)} mo</>}
                            </span>
                          </div>
                          <ul className="mt-2 space-y-1.5 text-[15px] leading-relaxed text-bone/80">
                            {r.points.map((p) => (
                              <li
                                key={p}
                                className="relative pl-5 before:absolute before:left-0 before:top-[0.6em] before:size-1.5 before:bg-accent"
                              >
                                {p}
                              </li>
                            ))}
                          </ul>
                          {r.tech.length > 0 && (
                            <ul className="mt-3 flex flex-wrap gap-1.5">
                              {r.tech.map((t) => (
                                <li key={t} className="label border border-line px-1.5 py-0.5 text-[10px] text-dust">
                                  {t}
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ol>
                  </details>
                </li>
              ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
