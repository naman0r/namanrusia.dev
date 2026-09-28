"use client";

import { useEffect, useState } from "react";
import { heroLinks, profile } from "@/content/profile";

// Hand-drawn 12x12 pixel icons; "#" is a filled pixel.
const ICONS = {
  mail: [
    "............",
    "############",
    "##........##",
    "#.#......#.#",
    "#..#....#..#",
    "#...#..#...#",
    "#....##....#",
    "#..........#",
    "#..........#",
    "############",
  ],
  doc: [
    ".#######....",
    ".#.....##...",
    ".#.....#.#..",
    ".#.....####.",
    ".#.##.##..#.",
    ".#........#.",
    ".#.######.#.",
    ".#........#.",
    ".#.######.#.",
    ".#........#.",
    ".##########.",
  ],
  github: [
    "............",
    "..#......#..",
    "..##....##..",
    "..########..",
    ".##########.",
    ".###.##.###.",
    ".###.##.###.",
    ".##########.",
    "..########..",
    "...#.##.#...",
    "...#....#...",
  ],
  linkedin: [
    "############",
    "#..........#",
    "#.##.......#",
    "#..........#",
    "#.##.#.###.#",
    "#.##.##..#.#",
    "#.##.#...#.#",
    "#.##.#...#.#",
    "#.##.#...#.#",
    "#..........#",
    "############",
  ],
  x: [
    "............",
    ".##......##.",
    "..##....##..",
    "...##..##...",
    "....####....",
    ".....##.....",
    "....####....",
    "...##..##...",
    "..##....##..",
    ".##......##.",
  ],
};

function PixelIcon({ name }: { name: keyof typeof ICONS }) {
  const d = ICONS[name].flatMap((row, y) => [...row].map((c, x) => (c === "#" ? `M${x} ${y}h1v1h-1z` : ""))).join("");
  return (
    <svg viewBox="0 0 12 12" className="size-4 shrink-0" aria-hidden shapeRendering="crispEdges" fill="currentColor">
      <path d={d} />
    </svg>
  );
}

const TONES = {
  accent: "border-ink bg-accent text-ink shadow-[4px_4px_0_0_var(--color-bone)]",
  bone: "border-ink bg-bone text-ink shadow-[4px_4px_0_0_var(--color-accent)]",
  ghost: "border-bone bg-ink text-bone shadow-[4px_4px_0_0_var(--color-line)] hover:border-accent hover:text-accent",
};

const BUTTON =
  "label inline-flex select-none items-center gap-2.5 border-2 px-4 py-2.5 text-sm transition-[transform,box-shadow] duration-75 hover:-translate-x-px hover:-translate-y-px active:translate-x-1 active:translate-y-1 active:shadow-none";

function Keycap({ k }: { k: string }) {
  return <kbd className="ml-1 hidden border border-current px-1 text-[10px] leading-4 opacity-60 sm:inline-block">{k}</kbd>;
}

/** Copies the email address and tells the title screen, so the E key and the button share feedback. */
export async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email);
    window.dispatchEvent(new Event("nr-copied"));
  } catch {
    location.href = `mailto:${profile.email}`;
  }
}

/** The title screen's controller row: every link has a key, shown as a keycap. */
export function HeroLinks() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let id = 0;
    const onCopied = () => {
      setCopied(true);
      clearTimeout(id);
      id = window.setTimeout(() => setCopied(false), 1800);
    };
    window.addEventListener("nr-copied", onCopied);
    return () => {
      window.removeEventListener("nr-copied", onCopied);
      clearTimeout(id);
    };
  }, []);

  const [resume, ...socials] = heroLinks;
  return (
    <div className="mt-10 flex flex-wrap items-center gap-3">
      <a href={resume.href} target="_blank" aria-keyshortcuts="R" className={`${BUTTON} ${TONES.accent}`}>
        <PixelIcon name="doc" />
        {resume.label}
        <Keycap k="R" />
      </a>
      <button type="button" onClick={copyEmail} aria-keyshortcuts="E" className={`${BUTTON} ${TONES.bone}`}>
        <PixelIcon name="mail" />
        <span aria-live="polite">{copied ? "Copied!" : "Copy email"}</span>
        <Keycap k="E" />
      </button>
      <span className="mx-1 hidden h-8 w-0.5 bg-line sm:block" aria-hidden />
      {socials.map((l) => (
        <a
          key={l.key}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          aria-label={l.label}
          aria-keyshortcuts={l.key.toUpperCase()}
          className={`${BUTTON} ${TONES.ghost}`}
        >
          <PixelIcon name={l.icon} />
          <span className="max-sm:sr-only">{l.label}</span>
          <Keycap k={l.key.toUpperCase()} />
        </a>
      ))}
    </div>
  );
}
