"use client";

import { CONTENT_PADDING } from "@/components/Sidebar";
import ExperienceTimeline from "./ExperienceTimeline";
import ExperienceBackground from "./ExperienceBackground";

export default function Experience() {
  const contentPadding = `px-6 ${CONTENT_PADDING} lg:pr-12`;

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
