"use client";

import { useEffect, useRef, useState } from "react";
import { stage, type CubePhase } from "@/lib/stage";

const fmt = (ms: number) => {
  const s = ms / 1000;
  return `${Math.floor(s / 60)}:${(s % 60).toFixed(2).padStart(5, "0")}`;
};

/** A speedcubing timer wired to the About cube: scramble it, then time the solve. */
export function CubeTimer() {
  const [phase, setPhase] = useState<CubePhase>("solved");
  const [solvedIn, setSolvedIn] = useState<number | null>(null);
  const display = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const c = stage.cube;
      setPhase(c.phase);
      if (c.phase === "solved" && c.solveEnd > c.solveStart) setSolvedIn(c.solveEnd - c.solveStart);
      if (display.current)
        display.current.textContent = fmt(
          c.phase === "solving" ? performance.now() - c.solveStart : Math.max(0, c.solveEnd - c.solveStart),
        );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const busy = phase === "scrambling" || phase === "solving";
  const status = {
    solved:
      solvedIn === null
        ? "I can solve one in under 30 seconds. Scramble it and see how fast the site does."
        : `Solved in ${(solvedIn / 1000).toFixed(2)}s. It cheats: it plays the scramble backwards. Done properly, mine is under 30.`,
    scrambling: "Scrambling…",
    scrambled: "Scrambled. Your move.",
    solving: "Solving…",
  }[phase];

  return (
    <div className="mt-8 max-w-md border-2 border-bone bg-ink shadow-[6px_6px_0_0_var(--color-accent)]">
      <p className="label flex justify-between bg-bone px-3 py-1 text-[10px] text-ink">
        <span>Speedcube timer</span>
        <span>3x3</span>
      </p>
      <div className="p-4">
        <span ref={display} className="font-display block text-5xl tabular-nums text-coin">
          0:00.00
        </span>
        <p className="mt-3 min-h-12 text-sm text-dust" aria-live="polite">
          {status}
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={() => (stage.cube.command = phase === "scrambled" ? "solve" : "scramble")}
          className="label mt-4 bg-accent px-4 py-2 text-ink shadow-[3px_3px_0_0_var(--color-bone)] transition-transform hover:-translate-y-px active:translate-y-0.5 active:shadow-none disabled:bg-coal disabled:text-dust disabled:shadow-none"
        >
          {phase === "scrambled" ? "Solve it" : busy ? `${phase}…` : solvedIn === null ? "Scramble it" : "Scramble again"}
        </button>
      </div>
    </div>
  );
}
