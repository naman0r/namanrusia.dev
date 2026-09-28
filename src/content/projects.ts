export type Status = "Live" | "Shipped" | "In progress" | "Released" | "Archived";

export type Feature = { title: string; body: string };

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  status: Status;
  /** Human label, e.g. "Aug 2025 — present". */
  period: string;
  /** Sort key and archive year, as a decimal year. */
  when: number;
  featured?: boolean;
  /** Three concrete claims for the landing-page card; the card also shows the first four of `stack`. */
  highlights?: string[];
  kind: string;
  role?: string;
  team?: string;
  stack: string[];
  links: { label: string; href: string }[];
  image?: string;
  video?: string;
  gallery?: { src: string; caption: string }[];
  /** Accent used for the project's pixel frame. */
  color: string;
  problem?: string[];
  built?: { intro?: string; features: Feature[] };
  architecture?: string[];
  learned?: Feature[];
  history?: { title: string; body: string[] };
};

export const projects: Project[] = [
  {
    slug: "tandemcode",
    title: "TandemCode",
    tagline: "Practice coding problems with a partner.",
    summary:
      "Two people share a room, edit the same code with live cursors, chat, and run their solution against hidden tests together. Every session can be replayed.",
    status: "Live",
    period: "Aug 2025 — present",
    when: 2026.73,
    featured: true,
    highlights: [
      "Shared editor with live cursors on a Yjs CRDT, relayed over WebSockets",
      "Every submission judged in a locked-down container under gVisor",
      "FastAPI, Postgres and the judge on AWS Lightsail; the web app on Vercel",
    ],
    kind: "Full-stack web app, open source (Apache 2.0)",
    role: "Solo dev",
    team: "Solo project",
    stack: [
      "AWS Lightsail",
      "FastAPI",
      "Yjs",
      "gVisor",
      "WebSockets",
      "Postgres 17",
      "asyncpg",
      "Docker",
      "Caddy",
      "React 19",
      "TypeScript",
      "Vite",
      "Monaco",
      "Clerk",
      "Vercel",
    ],
    links: [
      { label: "tandemcode.space", href: "https://www.tandemcode.space/" },
      { label: "GitHub", href: "https://github.com/naman0r/tandemcode" },
    ],
    image: "/projects/tandemcode.png",
    video: "/projects/tandemcode-loop.mp4",
    gallery: [{ src: "/projects/tandemcode-mascot.png", caption: "The mascot, which is also the README logo" }],
    color: "#4f8bff",
    problem: [
      "As an underclassman it's hard to find peers who want to do mock interviews or practice DSA in a pair. TandemCode is a place to find a partner at your level and actually practice together.",
      "The bigger goal: make interview prep social and consistent, with the accountability of doing it with someone else.",
    ],
    built: {
      intro: "One shared editor, one judge, and a replay of the whole session.",
      features: [
        {
          title: "Rooms",
          body: "Public or unlisted, shared by invite link, with a way to ask for a partner that highlights the room on the rooms page.",
        },
        {
          title: "One shared editor",
          body: "Live cursors on a Yjs CRDT. The server doesn't hold a copy of the document; it relays frames between peers and records changes for the replay.",
        },
        {
          title: "A real judge",
          body: "Problems ship with starter code, visible examples and hidden tests. Python submissions are judged in an isolated container per run, and everyone in the room sees the verdict.",
        },
        {
          title: "Complexity estimates",
          body: "An accepted run can be rerun on growing inputs to estimate its time complexity, measured as CPU time from outside the program and fitted to a power of n.",
        },
        { title: "Replay", body: "The code as it was typed, the chat and every run, played back after the room closes." },
        { title: "Problems by pull request", body: "Each problem is a SQL migration, so contributing one is a PR." },
      ],
    },
    architecture: [
      "Five parts: a React single-page app on Vercel; a FastAPI process serving HTTP under /api and two websockets under /ws; a separate runner process from the same image that judges submissions; Postgres for everything (users, rooms, chat, editor history, problems, submissions); and Clerk for sign-in, so TandemCode stores no passwords.",
      "Routes → services → DAOs. Services hold the rules (who can read a room, how many runs per hour); DAOs hold hand-written SQL for asyncpg. Rate limits that must hold under parallel requests are enforced inside a transaction, not by counting first and inserting later.",
      "A run is queued as a pending submission; the runner claims it, judges it and stores the verdict, which fires a Postgres NOTIFY that the API broadcasts to the room. Fan-out to many sockets sends in parallel with a deadline so one stalled peer can't freeze a room.",
      "Every submission is treated as hostile: a fresh container with no network, a read-only root filesystem, an unprivileged user with every capability dropped, memory and process caps, and a hard time budget. In production each container runs under gVisor, so escaping takes a gVisor bug and a kernel bug.",
      "Production is one Linux host running Docker Compose behind Caddy, with the web app on Vercel.",
    ],
    learned: [
      {
        title: "Learning a new stack is all about momentum",
        body: "This was very technically challenging, but it kept me engaged. Planning exactly what I'd do week by week, fixing scope and getting all the setup out of the way made the whole thing smooth. I've quit projects a day or two in before; front-loading planning and setup is what changed that.",
      },
      {
        title: "Challenge: four security reviews before deploy",
        body: "The September 2026 rebuild went through four security reviews before deploy: bounding every websocket send, capping sockets per user without races, limiting editor frames, and only letting people who've been in a room read its runs, code and roster.",
      },
      {
        title: "Challenge: timing code inside a sandbox",
        body: "Under gVisor the fixed cost of a run is about 150 ms, ten times a laptop's, and CPU time comes in 10 ms steps. Complexity estimates only count sizes where the solution's own time beats that floor, and short runs are timed twice with the faster kept.",
      },
    ],
    history: {
      title: "Version 1: Spring Boot",
      body: [
        "The first TandemCode was React on the front, Java Spring Boot on the back, Docker + Postgres for data, WebSockets for real-time and Clerk for auth. The plan then: real-time pair programming with CRDT/OT, time and space complexity analysis via code execution in ephemeral containers, AI interview feedback, and a social layer for finding peers at the same level.",
        "Spring Boot felt like magic: clean defaults, auto-configuration and a plug-and-play ecosystem that hides enterprise Java's boilerplate, so you can focus on logic instead of plumbing. The 2026 rewrite moved to FastAPI and shipped the CRDT editor and the containerized judge from that plan.",
      ],
    },
  },
  {
    slug: "dockmaster",
    title: "Dockmaster",
    tagline: "Know what's running on your Mac and your homelab.",
    summary:
      "A local dashboard that finds stray dev servers, inspects repos and worktrees, watches running coding agents, and checks system health, and can safely act on all of it.",
    status: "Released",
    period: "Aug 2026 — present",
    when: 2026.72,
    featured: true,
    highlights: [
      "Watches 10 coding agents, from Claude Code to Codex, and cleans up the servers they leave behind",
      "Guarded kills: tree-kill, confirmed SIGKILL and PID-reuse protection",
      "Manages other Macs over your own SSH; nothing leaves your machines",
    ],
    kind: "Local Next.js dev dashboard, macOS, MIT",
    role: "Creator",
    team: "Solo project",
    stack: ["Next.js", "SSH", "Docker API", "launchctl", "lsof / ps", "TypeScript", "Node 20"],
    links: [
      { label: "trydockmaster.vercel.app", href: "https://trydockmaster.vercel.app/" },
      { label: "GitHub", href: "https://github.com/naman0r/dockmaster" },
    ],
    image: "/projects/dockmaster-harbor.webp",
    gallery: [
      { src: "/projects/dockmaster-harbor.webp", caption: "Harbor: one live card per module plus system vitals" },
      { src: "/projects/dockmaster-ports.webp", caption: "Ports: every listening dev server, with a guarded stop" },
      { src: "/projects/dockmaster-repos.webp", caption: "Repos: dirty files, ahead/behind and stale branches under your dev root" },
      { src: "/projects/dockmaster-receipt.webp", caption: "Receipt: the last seven days of agent work as a shareable image" },
    ],
    color: "#5ec8ff",
    problem: [
      "Dev machines fill up with things nobody remembers starting: servers on random ports, worktrees from finished branches, gigabytes of build output, and now coding agents that leave processes behind.",
      "Dockmaster grew out of Port Authority, a single-file port dashboard. The idea scaled: a dev tool should know what's on your machine, and it should be able to act on it safely.",
    ],
    built: {
      features: [
        {
          title: "Ports and Processes",
          body: "Every listening dev server with a guarded stop: tree-kill, SIGTERM then confirmed SIGKILL, PID-reuse protection and LAN-exposure badges. Never PID 1 or Dockmaster's own ancestors.",
        },
        {
          title: "Repos and Worktrees",
          body: "A status board for every git repo under your dev root, plus stale worktrees and branches you can prune. Main worktrees and default branches are off limits.",
        },
        {
          title: "Agent Watch",
          body: "Coding agents running right now (Claude Code, Codex, OpenCode, Gemini CLI and more) with the repo each is in, seven days of sessions, and the servers they left behind, with a cleanup that re-scans and refuses while an agent is still in the folder.",
        },
        {
          title: "Secrets and Disk",
          body: "Credential-shaped strings in tracked files, redacted server-side so the API never returns full secret text. Reclaimable space from node_modules, build output and tool caches, deleting only exact artifact names.",
        },
        {
          title: "Receipt",
          body: "The last seven days as a shareable receipt: sessions per agent, tokens, lines changed, cost, and what Dockmaster stopped, removed and reclaimed.",
        },
        { title: "Remote Macs", body: "Works on a homelab over your own SSH. Nothing leaves your machines." },
      ],
    },
    architecture: [
      "A Next.js app you run on loopback. Each module shells out to the tool that already knows the answer (lsof, ps, git, du, launchctl, the Docker daemon) and every destructive action re-verifies its target right before acting.",
      "Every scanning module can be switched off, and settings, notes and the action log live in ~/.dockmaster as plain JSON.",
    ],
  },
  {
    slug: "git-interviewer",
    title: "Git Interviewer",
    tagline: "A pre-commit hook that interviews you about your code before letting you commit.",
    summary:
      "Before each commit it reads your staged diff, asks interview-style questions in a persona of your choice, and won't let the commit through without a real answer.",
    status: "Released",
    period: "Dec 2025",
    when: 2025.95,
    kind: "Open source CLI, DevOps / productivity",
    role: "Creator & engineer",
    team: "Weekend project",
    stack: ["Python", "Git hooks", "PyPI", "Rich", "OpenAI API"],
    links: [
      { label: "PyPI v1.0.0", href: "https://pypi.org/project/git-interviewer/1.0.0/" },
      { label: "GitHub", href: "https://github.com/naman0r/git-interviewer" },
    ],
    image: "/projects/git-interviewer.png",
    color: "#ffd23f",
    problem: [
      "Most developers commit too quickly, without thinking about design decisions, intent or tradeoffs. Git Interviewer turns every commit into a lightweight technical interview, like having a senior engineer inside your terminal.",
    ],
    built: {
      intro: "Pick who's grilling you:",
      features: [
        { title: "Nice", body: "Supportive engineer who wants clarity and understanding." },
        { title: "Grumpy", body: "Tired senior dev who has seen too much. Very picky." },
        { title: "Systems", body: "Asks about architecture, scaling, risk and tradeoffs." },
        { title: "Founder", body: "Focuses on product impact and iteration speed." },
      ],
    },
    architecture: [
      "Written in Python and wired into Git hooks to intercept the commit. It analyzes the diff of staged files and uses an LLM to generate context-aware questions for the chosen persona.",
      "It runs the interaction loop in the terminal and validates the answers before letting the commit proceed, or rejects it if the explanation is thin. Validating the thought process before code lands means better engineering discipline across a team.",
    ],
    learned: [
      {
        title: "Built during a snow delay",
        body: "I got to the airport comically early for a winter-break flight, then it was delayed by heavy snow in Boston. I had time to kill.",
      },
      {
        title: "Shipping a CLI is easier than it looks",
        body: "I came out with a much deeper understanding of git and git workflows, and did a lot of reflecting on my own habits. Packaging it for others on PyPI was surprisingly easy. I plan to make it a lot better, and a lot more annoying to use.",
      },
    ],
  },
  {
    slug: "canvas-buddy",
    title: "Canvas Buddy",
    tagline: "Ask questions about your Canvas classes from a small terminal app.",
    summary:
      "A terminal app that syncs your Canvas courses locally, answers questions with links back to the source, and shows syllabi, assignments, grades and files without a dozen tabs.",
    status: "Released",
    period: "Sep 2026",
    when: 2026.7,
    featured: true,
    highlights: [
      "Answers cite the exact syllabus page or lecture slide they came from",
      "The model looks things up itself through a read-only MCP server",
      "Keyword search on SQLite FTS5, with optional local embeddings through Ollama",
    ],
    kind: "Terminal app, MIT, Homebrew",
    role: "Creator",
    team: "Solo project",
    stack: ["Python 3.11", "MCP", "SQLite FTS5", "Ollama", "Textual", "HTTPX", "Canvas API", "Codex CLI", "OpenCode", "Homebrew"],
    links: [
      { label: "GitHub", href: "https://github.com/naman0r/canvas-buddy" },
      { label: "Homebrew tap", href: "https://github.com/naman0r/homebrew-tap" },
    ],
    color: "#3ccf7e",
    problem: [
      'Finding one policy or deadline means opening a dozen Canvas tabs. Canvas Buddy keeps a local cache of your classes and lets you ask things like "When is the midterm? Cite the syllabus."',
    ],
    built: {
      features: [
        {
          title: "Answers with sources",
          body: "Uses your existing Codex or OpenCode CLI login, or a local Ollama model. Replies stream in and link back to the Canvas source.",
        },
        { title: "Home screen", body: "Upcoming work, what Canvas posted, moved or removed in the last week, and current grades." },
        {
          title: "Library and planner",
          body: "Each course laid out the way Canvas does, with a reader that jumps to PDF pages and slides, and a planner of work by day with overdue work first.",
        },
        {
          title: "Local and read-only",
          body: "Local storage, read-only Canvas access. Without a model you can still sync, browse, search and check deadlines.",
        },
        {
          title: "Installs with brew",
          body: "Prebuilt Homebrew packages for Apple Silicon and Intel; no Python setup or repo clone. 0.4.0 is a personal-testing release; wider onboarding needs Canvas OAuth.",
        },
      ],
    },
    architecture: [
      "Five runtime dependencies (Textual, HTTPX, Beautiful Soup, python-dotenv, pypdf). Search runs on SQLite FTS5 from the standard library; local embeddings through Ollama are optional.",
      "The model can call six read-only tools: search, read a document, list documents and courses, deadlines and recent changes. Codex and OpenCode spawn them as a stdio MCP server, about 60 lines of JSON-RPC that opens SQLite read-only and never loads credentials.",
      "Courses sync three at a time, automatically on launch when the cache is more than six hours old. Unchanged files and embeddings are reused, snapshots update atomically, and failed endpoints keep their previous data.",
      "The Homebrew formula installs an isolated Python environment from checksummed prebuilt packages, with a pinned source release as the fallback.",
    ],
  },
  {
    slug: "peel",
    title: "Peel",
    tagline: "Turn anything on screen into a draggable artifact.",
    summary:
      "A macOS menu bar app that lifts content off the screen: transparent PNGs, tables as CSV, and event listings straight into Calendar.",
    status: "In progress",
    period: "Sep 2026 — present",
    when: 2026.68,
    kind: "macOS menu bar app, Apache 2.0",
    role: "Creator",
    stack: ["Swift 6", "Strict concurrency", "Accessibility API", "Vision / OCR", "Foundation Models", "EventKit"],
    links: [{ label: "GitHub", href: "https://github.com/naman0r/Peel" }],
    color: "#e8402a",
    problem: [
      "Useful content on screen is often trapped: a table in a screenshot, an event on a web page, an image inside an app. Peel reads Accessibility data first and falls back to on-device image and document recognition when an app doesn't expose structure.",
    ],
    built: {
      features: [
        { title: "Lift and drag", body: "Screen capture, segmentation, hover overlays and transparent PNG drags." },
        { title: "Tables to CSV", body: "Semantic-first table extraction with CSV drags, and a radial action shelf." },
        {
          title: "Events to Calendar",
          body: "Extracts text, uses Foundation Models guided generation with deterministic date cross-checks, and opens an editable EventKit confirmation.",
        },
      ],
    },
    architecture: [
      "Targets macOS 26 on Apple Silicon, written in Swift 6 with strict concurrency and no third-party dependencies. Milestone 4 is in; the pure logic is covered by 50 passing tests.",
    ],
  },
  {
    slug: "open-brain",
    title: "Open Brain",
    tagline: "Memory for my AI systems.",
    summary:
      "An MCP server over a local markdown vault. Claude and other MCP clients read curated context out of it and write generated work back in.",
    status: "In progress",
    period: "Mar — Sep 2026",
    when: 2026.67,
    kind: "MCP server",
    role: "Creator",
    stack: ["Python", "MCP", "Markdown", "Git"],
    links: [{ label: "GitHub", href: "https://github.com/naman0r/open-brain-mcp" }],
    color: "#b79cff",
    problem: [
      "The vault is the single source of truth: plain markdown in git, hand-editable, with no database and no embeddings. Grep's failure mode is \"no match\", which is legible; vector search's is silent bad recall, which isn't acceptable when the output is a document you're about to send.",
    ],
    built: {
      features: [
        { title: "Four tools", body: "list_projects, search_context, read_note and write_note." },
        {
          title: "Containment",
          body: "Every path is resolved and must land inside the vault. Traversal, absolute paths and symlink escapes are refused.",
        },
        {
          title: "Quarantine",
          body: "Writes only land under generated/ or _inbox/, checked on the resolved path. Curated notes are read-only through MCP.",
        },
        { title: "Auto-commit", body: "Each write can be committed, so a bad write is one git revert away." },
      ],
    },
  },
  {
    slug: "clash-royale-bot",
    title: "Clash Royale RL Bot",
    tagline: "A reinforcement learning agent that plays Clash Royale.",
    summary:
      "Q-learning with computer vision: the bot reads the game off the screen, picks a card and a spot, and learns from wins, losses and crowns.",
    status: "Shipped",
    period: "Oct — Nov 2025",
    when: 2025.85,
    kind: "CS4100 final project (group 8), Northeastern",
    team: "Group project",
    stack: ["Python", "Q-learning", "OpenCV", "PyAutoGUI", "Matplotlib", "BlueStacks"],
    links: [{ label: "GitHub", href: "https://github.com/naman0r/CS4100-CR-bot" }],
    color: "#4f8bff",
    problem: [
      "Group 8's final project for CS4100 (Foundations of AI) at Northeastern, Fall 2025: an agent that learns to play Clash Royale on an Android emulator, using only what it can see on screen.",
    ],
    built: {
      features: [
        {
          title: "State and actions",
          body: "State-space discretized into early, mid and late game; an epsilon-greedy agent over 144 discrete actions with adaptive learning rates.",
        },
        {
          title: "Vision",
          body: "OpenCV and PyAutoGUI detect the game phase, match outcomes and the cards in hand, then place cards in real time.",
        },
        {
          title: "Card recognition",
          body: 'The improved agent matches card slots against a reference library, so it learns "play Knight at the bridge" instead of "play slot 1", and survives deck reshuffles.',
        },
      ],
    },
    architecture: [
      "Modular Python separating the RL core, vision perception and battle management, with fallbacks for vision failures and live win-rate and reward graphs.",
    ],
  },
  {
    slug: "axiom-ai",
    title: "Axiom AI",
    tagline: "AI-powered student productivity platform.",
    summary:
      "Log and track projects, homework and assignments with Google Calendar sync, AI-generated study videos, mind maps and RAG search over your own notes. Notion, but built for student productivity.",
    status: "Live",
    period: "Mar 2025 — present",
    when: 2025.2,
    kind: "Full-stack AI platform",
    stack: ["Next.js", "TypeScript", "RAG", "Vector database", "Tailwind", "Supabase", "Flask / FastAPI", "Google Cloud"],
    links: [
      { label: "axiomai.space", href: "https://www.axiomai.space" },
      { label: "GitHub", href: "https://github.com/naman0r/axiomai" },
    ],
    image: "/projects/edugenie.png",
    color: "#b79cff",
    problem: [
      "I wanted something beyond note-taking apps like Notion or Obsidian: a platform that understands how students learn and work, combining their organizational power with AI-driven insights, automatic content generation and academic workflows. It started as EduGenie.",
    ],
    built: {
      features: [
        { title: "AI study videos", body: "Turns notes into video explanations so complex topics are easier to understand." },
        {
          title: "Google Calendar sync",
          body: "Assignments, deadlines and study sessions on your calendar, with reminders and time blocking.",
        },
        { title: "Mind maps", body: "Generated from your notes to show how concepts connect." },
        { title: "RAG search", body: "Ask questions about your study material in natural language and get answers from your own notes." },
      ],
    },
    architecture: [
      "Next.js and TypeScript on the front. The AI side is a RAG architecture over a vector database for semantic search and generation.",
      "The backend runs Flask/FastAPI, with Supabase for real-time sync and auth, and Google Cloud powering video generation and infrastructure.",
    ],
  },
  {
    slug: "mindfulmomentum",
    title: "MindfulMomentum",
    tagline: "Productivity and habits app with a Chrome extension.",
    summary:
      "Habit tracking, journaling and tasks, with a companion Chrome extension that blocks distractions in focus mode and syncs tasks. Built with security and scale in mind.",
    status: "Live",
    period: "Mar 2025",
    when: 2025.19,
    kind: "Full-stack web app + Chrome extension",
    stack: ["React", "Tailwind", "Flask", "Supabase", "Firebase", "JWT", "Chrome Extension API", "Vercel", "Railway"],
    links: [
      { label: "mindfulmomentum.vercel.app", href: "https://mindfulmomentum.vercel.app/" },
      { label: "GitHub", href: "https://github.com/naman0r/mindfulmomentum" },
    ],
    image: "/projects/mindfulmomentum.png",
    color: "#3ccf7e",
    problem: [
      "Students and professionals struggle to keep productive habits through endless distractions, and most productivity apps lack the security, cross-platform reach and smarts to make habits stick. I wanted something that actively helps you stay focused, not just a tracker.",
    ],
    built: {
      features: [
        { title: "Habit tracking", body: "Adapts to your schedule with personalized insights to help build routines." },
        { title: "Journaling", body: "Secure journaling with prompts and mood tracking." },
        { title: "Chrome extension", body: "Focus mode blocks distracting sites; tasks sync across devices." },
        { title: "Secure by default", body: "JWT auth, encrypted storage and secure API endpoints." },
      ],
    },
    architecture: [
      "React and Tailwind on the front; Flask API with JWT auth; Supabase for real-time sync and Firebase for extra cloud services. The extension talks to the app through secure API calls.",
      "Frontend on Vercel, backend on Railway. It went to beta with active users giving feedback.",
    ],
  },
  {
    slug: "backbuddy",
    title: "BackBuddy",
    tagline: "Arduino-integrated posture tracker.",
    summary:
      "A chair attachment with pressure sensors and inflatable bladders that nudges you back into good posture, paired with a React Native app over Bluetooth.",
    status: "Shipped",
    period: "Jan — Apr 2025",
    when: 2025.1,
    kind: "Hardware + software, Forge",
    role: "Software lead",
    team: "Team BackBuddy at Forge",
    stack: ["React Native", "Expo", "Arduino", "Arduino IoT", "Bluetooth HC-05", "Firebase"],
    links: [{ label: "GitHub", href: "https://github.com/naman0r/backbuddy-app" }],
    image: "/projects/backbuddy-app.png",
    color: "#ff8fb8",
    problem: [
      "Poor posture is a huge problem for students and office workers at desks all day. Reminder apps are passive and give no real-time feedback or physical correction. We wanted something that detects bad posture and helps fix it.",
    ],
    built: {
      features: [
        { title: "Chair attachment", body: "Arduino-based, fits any chair, uses pressure sensors to detect posture." },
        { title: "Pressure bladders", body: "Inflate and deflate to gently correct posture when you slouch." },
        { title: "Mobile app", body: "React Native over Bluetooth to track progress, set goals and tune sensitivity." },
        { title: "Feedback loop", body: "Learns your sitting patterns and adapts." },
      ],
    },
    architecture: [
      "Arduino IoT with pressure sensors placed across the chair. Uneven pressure (slouching) triggers targeted bladders that guide you back into alignment.",
      "The app connects through an HC-05 Bluetooth module and stores data in Firebase for cross-device sync and long-term trends.",
    ],
  },
  {
    slug: "market-sentiment",
    title: "Market Sentiment Visualizer",
    tagline: "A weather forecast for market psychology.",
    summary:
      "A dashboard that folds public market data into one 0 to 100 fear/greed score: VIX, put/call ratio, sector breadth and a fear & greed proxy, weighted and refreshed every 15 minutes in market hours.",
    status: "Shipped",
    period: "Apr — Sep 2026",
    when: 2026.3,
    kind: "Data dashboard",
    stack: ["React", "Vite", "FastAPI", "Python", "yfinance"],
    links: [{ label: "GitHub", href: "https://github.com/naman0r/market-sentiment-visualizer" }],
    color: "#ff8fb8",
    architecture: [
      "A React (Vite) front end with a sentiment gauge, sparkline cards and an 11-ETF sector heatmap, over a FastAPI backend. The backend exists because browsers block direct calls to most financial endpoints (CORS), so it fetches server-side and proxies.",
      "Free market data lags 15 minutes anyway, so it caches aggressively as JSON files: 15 minutes in market hours, 24 hours after close. No Redis needed. Failed fetches fall back instead of breaking the page.",
    ],
  },
  {
    slug: "resume-tex",
    title: "Resume-Tex",
    tagline: "Google ADK resume-tailoring agent.",
    summary:
      "Generates a tailored LaTeX resume from a job description, a context file and your template. By design it only edits the experience and projects sections.",
    status: "Shipped",
    period: "Dec 2025",
    when: 2025.93,
    kind: "AI agent, CLI",
    stack: ["Python", "Google ADK", "Gemini", "LaTeX"],
    links: [{ label: "GitHub", href: "https://github.com/naman0r/resume-tex" }],
    color: "#5ec8ff",
  },
  {
    slug: "nutrition",
    title: "NUtrition",
    tagline: "Northeastern dining hall macro tracker.",
    summary:
      "Scrapes nutrition info from the university dining site so students can log meals, track their diet over time and spot trends. Built with friends at Oasis; now in production.",
    status: "Live",
    period: "Spring 2025",
    when: 2025.3,
    kind: "Full-stack web app, Oasis",
    team: "Oasis group 11",
    stack: ["Selenium", "React", "Firebase", "Flask", "Supabase"],
    links: [
      { label: "nutrition-oasis.vercel.app", href: "https://nutrition-oasis.vercel.app/" },
      { label: "GitHub", href: "https://github.com/Oasis-NEU/sp25-group-11" },
    ],
    image: "/projects/nutrition.png",
    color: "#9fe870",
  },
  {
    slug: "ama-automator",
    title: "AMA Automator",
    tagline: "Internal tooling for TAMID.",
    summary:
      "Full-stack web app that automates TAMID at Northeastern's ask-me-anything process on Slack, with auth and a Slack agent built on webhooks.",
    status: "Shipped",
    period: "Mar 2025",
    when: 2025.18,
    kind: "Internal tool",
    stack: ["Supabase", "React", "Flask", "Slack webhooks"],
    links: [{ label: "GitHub", href: "https://github.com/naman0r/ama-consulting-project" }],
    image: "/projects/ama.png",
    color: "#5ec8ff",
  },
  {
    slug: "tanews",
    title: "TaNews",
    tagline: "Full-stack news platform.",
    summary: "Posting, reading and liking, with separate admin and user roles.",
    status: "Shipped",
    period: "Spring 2025",
    when: 2025.29,
    kind: "Full-stack web app",
    stack: ["Docker", "Flask", "React", "TypeScript", "MySQL"],
    links: [{ label: "GitHub", href: "https://github.com/IpDaniel/tanews/tree/naman" }],
    image: "/projects/tanews.png",
    color: "#e8402a",
  },
  {
    slug: "studybuddy",
    title: "StudyBuddy",
    tagline: "University study group connector.",
    summary: "Connects university students with each other to form study groups.",
    status: "Shipped",
    period: "Spring 2025",
    when: 2025.28,
    kind: "Full-stack web app",
    stack: ["Streamlit", "MySQL", "Docker", "Flask"],
    links: [{ label: "GitHub", href: "https://github.com/Arshayp/studybuddy-2" }],
    image: "/projects/studybuddy.png",
    color: "#ffd23f",
  },
  {
    slug: "car2drvr",
    title: "Car2Drvr",
    tagline: "AI car recommendation platform.",
    summary: "Tailored recommendations for which car to buy based on your needs, with a price range so you don't overpay.",
    status: "Live",
    period: "Jan 2025",
    when: 2025.05,
    kind: "Full-stack web app",
    stack: ["React", "Firebase", "Flask"],
    links: [
      { label: "Live", href: "https://car2drvr-finhacks.firebaseapp.com/" },
      { label: "GitHub", href: "https://github.com/somshrivastava/car2drvr" },
    ],
    image: "/projects/car2drvr.png",
    color: "#eee7d7",
  },
  {
    slug: "mindmapr",
    title: "MindMapr",
    tagline: "AI-powered study tool.",
    summary: "Generates easy-to-understand visualizations from students' study notes. Authentication and a MongoDB database.",
    status: "Archived",
    period: "Jan — Mar 2025",
    when: 2025.1,
    kind: "Full-stack AI app",
    stack: ["MongoDB", "AI"],
    links: [],
    color: "#b79cff",
  },
  {
    slug: "personal-website",
    title: "Personal Website v1",
    tagline: "The first portfolio.",
    summary: "An interactive portfolio built with React and a lot of animation.",
    status: "Archived",
    period: "Dec 2024",
    when: 2024.95,
    kind: "Portfolio",
    stack: ["React", "Framer Motion", "GSAP", "PrimeReact", "JavaScript"],
    links: [
      { label: "GitHub", href: "https://github.com/naman0r/personal-website" },
    ],
    image: "/projects/personal-website.png",
    color: "#4f8bff",
  },
  {
    slug: "donow",
    title: "DoNow!",
    tagline: "To-do list as a Chrome extension.",
    summary: "A smart, simple to-do list that lives in a Chrome extension. Published on the Chrome Web Store.",
    status: "Released",
    period: "Nov 2024",
    when: 2024.88,
    kind: "Chrome extension",
    stack: ["HTML", "CSS", "JavaScript"],
    links: [
      { label: "Chrome Web Store", href: "https://chromewebstore.google.com/detail/donow-to-do-list/ledniccgbjopheokhlcpaajlblopaegf" },
      { label: "GitHub", href: "https://github.com/naman0r/doNow_chrome_extension" },
    ],
    image: "/projects/donow-pic.png",
    color: "#e8402a",
  },
];

export const featured = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function neighbors(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return {
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  };
}
