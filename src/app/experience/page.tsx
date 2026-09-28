import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExperienceLog } from "@/components/ExperienceLog";
import { Gantt } from "@/components/Gantt";
import { experience, monthYear, TIMELINE_START } from "@/content/experience";
import { education, profile, skills } from "@/content/profile";

const description = "Every internship, studio and campus role, and what I built in each.";

export const metadata: Metadata = {
  title: "Experience",
  description,
  alternates: { canonical: "/experience" },
  openGraph: { title: "Experience · Naman Rusia", description, url: "/experience" },
};

export default function ExperiencePage() {
  const roles = experience.reduce((n, o) => n + o.roles.length, 0);

  return (
    <main id="main" data-shot="skyline" className="px-4 pb-24 pt-24 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <Link href="/" className="label text-dust hover:text-bone">
          ← Home
        </Link>
        <header className="mt-10 max-w-[880px]">
          <p className="label text-dust">
            <span className="text-accent">02</span> · Full timeline
          </p>
          <h1 className="font-display mt-3 text-[clamp(3rem,10vw,7.5rem)] text-bone">Experience</h1>
          <p className="mt-5 max-w-2xl text-lg text-dust">
            {experience.length} teams and {roles} roles since {monthYear(TIMELINE_START)}: internships first, then the studio I co-founded,
            then everything on campus. The skyline behind this page is the same timeline in voxels.
          </p>
        </header>

        <div className="mt-12 max-w-[880px] space-y-14">
          <Gantt />
          <ExperienceLog />

          <section aria-labelledby="edu-title" className="grid gap-6 border-2 border-bone bg-coal p-6 md:grid-cols-[180px_1fr] md:gap-8">
            <div className="flex items-start gap-3 md:flex-col">
              <span className="grid size-11 place-items-center bg-bone p-1.5">
                <Image src={education.logo} alt="" width={32} height={32} className="size-8 object-contain" />
              </span>
              <div>
                <p className="label text-accent">Home base</p>
                <h2 id="edu-title" className="font-display text-xl text-bone">
                  {education.school}
                </h2>
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-bone">{education.degree}</p>
              <p className="label mt-1 text-[10px] leading-relaxed text-dust">
                {education.location} · Expected {education.graduation} · GPA {education.gpa} · {education.honors.join(", ")}
              </p>
              <p className="label mt-5 text-[10px] text-dust">Coursework</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {education.courses.map((c) => (
                  <li key={c} className="border border-line px-2 py-0.5 text-[13px] text-bone/80">
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-dust">Before that: {education.highSchool}.</p>
            </div>
          </section>

          <section aria-labelledby="stack-title">
            <h2 id="stack-title" className="label mb-4 text-accent">
              Stack I reach for
            </h2>
            <dl className="space-y-3 border-t-2 border-line pt-4">
              {skills.map((g) => (
                <div key={g.group} className="grid gap-1 md:grid-cols-[140px_1fr]">
                  <dt className="label text-dust">{g.group}</dt>
                  <dd className="text-bone/85">{g.items.join(" · ")}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-10 text-dust">
              The one-page version is{" "}
              <a
                href={profile.resume}
                target="_blank"
                className="text-bone underline decoration-accent decoration-2 underline-offset-4 hover:text-accent"
              >
                resume.pdf
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
