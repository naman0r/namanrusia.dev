"use client";

import { useEffect } from "react";
import { heroLinks } from "@/content/profile";
import { copyEmail } from "./HeroLinks";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export function Shortcuts() {
  useEffect(() => {
    let konami = 0;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input, textarea, [contenteditable], [role='dialog']")) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      konami = e.key === KONAMI[konami] ? konami + 1 : e.key === KONAMI[0] ? 1 : 0;
      if (konami === KONAMI.length) {
        konami = 0;
        document.documentElement.classList.toggle("party");
        return;
      }
      // Single-letter shortcuts only on the title screen, where the keycaps are on show.
      if (location.pathname !== "/" || window.scrollY > window.innerHeight * 0.6) return;
      const key = e.key.toLowerCase();
      if (key === "e") copyEmail();
      const link = heroLinks.find((l) => l.key === key);
      if (link) window.open(link.href, "_blank", "noopener");
    };
    window.addEventListener("keydown", onKey);

    console.log(
      "%c NR %c hi. you opened the console, so you'd probably like the terminal: press ~\n     (and there's a code from 1986 that still works)",
      "background:#4f8bff;color:#0c0b0a;font-weight:bold;padding:2px 4px",
      "color:#eee7d7",
    );
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return null;
}
