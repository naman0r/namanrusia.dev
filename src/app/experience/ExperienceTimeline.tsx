"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AXIS_START,
  AXIS_END,
  NOW,
  groupedByOrg,
  months,
  orgLogos,
  orgSpan,
  roles,
} from "@/lib/experience";
import RoleBody from "./RoleBody";
import EducationCard from "./EducationCard";

const SPAN = AXIS_END - AXIS_START;
const TRACK = 88;
const pct = (n: number) => ((n - AXIS_START) / SPAN) * TRACK;

const idOf = (title: string, period: string) =>
  `${title}-${period}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export default function ExperienceTimeline() {
  const groups = groupedByOrg();
  const [activeId, setActiveId] = useState(
    idOf(roles[0].title, roles[0].period),
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Whichever role is nearest the top of the viewport is the active one, so the
  // overview follows reading position instead of the pointer.
  useEffect(() => {
    const sections = containerRef.current?.querySelectorAll("[data-role-id]");
    if (!sections?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.getAttribute("data-role-id") ?? "");
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <header className="pb-10">
        <h1 className="text-4xl font-light tracking-tight sm:text-5xl">
          Experience
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-6 text-white/40">
          My professional and on-campus experiences
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-14 2xl:grid-cols-[minmax(0,1fr)_19rem]">
        {/* the reading column */}
        <div ref={containerRef}>
          {groups.map((group) => (
            <section key={group.org}>
              {/* the org is the parent, so it outranks the role titles under it */}
              <header className="flex items-center gap-3 pb-4 pt-12">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1.5">
                  <Image
                    src={orgLogos[group.org]}
                    alt=""
                    width={36}
                    height={36}
                    className="h-full w-full object-contain"
                  />
                </span>
                <h2 className="shrink-0 text-[1.25rem] font-light tracking-tight text-[#e9e4da]">
                  {group.org}
                </h2>
                <span aria-hidden className="h-px flex-1 bg-white/[0.12]" />
                {/* only worth showing when it says more than the single role below */}
                {group.roles.length > 1 && (
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-white/30">
                    {orgSpan(group.roles)} · {group.roles.length} roles
                  </span>
                )}
              </header>

              {group.roles.map((role) => {
                const id = idOf(role.title, role.period);
                const on = activeId === id;
                const warm = role.kind === "work";
                return (
                  <article
                    key={id}
                    id={id}
                    data-role-id={id}
                    className={`ml-1 scroll-mt-6 border-l-2 py-4 pl-6 transition-colors ${
                      on
                        ? warm
                          ? "border-[#e2b07a]/70"
                          : "border-[#8fb8dd]/70"
                        : "border-white/[0.08]"
                    }`}
                  >
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
                      {role.period} · {months(role)} mos
                    </p>
                    <RoleBody role={role} />
                  </article>
                );
              })}
            </section>
          ))}
        </div>

        {/* overview: sticky, and the only chart on the page */}
        <aside className="hidden lg:sticky lg:top-12 lg:block lg:self-start">
          <p className="mb-3 font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/30">
            Overview
          </p>

          <div className="relative rounded-lg border border-white/10 bg-white/[0.02] p-3">
            <div className="relative mb-2 h-3">
              {[2025, 2026].map((y) => (
                <span
                  key={y}
                  className="absolute top-0 -translate-x-1/2 font-mono text-[9px] tabular-nums text-white/25"
                  style={{ left: `${pct(y)}%` }}
                >
                  {y}
                </span>
              ))}
            </div>

            {/* bars and the today marker share one positioning context, so a
                bar ending "now" lands exactly on the line */}
            <div className="relative">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 z-10 w-px bg-emerald-400/40"
                style={{ left: `${pct(NOW)}%` }}
              />

              {roles
                .slice()
                .sort((a, b) => b.start - a.start)
                .map((role) => {
                  const id = idOf(role.title, role.period);
                  const on = activeId === id;
                  const warm = role.kind === "work";
                  return (
                    <a
                      key={id}
                      href={`#${id}`}
                      title={`${role.org} — ${role.title}`}
                      className="relative block h-4 rounded transition-colors hover:bg-white/[0.05]"
                    >
                      <span
                        className={`absolute top-1.5 block h-1.5 rounded-full transition-all ${
                          warm ? "bg-[#e2b07a]" : "bg-[#8fb8dd]"
                        } ${on ? "opacity-100" : "opacity-30"}`}
                        style={{
                          left: `${pct(role.start)}%`,
                          width: `${Math.max(pct(role.end) - pct(role.start), 2)}%`,
                        }}
                      />
                      {role.ongoing && (
                        <span
                          aria-hidden
                          className={`absolute top-[0.3rem] z-20 block h-2 w-2 -translate-x-1/2 rounded-full bg-emerald-400 transition-opacity ${
                            on ? "opacity-100" : "opacity-60"
                          }`}
                          style={{ left: `${pct(role.end)}%` }}
                        />
                      )}
                    </a>
                  );
                })}
            </div>
          </div>

          <dl className="mt-3 flex flex-col gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/40">
            <div className="flex items-center gap-2">
              <dt
                aria-hidden
                className="h-1.5 w-5 shrink-0 rounded-full bg-[#e2b07a]"
              />
              <dd>Professional (co-ops and Internships)</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt
                aria-hidden
                className="h-1.5 w-5 shrink-0 rounded-full bg-[#8fb8dd]"
              />
              <dd>On-campus (Student orgs and non profits)</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt aria-hidden className="flex w-5 shrink-0 justify-center">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
              </dt>
              <dd>Ongoing, current</dd>
            </div>
          </dl>

          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-white/20">
            Click a bar to jump
          </p>

          <EducationCard />
        </aside>
      </div>
    </div>
  );
}
