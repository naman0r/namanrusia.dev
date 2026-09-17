"use client";

import ExperienceTimeline from "./ExperienceTimeline";
import ExperienceBackground from "./ExperienceBackground";

export default function Experience() {
  // The sidebar rail is fixed at 88px and expands as an overlay, so content
  // only ever has to clear the rail.
  const contentPadding = "px-6 lg:pl-[108px] lg:pr-12";

  return (
    <div
      className={`relative min-h-screen bg-black/10 pb-20 pt-12 text-[#e9e4da] transition-[padding] duration-300 ${contentPadding}`}
    >
      <ExperienceBackground />
      <div className="mx-auto max-w-6xl 2xl:max-w-[86rem]">
        <ExperienceTimeline />
      </div>
    </div>
  );
}
