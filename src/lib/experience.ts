export type Kind = "work" | "campus";

export type Role = {
  org: string;
  title: string;
  /** short label that has to fit inside a bar */
  short: string;
  blurb: string;
  location: string;
  period: string;
  /** decimal years: 2026.0 == 1 Jan 2026, 2026.5 == 1 Jul 2026 */
  start: number;
  end: number;
  ongoing?: boolean;
  kind: Kind;
  tech: string[];
  link?: string;
};

// clubs, internships, co-op positions
export const roles: Role[] = [
  // ---------- internships and co-ops ----------
  {
    org: "Sonos",
    title: "Software Engineering Intern, iOS App Experience",
    short: "SWE Intern, iOS",
    blurb:
      "Worked on several exciting user facing features for the Sonos iOS app. Implemented 3 major features from the ground up, implementing telemetry and architecting the feature. ",
    location: "Boston, MA",
    period: "Jun — Aug 2026",
    start: 2026.417,
    end: 2026.667,
    kind: "work",
    tech: [
      "Swift",
      "SwiftUI",
      "UIKit",
      "Swift Concurrency",
      "Snowflake",
      "REST APIs",
    ],
    link: "https://lnkd.in/p/eqp8QR2B",
  },
  {
    org: "Philips Healthcare",
    title: "Software Engineering Co-op, Systems Integration & Automation",
    short: "SWE Co-op",
    blurb:
      "Developed declarative provisioning and orchestration automation pipeline for Philips PICiX patient-monitoring systems. Using FastAPI, Python multithreading, and PXE network booting; Automated multi-machine hospital deployments up to 2,550 beds, slashing environment setup time from 100+ hours to 2–3 hours.",
    location: "Cambridge, MA",
    period: "Jan — May 2026",
    start: 2026.0,
    end: 2026.417,
    kind: "work",
    tech: [
      "FastAPI",
      "Python",
      "PowerShell",
      "C#",
      ".NET",
      "Distributed Systems",
    ],
  },
  {
    org: "Auribus Labs",
    title: "Software Engineer Intern",
    short: "SWE Intern",
    blurb:
      "Built 2 full-stack web applications for research and development of a new product, plus a research iOS application in native development.",
    location: "Boston, MA",
    period: "Feb — Sep 2025",
    start: 2025.083,
    end: 2025.75,
    kind: "work",
    tech: ["Next.js", "Swift", "iOS Development", "GCP", "Hasura", "GraphQL"],
    link: "https://www.neocorehealth.com/",
  },
  {
    org: "Venu AI",
    title: "TPM and SWE Intern",
    short: "TPM / SWE Intern",
    blurb:
      "Y Combinator (W21) backed startup. Built several core features and improved CRM infrastructure and asynchronous processing pipelines using Django, PostgreSQL, Celery, and Redis.",
    location: "Remote",
    period: "Apr — Jul 2025",
    start: 2025.25,
    end: 2025.583,
    kind: "work",
    tech: ["React", "Python", "Django", "Azure", "Celery", "Redis"],
    link: "https://www.venu3d.com/",
  },

  // ---------- TAMID ----------
  {
    org: "TAMID at Northeastern",
    title: "Director of Software",
    short: "Director of Software",
    blurb: "🧑‍💻",
    location: "Boston, MA",
    period: "Jul 2026 — Present",
    start: 2026.5,
    end: 2026.667,
    ongoing: true,
    kind: "campus",
    tech: [],
    link: "https://www.nutamidtech.org/",
  },
  {
    org: "TAMID at Northeastern",
    title: "Tech Consulting Foundations Instructor",
    short: "TCF Instructor",
    blurb: "Taught the Tech Consulting Foundations curriculum to 15+ students.",
    location: "Boston, MA",
    period: "Jan — Jul 2026",
    start: 2026.0,
    end: 2026.583,
    kind: "campus",
    tech: [],
  },
  {
    org: "TAMID at Northeastern",
    title: "Software Developer",
    short: "Software Developer",
    blurb:
      "Worked with a Hedge Fund in the Boston area. Built a full-stack quant research platform for a Boston hedge fund to generate, backtest, and explore trading signals. Ran computations as async background jobs with Redis + RQ behind a FastAPI layer, with a Python quant engine and Next.js frontend for interactive analysis.",
    location: "Boston, MA",
    period: "Jan — Jul 2026",
    start: 2026.0,
    end: 2026.583,
    kind: "campus",
    tech: ["Celery", "Redis", "FastAPI", "Next.js", "Python", "PostgreSQL"],
  },
  {
    org: "TAMID at Northeastern",
    title: "Technical Product Manager (Tech Lead)",
    short: "TPM / Tech Lead",
    blurb:
      "Working with a startup in an agile environment to provide real-time pricing insights to boutique hotels.",
    location: "Boston, MA",
    period: "Sep — Dec 2025",
    start: 2025.667,
    end: 2026.0,
    kind: "campus",
    tech: [
      "Product Management",
      "FastAPI",
      "PostgreSQL",
      "Neon DB",
      "Next.js",
      "CI/CD",
      "RAG",
    ],
    link: "https://foresight-tamid.vercel.app/about",
  },
  {
    org: "TAMID at Northeastern",
    title: "TCF and Education Member",
    short: "TCF & Education",
    blurb: "Tech Consulting Foundations and education track member.",
    location: "Boston, MA",
    period: "Jan — Aug 2025",
    start: 2025.0,
    end: 2025.667,
    kind: "campus",
    tech: ["Docker", "Flask"],
  },

  // ---------- Code4Community ----------

  {
    org: "Code4Community",
    title: "Software Developer, BHCHP",
    short: "BHCHP",
    blurb:
      "Building for Boston Health Care for the Homeless Program, which provides care to people experiencing homelessness across Boston.",
    location: "Boston, MA",
    period: "May — Aug 2026",
    start: 2026.333,
    end: 2026.667,
    kind: "campus",
    tech: [],
    link: "https://github.com/Code-4-Community/proj-bhchp",
  },
  {
    org: "Code4Community",
    title: "Software Developer, 826 Boston",
    short: "826 Boston",
    blurb: "Building for 826 Boston, a youth writing nonprofit.",
    location: "Boston, MA",
    period: "Jan — Apr 2026",
    start: 2026.0,
    end: 2026.333,
    kind: "campus",
    tech: ["Next.js", "AWS", "PostgreSQL", "Jest", "TypeScript"],
    link: "https://826boston.org/",
  },
  {
    org: "Code4Community",
    title: "Software Developer, Core Infrastructure",
    short: "Core Infra",
    blurb: "Core Infrastructure team.",
    location: "Boston, MA",
    period: "Sep — Dec 2025",
    start: 2025.667,
    end: 2026.0,
    kind: "campus",
    tech: ["NestJS", "AWS", "TypeScript"],
    link: "https://www.c4cneu.com/people",
  },

  // Fall Code4Community project. TODO fill when get assignment
  // `start`/`end` are decimal years: 2026.75 == Oct 2026.

  // {
  //   org: "Code4Community",
  //   title: "Software Developer",
  //   short: "TBD",
  //   blurb: "",
  //   location: "Boston, MA",
  //   period: "Sep 2026 — Present",
  //   start: 2026.667,
  //   end: 2026.667,
  //   ongoing: true,
  //   kind: "campus",
  //   tech: [],
  // },

  // ---------- Forge ----------
  {
    org: "Forge",
    title: "Software Lead, team BackBuddy",
    short: "BackBuddy",
    blurb:
      "Software lead on Team BackBuddy: a cross-platform Arduino-integrated mobile app to help improve posture.",
    location: "Boston, MA",
    period: "Jan — Apr 2025",
    start: 2025.0,
    end: 2025.333,
    kind: "campus",
    tech: ["Embedded Software", "React Native", "Arduino", "Firebase"],
    link: "https://github.com/naman0r/backbuddy-app",
  },
  {
    org: "Forge",
    title: "Software Engineer, team SmartStep",
    short: "SmartStep",
    blurb:
      "Team SmartStep: an app for a height-adjusting cane with tracking, to help the elderly climb stairs and to locate the cane if lost.",
    location: "Boston, MA",
    period: "Sep — Dec 2024",
    start: 2024.667,
    end: 2025.0,
    kind: "campus",
    tech: ["React Native", "Arduino"],
    link: "https://www.forgenu.com/",
  },

  // ---------- Oasis ----------
  {
    org: "Oasis at Northeastern",
    title: "Software Developer",
    short: "NUtrition",
    blurb:
      "Built NUtrition, a Northeastern dining hall macronutrient tracker, now in production.",
    location: "Boston, MA",
    period: "Jan — May 2025",
    start: 2025.0,
    end: 2025.417,
    kind: "campus",
    tech: ["Supabase", "Flask", "React", "Selenium"],
    link: "https://nutrition-oasis.vercel.app",
  },
];

/** Render order: internships first, then each org's roles newest-first. */
const orgOrder = [
  "Sonos",
  "Philips Healthcare",
  "Auribus Labs",
  "Venu AI",
  "TAMID at Northeastern",
  "Code4Community",
  "Forge",
  "Oasis at Northeastern",
];

export function groupedByOrg() {
  return orgOrder
    .map((org) => ({
      org,
      roles: roles
        .filter((r) => r.org === org)
        .sort((a, b) => b.start - a.start),
    }))
    .filter((g) => g.roles.length > 0);
}

export const AXIS_START = 2024.583;
export const AXIS_END = 2026.75;

/** Whole months a role ran for, for the "4 mos" line. */
export function months(role: Role) {
  return Math.max(1, Math.round((role.end - role.start) * 12));
}

export const NOW = 2026.667;

/** Total span an org covers, across all its roles: "1 yr 8 mos". */
export function orgSpan(list: Role[]) {
  const start = Math.min(...list.map((r) => r.start));
  const end = Math.max(...list.map((r) => r.end));
  const total = Math.max(1, Math.round((end - start) * 12));
  const years = Math.floor(total / 12);
  const rest = total % 12;
  if (years && rest) return `${years} yr ${rest} mos`;
  if (years) return `${years} yr`;
  return `${rest} mos`;
}

/** Org logos, served locally. The source images are mostly dark-on-white, so
 *  they are rendered on a light tile rather than straight onto the page. */
export const orgLogos: Record<string, string> = {
  Sonos: "/logos/sonos.png",
  "Philips Healthcare": "/logos/philips.png",
  "Auribus Labs": "/logos/auribus.jpg",
  "Venu AI": "/logos/venu.png",
  "TAMID at Northeastern": "/logos/tamid.jpg",
  Code4Community: "/logos/c4c.jpg",
  Forge: "/logos/forge.jpg",
  "Oasis at Northeastern": "/logos/oasis.png",
};

