"use client";

import Link from "next/link";
import type { Project } from "@/content/projects";
import { stage } from "@/lib/stage";

/** The lead project as a cartridge with its demo loop for label art. It is cartridge 0 in the ring. */
export function HeroCartridge({ project: p }: { project: Project }) {
  return (
    <Link
      href={`/projects/${p.slug}`}
      className="group block lg:col-span-7"
      aria-label={`${p.title} project page`}
      onPointerEnter={() => (stage.hoveredProject = 0)}
      onPointerLeave={() => (stage.hoveredProject = -1)}
    >
      <div className="border-2 border-bone bg-ink shadow-[8px_8px_0_0_var(--color-accent)] transition-transform duration-150 ease-(--ease-step) group-hover:-translate-x-1 group-hover:-translate-y-1">
        <div className="label flex items-center justify-between border-b-2 border-bone bg-bone px-3 py-1.5 text-[10px] text-ink">
          <span>{p.title}</span>
          <span>Insert ▸</span>
        </div>
        <video
          src={p.video}
          poster={p.image}
          autoPlay
          muted
          loop
          playsInline
          className="block aspect-[2/1] w-full bg-coal object-cover"
          aria-label={`${p.title} demo loop`}
        />
      </div>
    </Link>
  );
}
