"use client";

import { useEffect, useState } from "react";
import {
  readSidebarExpanded,
  subscribeToSidebarExpandedChange,
} from "@/lib/sidebar";
import ExperienceTimeline from "./ExperienceTimeline";
import ExperienceBackground from "./ExperienceBackground";

export default function Experience() {
  // The sidebar is fixed and overlays the page, so content has to clear it.
  // The mobile/desktop split is pure CSS; only expanded vs collapsed needs state.
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    setSidebarExpanded(readSidebarExpanded(false));
    return subscribeToSidebarExpandedChange(setSidebarExpanded);
  }, []);

  const contentPadding = `px-6 lg:pr-12 ${
    sidebarExpanded ? "lg:pl-[280px]" : "lg:pl-[108px]"
  }`;

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
