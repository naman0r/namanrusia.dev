"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { experience } from "@/content/experience";
import { about, education, profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { scrollToId } from "@/lib/stage";

type Line = { kind: "in" | "out" | "err" | "accent"; text: string };

// Carried over from the old /terminal page.
const JOKES = [
  "Why don't programmers like nature? It has too many bugs.",
  "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "What do you call 8 hobbits? A hobbyte.",
  "What's the object-oriented way to become wealthy? Inheritance.",
  "Why did the functions stop calling each other? They had too many arguments.",
];

const SECTIONS = ["top", "about", "experience", "projects", "activity", "contact"];

const pick = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)];

const WELCOME: Line[] = [
  { kind: "accent", text: "namanrusia.dev terminal. type 'help' to see what it does." },
  { kind: "out", text: "" },
];

const HELP: [string, string][] = [
  ["whoami", "who is this"],
  ["about", "the short version"],
  ["experience", "every role, one line each"],
  ["projects", "list projects"],
  ["open <slug>", "open a project page"],
  ["goto <section>", SECTIONS.join(" | ")],
  ["education", "school"],
  ["resume", "open the resume"],
  ["contact", "how to reach me"],
  ["funfact", "a random fact about me"],
  ["joke", "a programming joke"],
  ["music", "what's playing"],
  ["coffee", "brew one"],
  ["clear", "clear the screen"],
  ["exit", "close the terminal"],
];

export function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "`" || e.key === "~") && !(e.target as HTMLElement).closest("input, textarea")) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // /terminal redirects to /#terminal, and the 404 page links there too.
  useEffect(() => {
    if (window.location.hash !== "#terminal") return;
    const id = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight });
  }, [lines]);

  function run(raw: string): Line[] {
    const cmd = raw.trim();
    const [head, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(" ");
    const out = (text: string): Line => ({ kind: "out", text });
    switch (head?.toLowerCase()) {
      case "":
        return [];
      case "help":
        return HELP.map(([c, d]) => out(`  ${c.padEnd(16)} ${d}`));
      case "whoami":
        return [out(`${profile.name}, ${profile.location}`), out(profile.thesis)];
      case "about":
        return [out(about.paragraphs[0])];
      case "experience":
      case "exp":
        return [
          ...experience.flatMap((o) => o.roles.map((r) => out(`  ${r.period.padEnd(18)} ${o.org} · ${r.title}`))),
          { kind: "accent", text: "the full log lives at /experience" },
        ];
      case "projects":
      case "ls":
        return [...projects.map((p) => out(`  ${p.slug.padEnd(20)} ${p.tagline}`)), { kind: "accent", text: "try: open tandemcode" }];
      case "open": {
        const p = projects.find((x) => x.slug === arg.toLowerCase());
        if (!p) return [{ kind: "err", text: `no project '${arg}'. try 'projects'.` }];
        router.push(`/projects/${p.slug}`);
        return [out(`opening ${p.title}...`)];
      }
      case "goto":
      case "cd": {
        const id = arg.replace(/^#/, "").toLowerCase();
        if (!SECTIONS.includes(id)) return [{ kind: "err", text: `no section '${arg}'.` }];
        if (pathname !== "/") router.push(`/#${id}`);
        else scrollToId(id);
        return [out(`→ ${id}`)];
      }
      case "education":
        return [
          out(education.degree),
          out(`${education.school}, expected ${education.graduation} · GPA ${education.gpa}`),
          out(education.highSchool),
        ];
      case "resume":
        window.open(profile.resume, "_blank");
        return [out("opening resume.pdf")];
      case "contact":
      case "email":
        return [out(profile.email), out(profile.links.linkedin)];
      case "funfact":
        return [out(pick(about.funFacts))];
      case "joke":
        return [out(pick(JOKES))];
      case "music":
        return [out("Instant Crush - Daft Punk"), out("Album: Random Access Memories")];
      case "coffee":
        return [out("brewing a fresh cup..."), out("favorite brew: black. just black. yea")];
      case "sudo":
        return [{ kind: "err", text: "Nice try! You don't have sudo privileges on this system." }];
      case "rm":
        return [{ kind: "err", text: "Whoa there! Let's not delete everything. This terminal is read-only." }];
      case "konami":
        return [out("↑ ↑ ↓ ↓ ← → ← → b a, outside the terminal.")];
      case "party":
        return [out(document.documentElement.classList.toggle("party") ? "party mode on" : "party mode off")];
      case "clear":
        setLines([]);
        return [];
      case "exit":
        setOpen(false);
        return [];
      default:
        if (cmd.toLowerCase() === "what is the meaning of life") return [out("42. Ah, I see you're a person of culture as well!")];
        return [{ kind: "err", text: `command not found: ${head}. type 'help'.` }];
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Terminal"
      data-lenis-prevent
      className="fixed bottom-4 right-4 z-50 flex h-[min(460px,70svh)] w-[min(640px,calc(100vw-2rem))] flex-col border-2 border-bone bg-ink font-mono text-[13px] leading-relaxed shadow-[6px_6px_0_0_var(--color-accent)]"
    >
      <div className="label flex items-center justify-between border-b-2 border-bone bg-bone px-3 py-1 text-ink">
        <span>guest@namanrusia.dev</span>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close terminal" className="px-1 hover:text-accent">
          [x]
        </button>
      </div>
      <div ref={body} className="flex-1 overflow-y-auto p-3" onClick={() => input.current?.focus()}>
        {lines.map((l, i) => (
          <p
            key={i}
            className={`whitespace-pre-wrap break-words ${l.kind === "err" ? "text-[#ff6b5a]" : l.kind === "accent" ? "text-accent" : l.kind === "in" ? "text-dust" : "text-bone"}`}
          >
            {l.kind === "in" ? `$ ${l.text}` : l.text || " "}
          </p>
        ))}
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const result = run(value);
            if (value.trim().toLowerCase() !== "clear") setLines((ls) => [...ls, { kind: "in", text: value }, ...result]);
            if (value.trim()) setHistory((h) => [value, ...h]);
            setCursor(-1);
            setValue("");
          }}
        >
          <label htmlFor="term-input" className="text-accent">
            $
          </label>
          <input
            id="term-input"
            ref={input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" && history.length) {
                e.preventDefault();
                const next = Math.min(history.length - 1, cursor + 1);
                setCursor(next);
                setValue(history[next]);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const next = cursor - 1;
                setCursor(next);
                setValue(next < 0 ? "" : history[next]);
              }
            }}
            autoComplete="off"
            spellCheck={false}
            className="flex-1 bg-transparent text-bone caret-accent outline-none"
          />
        </form>
      </div>
    </div>
  );
}
