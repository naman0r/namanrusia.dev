"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { emit, prefersReducedMotion, setScroller, stage, type ShotId } from "@/lib/stage";

type Section = { id: string; shot: ShotId; top: number; height: number };

/**
 * Owns smooth scrolling and turns section geometry into the continuous shot position the
 * scene reads. Sections opt in with `data-shot`.
 */
export function ScrollStage() {
  const pathname = usePathname();

  useEffect(() => {
    const lenis = prefersReducedMotion() ? null : new Lenis({ autoRaf: true, anchors: { offset: -72 }, lerp: 0.11 });
    setScroller(lenis ? (el) => lenis.scrollTo(el, { offset: -72, duration: 1.4 }) : null);

    let sections: Section[] = [];

    const update = () => {
      if (!sections.length) return;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const last = sections.length - 1;

      // Hold each shot while its section fills the screen; morph while the next section
      // rises from the bottom of the viewport to 20% from the top.
      let position = last;
      for (let i = 0; i < last; i++) {
        const holdEnd = Math.max(sections[i].top - 0.2 * vh, sections[i].top + sections[i].height - vh);
        const nextStart = sections[i + 1].top - 0.2 * vh;
        if (y < holdEnd) {
          position = i;
          break;
        }
        if (y < nextStart) {
          position = i + (y - holdEnd) / Math.max(1, nextStart - holdEnd);
          break;
        }
      }
      // A short last section can't reach its hold, so the bottom of the page finishes the morph.
      if (last > 0 && y >= document.documentElement.scrollHeight - vh - 2) position = last;
      stage.position = position;

      const probe = y + vh * 0.4;
      let active = 0;
      sections.forEach((s, i) => {
        if (probe >= s.top) active = i;
        stage.locals[i] = Math.min(1, Math.max(0, (y + vh * 0.5 - s.top) / s.height));
      });
      const s = sections[active];

      if (position > last - 0.05 && stage.burst === 0) stage.burst = performance.now();
      if (position < last - 0.6) stage.burst = 0;

      if (stage.section !== s.id) {
        stage.section = s.id;
        emit();
      }
    };

    const measure = () => {
      sections = [...document.querySelectorAll<HTMLElement>("[data-shot]")].map((el) => {
        const r = el.getBoundingClientRect();
        return { id: el.id, shot: el.dataset.shot as ShotId, top: r.top + window.scrollY, height: r.height };
      });
      stage.shots = sections.length ? sections.map((s) => s.shot) : ["lost"];
      stage.locals.length = sections.length;
      update();
    };

    const onPointer = (e: PointerEvent) => {
      stage.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      stage.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    measure();
    // Section heights change as fonts, images and data load.
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    if (lenis) lenis.on("scroll", update);
    else window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("pointermove", onPointer);
      lenis?.destroy();
      setScroller(null);
    };
  }, [pathname]);

  return null;
}
