"use client";

import Image from "next/image";
import { useRef } from "react";
import { photos } from "@/content/profile";
import { stage } from "@/lib/stage";

const HEIGHT = 260;

/**
 * Polaroids in a sideways strip. A mouse can grab and drag it; touch and trackpads scroll it
 * natively. Pointing at a photo (or tapping it) tells the scene which one to rebuild.
 */
export function PhotoStrip() {
  const strip = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);

  return (
    <ul
      ref={strip}
      data-lenis-prevent-horizontal
      className="-mx-4 flex cursor-grab snap-x gap-5 overflow-x-auto px-4 pb-8 pt-2 [scrollbar-width:none] active:cursor-grabbing md:-mx-8 md:px-8"
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse" || !strip.current) return;
        drag.current = { x: e.clientX, left: strip.current.scrollLeft };
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d || !strip.current) return;
        strip.current.scrollLeft = d.left - (e.clientX - d.x);
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerLeave={(e) => {
        drag.current = null;
        if (e.pointerType === "mouse") stage.photo = -1;
      }}
      onDragStart={(e) => e.preventDefault()}
    >
      {photos.map((p, i) => (
        <li
          key={p.src}
          onPointerEnter={(e) => e.pointerType === "mouse" && (stage.photo = i)}
          onClick={() => (stage.photo = i)}
          className={`shrink-0 snap-start bg-bone p-2 pb-0 shadow-[6px_6px_0_0_var(--color-coal)] transition-transform duration-150 ease-(--ease-step) hover:-translate-y-1 hover:rotate-0 ${
            i % 3 === 0 ? "-rotate-2" : i % 3 === 1 ? "rotate-1" : "-rotate-1"
          }`}
        >
          <Image
            src={p.src}
            alt={p.alt}
            width={Math.round((p.w / p.h) * HEIGHT)}
            height={HEIGHT}
            sizes={`${Math.round((p.w / p.h) * HEIGHT)}px`}
            className="block h-[200px] w-auto object-cover md:h-[260px]"
            draggable={false}
          />
          <p className="label py-2 text-[11px] normal-case tracking-normal text-ink">{p.name}</p>
        </li>
      ))}
    </ul>
  );
}
