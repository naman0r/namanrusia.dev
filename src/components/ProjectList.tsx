"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { projects, type Project } from "@/content/projects";
import { stage } from "@/lib/stage";
import { StatusTag } from "./StatusTag";

/**
 * Big rows with a preview that trails the cursor on devices that can hover. Hovering a row also
 * brings that project's cartridge to the front of the scene behind the page.
 */
export function ProjectList({ items }: { items: Project[] }) {
  const [hovered, setHovered] = useState<Project | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const goal = useRef({ x: 0, y: 0 });

  // The preview eases toward the cursor instead of sticking to it. Layout effect, so its first
  // position lands before paint.
  useLayoutEffect(() => {
    if (!hovered) return;
    const at = { ...goal.current };
    let raf = 0;
    const tick = () => {
      at.x += (goal.current.x - at.x) * 0.2;
      at.y += (goal.current.y - at.y) * 0.2;
      if (preview.current) preview.current.style.transform = `translate(${at.x + 28}px, ${at.y}px) translateY(-50%)`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [hovered]);

  useEffect(() => {
    // Items arrive from server components as copies, so match by slug rather than identity.
    stage.hoveredProject = hovered ? projects.findIndex((q) => q.slug === hovered.slug) : -1;
  }, [hovered]);

  return (
    <div
      ref={box}
      className="relative"
      onPointerMove={(e) => {
        const r = box.current!.getBoundingClientRect();
        goal.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      }}
      onPointerLeave={() => setHovered(null)}
    >
      <ol className="border-b-2 border-line">
        {items.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/projects/${p.slug}`}
              onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(p)}
              onFocus={() => setHovered(null)}
              className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1 border-t-2 border-line bg-ink/85 py-5 transition-colors hover:bg-bone hover:text-ink md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_11rem] md:px-3"
            >
              <span className="font-display text-2xl text-bone group-hover:text-ink md:text-3xl">{p.title}</span>
              <span className="col-start-1 text-[15px] text-dust group-hover:text-ink/70 md:col-start-auto">{p.tagline}</span>
              <span className="label col-start-2 row-start-1 flex items-center justify-end gap-3 text-dust group-hover:text-ink md:col-start-auto md:row-start-auto">
                <StatusTag status={p.status} />
                <span className="hidden sm:inline">{Math.floor(p.when)}</span>
                <span aria-hidden className="transition-transform duration-150 ease-(--ease-step) group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {hovered && (hovered.image || hovered.video) && (
        <div
          ref={preview}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-20 hidden w-[340px] border-2 border-bone bg-ink md:block"
          style={{ boxShadow: `6px 6px 0 0 ${hovered.color}` }}
        >
          {hovered.video ? (
            <video src={hovered.video} autoPlay muted loop playsInline className="block aspect-[2/1] w-full object-cover" />
          ) : (
            <Image src={hovered.image!} alt="" width={680} height={400} className="block aspect-[17/10] w-full object-cover object-top" />
          )}
          <p className="label border-t-2 border-bone px-3 py-1.5 text-[10px] text-bone">{hovered.kind}</p>
        </div>
      )}
    </div>
  );
}
