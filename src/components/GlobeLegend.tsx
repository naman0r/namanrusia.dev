"use client";

import { useEffect, useState } from "react";
import { countriesVisited, homes } from "@/content/profile";
import { stage } from "@/lib/stage";

/** The globe's legend: follows its tour of the homes, and pointing at a place flies the globe there. */
export function GlobeLegend() {
  const [focus, setFocus] = useState(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setFocus(stage.globe.focus);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const hold = (i: number) => () => (stage.globe.hover = i);
  const release = () => (stage.globe.hover = -1);

  return (
    <div className="mb-6 flex items-center gap-4 lg:absolute lg:bottom-44 lg:right-8 lg:mb-0 lg:block lg:w-[340px]">
      <p className="label hidden text-dust lg:block">Route so far · lit by the real sun, right now</p>
      <ol className="flex items-center gap-1.5 lg:mt-3">
        {homes.map((h, i) => (
          <li key={h.code} className="flex items-center gap-1.5">
            <button
              type="button"
              onPointerEnter={hold(i)}
              onPointerLeave={release}
              onFocus={hold(i)}
              onBlur={release}
              aria-pressed={focus === i}
              className={`font-display px-2 py-1 text-sm transition-colors ${focus === i ? "bg-accent text-ink" : "bg-coal text-bone hover:bg-line"}`}
            >
              {h.code}
            </button>
            {i < homes.length - 1 && (
              <span aria-hidden className={focus === i + 1 ? "text-accent" : "text-dust"}>
                →
              </span>
            )}
          </li>
        ))}
      </ol>
      <p className="text-sm text-bone lg:mt-2">{homes[focus].label}</p>
      <p className="label mt-1 hidden text-[10px] text-dust lg:block">{countriesVisited} countries visited · one satellite each</p>
    </div>
  );
}
