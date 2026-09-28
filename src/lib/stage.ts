import { useSyncExternalStore } from "react";

export type ShotId = "globe" | "cube" | "track" | "carts" | "city" | "monogram" | "skyline" | "library" | "monolith" | "lost";

export type Day = [date: string, count: number];

/**
 * Where scroll, hover and pointer state meet the 3D scene. The scene reads the mutable
 * fields every frame; DOM components subscribe to the few that drive UI.
 */
export const stage = {
  /** Shot per `[data-shot]` section on the current page, in scroll order. */
  shots: ["globe"] as ShotId[],
  /** Continuous position through `shots`: 1.4 is 40% of the way from shot 1 to shot 2. */
  position: 0,
  /** 0..1 progress through each `[data-shot]` section, by the viewport's middle. */
  locals: [] as number[],
  section: "",
  pointer: { x: 0, y: 0 },
  /** Index into `projects` of the row or card under the pointer. */
  hoveredProject: -1,
  /** Slug of the project page being viewed, for its cartridge. */
  project: "",
  activeCheckpoint: -1,
  /** performance.now() when the last section was reached, to fire its burst once per visit. */
  burst: 0,
  /** The title-screen globe: pointer drag deltas since the last frame, and the home being pointed at. */
  globe: { dragging: false, dx: 0, dy: 0, hover: -1 },
  /** The GitHub contribution calendar, once the landing page hands it over. */
  days: null as Day[] | null,
  version: 0,
};

const listeners = new Set<() => void>();

export function emit() {
  stage.version++;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

/** Re-renders when the active section or the scene data changes. Returns the live `stage`. */
export function useStage() {
  useSyncExternalStore(
    subscribe,
    () => stage.version,
    () => 0,
  );
  return stage;
}

let scroller: ((el: HTMLElement) => void) | null = null;

export function setScroller(fn: typeof scroller) {
  scroller = fn;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  if (scroller) scroller(el);
  else el.scrollIntoView();
  return true;
}

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
