export const profile = {
  name: "Naman Rusia",
  handle: "naman0r",
  location: "Boston, MA",
  email: "rusia.n@northeastern.edu",
  photo: "/profile_pic.jpeg",
  resume: "/resume.pdf",
  status: "Open to Spring 2027 and Summer 2027 co-ops and internships",
  // From the note on the old /more page.
  motto: "I like Building, Iterating and shipping software to effect impact",
  links: {
    github: "https://github.com/naman0r",
    linkedin: "https://linkedin.com/in/namanrusia",
    x: "https://x.com/namanrusia1",
    source: "https://github.com/naman0r/namanrusia.dev",
  },
  glance: [
    {
      label: "Now",
      value:
        "Classes, Director of Software at TAMID at Northeastern, Developer at Code4Community",
    },
    {
      label: "Previously",
      value:
        "SWE intern @ Sonos and Philips Healthcare, + Auribus Labs and Venu AI (YC W21)",
    },
    {
      label: "Education",
      value:
        "Computer Science and Finance at Northeastern University, graduating in May 2028",
    },
    { label: "Focus", value: "Backend, cloud, systems and novel problems" },
  ],
} as const;

/** Title-screen links; pressing the key opens the link. E copies the email. */
export const heroLinks = [
  { key: "r", label: "Resume", href: profile.resume, icon: "doc" },
  { key: "g", label: "GitHub", href: profile.links.github, icon: "github" },
  {
    key: "l",
    label: "LinkedIn",
    href: profile.links.linkedin,
    icon: "linkedin",
  },
  { key: "x", label: "X", href: profile.links.x, icon: "x" },
] as const;

export const education = {
  school: "Northeastern University",
  degree: "BS Computer Science and Business Administration",
  location: "Boston, MA",
  graduation: "May 2028",
  gpa: "3.8 / 4.0",
  honors: ["Dean's List"],
  courses: [
    "Foundations of Artificial Intelligence",
    "Object-Oriented Design",
    "Algorithms and Data",
    "Foundations of Cybersecurity",
    "Database Design",
    "Foundations of Data Science",
    "Discrete Structures",
    "Large Scale Information Storage and Retrieval",
  ],
  highSchool: "Singapore American School, class of 2024",
  logo: "/logos/northeastern.png",
};

/** Places the globe lights up, in the order Naman lived in them. */
export const homes = [
  { code: "US", label: "Born in the US", lat: 39.5, lon: -98.35 },
  { code: "IN", label: "Grew up in India", lat: 22.5, lon: 79 },
  { code: "SG", label: "High school in Singapore", lat: 1.35, lon: 103.82 },
  { code: "BOS", label: "Now in Boston", lat: 42.36, lon: -71.06 },
] as const;

export const countriesVisited = 16;

export const about = {
  paragraphs: [
    "I'm Naman. I grew up in India and Singapore, and now live in Boston, where I study Computer Science and Business at Northeastern.",
    "I got into software during my first semester of college. Since then, I've worked at startups, Philips, and Sonos, and a lot of side projects. Lately, I've been interested in backend systems and tools that make building software easier.",
    "At school, Director of Software Engineering at TAMID, and developer at Code4Community (pro bono Software for non profits). Outside of that, I like playing guitar, music, lifting, and Clash Royale.",
  ],
};

// Captions are the file names from the old /more page.
export const photos = [
  {
    src: "/photos/skydiving.jpg",
    name: "8500.jpg",
    alt: "Naman tandem skydiving",
    w: 1600,
    h: 736,
  },
  {
    src: "/photos/hk.jpeg",
    name: "hk.jpeg",
    alt: "Naman at The Peak in Hong Kong, the skyline behind",
    w: 1024,
    h: 768,
  },
  {
    src: "/photos/layla.jpeg",
    name: "layla.jpeg",
    alt: "Layla, a fluffy white dog, looking up at the camera",
    w: 645,
    h: 1218,
  },
  {
    src: "/photos/big-buddha.jpg",
    name: "hk2.jpg",
    alt: "Naman at the gate below the Big Buddha in Hong Kong",
    w: 1600,
    h: 1200,
  },
  {
    src: "/photos/rank-1-of-521.jpg",
    name: "slitherio.png",
    alt: "A slither.io leaderboard showing rank 1 of 521",
    w: 1600,
    h: 736,
  },
  {
    src: "/photos/mom.jpeg",
    name: "maldives.jpeg",
    alt: "Naman and Mom in a golf cart by the beach",
    w: 1024,
    h: 768,
  },
  {
    src: "/photos/dab.jpeg",
    name: "louvre.jpeg",
    alt: "A young Naman posing in front of the Louvre pyramid",
    w: 665,
    h: 1182,
  },
  {
    src: "/photos/the-pru.jpeg",
    name: "boston.jpeg",
    alt: "Boston skyline at dusk with the Prudential Tower",
    w: 1600,
    h: 1200,
  },
  {
    src: "/photos/sid2.jpeg",
    name: "singapore.jpeg",
    alt: "Naman and a friend at a table at night in George Town",
    w: 1024,
    h: 768,
  },
  {
    src: "/photos/deck-12.jpeg",
    name: "deck-12.jpeg",
    alt: "Sunset over the sea from a ship's top deck",
    w: 1600,
    h: 1200,
  },
  {
    src: "/photos/strava-harvard-bridge.png",
    name: "out_walking.jpeg",
    alt: "A Strava route across the Harvard Bridge from Cambridge into Boston",
    w: 982,
    h: 616,
  },
];

export const skills = [
  {
    group: "Languages",
    items: [
      "Python",
      "Java",
      "TypeScript",
      "Swift",
      "SQL",
      "C++",
      "Go",
      "HTML/CSS",
    ],
  },
  {
    group: "Frameworks",
    items: [
      "React",
      "Next.js",
      "SwiftUI",
      "FastAPI",
      "Flask",
      "Node.js",
      ".NET",
      "React Native",
      "GraphQL",
      "PyTest",
    ],
  },
  {
    group: "Infra & data",
    items: [
      "AWS",
      "GCP",
      "Azure",
      "Docker",
      "PostgreSQL",
      "TimescaleDB",
      "Redis",
      "Nutanix",
      "FOG/PXE",
      "Grafana",
      "Git",
    ],
  },
];
