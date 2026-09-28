"use client";

import { homes } from "@/content/profile";
import { stage } from "@/lib/stage";

/** The title screen's character line. Pointing at a place turns the globe to face it. */
export function HomeLine() {
  const place = (i: number, label: string) => (
    <button
      type="button"
      onPointerEnter={() => (stage.globe.hover = i)}
      onPointerLeave={() => (stage.globe.hover = -1)}
      onFocus={() => (stage.globe.hover = i)}
      onBlur={() => (stage.globe.hover = -1)}
      title={homes[i].label}
      className="label text-accent underline decoration-dotted underline-offset-4 hover:text-coin"
    >
      {label}
    </button>
  );

  return (
    <p className="label mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-dust md:mb-6">
      <span>Software engineer</span>
      <span className="text-line">/</span>
      {place(3, "Boston, MA")}
      <span className="text-line">/</span>
      <span>
        Grew up in {place(1, "India")} + {place(2, "Singapore")}
      </span>
    </p>
  );
}
