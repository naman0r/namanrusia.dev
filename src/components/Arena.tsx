"use client";

import { useEffect, useRef, useState } from "react";
import { CARDS, H, MAX_ELIXIR, W, botStep, createBot, createGame, play, snap, step, type Bot, type CardId, type Game, type Level, type Side } from "@/lib/arena";
import { TILE, absorb, createView, drawIcon, render } from "@/lib/arenaDraw";

const STEP = 1 / 60;
const LEVELS: Level[] = ["easy", "medium", "hard"];
type Phase = "menu" | "countdown" | "play" | "over";
type Hud = { hand: CardId[]; next: CardId; elixir: number; clock: number; overtime: boolean; crowns: [number, number]; winner: Side | -1 | null };

const hudOf = (g: Game): Hud => ({
  hand: [...g.hand[0]],
  next: g.queue[0][0],
  elixir: Math.floor(g.elixir[0]),
  clock: Math.max(0, Math.ceil(g.clock)),
  overtime: g.phase === "overtime",
  crowns: [...g.crowns],
  winner: g.winner,
});
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// The menu shows a fixed seed so the server and client render the same hand.
const PREVIEW = createGame(1);

/** The playground's lane battler: canvas arena, drag-or-tap card hand, elixir bar, and the bot. */
export function Arena() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const game = useRef<Game>(PREVIEW);
  const bot = useRef<Bot>(createBot("medium"));
  const phaseRef = useRef<Phase>("menu");
  const selectedRef = useRef<number | null>(null);
  const hover = useRef<[number, number] | null>(null);
  const drag = useRef<{ slot: number; x: number; y: number; moved: boolean; toggle: boolean } | null>(null);

  const [phase, setPhaseState] = useState<Phase>("menu");
  const [level, setLevel] = useState<Level>("medium");
  const [count, setCount] = useState(3);
  const [selected, setSelectedState] = useState<number | null>(null);
  const [hud, setHud] = useState<Hud>(() => hudOf(PREVIEW));
  const [nope, setNope] = useState(0);

  const setPhase = (p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  };
  const select = (s: number | null) => {
    selectedRef.current = s;
    setSelectedState(s);
  };

  useEffect(() => {
    const ctx = canvas.current!.getContext("2d")!;
    const view = createView();
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last = performance.now();
    let acc = 0;
    let raf = 0;
    let key = "";
    const frame = (now: number) => {
      let dt = (now - last) / 1000;
      last = now;
      // A long gap means the tab was hidden; don't fast-forward the match.
      if (dt > 0.25) dt = 0;
      const g = game.current;
      if (phaseRef.current === "play") {
        acc += dt;
        while (acc >= STEP) {
          botStep(bot.current, g, STEP);
          step(g, STEP);
          acc -= STEP;
        }
        if (g.phase === "over") {
          select(null);
          setPhase("over");
        }
      } else acc = 0;
      absorb(view, g.events, calm);
      g.events.length = 0;

      const s = selectedRef.current;
      const card = s === null || phaseRef.current !== "play" ? null : g.hand[0][s];
      const at = card && hover.current ? snap(g, 0, card, ...hover.current) : null;
      render(ctx, g, view, dt, acc / STEP, card ? { card, at } : null);

      fill.current!.style.width = `${(g.elixir[0] / MAX_ELIXIR) * 100}%`;
      const h = hudOf(g);
      const k = JSON.stringify(h);
      if (k !== key) {
        key = k;
        setHud(h);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (phase !== "countdown") return;
    const id = setTimeout(() => (count === 0 ? setPhase("play") : setCount(count - 1)), count === 0 ? 500 : 700);
    return () => clearTimeout(id);
  }, [phase, count]);

  const start = () => {
    game.current = createGame((Math.random() * 2 ** 31) | 0);
    bot.current = createBot(level);
    select(null);
    setCount(3);
    setPhase("countdown");
  };

  const tileAt = (cx: number, cy: number): [number, number] | null => {
    const r = canvas.current!.getBoundingClientRect();
    if (cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) return null;
    return [((cx - r.left) / r.width) * W, ((cy - r.top) / r.height) * H];
  };

  const deploy = (slot: number, at: [number, number]) => {
    const g = game.current;
    const id = g.hand[0][slot];
    const p = snap(g, 0, id, ...at);
    if (!p) return;
    if (g.elixir[0] < CARDS[id].cost) {
      setNope((n) => n + 1);
      return;
    }
    if (play(g, 0, slot, ...p)) select(null);
  };

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = drag.current;
      if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6) d.moved = true;
      hover.current = tileAt(e.clientX, e.clientY);
    };
    const up = (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      drag.current = null;
      const at = tileAt(e.clientX, e.clientY);
      if (at && phaseRef.current === "play") deploy(d.slot, at);
      else if (!d.moved && d.toggle) select(null);
      if (e.pointerType !== "mouse") hover.current = null;
    };
    const key = (e: KeyboardEvent) => {
      if (phaseRef.current !== "play" || (e.target as HTMLElement).closest("input, textarea")) return;
      const n = Number(e.key);
      if (n >= 1 && n <= 4) select(selectedRef.current === n - 1 ? null : n - 1);
      if (e.key === "Escape") select(null);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("keydown", key);
    };
    // deploy and tileAt only touch refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grab = (slot: number, e: React.PointerEvent) => {
    if (phaseRef.current !== "play" || e.button > 0) return;
    e.preventDefault();
    drag.current = { slot, x: e.clientX, y: e.clientY, moved: false, toggle: selectedRef.current === slot };
    select(slot);
  };

  const result = hud.winner === 0 ? ["Victory", "text-lime"] : hud.winner === 1 ? ["Defeat", "text-[#e8402a]"] : ["Draw", "text-coin"];

  return (
    <div className="mx-auto flex max-w-[1200px] items-start justify-center gap-12">
      <aside className="hidden w-72 shrink-0 border-2 border-line bg-ink/90 p-6 lg:mt-10 lg:block">
        <p className="label text-dust">
          <span className="text-lime">01</span> · Playground
        </p>
        <h1 className="font-display mt-3 text-6xl text-bone">Bridge Brawl</h1>
        <p className="mt-5 text-dust">A tiny lane battler in the spirit of Clash Royale. Knock down their towers before they knock down yours.</p>
        <ul className="mt-8 space-y-3 text-sm text-dust">
          <li>
            <span className="label text-bone">Drag</span> a card onto your half, or tap it then tap the arena.
          </li>
          <li>
            <span className="label text-bone">Elixir</span> refills over time, twice as fast in the last minute.
          </li>
          <li>
            <span className="label text-bone">Crowns</span> for each tower. The king tower ends it.
          </li>
          <li>
            <span className="label text-bone">1-4</span> pick a card, <span className="label text-bone">Esc</span> drops it.
          </li>
        </ul>
      </aside>

      <div className="flex flex-col items-center gap-3 lg:flex-row lg:items-end lg:gap-6">
        {/* The arena takes whatever height is left after the chrome; on phones the hand sits below it. */}
        <div className="flex w-[min(100%,calc((100svh_-_17.5rem)*9/16))] min-w-64 flex-col gap-2 lg:w-[calc((100svh_-_10rem)*9/16)]">
          <div className={`flex h-8 items-center justify-between gap-2 ${phase === "menu" ? "invisible" : ""}`}>
            <div className="flex items-center gap-2">
              <span className="label text-[#ff8f7a]">Bot · {level}</span>
              <Crowns n={hud.crowns[1]} side={1} />
            </div>
            <div className="flex items-center gap-2">
              {(hud.overtime || hud.clock <= 60) && phase === "play" && <span className="label bg-[#b79cff] px-1.5 py-0.5 text-[10px] text-ink">2x Elixir</span>}
              <span className="label text-dust">{hud.overtime ? "Overtime" : "Time"}</span>
              <span className={`font-display min-w-[3.5ch] pt-1 text-right text-2xl ${hud.clock <= 10 && phase === "play" ? "text-[#e8402a]" : "text-bone"}`}>{clock(hud.clock)}</span>
            </div>
          </div>
          <div className="relative border-2 border-line bg-coal shadow-[6px_6px_0_0_var(--color-line)]">
            <canvas
              ref={canvas}
              width={W * TILE}
              height={H * TILE}
              role="img"
              aria-label="Arena"
              className="pixelated block h-auto w-full touch-none select-none"
              onPointerDown={(e) => {
                const s = selectedRef.current;
                if (s === null || phaseRef.current !== "play") return;
                drag.current = { slot: s, x: e.clientX, y: e.clientY, moved: false, toggle: false };
                hover.current = tileAt(e.clientX, e.clientY);
              }}
              onPointerLeave={(e) => {
                if (!drag.current && e.pointerType === "mouse") hover.current = null;
              }}
            />

            {phase !== "menu" && (
              <div className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-2 bg-ink/80 px-1.5 py-1">
                <span className="label text-[10px] text-accent">You</span>
                <Crowns n={hud.crowns[0]} side={0} />
              </div>
            )}

            {phase === "menu" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-ink/75 px-6 text-center">
                <p className="label text-lime">Playground · 01</p>
                <h2 className="font-display text-[clamp(2.5rem,12vw,3.75rem)] text-bone">
                  Bridge
                  <br />
                  Brawl
                </h2>
                <p className="max-w-[17rem] text-sm text-dust">Take their towers before they take yours. Drag a card onto your half of the arena to play it.</p>
                <div role="radiogroup" aria-label="Difficulty" className="flex border-2 border-line bg-ink">
                  {LEVELS.map((l) => (
                    <button
                      key={l}
                      type="button"
                      role="radio"
                      aria-checked={level === l}
                      onClick={() => setLevel(l)}
                      className={`label px-3 py-2 ${level === l ? "bg-bone text-ink" : "text-dust hover:text-bone"}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={start}
                  className="font-display bg-accent px-7 pb-2 pt-3 text-2xl text-ink shadow-[3px_3px_0_0_var(--color-bone)] hover:-translate-y-px active:translate-y-px active:shadow-none"
                >
                  Play
                </button>
              </div>
            )}

            {phase === "countdown" && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/30">
                <span key={count} className="font-display animate-[deal_0.25s_steps(4)] text-[clamp(4rem,22vw,7rem)] text-bone [text-shadow:4px_4px_0_var(--color-accent)]">
                  {count > 0 ? count : "Brawl!"}
                </span>
              </div>
            )}

            {phase === "over" && (
              <div role="status" className="absolute inset-0 flex animate-[deal_0.3s_steps(4)] flex-col items-center justify-center gap-5 bg-ink/80 px-6 text-center">
                <p className="label text-dust">Bot · {level}</p>
                <h2 className={`font-display text-[clamp(3rem,14vw,4.5rem)] ${result[1]}`}>{result[0]}</h2>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center gap-1">
                    <span className="label text-[10px] text-accent">You</span>
                    <Crowns n={hud.crowns[0]} side={0} big />
                  </div>
                  <span className="font-display text-2xl text-dust">vs</span>
                  <div className="flex flex-col items-center gap-1">
                    <span className="label text-[10px] text-[#ff8f7a]">Bot</span>
                    <Crowns n={hud.crowns[1]} side={1} big />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={start}
                    className="font-display bg-accent px-5 pb-1.5 pt-2.5 text-xl text-ink shadow-[3px_3px_0_0_var(--color-bone)] hover:-translate-y-px active:translate-y-px active:shadow-none"
                  >
                    Rematch
                  </button>
                  <button type="button" onClick={() => setPhase("menu")} className="label border-2 border-line px-4 text-bone hover:border-bone">
                    Menu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex w-[min(100%,calc((100svh_-_17.5rem)*9/16))] min-w-64 flex-col gap-3 lg:w-52 lg:border-2 lg:border-line lg:bg-ink/90 lg:p-4">
          <div className="flex items-center gap-2">
            <div className="relative grid h-8 w-8 shrink-0 place-items-center">
              <Icon name="drop" className="absolute inset-0 h-full w-full" />
              <span className="font-display relative pt-1 text-base text-ink">{hud.elixir}</span>
            </div>
            <div key={nope} className={`relative h-4 flex-1 border-2 border-ink bg-ink outline-2 outline-line ${nope ? "animate-[nope_0.3s_steps(6)]" : ""}`}>
              <div ref={fill} className="absolute inset-y-0 left-0 bg-[#b79cff]" />
              <div className="absolute inset-0 grid grid-cols-10">
                {Array.from({ length: 10 }, (_, i) => (
                  <span key={i} className="border-r-2 border-ink last:border-0" />
                ))}
              </div>
            </div>
            <span className="sr-only" aria-live="polite">
              {hud.elixir} elixir
            </span>
          </div>

          <div className="grid grid-cols-[0.7fr_repeat(4,1fr)] items-end gap-2 lg:grid-cols-2 lg:gap-3">
            <div className="flex flex-col items-center gap-1 lg:order-last lg:col-span-2 lg:flex-row lg:gap-3">
              <span className="label text-[9px] text-dust">Next</span>
              <div className="grid aspect-[4/5] w-full place-items-center border-2 border-line bg-ink lg:w-12">
                <Icon key={hud.next} name={hud.next} label={CARDS[hud.next].name} className="h-1/2 w-auto opacity-70" />
              </div>
            </div>
            {hud.hand.map((id, i) => {
              const c = CARDS[id];
              const afford = hud.elixir >= c.cost;
              const on = selected === i;
              return (
                <button
                  key={`${i}:${id}`}
                  type="button"
                  aria-label={`${c.name}, ${c.cost} elixir. ${c.blurb}`}
                  aria-pressed={on}
                  title={c.blurb}
                  disabled={phase !== "play"}
                  onPointerDown={(e) => grab(i, e)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      select(on ? null : i);
                    }
                  }}
                  className={`relative flex aspect-[4/5] animate-[deal_0.2s_steps(4)] touch-none select-none flex-col items-center justify-center gap-1 border-2 bg-ink transition-transform duration-100 ${
                    on ? "-translate-y-2 border-bone shadow-[3px_3px_0_0_var(--color-accent)]" : "border-line enabled:hover:-translate-y-0.5 enabled:hover:border-dust"
                  } ${afford ? "" : "grayscale-[0.8] [&>canvas]:opacity-50"}`}
                >
                  <Icon name={id} className="h-[48%] w-auto" />
                  <span className="label w-full truncate px-0.5 text-center text-[9px] leading-none text-bone">{c.name}</span>
                  <span className="font-display absolute -left-2 -top-2 grid h-6 w-6 place-items-center border-2 border-ink bg-[#b79cff] pt-0.5 text-sm text-ink">{c.cost}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon({ name, side = 0, label, className = "" }: { name: CardId | "crown" | "drop"; side?: Side; label?: string; className?: string }) {
  return (
    <canvas
      ref={(c) => {
        if (c) drawIcon(c, name, side);
      }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={!label}
      className={`pixelated ${className}`}
    />
  );
}

function Crowns({ n, side, big }: { n: number; side: Side; big?: boolean }) {
  return (
    <span className="flex gap-1" role="img" aria-label={`${n} crowns`}>
      {[0, 1, 2].map((i) => (
        <Icon key={i} name="crown" side={side} className={`${big ? "h-6" : "h-3.5"} w-auto ${i < n ? "" : "opacity-25 grayscale"}`} />
      ))}
    </span>
  );
}
