export type Track = "work" | "campus" | "studio";

export type Role = {
  title: string;
  period: string;
  /** Decimal years, so 2026.5 is 1 Jul 2026. Drives the timeline and the 3D skyline. */
  start: number;
  end: number;
  ongoing?: boolean;
  points: string[];
  tech: string[];
  link?: string;
};

export type Org = {
  id: string;
  org: string;
  /** Three-letter code for the timing tower. */
  code: string;
  track: Track;
  location: string;
  logo?: string;
  /** Scene and timeline color for this org. */
  color: string;
  note?: string;
  /** The one line that stands in for the whole org on the landing page. */
  impact: string;
  roles: Role[];
};

// Internship bullets come from the resume (updated Sep 2026); campus blurbs from the old /experience page.
export const experience: Org[] = [
  {
    id: "sonos",
    org: "Sonos",
    code: "SON",
    track: "work",
    location: "Boston, MA",
    logo: "/logos/sonos.png",
    color: "#eee7d7",
    impact: "Built 3 features from the ground up in the Sonos iOS app, a surface serving 10M+ DAUs.",
    roles: [
      {
        title: "Software Engineering Intern, iOS App Experience",
        period: "Jun — Aug 2026",
        start: 2026.417,
        end: 2026.667,
        points: [
          "Owned a core latency-sensitive iOS feature end to end: architecture, tests, telemetry and staged rollout for a real-time suggestion layer on a high-traffic surface.",
          "Built a reusable framework for detecting and presenting device, connectivity, configuration and network-topology issues across multi-device setups, and the user-facing UI with UX, serving 10M+ DAUs.",
        ],
        tech: ["Swift", "SwiftUI", "UIKit", "Swift Concurrency", "Combine", "Snowflake", "REST APIs"],
        link: "https://lnkd.in/p/eqp8QR2B",
      },
    ],
  },
  {
    id: "philips",
    org: "Philips Healthcare",
    code: "PHI",
    track: "work",
    location: "Cambridge, MA",
    logo: "/logos/philips.png",
    color: "#4f8bff",
    impact: "Automated PIC iX hospital deployments up to 2,550 beds, cutting setup from 100+ hours to 2 hours.",
    roles: [
      {
        title: "Software Engineering Co-op, Systems Integration & Automation",
        period: "Jan — May 2026",
        start: 2026.0,
        end: 2026.417,
        points: [
          "Built a declarative, self-scaling provisioning API for PIC iX hospital deployments from operator-defined network topologies and fixed MAC assignments, cutting environment setup from 100+ hours to 2 hours at max capacity (up to 2,550 beds).",
          "Built a self-scaling monitoring microservice that ingests metrics from thousands of VMs across hypervisors into TimescaleDB, sizes its own compute to the fleet, and reports through an AI agent in Teams.",
          "Maintained and extended the internal Deployment Manager (PostgreSQL, React, FastAPI, Python multithreading), improving orchestration, concurrency handling and network reliability.",
          "Extended deployment automation from VMs to bare metal through a FOG/PXE network-boot path wired into the existing FastAPI service.",
        ],
        tech: ["FastAPI", "Python", "PowerShell", "C#", ".NET", "TimescaleDB", "FOG/PXE", "Distributed Systems"],
      },
    ],
  },
  {
    id: "auribus",
    org: "Auribus Labs",
    code: "AUR",
    track: "work",
    location: "Boston, MA",
    logo: "/logos/auribus.jpg",
    color: "#3ccf7e",
    impact: "Hearing assessment at 95% accuracy in preliminary evaluations; FDA-compliant Rx iOS app used by 60+ clinical researchers.",
    note: "Part-time",
    roles: [
      {
        title: "Software Engineer Intern",
        period: "Feb — Sep 2025",
        start: 2025.083,
        end: 2025.75,
        points: [
          "Led research and development of a top-of-funnel interactive hearing assessment in Next.js, TypeScript, GraphQL and GCP, reaching 95% accuracy in preliminary diagnostic evaluations.",
          "Built an FDA-compliant Rx healthcare app in Swift and SwiftUI, deployed to 60+ clinical researchers.",
        ],
        tech: ["Next.js", "Swift", "SwiftUI", "GCP", "Hasura", "GraphQL"],
        link: "https://www.neocorehealth.com/",
      },
    ],
  },
  {
    id: "venu",
    org: "Venu AI",
    code: "VEN",
    track: "work",
    location: "Remote",
    logo: "/logos/venu.png",
    color: "#ffd23f",
    impact: "YC W21 startup. Core CRM workflows and async job pipelines; cut latency on high-volume endpoints by up to 70%.",
    note: "Y Combinator W21 · part-time",
    roles: [
      {
        title: "TPM and SWE Intern",
        period: "Apr — Jul 2025",
        start: 2025.25,
        end: 2025.583,
        points: [
          "Architected core CRM workflows and asynchronous background job pipelines with Django, Celery, Redis and PostgreSQL.",
          "Optimized database queries and high-volume REST endpoints, cutting latency by up to 70%.",
          "Refactored email-client API integrations to reduce spam flagging, and improved UI for key customer flows.",
        ],
        tech: ["React", "Python", "Django", "Azure", "Celery", "Redis"],
        link: "https://www.venu3d.com/",
      },
    ],
  },
  {
    id: "sideband",
    org: "Sideband",
    code: "SBD",
    track: "studio",
    location: "Boston, MA",
    logo: "/logos/sideband.png",
    color: "#b79cff",
    impact: "A few friends and I building cool stuff together: display streaming, media pipelines and web products.",
    note: "A few friends building things together",
    roles: [
      {
        title: "Member",
        period: "Present",
        start: 2026.583,
        end: 2026.75,
        ongoing: true,
        points: [
          "A few friends and I building things together under one name (formerly Eternal Reverse): display streaming, media pipelines, fitness software and web products, including EternalMonitor and Exerly.",
          "Worked on the rebrand to Sideband and the new studio site at sideband.studio. TandemCode is mirrored in the studio's GitHub org.",
        ],
        tech: ["Next.js", "TypeScript", "Rust", "Swift"],
        link: "https://www.sideband.studio",
      },
    ],
  },
  {
    id: "tamid",
    org: "TAMID at Northeastern",
    code: "TAM",
    track: "campus",
    location: "Boston, MA",
    logo: "/logos/tamid.jpg",
    color: "#5ec8ff",
    impact:
      "Director of Software. Before that: a quant research platform for a Boston hedge fund, and tech lead for a hotel-pricing startup.",
    roles: [
      {
        title: "Director of Software",
        period: "Jul 2026 — Present",
        start: 2026.5,
        end: 2026.75,
        ongoing: true,
        points: ["Runs the Software Engineering track (formerly Tech Consulting)."],
        tech: [],
        link: "https://www.nutamidtech.org/",
      },
      {
        title: "Software Developer",
        period: "Jan — Jul 2026",
        start: 2026.0,
        end: 2026.583,
        points: [
          "Built a full-stack quant research platform for a Boston hedge fund to generate, backtest and explore trading signals: a Python quant engine running as async Redis + RQ jobs behind FastAPI, with a Next.js frontend for interactive analysis.",
        ],
        tech: ["FastAPI", "Redis", "Celery", "Next.js", "Python", "PostgreSQL"],
      },
      {
        title: "Tech Consulting Foundations Instructor",
        period: "Jan — Jul 2026",
        start: 2026.0,
        end: 2026.583,
        points: ["Taught the Tech Consulting Foundations curriculum to 15+ students."],
        tech: [],
      },
      {
        title: "Technical Product Manager (Tech Lead)",
        period: "Sep — Dec 2025",
        start: 2025.667,
        end: 2026.0,
        points: ["Led Foresight, working with a startup in an agile setup to give boutique hotels real-time pricing insights."],
        tech: ["FastAPI", "PostgreSQL", "Neon", "Next.js", "CI/CD", "RAG"],
        link: "https://foresight-tamid.vercel.app/about",
      },
      {
        title: "TCF and Education Member",
        period: "Jan — Aug 2025",
        start: 2025.0,
        end: 2025.667,
        points: ["Tech Consulting Foundations and education track member."],
        tech: ["Docker", "Flask"],
      },
    ],
  },
  {
    id: "c4c",
    org: "Code4Community",
    code: "C4C",
    track: "campus",
    location: "Boston, MA",
    logo: "/logos/c4c.jpg",
    color: "#e8402a",
    impact: "Pro-bono software for Blue Hill Observatory, Boston Health Care for the Homeless Program and 826 Boston.",
    note: "Pro-bono software consultancy",
    roles: [
      {
        title: "Software Developer, Blue Hill Observatory",
        period: "Sep 2026 — Present",
        start: 2026.667,
        end: 2026.75,
        ongoing: true,
        points: [
          "Early days on a new app for Blue Hill Observatory that imports its daily weather-observation spreadsheets into PostgreSQL on AWS RDS.",
          "Drafted the initial database schema: uploads, daily, hourly and scheduled observations, historical daily records and an audit log.",
        ],
        tech: ["TypeScript", "NestJS", "React", "PostgreSQL", "TypeORM", "AWS"],
        link: "https://github.com/Code-4-Community/bho",
      },
      {
        title: "Software Developer, BHCHP",
        period: "May — Aug 2026",
        start: 2026.333,
        end: 2026.667,
        points: [
          "Built for Boston Health Care for the Homeless Program, which provides care to people experiencing homelessness across Boston.",
        ],
        tech: [],
        link: "https://github.com/Code-4-Community/proj-bhchp",
      },
      {
        title: "Software Developer, 826 Boston",
        period: "Jan — Apr 2026",
        start: 2026.0,
        end: 2026.333,
        points: ["Built for 826 Boston, a youth writing nonprofit."],
        tech: ["Next.js", "AWS", "PostgreSQL", "Jest", "TypeScript"],
        link: "https://826boston.org/",
      },
      {
        title: "Software Developer, Core Infrastructure",
        period: "Sep — Dec 2025",
        start: 2025.667,
        end: 2026.0,
        points: ["Core Infrastructure team, working on C4C's internal recruitment dashboard."],
        tech: ["NestJS", "AWS", "TypeScript"],
        link: "https://www.c4cneu.com/people",
      },
    ],
  },
  {
    id: "forge",
    org: "Forge",
    code: "FRG",
    track: "campus",
    location: "Boston, MA",
    logo: "/logos/forge.jpg",
    color: "#ff8fb8",
    impact: "Product studio. Software lead on BackBuddy, an Arduino-integrated posture app; engineer on SmartStep.",
    note: "Product development studio",
    roles: [
      {
        title: "Software Lead, team BackBuddy",
        period: "Jan — Apr 2025",
        start: 2025.0,
        end: 2025.333,
        points: ["Software lead on BackBuddy, a cross-platform Arduino-integrated mobile app to help improve posture."],
        tech: ["Embedded", "React Native", "Arduino", "Firebase"],
        link: "https://github.com/naman0r/backbuddy-app",
      },
      {
        title: "Software Engineer, team SmartStep",
        period: "Sep — Dec 2024",
        start: 2024.667,
        end: 2025.0,
        points: ["An app for a height-adjusting cane with tracking, to help the elderly climb stairs and find the cane if it's lost."],
        tech: ["React Native", "Arduino"],
        link: "https://www.forgenu.com/",
      },
    ],
  },
  {
    id: "oasis",
    org: "Oasis at Northeastern",
    code: "OAS",
    track: "campus",
    location: "Boston, MA",
    logo: "/logos/oasis.png",
    color: "#9fe870",
    impact: "Built NUtrition, a Northeastern dining hall macro tracker, now in production.",
    roles: [
      {
        title: "Software Developer",
        period: "Jan — May 2025",
        start: 2025.0,
        end: 2025.417,
        points: ["Built NUtrition, a Northeastern dining hall macronutrient tracker, now in production."],
        tech: ["Supabase", "Flask", "React", "Selenium"],
        link: "https://nutrition-oasis.vercel.app",
      },
    ],
  },
];

const decimalYear = (d: Date) => d.getUTCFullYear() + d.getUTCMonth() / 12 + (d.getUTCDate() - 1) / 365;

/** Ongoing roles run to the day the site was built. */
export const NOW = decimalYear(new Date());
export const roleEnd = (r: Role) => (r.ongoing ? Math.max(r.end, NOW) : r.end);

export const TIMELINE_START = Math.min(...experience.flatMap((o) => o.roles.map((r) => r.start)));
export const TIMELINE_END = Math.max(...experience.flatMap((o) => o.roles.map(roleEnd)));

export function months(role: Role) {
  return Math.max(1, Math.round((roleEnd(role) - role.start) * 12));
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const monthYear = (y: number) => {
  const m = Math.round((y % 1) * 12);
  return `${MONTHS[m % 12]} ${Math.floor(y) + Math.floor(m / 12)}`;
};

/** First start to last end across every role, e.g. "Jan 2025 — Present". */
export function orgPeriod(org: Org) {
  if (org.roles.length === 1) return org.roles[0].period;
  const start = Math.min(...org.roles.map((r) => r.start));
  const end = Math.max(...org.roles.map((r) => r.end));
  // Role ends are exclusive (1 Sep means "through August"), so step back a month.
  return `${monthYear(start)} — ${org.roles.some((r) => r.ongoing) ? "Present" : monthYear(end - 1 / 12)}`;
}
