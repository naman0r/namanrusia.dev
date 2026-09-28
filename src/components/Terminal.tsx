"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { experience } from "@/content/experience";
import { about, education, profile, skills } from "@/content/profile";
import { projects } from "@/content/projects";
import { scrollToId } from "@/lib/stage";

// Everything below the window chrome is ported from the old site's /terminal: the commands, the
// easter eggs, the number game, the hack sequence and the flip.

type Out =
  | { t: "command"; text: string; guest: string }
  | { t: "output" | "error" | "success" | "system" | "section" | "hack"; text: string }
  | { t: "link"; text: string; url: string }
  | { t: "list"; items: string[] }
  | { t: "table"; rows: [string, string][] }
  | { t: "ascii"; lines: string[] }
  | { t: "progress"; value: number }
  | { t: "commit"; hash: string; date: string; message: string; description: string }
  | { t: "image"; url: string; alt: string };

const ASCII: Record<string, string[]> = {
  name: [
    "  _   _                               _____           _       ",
    " | \\ | |                             |  __ \\         (_)      ",
    " |  \\| | __ _ _ __ ___   __ _ _ __   | |__) |   _ ___ _  __ _ ",
    " | . ` |/ _` | '_ ` _ \\ / _` | '_ \\  |  _  / | | / __| |/ _` |",
    " | |\\  | (_| | | | | | | (_| | | | | | | \\ \\ |_| \\__ \\ | (_| |",
    " |_| \\_|\\__,_|_| |_| |_|\\__,_|_| |_| |_|  \\_\\__,_|___/_|\\__,_|",
  ],
  coffee: ["      ( (    ", "       ) )   ", "    .______.  ", "    |      |] ", "    \\      /  ", "     `----'   "],
  computer: [
    "     .---.         ",
    "     |   |         ",
    "     |   |         ",
    "     |   |.--.     ",
    "     |   |   :     ",
    "     |   |   |     ",
    "     |   |   |     ",
    " ____|   |   |     ",
    "|    |   |   |     ",
    "|____|   |___|     ",
    "     '---'         ",
  ],
};

const JOKES = [
  "Why don't programmers like nature? It has too many bugs.",
  "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "A programmer's wife tells him to go to the store and 'get a gallon of milk, and if they have eggs, get a dozen.' He returns with 13 gallons of milk.",
  "What do you call 8 hobbits? A hobbyte.",
  "What's the object-oriented way to become wealthy? Inheritance.",
  "Why did the functions stop calling each other? They had too many arguments.",
];

const QUOTES: [string, string][] = [
  ["The best way to predict the future is to invent it.", "Alan Kay"],
  ["Code is like humor. When you have to explain it, it's bad.", "Cory House"],
  ["Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", "Martin Fowler"],
  ["First, solve the problem. Then, write the code.", "John Johnson"],
  ["Experience is the name everyone gives to their mistakes.", "Oscar Wilde"],
  ["Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code.", "Dan Salomon"],
  ["It's going to be legen... wait for it... dary! Legendary!", "Barney Stinson, HIMYM"],
  ["Whatever you do in this life, it's not legendary, unless your friends are there to see it.", "Ted Mosby, HIMYM"],
  ["Winners don't make excuses.", "Harvey Specter, Suits"],
  ["Sometimes good guys gotta do bad things to make the bad guys pay.", "Harvey Specter, Suits"],
  ["The only way to do great work is to love what you do.", "Steve Jobs"],
  ["Bazinga!", "Sheldon Cooper, The Big Bang Theory"],
  ["I am the one who knocks.", "Walter White, Breaking Bad"],
];

const FUN_FACTS = [
  "I can crack my neck really loud",
  "I've visited 16+ countries around the world",
  "I can solve a Rubik's cube in under 30 seconds",
  "My favorite programming framework is React",
  "I'm a night owl and do my best coding after midnight",
];

const HACK_STEPS = [
  "Establishing connection to target mainframe...",
  "Bypassing firewall protocols... [Access Granted]",
  "Injecting polymorphic code...",
  "Decrypting secure data streams...",
  "Analyzing vulnerability vectors...",
  "Escalating privileges... [Root Access Achieved]",
  "Downloading confidential files... /data/secrets.zip",
  "Covering tracks... Deleting logs...",
  "Exfiltrating data...",
  "Disconnecting from server...",
];

const SECTIONS = ["top", "about", "experience", "projects", "photos", "activity", "contact"];

const HELP: [string, string][] = [
  ["about", "Learn about me"],
  ["projects", "View my projects"],
  ["open [project]", "Open a project page"],
  ["experience", "Every role, one line each"],
  ["skills", "See my technical skills"],
  ["education", "View my educational background"],
  ["resume", "View my professional resume"],
  ["funfact", "Read a random fun fact about me"],
  ["social", "Get links to my social profiles"],
  ["contact", "Get my contact information"],
  ["goto [section]", SECTIONS.join(" | ")],
  ["date", "Display the current date"],
  ["time", "Display the current time"],
  ["echo [message]", "Display a message"],
  ["change name [name]", "Change your guest name"],
  ["ascii [type]", "Show ASCII art (name, coffee, computer)"],
  ["joke", "Tell a programming joke"],
  ["quote", "Show an inspirational quote"],
  ["game", "Play a number guessing game"],
  ["github", "View my GitHub stats"],
  ["spotify", "See what I'm listening to"],
  ["coffee", "Take a coffee break"],
  ["banner", "Show welcome banner"],
  ["ls", "List directory contents"],
  ["hack", "Run a fake hacking sequence"],
  ["flip", "Flip the terminal upside down"],
  ["git log", "Show project commit history"],
  ["commits", "Show GitHub activity heatmap"],
  ["clear", "Clear the terminal"],
  ["exit", "Close the terminal"],
];

const COMMANDS = [...HELP.map(([c]) => c.replace(/ \[.*\]$/, "")), "change name", "git log"];

const WELCOME: Out[] = [
  { t: "ascii", lines: ASCII.name },
  { t: "output", text: "Welcome to my interactive terminal!" },
  { t: "output", text: "Type 'help' to see what commands are available." },
];

const pick = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)];

// A stable, fake commit hash per project, as the old `git log` had.
const hash = (s: string) => {
  let h = 0;
  for (const c of s) h = ((h << 5) - h + c.charCodeAt(0)) | 0;
  return Math.abs(h).toString(16).padStart(7, "0").slice(0, 7);
};

/** A plain button that opens the terminal, for anyone who doesn't know about the ~ key. */
export function TerminalButton() {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event("nr-terminal"))} className="text-bone hover:text-accent">
      open the terminal (~)
    </button>
  );
}

export function Terminal() {
  const [mode, setMode] = useState<"closed" | "open" | "minimized">("closed");
  const [maximized, setMaximized] = useState(false);
  const [out, setOut] = useState<Out[]>(WELCOME);
  const [value, setValue] = useState("");
  const [guest, setGuest] = useState("guest");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [game, setGame] = useState<{ target: number; guesses: number } | null>(null);
  const [busy, setBusy] = useState<"hack" | "flip" | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "`" || e.key === "~") && !(e.target as HTMLElement).closest("input, textarea")) {
        e.preventDefault();
        setMode((m) => (m === "open" ? "closed" : "open"));
      }
      if (e.key === "Escape") setMode((m) => (m === "open" ? "closed" : m));
    };
    const onOpen = () => setMode("open");
    window.addEventListener("keydown", onKey);
    window.addEventListener("nr-terminal", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("nr-terminal", onOpen);
    };
  }, []);

  // /terminal redirects to /#terminal.
  useEffect(() => {
    if (window.location.hash !== "#terminal") return;
    const id = requestAnimationFrame(() => setMode("open"));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    if (mode === "open" && !busy) input.current?.focus();
  }, [mode, busy]);

  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight });
  }, [out]);

  const hack = () => {
    setBusy("hack");
    let step = 0;
    const id = window.setInterval(() => {
      if (step < HACK_STEPS.length) {
        const text = HACK_STEPS[step];
        const value = ((step + 1) / HACK_STEPS.length) * 100;
        setOut((o) => [...o.slice(0, -2), { t: "hack", text }, { t: "progress", value }]);
        step++;
        return;
      }
      window.clearInterval(id);
      setOut((o) => [
        ...o.slice(0, -2),
        { t: "success", text: "Target system compromised successfully!" },
        { t: "system", text: "Operation complete. Reverting to normal terminal mode." },
      ]);
      setBusy(null);
    }, 500);
  };

  function guess(raw: string): Out[] {
    if (!game) return [];
    if (raw.toLowerCase() === "exit game") {
      setGame(null);
      return [{ t: "output", text: "Game over. Thanks for playing!" }];
    }
    const n = parseInt(raw, 10);
    if (Number.isNaN(n)) return [{ t: "error", text: "Please enter a valid number or 'exit game' to quit." }];
    const guesses = game.guesses + 1;
    if (n === game.target) {
      setGame(null);
      return [
        { t: "success", text: `Congratulations! You guessed the number ${game.target} in ${guesses} guesses!` },
        { t: "output", text: "Game over. Type 'game' to play again." },
      ];
    }
    setGame({ ...game, guesses });
    return [
      { t: "output", text: n < game.target ? "Too low! Try a higher number." : "Too high! Try a lower number." },
      { t: "output", text: `Guesses so far: ${guesses}` },
    ];
  }

  function run(raw: string): Out[] | "clear" {
    const cmd = raw.trim();
    const lower = cmd.toLowerCase();
    const [head, ...rest] = lower.split(/\s+/);
    const arg = rest.join(" ");

    if (lower.startsWith("change name")) {
      const name = cmd.slice(11).trim();
      if (!name) return [{ t: "error", text: "Error: Please provide a name after 'change name'." }];
      setGuest(name);
      return [{ t: "success", text: `Name successfully changed to "${name}"` }];
    }
    if (head === "echo") {
      const message = cmd.slice(4).trim();
      return message ? [{ t: "output", text: message }] : [{ t: "error", text: "Error: Echo requires a message." }];
    }

    switch (head) {
      case "about":
        return about.paragraphs.map((text) => ({ t: "output", text }));
      case "projects":
        return [
          { t: "output", text: "I love the process of bringing my ideas to life. Try 'open <project>' for any of these:" },
          { t: "table", rows: projects.map((p) => [p.slug, p.tagline]) },
          { t: "link", text: "Or see them all on the projects page", url: "/projects" },
        ];
      case "open": {
        const p = projects.find((x) => x.slug === arg);
        if (!p) return [{ t: "error", text: `No project '${arg}'. Type 'projects' for the list.` }];
        router.push(`/projects/${p.slug}`);
        return [{ t: "system", text: `Opening ${p.title}...` }];
      }
      case "experience":
      case "exp":
        return [
          ...experience.flatMap((o) => o.roles.map((r): Out => ({ t: "output", text: `${r.period.padEnd(20)} ${o.org} · ${r.title}` }))),
          { t: "link", text: "The full timeline", url: "/experience" },
        ];
      case "goto":
      case "cd": {
        const id = arg.replace(/^#/, "");
        if (!SECTIONS.includes(id)) return [{ t: "error", text: `No section '${arg}'. Try: ${SECTIONS.join(", ")}` }];
        if (pathname !== "/") router.push(`/#${id}`);
        else scrollToId(id);
        return [{ t: "system", text: `→ ${id}` }];
      }
      case "skills":
        return skills.flatMap((g): Out[] => [
          { t: "section", text: `${g.group}:` },
          { t: "list", items: g.items },
        ]);
      case "education":
        return [
          { t: "section", text: "Education:" },
          { t: "output", text: education.degree },
          { t: "output", text: `${education.school} [Boston], expected ${education.graduation}` },
          { t: "output", text: education.honors.join(", ") },
          { t: "output", text: education.highSchool },
        ];
      case "resume":
        return [
          { t: "output", text: "My professional resume is available at:" },
          { t: "link", text: "View my resume", url: profile.resume },
        ];
      case "funfact":
        return [{ t: "output", text: pick(FUN_FACTS) }];
      case "social":
        return [
          { t: "section", text: "Find me on:" },
          { t: "link", text: "GitHub", url: profile.links.github },
          { t: "link", text: "LinkedIn", url: profile.links.linkedin },
          { t: "link", text: "X", url: profile.links.x },
        ];
      case "contact":
        return [
          { t: "output", text: "Feel free to reach out to me at:" },
          { t: "link", text: profile.email, url: `mailto:${profile.email}` },
          { t: "link", text: "linkedin.com/in/namanrusia", url: profile.links.linkedin },
        ];
      case "date":
        return [
          {
            t: "output",
            text: new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
          },
        ];
      case "time":
        return [{ t: "output", text: new Date().toLocaleTimeString("en-US") }];
      case "game":
        setGame({ target: Math.floor(Math.random() * 100) + 1, guesses: 0 });
        return [
          { t: "section", text: "Number Guessing Game" },
          { t: "output", text: "I'm thinking of a number between 1 and 100." },
          { t: "output", text: "Type a number to guess, or 'exit game' to quit." },
        ];
      case "ascii":
        return ASCII[arg || "name"] ? [{ t: "ascii", lines: ASCII[arg || "name"] }] : [{ t: "error", text: "ASCII art not found" }];
      case "joke":
        return [
          { t: "section", text: "Here's a programming joke:" },
          { t: "output", text: pick(JOKES) },
        ];
      case "secret":
        return [
          { t: "section", text: "How did you know this was here?" },
          { t: "output", text: "SSHHHHHHH!" },
        ];
      case "quote": {
        const [text, author] = pick(QUOTES);
        return [
          { t: "section", text: "Inspirational Quote:" },
          { t: "output", text: `"${text}"` },
          { t: "output", text: `- ${author}` },
        ];
      }
      case "hack":
        hack();
        return [
          { t: "system", text: "Initiating cyber intrusion sequence..." },
          { t: "hack", text: "" },
          { t: "progress", value: 0 },
        ];
      case "flip":
        setBusy("flip");
        window.setTimeout(() => setBusy(null), 4000);
        return [{ t: "system", text: "Whoa! Everything's upside down!" }];
      case "git":
        if (arg !== "log") return [{ t: "error", text: `Unknown git command: ${arg}` }];
        return [
          { t: "section", text: "Project Commit History:" },
          ...[...projects]
            .sort((a, b) => b.when - a.when)
            .map((p): Out => ({
              t: "commit",
              hash: hash(p.title),
              date: p.period,
              message: `feat: Add project - ${p.title}`,
              description: p.summary.length > 80 ? `${p.summary.slice(0, 80)}...` : p.summary,
            })),
        ];
      case "commits":
        return [
          { t: "section", text: "My Recent GitHub Activity:" },
          { t: "image", url: "https://raw.githubusercontent.com/naman0r/naman0r/output/ocean.gif", alt: "GitHub contribution heatmap" },
        ];
      case "github":
        return [
          { t: "section", text: "GitHub Stats:" },
          { t: "output", text: `Username: ${profile.handle}` },
          { t: "output", text: "Repositories: 25+" },
          { t: "output", text: "Most used languages: JavaScript, Python, Java, TypeScript" },
          { t: "link", text: "View GitHub Profile", url: profile.links.github },
        ];
      case "spotify":
        return [
          { t: "section", text: "Currently Vibing To:" },
          { t: "output", text: "Instant Crush - Daft Punk" },
          { t: "output", text: "Album: Random Access Memories" },
          { t: "output", text: "Playlist: house?" },
          { t: "link", text: "View my Spotify Songs!", url: "https://open.spotify.com/user/h8pkjswq0k221qlr7oxqphw5i" },
        ];
      case "coffee":
        return [
          { t: "section", text: "Coffee Break!" },
          { t: "ascii", lines: ASCII.coffee },
          { t: "output", text: "Brewing a fresh cup of coffee for you..." },
          { t: "output", text: "Favorite brew: black. just black. yea" },
        ];
      case "banner":
        return WELCOME;
      case "ls":
        return [
          { t: "section", text: "Directory Contents:" },
          {
            t: "table",
            rows: [
              ["about.txt", "Personal information"],
              ["projects/", "My coding projects"],
              ["skills.json", "Technical skills"],
              ["resume.pdf", "My resume"],
              ["contact.md", "Contact information"],
              ["games/", "Terminal games"],
              ["config.js", "Terminal configuration"],
            ],
          },
        ];
      case "help":
        return [
          { t: "section", text: "Available Commands:" },
          { t: "table", rows: HELP },
        ];
      case "clear":
        return "clear";
      case "exit":
        window.setTimeout(() => setMode("minimized"), 1000);
        return [{ t: "system", text: "Closing terminal..." }];
    }
    if (head?.startsWith("sudo")) return [{ t: "error", text: "Nice try! You don't have sudo privileges on this system." }];
    if (head === "rm" && rest.includes("-rf"))
      return [{ t: "error", text: "Whoa there! Let's not delete everything. This terminal is read-only." }];
    if (head === "42" || lower === "what is the meaning of life")
      return [{ t: "output", text: "42. Ah, I see you're a person of culture as well!" }];
    if (/\b(hello|hi|hey)\b/.test(lower)) return [{ t: "output", text: `Hello there, ${guest}! Type 'help' to see available commands.` }];
    return [{ t: "error", text: `Command not found: ${cmd}. Type 'help' to see available commands.` }];
  }

  const submit = () => {
    const cmd = value;
    if (!cmd.trim() || busy) return;
    setHistory((h) => [...h, cmd]);
    setCursor(-1);
    setSuggestions([]);
    setValue("");
    const echo: Out = { t: "command", text: cmd, guest };
    if (game) {
      setOut((o) => [...o, echo, ...guess(cmd.trim())]);
      return;
    }
    const result = run(cmd);
    if (result === "clear") setOut([{ t: "system", text: "Terminal cleared" }]);
    else setOut((o) => [...o, echo, ...result]);
  };

  const complete = () => {
    const typed = value.toLowerCase();
    if (!typed.trim()) return;
    const matches = [...new Set(COMMANDS)].filter((c) => c.startsWith(typed));
    if (matches.length === 1) {
      setValue(matches[0]);
      setSuggestions([]);
    } else setSuggestions(matches);
  };

  if (mode === "closed") return null;
  if (mode === "minimized") {
    return (
      <button
        type="button"
        onClick={() => setMode("open")}
        title="Open terminal"
        aria-label="Open terminal"
        className="font-display fixed bottom-6 right-6 z-50 grid size-12 place-items-center border-2 border-bone bg-ink text-sm text-lime shadow-[4px_4px_0_0_var(--color-accent)] transition-transform hover:-translate-y-0.5"
      >
        &gt;_
      </button>
    );
  }

  const prompt = `${guest}@terminal:~$`;
  return (
    <div
      role="dialog"
      aria-label="Terminal"
      data-lenis-prevent
      className={`fixed z-50 flex flex-col border-2 border-bone bg-ink font-mono text-[13px] leading-relaxed shadow-[6px_6px_0_0_var(--color-accent)] transition-transform duration-500 ${
        maximized ? "inset-4" : "bottom-4 right-4 h-[min(500px,75svh)] w-[min(720px,calc(100vw-2rem))]"
      } ${busy === "flip" ? "rotate-180" : ""}`}
      onClick={() => !busy && input.current?.focus()}
    >
      <div className="label flex items-center justify-between border-b-2 border-bone bg-bone px-3 py-1 text-ink">
        <span className="normal-case tracking-normal">{guest}@terminal: ~</span>
        <span className="flex gap-3">
          <button type="button" onClick={() => setMode("minimized")} aria-label="Minimize terminal" className="hover:text-accent">
            [_]
          </button>
          <button
            type="button"
            onClick={() => setMaximized((m) => !m)}
            aria-label={maximized ? "Restore terminal" : "Maximize terminal"}
            className="hover:text-accent"
          >
            [{maximized ? "=" : "□"}]
          </button>
          <button type="button" onClick={() => setMode("closed")} aria-label="Close terminal" className="hover:text-accent">
            [x]
          </button>
        </span>
      </div>

      <div ref={body} className="flex-1 overflow-y-auto p-3">
        {out.map((o, i) => (
          <Line key={i} o={o} />
        ))}
      </div>

      {suggestions.length > 0 && (
        <ul className="border-t-2 border-line bg-coal px-3 py-2">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                className="text-bone hover:text-coin"
                onClick={() => {
                  setValue(s);
                  setSuggestions([]);
                  input.current?.focus();
                }}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}

      <form
        className="flex gap-2 border-t-2 border-line px-3 py-2"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label htmlFor="term-input" className="shrink-0 text-lime">
          {prompt}
        </label>
        <input
          id="term-input"
          ref={input}
          value={value}
          disabled={busy !== null}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" && history.length) {
              e.preventDefault();
              const next = Math.min(history.length - 1, cursor + 1);
              setCursor(next);
              setValue(history[history.length - 1 - next]);
            } else if (e.key === "ArrowDown" && cursor >= 0) {
              e.preventDefault();
              const next = cursor - 1;
              setCursor(next);
              setValue(next < 0 ? "" : history[history.length - 1 - next]);
            } else if (e.key === "Tab" && !game) {
              e.preventDefault();
              complete();
            } else if (e.key === "Escape") setSuggestions([]);
          }}
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-bone caret-lime outline-none"
        />
      </form>
    </div>
  );
}

function Line({ o }: { o: Out }) {
  switch (o.t) {
    case "command":
      return (
        <p className="mt-1">
          <span className="text-lime">{o.guest}@terminal:~$</span> <span className="text-bone">{o.text}</span>
        </p>
      );
    case "error":
      return <p className="ml-4 text-[#ff6b5a]">{o.text}</p>;
    case "success":
      return <p className="ml-4 text-lime">{o.text}</p>;
    case "system":
      return <p className="text-[#b79cff]">{o.text}</p>;
    case "section":
      return <p className="mt-1 text-accent">{o.text}</p>;
    case "hack":
      return <p className="ml-4 text-lime">{o.text}</p>;
    case "link":
      return (
        <p className="ml-4">
          <a href={o.url} target={o.url.startsWith("/") ? undefined : "_blank"} rel="noreferrer" className="text-coin hover:underline">
            {o.text} ↗
          </a>
        </p>
      );
    case "list":
      return (
        <ul className="ml-8 list-disc text-bone">
          {o.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="my-1 ml-4">
          {o.rows.map(([a, b]) => (
            <p key={a} className="grid grid-cols-[minmax(0,12rem)_1fr] gap-4">
              <span className="text-coin">{a}</span>
              <span className="text-bone/85">{b}</span>
            </p>
          ))}
        </div>
      );
    case "ascii":
      return <pre className="my-2 overflow-x-auto text-[11px] leading-tight text-lime">{o.lines.join("\n")}</pre>;
    case "progress":
      return (
        <div className="my-2 ml-4 h-2.5 bg-line">
          <div className="h-full bg-accent transition-[width] duration-300" style={{ width: `${o.value}%` }} />
        </div>
      );
    case "commit":
      return (
        <div className="mb-3 ml-4">
          <p className="text-coin">
            commit <span className="text-[#ff6b5a]">{o.hash}</span> (HEAD -&gt; main)
          </p>
          <p className="text-dust">Author: {profile.name} &lt;{profile.email}&gt;</p>
          <p className="text-dust">Date: {o.date}</p>
          <p className="mt-1 text-bone">{o.message}</p>
          <p className="italic text-bone/70">{o.description}</p>
        </div>
      );
    case "image":
      return (
        <div className="my-2 ml-4">
          {/* A remote GIF: the image optimizer would drop its animation. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={o.url} alt={o.alt} className="max-w-full" />
        </div>
      );
    default:
      return <p className="ml-4 text-bone">{o.text || " "}</p>;
  }
}
