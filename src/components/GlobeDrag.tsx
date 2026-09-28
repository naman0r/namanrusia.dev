"use client";

import { useRef } from "react";
import { stage } from "@/lib/stage";

/**
 * An invisible handle over the title-screen globe. Dragging spins it; a flick keeps it coasting.
 * Vertical swipes on phones still scroll the page (touch-action: pan-y).
 */
export function GlobeDrag() {
  const last = useRef<{ x: number; y: number } | null>(null);
  const release = () => {
    last.current = null;
    stage.globe.dragging = false;
  };

  return (
    <div
      aria-hidden
      className="group absolute right-0 top-14 h-[42svh] w-full cursor-grab touch-pan-y active:cursor-grabbing md:top-0 md:h-full md:w-[46%]"
      onPointerDown={(e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        last.current = { x: e.clientX, y: e.clientY };
        stage.globe.dragging = true;
      }}
      onPointerMove={(e) => {
        if (!last.current) return;
        stage.globe.dx += e.clientX - last.current.x;
        stage.globe.dy += e.clientY - last.current.y;
        last.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <span className="label absolute right-4 top-3 text-[10px] text-dust opacity-70 transition-opacity group-active:opacity-0 md:bottom-48 md:right-8 md:top-auto">
        ⟲ drag to spin
      </span>
    </div>
  );
}
