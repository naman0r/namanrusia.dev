"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToId } from "@/lib/stage";

/** The arcade "CONTINUE?" countdown. It only starts once you can see it. */
export function Continue() {
  const [n, setN] = useState(9);
  const [running, setRunning] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setRunning(e.isIntersecting), { threshold: 1 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running || n === 0) return;
    const id = setTimeout(() => setN((v) => v - 1), 1000);
    return () => clearTimeout(id);
  }, [running, n]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => {
        setN(9);
        scrollToId("top");
      }}
      className="group label text-sm text-dust hover:text-bone"
    >
      {n > 0 ? (
        <>
          Continue? <span className="text-accent tabular-nums">{n}</span>
        </>
      ) : (
        <span className="blink text-accent">Insert coin</span>
      )}
      <span className="ml-3 text-xs normal-case tracking-normal text-dust/60 group-hover:text-dust">back to start ↑</span>
    </button>
  );
}
