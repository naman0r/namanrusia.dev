"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BatteryMedium, Moon, Sun, Wifi } from "lucide-react";
import Window from "./Window";
import Folder from "./Folder";

// Edit this list. src is any image under public/, name is the caption under the window.
// dx is the window's left edge in px from the hero's center (so windows hug the copy at any
// width instead of drifting over it), y is percent of the hero, w is width in px, ratio is w/h.
const photos = [
  {
    src: "/more/layla.jpeg",
    name: "layla.jpeg",
    dx: -500,
    y: 5,
    w: 150,
    ratio: "3 / 4",
  },
  {
    src: "/more/mom.jpeg",
    name: "mom.jpeg",
    dx: -330,
    y: 8,
    w: 170,
    ratio: "4 / 3",
  },
  {
    src: "/more/sid2.jpeg",
    name: "sid-again.jpeg",
    dx: -120,
    y: 4,
    w: 160,
    ratio: "4 / 3",
  },
  {
    src: "/more/rank-1-of-521.jpg",
    name: "rank-1-of-521.png",
    dx: 50,
    y: 3,
    w: 250,
    ratio: "2.17 / 1",
  },
  {
    src: "/more/hk.jpeg",
    name: "the-peak.jpeg",
    dx: 500,
    y: 12,
    w: 210,
    ratio: "4 / 3",
  },
  {
    src: "/more/big-buddha.jpg",
    name: "big-buddha.jpg",
    dx: 350,
    y: 37,
    w: 180,
    ratio: "4 / 3",
  },
  {
    src: "/more/IMG_8795.mp4",
    name: "IMG_8795.mov",
    dx: -720,
    y: 38,
    w: 120,
    ratio: "9 / 16",
  },
  {
    src: "/more/dab.jpeg",
    name: "louvre-2016.jpeg",
    dx: -560,
    y: 44,
    w: 130,
    ratio: "9 / 16",
  },
  {
    src: "/more/the-pru.jpeg",
    name: "the-pru.jpeg",
    dx: -700,
    y: 68,
    w: 150,
    ratio: "3 / 4",
  },
  {
    src: "/more/skydiving.jpg",
    name: "13000ft.jpg",
    dx: -20,
    y: 67,
    w: 260,
    ratio: "16 / 7",
  },
  {
    src: "/more/deck-12.jpeg",
    name: "deck-12.jpeg",
    dx: 570,
    y: 70,
    w: 150,
    ratio: "3 / 4",
  },
  {
    src: "/more/strava-harvard-bridge.png",
    name: "long_walks.jpeg",
    dx: 280,
    y: 72,
    w: 250,
    ratio: "16 / 9",
  },
  // Drop the guitar photo into public/more and uncomment.
  // { src: "/more/guitar.jpeg", name: "guitar.jpeg", dx: 120, y: 70, w: 170, ratio: "3 / 4" },
];

// Project icons in public/more/icons, dropped bare on the desk like desktop files.
const icons = [
  {
    src: "/more/icons/dockmaster.png",
    label: "dockmaster",
    dx: -700,
    y: 10,
    w: 72,
  },
  {
    src: "/more/icons/foresight.png",
    label: "foresight",
    dx: -660,
    y: 26,
    w: 60,
  },
  {
    src: "/more/icons/mindfulmomentum.png",
    label: "mindfulmomentum",
    dx: 350,
    y: 8,
    w: 64,
  },
  {
    src: "/more/icons/nutrition.png",
    label: "nutrition",
    dx: 340,
    y: 25,
    w: 64,
  },
  {
    src: "/more/icons/tandemcode.png",
    label: "tandemcode",
    dx: 560,
    y: 58,
    w: 64,
  },
  { src: "/more/icons/sideband.png", label: "sideband", dx: 600, y: 37, w: 60 },
  { src: "/more/icons/bhchp.png", label: "bhchp", dx: 400, y: 64, w: 64 },
  {
    src: "/more/icons/826-boston.png",
    label: "826 boston",
    dx: -210,
    y: 78,
    w: 56,
  },
  {
    src: "/more/icons/car2drvr.png",
    label: "car2drvr",
    dx: -400,
    y: 73,
    w: 150,
  },
];

const elsewhere = [
  { label: "github", href: "https://github.com/naman0r" },
  { label: "linkedin", href: "https://linkedin.com/in/namanrusia" },
  { label: "x (twitter)", href: "https://x.com/namanrusia1" },
];

// 5-row pixel font, folders for pixels. Only the letters the hero needs.
const glyphs: Record<string, string[]> = {
  " ": ["", "", "", "", ""],
  a: [".###", "...#", ".###", "#..#", ".###"],
  b: ["#...", "#...", "###.", "#..#", "###."],
  e: [".##.", "#..#", "####", "#...", ".###"],
  m: ["#####", "#.#.#", "#.#.#", "#.#.#", "#.#.#"],
  n: ["###.", "#..#", "#..#", "#..#", "#..#"],
  o: [".##.", "#..#", "#..#", "#..#", ".##."],
  r: ["#.#", "##.", "#..", "#..", "#.."],
  t: [".#.", "###", ".#.", ".#.", "..#"],
  u: ["#..#", "#..#", "#..#", "#..#", ".###"],
};

function Clock() {
  const [now, setNow] = useState("");
  useEffect(() => {
    const tick = () =>
      setNow(
        new Date()
          .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
          .toLowerCase(),
      );
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{now}</span>;
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const pinned = document.documentElement.dataset.theme;
    setDark(
      pinned
        ? pinned === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches,
    );
  }, []);
  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("more-theme", next);
    setDark(!dark);
  };
  return (
    <button
      onClick={toggle}
      aria-label={dark ? "switch to light mode" : "switch to dark mode"}
      className="text-ink/55 hover:text-ink"
    >
      {dark ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}

function Photo({
  src,
  name,
  ratio,
  sizes = "300px",
  priority = false,
}: {
  src: string;
  name: string;
  ratio: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <>
      <Window>
        <div className="relative" style={{ aspectRatio: ratio }}>
          {src.endsWith(".mp4") ? (
            // A silent looping clip reads as a gif but is a fraction of the size.
            <video
              src={src}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image
              src={src}
              alt=""
              fill
              priority={priority}
              sizes={sizes}
              className="object-cover"
            />
          )}
        </div>
      </Window>
      <p className="mt-2 text-center text-[11px] text-ink/40">{name}</p>
    </>
  );
}

// Starts above the hero copy so a dragged window lands on top of everything.
let topZ = 20;

// A draggable thing on the desk. dx is px from center, y is percent of the hero, w is px.
function Float({
  i,
  dx,
  y,
  w,
  children,
}: {
  i: number;
  dx: number;
  y: number;
  w: number;
  children: React.ReactNode;
}) {
  const [z, setZ] = useState(20);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: 0.15 + i * 0.06,
        duration: 0.5,
        ease: [0.2, 0.7, 0.2, 1],
      }}
      drag
      dragMomentum={false}
      whileDrag={{ scale: 1.03 }}
      onPointerDown={() => setZ(++topZ)}
      className="absolute cursor-grab"
      style={{ left: `calc(50% + ${dx}px)`, top: `${y}%`, width: w, zIndex: z }}
    >
      {children}
    </motion.div>
  );
}

function DesktopIcon({
  src,
  label,
  w,
}: {
  src: string;
  label: string;
  w: number;
}) {
  return (
    <div className="group flex flex-col items-center gap-1.5">
      {/* Plain img: these are tiny PNGs of odd aspect ratios, not worth the optimizer's sizing rules. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        className="h-auto max-w-none select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)]"
        style={{ width: w }}
      />
      <span className="max-w-[9rem] truncate rounded bg-[#1d6ee5] px-1.5 py-0.5 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-100">
        {label}
      </span>
    </div>
  );
}

// Spells a word in folder pixels, with a lone folder as the full stop.
function FolderWord({
  word,
  stop = false,
  className = "",
}: {
  word: string;
  stop?: boolean;
  className?: string;
}) {
  const letters = word.split("").map((c) => glyphs[c]);
  // One blank column between letters. A trailing blank would throw the word off
  // centre, so only the full stop earns the two columns after the last letter.
  const cols =
    letters.reduce((n, g) => n + g[0].length, letters.length - 1) +
    (stop ? 2 : 0);
  const cells: boolean[] = [];
  for (let r = 0; r < 5; r++) {
    letters.forEach((g, i) => {
      g[r].split("").forEach((p) => cells.push(p === "#"));
      if (stop || i < letters.length - 1) cells.push(false);
    });
    if (stop) cells.push(r === 4);
  }
  return (
    <div
      aria-hidden
      className={`grid ${className}`}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {cells.map((on, i) => (
        <div key={i} className="aspect-[64/52]">
          {on && (
            <Folder className="w-full scale-[1.18] drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]" />
          )}
        </div>
      ))}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[12px] tracking-wide text-ink/55">{children}</p>;
}

export default function More() {
  // Scattered windows only make sense with room to scatter; below lg they collapse into a grid.
  // Positions and sizes are tuned for a 1440px desk and scale down with the viewport so narrower
  // windows (a browser with a sidebar, a laptop) see the same layout smaller instead of clipped.
  const [vw, setVw] = useState(0);
  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const isWide = vw >= 1024;
  const scale = Math.min(1, vw / 1440);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-9 items-center justify-between border-b border-ink/5 bg-desk/80 px-5 text-[13px] backdrop-blur">
        <nav className="flex items-center gap-4">
          <a href="#top" className="font-semibold">
            naman rusia
          </a>
          <a
            href="#note"
            className="hidden text-ink/60 hover:text-ink md:inline"
          >
            note
          </a>
        </nav>
        <div className="flex items-center gap-3.5 text-[12px] text-ink/55">
          <Wifi size={14} className="hidden sm:block" />
          <BatteryMedium size={16} className="hidden sm:block" />
          <Clock />
          <ThemeToggle />
          <Link href="/" className="font-medium text-[#0f7fff]">
            rest of the website
          </Link>
        </div>
      </header>

      <section
        id="top"
        className="relative flex min-h-[calc(100vh-2.25rem)] flex-col items-center justify-center overflow-hidden px-6 py-24"
      >
        {isWide &&
          photos.map((p, i) => (
            <Float key={p.name} i={i} dx={p.dx * scale} y={p.y} w={p.w * scale}>
              <Photo {...p} priority />
            </Float>
          ))}
        {isWide &&
          icons.map((ic, i) => (
            <Float
              key={ic.src}
              i={photos.length + i}
              dx={ic.dx * scale}
              y={ic.y}
              w={Math.max(ic.w * scale, 40)}
            >
              <DesktopIcon {...ic} w={Math.round(ic.w * scale)} />
            </Float>
          ))}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <h1 className="flex flex-col items-center">
            <span className="sr-only">more about naman rusia</span>
            <FolderWord
              word="more about"
              className="w-[min(72vw,540px)] lg:w-[min(38vw,540px)]"
            />
            <FolderWord
              word="naman"
              stop
              className="mt-4 w-[min(88vw,660px)] lg:w-[min(46vw,660px)]"
            />
          </h1>
          <p className="mt-6 text-[11px] text-ink/40">
            the not-a-resume page &middot; everything on the desk is draggable
          </p>
        </motion.div>
      </section>

      <section className="grid grid-cols-2 gap-6 px-6 pb-8 lg:hidden">
        {photos.map((p, i) => (
          <div key={p.name}>
            <Photo {...p} sizes="50vw" priority={i < 4} />
          </div>
        ))}
      </section>

      <section className="flex flex-wrap items-end justify-center gap-x-6 gap-y-5 px-6 pb-16 lg:hidden">
        {icons.map((ic) => (
          <DesktopIcon key={ic.src} {...ic} w={Math.min(ic.w, 64)} />
        ))}
      </section>

      <div className="mx-auto max-w-3xl px-6">
        <section id="note" className="scroll-mt-16 py-24">
          <Label>note</Label>
          <Window title="notes" paper className="mt-6 w-full max-w-xl">
            <div className="bg-paper px-7 py-6 text-[16px] leading-relaxed text-ink/80">
              <p className="mb-3">
                hi, i&apos;m naman. this is the part of the internet where i
                don&apos;t have to be employable.
              </p>
              <p className="mb-3">
                grew up between the us, india and singapore. now in boston,
                studying computer science and business. I am constantly building
                and shipping, and I geuinelly love building
              </p>
              <p className="mb-3">
                i like building things end to end, and{" "}
                <mark className="rounded-sm bg-[#feea3d]/70 px-0.5 text-black">
                  i think the best software feels obsessed over.
                </mark>
              </p>
              <p className="mb-3">currently in classes</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src="/profile_pic.jpeg"
                    alt=""
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <div className="leading-tight">
                    <p className="text-[15px] font-medium text-ink">naman,</p>
                    <p className="text-[14px] text-ink/50">student, mostly</p>
                  </div>
                </div>
                <span className="text-[34px] italic leading-none text-ink [font-family:var(--font-instrument-serif)]">
                  naman
                </span>
              </div>
            </div>
          </Window>
        </section>

        <footer className="border-t border-ink/10 py-14">
          <ul className="flex flex-wrap gap-x-7 gap-y-2 text-[14px] text-ink/55">
            {elsewhere.map((p) => (
              <li key={p.label}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink"
                >
                  {p.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/projects" className="hover:text-ink">
                projects
              </Link>
            </li>
            <li>
              <Link href="/experience" className="hover:text-ink">
                experience
              </Link>
            </li>
            <li>
              <a
                href="mailto:rusia.n@northeastern.edu"
                className="hover:text-ink"
              >
                email
              </a>
            </li>
          </ul>
          <p className="mt-10 text-[12px] text-ink/45">
            &copy; naman rusia {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </>
  );
}
