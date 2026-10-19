"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { CARDS, DECK_SIZE, DEFAULT_DECK, H, MAX_ELIXIR, RIVER, W, botStep, createBot, createGame, play, snap, step, type Bot, type CardId, type Game, type Level, type Rarity, type Side } from "@/lib/arena";
import { TILE, absorb, costPop, createView, drawIcon, refuse, render } from "@/lib/arenaDraw";
import { setMuted, sfx, unlockSound } from "@/lib/arenaSound";
import { stage } from "@/lib/stage";

const STEP = 1 / 60;
const LEVELS: Level[] = ["easy", "medium", "hard"];
type Phase = "menu" | "deck" | "countdown" | "play" | "over";
const POOL = (Object.keys(CARDS) as CardId[]).sort((a, b) => CARDS[a].cost - CARDS[b].cost);
const RARITY: Record<Rarity, string> = { common: "#5ec8ff", rare: "#ff7a1a", epic: "#c86bff" };

// Settings live in localStorage; the server renders the defaults and the client swaps in what's saved.
function localStore(key: string) {
  const listeners = new Set<() => void>();
  return {
    subscribe: (cb: () => void) => {
      listeners.add(cb);
      return () => void listeners.delete(cb);
    },
    get: () => localStorage.getItem(key) ?? "",
    server: () => "",
    save: (value: string) => {
      localStorage.setItem(key, value);
      listeners.forEach((f) => f());
    },
  };
}
const deckStore = localStore("bridge-brawl-deck");
// Sound is opt-in: silent until the player turns it on.
const soundStore = localStore("bridge-brawl-sound");
/** A saved deck, or the default if it's missing or stale. */
function parseDeck(raw: string): CardId[] {
  const ids = [...new Set(raw.split(","))].filter((id): id is CardId => id in CARDS);
  return ids.length === DECK_SIZE ? ids : DEFAULT_DECK;
}
const stats = (id: CardId) => {
  const c = CARDS[id];
  if (c.kind === "spell") return `Damage ${c.dmg} · Radius ${c.radius}`;
  const base = `HP ${c.hp} · Damage ${c.dmg}${c.kind === "troop" && c.count > 1 ? ` x${c.count}` : ""}`;
  if (c.kind === "building") return `${base} · Lasts ${c.life}s`;
  return `${base} · ${c.range >= 2 ? `Range ${c.range}` : "Melee"}${c.air ? " · Flying" : ""}`;
};
type Hud = { hand: CardId[]; next: CardId; elixir: number; clock: number; overtime: boolean; double: boolean; crowns: [number, number]; winner: Side | -1 | null };

const hudOf = (g: Game): Hud => ({
  hand: [...g.hand[0]],
  next: g.queue[0][0],
  elixir: Math.floor(g.elixir[0]),
  clock: Math.max(0, Math.ceil(g.clock)),
  overtime: g.phase === "overtime",
  double: g.phase === "overtime" || (g.phase === "play" && g.clock <= 60),
  crowns: [...g.crowns],
  winner: g.winner,
});
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/**
 * Where a card aimed at `at` would land. Past the river it sticks to the bank, so dragging too far
 * keeps a usable ghost instead of losing it.
 */
const aimAt = (g: Game, card: CardId, at: [number, number]) => snap(g, 0, card, ...at) ?? snap(g, 0, card, at[0], Math.max(at[1], RIVER[1] + 0.5));

// Big moments take over the voxel scene behind the page, then hand it back to the arena.
// A cue only gives way to one of equal or higher priority.
const cues = { prio: 0, n: 0, timer: undefined as ReturnType<typeof setTimeout> | undefined };
function cue(sprite: string, side: Side, prio: number, hold?: number) {
  if (stage.cue && prio < cues.prio) return;
  clearTimeout(cues.timer);
  cues.prio = prio;
  stage.cue = { sprite, side, key: ++cues.n };
  if (hold) cues.timer = setTimeout(clearCue, hold);
}
function clearCue() {
  clearTimeout(cues.timer);
  cues.prio = 0;
  stage.cue = null;
}

// The menu shows a fixed seed so the server and client render the same hand.
const PREVIEW = createGame(1);

/** The playground's lane battler: canvas arena, drag-or-tap card hand, elixir bar, and the bot. */
export function Arena() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const handRef = useRef<HTMLDivElement>(null);
  const ghost = useRef<HTMLDivElement>(null);
  const view = useRef<ReturnType<typeof createView>>(null);
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
  const saved = useSyncExternalStore(deckStore.subscribe, deckStore.get, deckStore.server);
  const deck = useMemo(() => parseDeck(saved), [saved]);
  const [draft, setDraft] = useState<CardId[]>(DEFAULT_DECK);
  const [focus, setFocus] = useState<CardId>(DEFAULT_DECK[0]);
  const [dragging, setDragging] = useState<CardId | null>(null);
  const [short, setShort] = useState<{ n: number; key: number } | null>(null);
  const muted = useSyncExternalStore(soundStore.subscribe, soundStore.get, soundStore.server) !== "1";

  useEffect(() => setMuted(muted), [muted]);

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
    const v = (view.current = createView());
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let last = performance.now();
    let idle = 0;
    let acc = 0;
    let raf = 0;
    let key = "";
    let double = false;
    const frame = (now: number) => {
      // Between matches only the scenery moves, so 20fps is plenty and keeps laptops cool.
      if (phaseRef.current !== "play" && phaseRef.current !== "countdown" && now - idle < 50) {
        raf = requestAnimationFrame(frame);
        return;
      }
      idle = now;
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
          if (g.winner === 0) sfx.win();
          else sfx.lose();
          if (g.winner === -1) clearCue();
          else cue("crown", g.winner!, 3);
        }
        const dbl = g.phase === "overtime" || (g.phase === "play" && g.clock <= 60);
        if (dbl && !double) {
          sfx.double();
          cue("drop", 0, 2, 3000);
        }
        double = dbl;
      } else acc = 0;
      for (const e of g.events) {
        if (e.type === "hit" || e.type === "splash" || e.type === "spin") sfx.hit();
        else if (e.type === "boom") sfx.boom();
        else if (e.type === "blast") sfx.blast();
        else if (e.type === "zap" || e.type === "volley") sfx.zap();
        else if (e.type === "tower") sfx.tower();
        if (e.type === "tower") cue("crown", e.side === 0 ? 1 : 0, 2, 3200);
        // The bot's heavy hitters get their moment too; its cheap cycle cards would just be noise.
        else if (e.type === "deploy" && e.side === 1 && CARDS[e.card!].cost >= 5) cue(e.card!, 1, 1, 3000);
      }
      absorb(v, g.events, calm);
      g.events.length = 0;

      const s = selectedRef.current;
      const card = s === null || phaseRef.current !== "play" ? null : g.hand[0][s];
      const at = card && hover.current ? aimAt(g, card, hover.current) : null;
      render(ctx, g, v, dt, acc / STEP, card ? { card, at } : null);

      fill.current!.style.width = `${(g.elixir[0] / MAX_ELIXIR) * 100}%`;
      // Cards read this to fill up as elixir comes in, without a React render per frame.
      handRef.current!.style.setProperty("--elixir", String(g.elixir[0]));
      const h = hudOf(g);
      const k = JSON.stringify(h);
      if (k !== key) {
        key = k;
        setHud(h);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      clearCue();
    };
  }, []);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (count > 0) sfx.tick();
    else sfx.go();
    const id = setTimeout(() => (count === 0 ? setPhase("play") : setCount(count - 1)), count === 0 ? 500 : 700);
    return () => clearTimeout(id);
  }, [phase, count]);

  const start = () => {
    unlockSound();
    clearCue();
    game.current = createGame((Math.random() * 2 ** 31) | 0, deck);
    bot.current = createBot(level);
    select(null);
    setCount(3);
    setPhase("countdown");
  };

  const editDeck = () => {
    setDraft(deck);
    setFocus(deck[0]);
    setPhase("deck");
  };
  const toggle = (id: CardId) => {
    setFocus(id);
    if (draft.includes(id)) setDraft(draft.filter((d) => d !== id));
    else if (draft.length < DECK_SIZE) setDraft([...draft, id]);
    else setNope((n) => n + 1);
  };
  const saveDeck = () => {
    deckStore.save(draft.join(","));
    setPhase("menu");
  };

  /** The tile under a pointer, or null off the arena. Touch aims a little above the finger so it doesn't hide the ghost. */
  const tileAt = (cx: number, cy: number, touch = false): [number, number] | null => {
    const r = canvas.current!.getBoundingClientRect();
    if (cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) return null;
    return [((cx - r.left) / r.width) * W, Math.max(0, ((cy - r.top) / r.height) * H - (touch ? 1.6 : 0))];
  };

  const deploy = (slot: number, at: [number, number]) => {
    const g = game.current;
    const id = g.hand[0][slot];
    const p = aimAt(g, id, at);
    if (!p) {
      refuse(view.current!, ...at);
      sfx.nope();
      return;
    }
    if (g.elixir[0] < CARDS[id].cost) {
      setNope((n) => n + 1);
      setShort({ n: Math.ceil(CARDS[id].cost - g.elixir[0]), key: Date.now() });
      sfx.nope();
      return;
    }
    if (play(g, 0, slot, ...p)) {
      costPop(view.current!, p[0], p[1], CARDS[id].cost);
      sfx.deploy();
      // The Cannon is drawn rather than a sprite, so it has no figure to show.
      if (id !== "cannon") cue(id, 0, 1, 3200);
      select(null);
    }
  };

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = drag.current;
      if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6) d.moved = true;
      const touch = e.pointerType === "touch";
      hover.current = tileAt(e.clientX, e.clientY, touch);
      // The dragged card rides the pointer until it's over the arena, where the in-canvas ghost takes over.
      const gh = ghost.current!;
      gh.style.transform = `translate(${e.clientX}px, ${e.clientY - (touch ? 56 : 0)}px)`;
      gh.style.opacity = d?.moved && !hover.current ? "1" : "0";
    };
    const up = (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      drag.current = null;
      ghost.current!.style.opacity = "0";
      setDragging(null);
      const at = tileAt(e.clientX, e.clientY, e.pointerType === "touch");
      if (at && phaseRef.current === "play") deploy(d.slot, at);
      // A tap on the selected card, or a drag dropped back off the arena, puts the card away.
      else if ((!d.moved && d.toggle) || d.moved) select(null);
      if (e.pointerType !== "mouse") hover.current = null;
    };
    const key = (e: KeyboardEvent) => {
      if (phaseRef.current !== "play" || (e.target as HTMLElement).closest("input, textarea")) return;
      const n = Number(e.key);
      if (n >= 1 && n <= 4) {
        select(selectedRef.current === n - 1 ? null : n - 1);
        sfx.select();
      }
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
    setDragging(game.current.hand[0][slot]);
    sfx.select();
  };

  const preview = phase === "menu" || phase === "deck";
  const hand = preview ? deck.slice(0, 4) : hud.hand;
  const next = preview ? deck[4] : hud.next;
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
            <span className="label text-bone">Deck</span> pick any six cards from the menu.
          </li>
          <li>
            <span className="label text-bone">1-4</span> pick a card, <span className="label text-bone">Esc</span> drops it.
          </li>
        </ul>
      </aside>

      <div className="flex flex-col items-center gap-3 lg:flex-row lg:items-end lg:gap-6">
        {/* The arena takes whatever height is left after the chrome; on phones the hand sits below it. */}
        <div className="flex w-[min(100%,calc((100svh_-_17.5rem)*9/16))] min-w-64 flex-col gap-2 lg:w-[calc((100svh_-_10rem)*9/16)]">
          <div className="flex h-8 items-center justify-between gap-2">
            <div className={`flex items-center gap-2 ${preview ? "invisible" : ""}`}>
              <span className="label whitespace-nowrap text-[#ff8f7a]">Bot · {level}</span>
              <Crowns n={hud.crowns[1]} side={1} />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-pressed={!muted}
                onClick={() => {
                  unlockSound();
                  soundStore.save(muted ? "1" : "");
                }}
                className="label mr-1 whitespace-nowrap text-[10px] text-dust hover:text-bone"
              >
                {muted ? "Sound off" : "Sound on"}
              </button>
              <div className={`flex items-center gap-2 ${preview ? "invisible" : ""}`}>
                {hud.double && phase === "play" && <span className="label animate-[glow_1s_ease-in-out_infinite] whitespace-nowrap bg-[#b79cff] px-1.5 py-0.5 text-[10px] text-ink">2x</span>}
                <span className="label text-dust max-sm:hidden">{hud.overtime ? "Overtime" : "Time"}</span>
                <span className={`font-display min-w-[3.5ch] pt-1 text-right text-2xl ${hud.clock <= 10 && phase === "play" ? "text-[#e8402a]" : "text-bone"}`}>{clock(hud.clock)}</span>
              </div>
            </div>
          </div>
          <div className="relative border-2 border-line bg-coal shadow-[6px_6px_0_0_var(--color-line)]">
            <canvas
              ref={canvas}
              width={W * TILE}
              height={H * TILE}
              role="img"
              aria-label="Arena"
              className={`pixelated block h-auto w-full touch-none select-none ${selected !== null && phase === "play" ? "cursor-crosshair" : ""}`}
              onPointerDown={(e) => {
                const s = selectedRef.current;
                if (s === null || phaseRef.current !== "play") return;
                drag.current = { slot: s, x: e.clientX, y: e.clientY, moved: false, toggle: false };
                hover.current = tileAt(e.clientX, e.clientY, e.pointerType === "touch");
              }}
              onPointerLeave={(e) => {
                if (!drag.current && e.pointerType === "mouse") hover.current = null;
              }}
            />

            {phase !== "menu" && phase !== "deck" && (
              <div className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-2 bg-ink/80 px-1.5 py-1">
                <span className="label text-[10px] text-accent">You</span>
                <Crowns n={hud.crowns[0]} side={0} />
              </div>
            )}

            {phase === "play" && hud.double && (
              <div key={hud.overtime ? "overtime" : "double"} className="pointer-events-none absolute inset-x-0 top-[40%] flex animate-[banner_2.6s_ease-out_forwards] flex-col items-center gap-1 opacity-0">
                <span className={`font-display text-[clamp(2.5rem,11vw,3.5rem)] [text-shadow:3px_3px_0_var(--color-ink)] ${hud.overtime ? "text-coin" : "text-[#b79cff]"}`}>{hud.overtime ? "Overtime" : "2x Elixir"}</span>
                <span className="label bg-ink/80 px-2 py-0.5 text-[10px] text-bone">{hud.overtime ? "Next tower wins" : "Last minute"}</span>
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
                <button type="button" onClick={editDeck} className="group flex flex-col items-center gap-2" aria-label="Edit deck">
                  <span className="flex gap-1">
                    {deck.map((id) => (
                      <span key={id} className="grid h-10 w-8 place-items-center border-2" style={{ borderColor: RARITY[CARDS[id].rarity], background: tint(id) }}>
                        <Icon name={id} className="h-5 w-auto" />
                      </span>
                    ))}
                  </span>
                  <span className="label text-[10px] text-dust group-hover:text-bone">Edit deck</span>
                </button>
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

            {phase === "deck" && (
              <div className="absolute inset-0 flex flex-col gap-3 overflow-y-auto bg-ink/90 p-3 sm:p-4">
                <div className="flex items-baseline justify-between">
                  <h2 className="font-display text-2xl text-bone">Your deck</h2>
                  <span className="label text-[10px] text-dust">
                    <span className={draft.length === DECK_SIZE ? "text-lime" : "text-bone"}>
                      {draft.length}/{DECK_SIZE}
                    </span>
                    {draft.length > 0 && ` · avg ${(draft.reduce((s, id) => s + CARDS[id].cost, 0) / draft.length).toFixed(1)}`}
                  </span>
                </div>
                <div key={nope} className={`grid grid-cols-6 gap-1.5 ${nope ? "animate-[nope_0.3s_ease-in-out]" : ""}`}>
                  {Array.from({ length: DECK_SIZE }, (_, i) => {
                    const id = draft[i];
                    return id ? (
                      <button key={id} type="button" onClick={() => toggle(id)} aria-label={`Remove ${CARDS[id].name}`} className="grid aspect-[4/5] animate-[deal_0.2s_cubic-bezier(0.2,0.9,0.3,1.4)] place-items-center border-2" style={{ borderColor: RARITY[CARDS[id].rarity], background: tint(id) }}>
                        <Icon name={id} className="h-1/2 w-auto" />
                      </button>
                    ) : (
                      <span key={i} className="aspect-[4/5] border-2 border-dashed border-line" />
                    );
                  })}
                </div>
                <div className="min-h-[3.25rem] border-l-2 pl-2" style={{ borderColor: RARITY[CARDS[focus].rarity] }}>
                  <p className="label text-[11px] text-bone">
                    {CARDS[focus].name} <span style={{ color: RARITY[CARDS[focus].rarity] }}>· {CARDS[focus].rarity}</span>
                  </p>
                  <p className="text-xs leading-snug text-dust">{CARDS[focus].blurb}</p>
                  <p className="label text-[9px] text-dust">{stats(focus)}</p>
                </div>
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2 lg:grid-cols-6">
                  {POOL.map((id) => {
                    const c = CARDS[id];
                    const on = draft.includes(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={on}
                        aria-label={`${c.name}, ${c.cost} elixir`}
                        onClick={() => toggle(id)}
                        onPointerEnter={() => setFocus(id)}
                        onFocus={() => setFocus(id)}
                        className={`relative flex aspect-[4/5] flex-col items-center justify-center gap-1 border-2 transition-transform duration-100 hover:-translate-y-0.5 ${on ? "opacity-40" : ""}`}
                        style={{ borderColor: RARITY[c.rarity], background: tint(id) }}
                      >
                        <Icon name={id} className="h-[46%] w-auto" />
                        <span className="label w-full truncate px-0.5 text-center text-[8px] leading-none text-bone">{c.name}</span>
                        <span className="font-display absolute -left-1.5 -top-1.5 grid h-5 w-5 place-items-center border-2 border-ink bg-[#b79cff] pt-0.5 text-xs text-ink">{c.cost}</span>
                        {on && <span className="label absolute inset-x-0 bottom-1/2 translate-y-1/2 bg-ink py-0.5 text-center text-[8px] text-lime">In deck</span>}
                      </button>
                    );
                  })}
                </div>
                <div className="sticky bottom-0 -mx-3 mt-auto flex justify-between gap-3 bg-ink/95 px-3 py-2 sm:-mx-4 sm:px-4">
                  <button type="button" onClick={() => setDraft(DEFAULT_DECK)} className="label border-2 border-line px-3 py-2 text-dust hover:border-bone hover:text-bone">
                    Default
                  </button>
                  <button
                    type="button"
                    onClick={saveDeck}
                    disabled={draft.length !== DECK_SIZE}
                    className="font-display bg-accent px-5 pb-1.5 pt-2.5 text-xl text-ink shadow-[3px_3px_0_0_var(--color-bone)] enabled:hover:-translate-y-px enabled:active:translate-y-px enabled:active:shadow-none disabled:opacity-40"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {phase === "countdown" && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/30">
                <span key={count} className="font-display animate-[deal_0.35s_cubic-bezier(0.2,0.9,0.3,1.4)] text-[clamp(4rem,22vw,7rem)] text-bone [text-shadow:4px_4px_0_var(--color-accent)]">
                  {count > 0 ? count : "Brawl!"}
                </span>
              </div>
            )}

            {phase === "over" && (
              <div role="status" className="absolute inset-0 flex animate-[deal_0.35s_cubic-bezier(0.2,0.9,0.3,1.2)] flex-col items-center justify-center gap-5 bg-ink/80 px-6 text-center">
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
                  <button type="button" onClick={() => {
                      clearCue();
                      setPhase("menu");
                    }} className="label border-2 border-line px-4 text-bone hover:border-bone">
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
            <div key={nope} className={`relative h-4 flex-1 border-2 border-ink bg-ink outline-2 outline-line ${nope ? "animate-[nope_0.3s_ease-in-out]" : ""}`}>
              {short && (
                <span key={short.key} className="label pointer-events-none absolute -top-7 left-1/2 z-10 -translate-x-1/2 animate-[toast_1.1s_ease-out_forwards] whitespace-nowrap bg-ink px-1.5 py-0.5 text-[10px] text-[#b79cff] opacity-0">
                  Need {short.n} more
                </span>
              )}
              <div ref={fill} className={`absolute inset-y-0 left-0 bg-[#b79cff] ${hud.double && phase === "play" ? "animate-[glow_1s_ease-in-out_infinite]" : ""}`} />
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

          <div ref={handRef} className="grid grid-cols-[0.7fr_repeat(4,1fr)] items-end gap-2 lg:grid-cols-2 lg:gap-3">
            <div className="flex flex-col items-center gap-1 lg:order-last lg:col-span-2 lg:flex-row lg:gap-3">
              <span className="label text-[9px] text-dust">Next</span>
              <div className="grid aspect-[4/5] w-full place-items-center border-2 border-line bg-ink lg:w-12">
                <Icon key={next} name={next} label={CARDS[next].name} className="h-1/2 w-auto opacity-70" />
              </div>
            </div>
            {hand.map((id, i) => {
              const c = CARDS[id];
              const on = selected === i;
              return (
                <button
                  key={`${i}:${id}`}
                  type="button"
                  aria-label={`${c.name}, ${c.cost} elixir. ${c.blurb}`}
                  aria-pressed={on}
                  disabled={phase !== "play"}
                  onPointerDown={(e) => grab(i, e)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      select(on ? null : i);
                    }
                  }}
                  style={{ borderColor: on ? undefined : RARITY[c.rarity], background: tint(id) }}
                  className={`relative flex aspect-[4/5] animate-[rise_0.3s_cubic-bezier(0.2,0.9,0.3,1.3)] touch-none select-none flex-col items-center justify-center gap-1 overflow-visible border-2 transition-[translate,box-shadow] duration-150 ease-out ${
                    on ? "-translate-y-2 border-bone shadow-[3px_3px_0_0_var(--color-accent)]" : "enabled:hover:-translate-y-0.5"
                  } ${dragging === id && on ? "opacity-60" : ""}`}
                >
                  <Icon name={id} className="h-[48%] w-auto" />
                  <span className="label w-full truncate px-0.5 text-center text-[9px] leading-none text-bone">{c.name}</span>
                  {/* Shade lifts off the card as elixir fills toward its cost. */}
                  <span className="pointer-events-none absolute inset-x-0 top-0 bg-ink/70" style={{ height: `calc((1 - min(1, var(--elixir) / ${c.cost})) * 100%)` }} />
                  <span className="font-display absolute -left-2 -top-2 grid h-6 w-6 place-items-center border-2 border-ink bg-[#b79cff] pt-0.5 text-sm text-ink">{c.cost}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div ref={ghost} aria-hidden className="pointer-events-none fixed left-0 top-0 z-50 opacity-0 transition-opacity duration-100">
        {dragging && (
          <div className="grid h-16 w-[3.25rem] -translate-x-1/2 -translate-y-1/2 rotate-3 place-items-center border-2 shadow-[3px_3px_0_0_var(--color-ink)]" style={{ borderColor: RARITY[CARDS[dragging].rarity], background: tint(dragging) }}>
            <Icon name={dragging} className="h-1/2 w-auto" />
          </div>
        )}
      </div>
    </div>
  );
}

/** A card's face: dark, washed with its rarity color. */
const tint = (id: CardId) => `color-mix(in srgb, ${RARITY[CARDS[id].rarity]} 16%, var(--color-ink))`;

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
