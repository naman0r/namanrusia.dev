export const profile = {
  name: "Naman Rusia",
  handle: "naman0r",
  location: "Boston, MA",
  email: "rusia.n@northeastern.edu",
  photo: "/profile_pic.jpeg",
  resume: "/resume.pdf",
  status: "Open to Spring 2027 and Summer 2027 co-ops and internships",
  // From the note on the old /more page.
  thesis: "I like building things end to end, and I think the best software feels obsessed over.",
  intro:
    "CS + Business at Northeastern. Shipped iOS features at Sonos and hospital deployment automation at Philips. Co-founder at Sideband. After hours I build developer tools like Dockmaster, Canvas Buddy and Git Interviewer.",
  links: {
    github: "https://github.com/naman0r",
    linkedin: "https://linkedin.com/in/namanrusia",
    x: "https://x.com/namanrusia1",
    source: "https://github.com/naman0r/namanrusia.dev",
  },
  glance: [
    { label: "Now", value: "Director of Software at TAMID. Co-founder at Sideband. Back in classes." },
    { label: "Previously", value: "SWE intern at Sonos and Philips Healthcare, plus Auribus Labs and Venu AI (YC W21)" },
    { label: "Education", value: "Northeastern, BS CS + Business, Apr 2028" },
    { label: "Focus", value: "Backend, cloud and systems" },
  ],
} as const;

/** Title-screen links; pressing the key opens the link. E copies the email. */
export const heroLinks = [
  { key: "r", label: "Resume", href: profile.resume, icon: "doc" },
  { key: "g", label: "GitHub", href: profile.links.github, icon: "github" },
  { key: "l", label: "LinkedIn", href: profile.links.linkedin, icon: "linkedin" },
  { key: "x", label: "X", href: profile.links.x, icon: "x" },
] as const;

export const education = {
  school: "Northeastern University",
  degree: "BS Computer Science and Business Administration",
  location: "Boston, MA",
  graduation: "Apr 2028",
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
    "Born in the US, raised mostly in India and Singapore. In high school in Singapore I co-founded the Entrepreneurship Club and led it to JA Company of the Year (Most Promising) in my junior year. That was the first thing I built that I was proud of, and it's why I picked Computer Science and Business.",
    "I haven't been coding since I was six. The eureka moment came in my first semester of college, when I got obsessed with a project idea. I've been building ever since.",
    "At Northeastern I've built mobile apps at Forge, shipped tech consulting projects at TAMID (where I now run the software track), worked on pro-bono software at Code4Community, and built NUtrition with friends at Oasis.",
  ],
  offline:
    "Friends, the gym, road biking, and travel (16 countries so far). I've come to love cooking. I can solve a Rubik's cube in under 30 seconds, I'm hugely addicted to Clash Royale, and I've been getting into F1.",
  funFacts: [
    "I can crack my neck really loud",
    "I've visited 16+ countries around the world",
    "I can solve a Rubik's cube in under 30 seconds",
    "My favorite programming framework is React",
    "I'm a night owl and do my best coding after midnight",
    "Favorite brew: black. just black.",
    "Currently on repeat: Instant Crush, Daft Punk",
  ],
};

// Captions are the file names from the old /more page.
export const photos = [
  { src: "/photos/skydiving.jpg", name: "13000ft.jpg", alt: "Naman tandem skydiving", w: 1600, h: 736 },
  { src: "/photos/hk.jpeg", name: "the-peak.jpeg", alt: "Naman at The Peak in Hong Kong, the skyline behind", w: 1024, h: 768 },
  { src: "/photos/layla.jpeg", name: "layla.jpeg", alt: "Layla, a fluffy white dog, looking up at the camera", w: 645, h: 1218 },
  { src: "/photos/big-buddha.jpg", name: "big-buddha.jpg", alt: "Naman at the gate below the Big Buddha in Hong Kong", w: 1600, h: 1200 },
  { src: "/photos/rank-1-of-521.jpg", name: "rank-1-of-521.png", alt: "A slither.io leaderboard showing rank 1 of 521", w: 1600, h: 736 },
  { src: "/photos/mom.jpeg", name: "mom.jpeg", alt: "Naman and Mom in a golf cart by the beach", w: 1024, h: 768 },
  { src: "/photos/dab.jpeg", name: "louvre-2016.jpeg", alt: "A young Naman posing in front of the Louvre pyramid", w: 665, h: 1182 },
  { src: "/photos/the-pru.jpeg", name: "the-pru.jpeg", alt: "Boston skyline at dusk with the Prudential Tower", w: 1600, h: 1200 },
  { src: "/photos/sid2.jpeg", name: "sid-again.jpeg", alt: "Naman and a friend at a table at night in George Town", w: 1024, h: 768 },
  { src: "/photos/deck-12.jpeg", name: "deck-12.jpeg", alt: "Sunset over the sea from a ship's top deck", w: 1600, h: 1200 },
  {
    src: "/photos/strava-harvard-bridge.png",
    name: "long_walks.jpeg",
    alt: "A Strava route across the Harvard Bridge from Cambridge into Boston",
    w: 982,
    h: 616,
  },
];

export const skills = [
  { group: "Languages", items: ["Python", "Java", "TypeScript", "Swift", "SQL", "C++", "Go", "HTML/CSS"] },
  {
    group: "Frameworks",
    items: ["React", "Next.js", "SwiftUI", "FastAPI", "Flask", "Node.js", ".NET", "React Native", "GraphQL", "PyTest"],
  },
  {
    group: "Infra & data",
    items: ["AWS", "GCP", "Azure", "Docker", "PostgreSQL", "TimescaleDB", "Redis", "Nutanix", "FOG/PXE", "Grafana", "Git"],
  },
];
