"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { profile } from "@/content/profile";
import { useStage } from "@/lib/stage";

// Experience and Projects are real pages, so they get real links everywhere, phones included.
const LINKS = [
  { href: "/experience", label: "Experience", section: "experience" },
  { href: "/projects", label: "Projects", section: "projects" },
  { href: "/#about", label: "About", section: "about" },
  { href: "/#contact", label: "Contact", section: "contact" },
];

/** A segmented bar that fills with page progress. Written straight to the DOM every frame. */
function Progress() {
  const fill = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (fill.current) fill.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div aria-hidden className="relative h-[5px] w-full bg-coal">
      <div ref={fill} className="absolute inset-0 origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 calc(100% / 32 - 2px), var(--color-ink) calc(100% / 32 - 2px) calc(100% / 32))",
        }}
      />
    </div>
  );
}

export function Nav() {
  const pathname = usePathname();
  const { section } = useStage();
  const home = pathname === "/";

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b-2 border-line bg-ink">
      <nav aria-label="Primary" className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4 sm:gap-6 md:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="Naman Rusia, home">
          <span className="font-display grid size-8 place-items-center bg-accent text-sm text-ink shadow-[3px_3px_0_0_var(--color-bone)] transition-transform duration-150 ease-(--ease-step) group-hover:-translate-y-0.5">
            NR
          </span>
          <span className="label hidden text-bone lg:inline">{profile.name}</span>
        </Link>

        <ul className="ml-auto flex items-center gap-0.5 sm:gap-1">
          {LINKS.map((l, i) => {
            // Sections can hold several scenes (about-story, about-cube); the prefix names the section.
            const active = home ? section.split("-")[0] === l.section : pathname.startsWith(l.href);
            return (
              <li key={l.href} className={i > 1 ? "max-sm:hidden" : ""}>
                <Link
                  href={l.href}
                  aria-current={active ? (home ? "location" : "page") : undefined}
                  className={`label block px-2 py-1.5 transition-colors sm:px-2.5 ${active ? "bg-bone text-ink" : "text-dust hover:text-bone"}`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <a
          href={profile.resume}
          target="_blank"
          className="label border-2 border-bone px-2.5 py-1 text-bone shadow-[3px_3px_0_0_var(--color-accent)] transition-transform hover:-translate-x-px hover:-translate-y-px active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          Resume
        </a>
      </nav>
      <Progress />
    </header>
  );
}
