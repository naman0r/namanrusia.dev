"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useStage } from "@/lib/stage";

// WebGL has nothing to render on the server, and three.js is the heaviest thing on the page.
const Scene = dynamic(() => import("@/scene/Scene"), { ssr: false });

function hasWebGL() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

/** The fixed canvas behind every page. Loads after first paint so text never waits on three.js. */
export function SceneMount() {
  const [ready, setReady] = useState(false);
  const { section } = useStage();
  // On phones text sits on top of the scene, so it steps back except where the layout leaves it room.
  const titleScreen = usePathname() === "/" && ["", "top", "about-cube", "contact"].includes(section);

  useEffect(() => {
    if (!hasWebGL()) return;
    const start = () => setReady(true);
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(start, { timeout: 1200 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(start, 300);
    return () => clearTimeout(id);
  }, []);

  return (
    <div
      aria-hidden
      className={`scene pointer-events-none fixed inset-0 z-0 transition-opacity duration-700 ${
        ready ? (titleScreen ? "opacity-100" : "opacity-100 max-md:opacity-30") : "opacity-0"
      }`}
    >
      {ready && <Scene />}
    </div>
  );
}
