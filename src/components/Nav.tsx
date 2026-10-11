"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { profile } from "@/content/profile";
import { prefersReducedMotion, stage, useStage, type ShotId } from "@/lib/stage";
import { ACCENT, HEAT } from "@/scene/palette";

// Experience and Projects are real pages, so they get real links everywhere, phones included.
const LINKS = [
  { href: "/experience", label: "Experience", section: "experience" },
  { href: "/projects", label: "Projects", section: "projects" },
  { href: "/blog", label: "Writing", section: "blog" },
  { href: "/#about", label: "About", section: "about" },
  { href: "/#contact", label: "Contact", section: "contact" },
];

/** A segmented bar that fills with page progress. Written straight to the DOM every frame. */
function Progress() {
  const fill = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (fill.current) fill.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div aria-hidden className="relative h-[5px] w-full bg-coal">
      <div ref={fill} className="absolute inset-0 origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 calc(100% / 32 - 2px), var(--color-ink) calc(100% / 32 - 2px) calc(100% / 32))",
        }}
      />
    </div>
  );
}

const COLS = 13;
const ROWS = 9;
/** Rows of room above and below the glyph for pixels arcing between shapes. */
const PAD = 2;
/** CSS px per grid cell: a 2px pixel and a 1px gutter. */
const CELL = 3;

const INK: Record<string, string> = {
  b: "#eee7d7",
  s: "#6b6356",
  a: ACCENT,
  d: HEAT[1],
  t: HEAT[3],
  l: HEAT[4],
  y: HEAT[5],
  m: "#4f6b2a",
  g: "#1fbf6a",
  r: "#e8402a",
  o: "#ff7a1a",
  // The rest are the org colors from the experience timeline.
  e: "#3ccf7e",
  v: "#b79cff",
  c: "#5ec8ff",
  p: "#ff8fb8",
  n: "#9fe870",
};

// Experience's timeline: one bar per org, in its color, roughly where it sits in time.
const TIMELINE = [
  "..........bb.",
  "........aaa..",
  "..eeeee......",
  "...yyy.......",
  "...........vv",
  "..ccccccccccc",
  "......rrrrrrr",
  "ppppp........",
  "..nnn........",
];

// One small icon per scene shot, so the bar echoes whatever the big scene is morphing into.
export const SHAPES: Record<ShotId, string[]> = {
  globe: [
    "....aaaaa....",
    "...allaaaa...",
    "..aalllaaaa..",
    "..allllaayyyy",
    "..aayyyyyal..",
    "yyyyllaaaaa..",
    "..aaaallaaa..",
    "...aaalaaa...",
    "....aaaaa....",
  ],
  cube: [
    "......b......",
    "....bbbbb....",
    "..bbbbbbbbb..",
    "abbbbbbbbbbbd",
    "aaabbbbbbbddd",
    "aaaaabbbddddd",
    "aaaaaabdddddd",
    ".aaaaaaddddd.",
    "...aaaaddd...",
  ],
  track: TIMELINE,
  skyline: TIMELINE,
  carts: [
    "..bbbbbbbbb..",
    "..baaaaaaab..",
    "..bayyyyyab..",
    "..bayrrryab..",
    "..baaaaaaab..",
    "..bbbbbbbbb..",
    "..b.b.b.b.b..",
    "...y.y.y.y...",
    ".............",
  ],
  terrain: [
    "..........yy.",
    "..........yy.",
    "....b........",
    "...bmb....b..",
    "..mmmmm..bmb.",
    ".mmgmmmmmmmmm",
    "mmgggmmgggmmm",
    "aaaaaaaaaaaaa",
    "dadaddadaddad",
  ],
  city: [
    ".......y.....",
    "..l....y.....",
    "..l....y..t..",
    "..l.a..y..t..",
    "t.l.a.ty..t.a",
    "t.lda.tyl.tda",
    "tdldaatylatda",
    "tdldaatylatda",
    "sssssssssssss",
  ],
  // Contact's scene spells NR, but the badge beside this already does, so it gets an envelope.
  monogram: [
    "bbbbbbbbbbbbb",
    "baa.......aab",
    "b..aa...aa..b",
    "b....rrr....b",
    "b.....r.....b",
    "b...........b",
    "b.sssss.....b",
    "b.sss.......b",
    "bbbbbbbbbbbbb",
  ],
  library: [
    ".............",
    "....y......a.",
    "..g.y.p..b.a.",
    "a.g.ytp..boa.",
    "arg.ytpl.boav",
    "arg.ytpl.boav",
    "arg.ytpl.boav",
    "arg.ytpl.boav",
    "sssssssssssss",
  ],
  monolith: [
    "..b.........b",
    ".....add.....",
    "b....add.....",
    ".....add..b..",
    ".....add.....",
    ".....add.....",
    ".....add.....",
    "sssssssssssss",
    ".............",
  ],
  folio: [
    "bbbbbbbbb....",
    "baaaaaaab....",
    "bbbbbbbbbs...",
    "bssssssbbs...",
    "bbbbbbbbbss..",
    "bsssssbbbss..",
    "bbbbbbbbbss..",
    ".ssssssssss..",
    "..ssssssssss.",
  ],
  grove: [
    "....lllll....",
    "..lllglllll..",
    ".llglllllgll.",
    ".lllllgllll..",
    "..lll.s.lll..",
    "......s......",
    ".....ss......",
    "......s......",
    "..mmmmmmmmm..",
  ],
  orbit: [
    "......b......",
    "....aaaaa....",
    "...aadaaaa...",
    "bbbbbbbbbbbbb",
    "..aaaaadaaa..",
    "...aaaaaaa...",
    "....aaaaa....",
    ".............",
    "..y..........",
  ],
  rain: [
    "a...b....a...",
    "a...a..b.a..b",
    "a.b.a..a....a",
    "..a....a.b..a",
    "..a.b.....a..",
    "....a..b..a..",
    "....a..a.....",
    "..t..t..t..t.",
    "ddddddddddddd",
  ],
  lost: [
    "....yyyy.....",
    "...yy..yy....",
    ".......yy....",
    "......yy.....",
    ".....yy......",
    ".....yy......",
    ".............",
    ".....yy......",
    ".............",
  ],
};

type Px = [x: number, y: number, r: number, g: number, b: number];

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const lit = Object.fromEntries(
  Object.entries(SHAPES).map(([id, rows]) => {
    const pts = rows.flatMap((row, y) =>
      [...row].flatMap((c, x) => (c === "." ? [] : [[x, y + PAD, ...rgb(INK[c])] as Px])),
    );
    // Pairing pixels in angle order makes every morph swirl instead of sliding sideways.
    const angle = ([x, y]: Px) => Math.atan2(y - PAD - (ROWS - 1) / 2, x - (COLS - 1) / 2);
    return [id, pts.sort((a, b) => angle(a) - angle(b))];
  }),
) as Record<ShotId, Px[]>;
const N = Math.max(...Object.values(lit).map((p) => p.length));
/** Every shape stretched to N pixels; smaller shapes stack a few pixels on one cell. */
const GLYPHS = Object.fromEntries(
  Object.entries(lit).map(([id, pts]) => [id, Array.from({ length: N }, (_, i) => pts[Math.floor((i * pts.length) / N)])]),
) as Record<ShotId, Px[]>;

/**
 * A pixel sprite scrubbed by the same scroll position as the scene: its pixels swarm from one
 * shot's icon to the next, trading colors on the way, with a slow scan across it at rest.
 */
function Sprite() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const dpr = window.devicePixelRatio;
    canvas.width = COLS * CELL * dpr;
    canvas.height = (ROWS + PAD * 2) * CELL * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    const still = prefersReducedMotion();
    // Drawn pixels chase the scrubbed ones, which smooths page changes where shots swap outright.
    const drawn = GLYPHS[stage.shots[0]].map((p) => [...p]);
    let raf = 0;
    const tick = (time: number) => {
      const last = stage.shots.length - 1;
      const i = Math.min(Math.floor(stage.position), last);
      const f = stage.position - i;
      const from = GLYPHS[stage.shots[i]];
      const to = GLYPHS[stage.shots[Math.min(i + 1, last)]];
      const scan = still ? -1 : Math.floor(time / 70) % 50;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let k = 0; k < N; k++) {
        const seed = ((k * 37) % N) / N;
        // Staggered departures, and each pixel arcs up or down on the way.
        const t = Math.min(1, Math.max(0, f * 1.6 - seed * 0.6));
        const e = t * t * (3 - 2 * t);
        const p = drawn[k];
        for (let j = 0; j < 5; j++) {
          const target = from[k][j] + (to[k][j] - from[k][j]) * e + (j === 1 ? Math.sin(Math.PI * t) * (seed * 2 - 1) * 1.8 : 0);
          p[j] += (target - p[j]) * 0.18;
        }
        // The scan lifts each column toward white as it passes.
        const lift = Math.round(p[0]) === scan ? 0.5 : 0;
        const [r, g, b] = [p[2], p[3], p[4]].map((v) => Math.round(v + (255 - v) * lift));
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(Math.round(p[0] * CELL), Math.round(p[1] * CELL), CELL - 1, CELL - 1);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas ref={ref} aria-hidden style={{ width: COLS * CELL, height: (ROWS + PAD * 2) * CELL }} />
  );
}

export function Nav() {
  const pathname = usePathname();
  const { section } = useStage();
  const home = pathname === "/";

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b-2 border-line bg-ink">
      <nav aria-label="Primary" className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4 sm:gap-6 md:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="Naman Rusia, home">
          <span className="font-display grid size-8 place-items-center bg-accent text-sm text-ink shadow-[3px_3px_0_0_var(--color-bone)] transition-transform duration-150 ease-(--ease-step) group-hover:-translate-y-0.5">
            NR
          </span>
          <span className="label hidden text-bone lg:inline">{profile.name}</span>
        </Link>

        {/* Phones have no gap to fill: the badge sits right against the links. */}
        <div className="max-sm:hidden">
          <Sprite />
        </div>

        <ul className="ml-auto flex items-center gap-0.5 sm:gap-1">
          {LINKS.map((l, i) => {
            // Sections can hold several scenes (about-story, about-cube); the prefix names the section.
            const active = home ? section.split("-")[0] === l.section : pathname.startsWith(l.href);
            return (
              <li key={l.href} className={i > 1 ? "max-sm:hidden" : ""}>
                <Link
                  href={l.href}
                  aria-current={active ? (home ? "location" : "page") : undefined}
                  className={`label block px-2 py-1.5 transition-colors sm:px-2.5 ${active ? "bg-bone text-ink" : "text-dust hover:text-bone"}`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <a
          href={profile.resume}
          target="_blank"
          className="label border-2 border-bone px-2.5 py-1 text-bone shadow-[3px_3px_0_0_var(--color-accent)] transition-transform hover:-translate-x-px hover:-translate-y-px active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          Resume
        </a>
      </nav>
      <Progress />
    </header>
  );
}
