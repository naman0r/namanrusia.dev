"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CtaLink, Heading, Section } from "@/components/Section";
import { experience, orgPeriod } from "@/content/experience";
import { stage } from "@/lib/stage";

/** Headlines only: one row per org. The detail lives on /experience. */
export function Experience() {
  const list = useRef<HTMLOListElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [inView, setInView] = useState(0);
  const active = hovered ?? inView;

  // Without a hover, the row nearest the middle of the screen is the one on the radio.
  useEffect(() => {
    const rows = [...list.current!.querySelectorAll<HTMLElement>("[data-row]")];
    const visible = new Set<number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = Number((e.target as HTMLElement).dataset.row);
          if (e.isIntersecting) visible.add(i);
          else visible.delete(i);
        }
        if (visible.size) setInView(Math.min(...visible));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    stage.activeCheckpoint = active;
    return () => {
      stage.activeCheckpoint = -1;
    };
  }, [active]);

  const org = experience[active];

  return (
    <Section id="experience" shot="track" className="py-28 md:py-40">
      <Heading id="experience" index="02" title="Experience" kicker="Timing tower" href="/experience" cta="Full timeline" />
      <div className="lg:w-[62%]">
        <div className="border-2 border-bone bg-ink shadow-[6px_6px_0_0_var(--color-coal)]">
          <p className="label flex justify-between bg-bone px-4 py-1.5 text-[10px] text-ink">
            <span>Pos · Team · Role</span>
            <span>{experience.length} teams</span>
          </p>
          <ol ref={list} onPointerLeave={() => setHovered(null)}>
            {experience.map((o, i) => {
              const period = orgPeriod(o).replace(/ — /, "–");
              return (
                <li key={o.id} data-row={i} className="border-t-2 border-line first:border-t-0">
                  <Link
                    href={`/experience#${o.id}`}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(i)}
                    onFocus={() => setHovered(i)}
                    className={`grid grid-cols-[2.25rem_4px_1fr] items-center gap-x-3 px-3 py-3 transition-colors sm:grid-cols-[2.75rem_4px_2.25rem_1fr_auto] sm:gap-x-4 sm:px-4 ${
                      active === i ? "bg-coal" : ""
                    }`}
                  >
                    <span className={`font-display text-lg tabular-nums ${active === i ? "text-accent" : "text-bone"}`}>P{i + 1}</span>
                    <span className="h-9 w-1" style={{ background: o.color }} aria-hidden />
                    {o.logo && (
                      <span className="relative hidden size-9 bg-bone sm:block">
                        <Image src={o.logo} alt="" fill sizes="36px" className="object-contain p-1" />
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="font-display block truncate text-[15px] text-bone sm:text-lg">{o.org}</span>
                      <span className="block truncate text-sm text-dust">
                        {o.roles[0].title}
                        {o.roles.length > 1 && <span className="text-bone/60"> · +{o.roles.length - 1} more</span>}
                      </span>
                      <span className="label mt-0.5 block text-[10px] text-dust sm:hidden">{period}</span>
                    </span>
                    <span className="label whitespace-nowrap text-right text-xs text-dust max-sm:hidden">
                      {period}
                      {o.roles.some((r) => r.ongoing) && <span className="ml-2 bg-live px-1 text-ink">Now</span>}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
          <p className="label flex gap-3 border-t-2 border-bone bg-coal px-4 py-3 text-[11px] normal-case tracking-normal">
            <span className="shrink-0 text-accent">Radio · {org.code}</span>
            <span className="text-bone/85">{org.impact}</span>
          </p>
        </div>
        <div className="mt-10">
          <CtaLink href="/experience">Every role, bullet and stack</CtaLink>
        </div>
      </div>
    </Section>
  );
}
