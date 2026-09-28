"use client";

import Image from "next/image";
import Link from "next/link";
import { projects, type Project } from "@/content/projects";
import { stage } from "@/lib/stage";
import { PixelPlaceholder } from "./PixelPlaceholder";
import { StatusTag } from "./StatusTag";

/** A featured project: its demo or screenshot beside the pitch. Hovering swings its cartridge forward. */
export function ProjectCard({ project: p }: { project: Project }) {
  const hover = (on: boolean) => () => (stage.hoveredProject = on ? projects.indexOf(p) : -1);
  return (
    <Link
      href={`/projects/${p.slug}`}
      onPointerEnter={hover(true)}
      onPointerLeave={hover(false)}
      onFocus={hover(true)}
      onBlur={hover(false)}
      className="group grid border-2 border-line bg-ink transition-[border-color,box-shadow] hover:border-bone hover:shadow-[6px_6px_0_0_var(--card-color)] sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
      style={{ "--card-color": p.color } as React.CSSProperties}
    >
      <div className="relative aspect-[16/10] overflow-hidden border-line bg-coal max-sm:border-b-2 sm:border-r-2">
        {p.video ? (
          <video src={p.video} poster={p.image} autoPlay muted loop playsInline className="size-full object-cover" aria-hidden />
        ) : p.image ? (
          <Image src={p.image} alt="" fill sizes="(min-width: 640px) 320px, 100vw" className="object-cover object-top" />
        ) : (
          <PixelPlaceholder seed={p.slug} color={p.color} label={p.title} />
        )}
      </div>
      <div className="flex flex-col p-5">
        <p className="label flex items-center gap-3 text-[10px] text-dust">
          <StatusTag status={p.status} />
          {p.period}
        </p>
        <h3 className="font-display mt-3 text-2xl text-bone md:text-3xl">{p.title}</h3>
        <p className="mt-2 text-bone/85">{p.tagline}</p>
        <p className="label mt-auto flex items-center justify-between gap-4 pt-4 text-[10px] normal-case tracking-normal text-dust">
          <span className="truncate">{p.stack.slice(0, 4).join(" / ")}</span>
          <span aria-hidden className="text-sm text-bone transition-transform duration-150 ease-(--ease-step) group-hover:translate-x-1">
            →
          </span>
        </p>
      </div>
    </Link>
  );
}
