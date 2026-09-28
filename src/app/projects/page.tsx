import type { Metadata } from "next";
import Link from "next/link";
import { ProjectList } from "@/components/ProjectList";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Every project I've built, newest first: developer tools, AI apps, hardware and hackathon builds.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsIndex() {
  const byYear = Map.groupBy(
    [...projects].sort((a, b) => b.when - a.when),
    (p) => Math.floor(p.when),
  );

  return (
    <main id="main" data-shot="shelf" className="px-4 pb-24 pt-24 md:px-8">
      <div className="mx-auto max-w-[1100px]">
        <Link href="/" className="label text-dust hover:text-bone">
          ← Home
        </Link>
        <header className="mt-10">
          <p className="label text-dust">
            <span className="text-accent">03</span> · All levels
          </p>
          <h1 className="font-display mt-3 text-[clamp(3rem,10vw,7.5rem)] text-bone">Projects</h1>
          <p className="mt-5 max-w-2xl text-lg text-dust">
            All {projects.length}, newest first. Each one has its own page with the problem, what I built, and how.
          </p>
        </header>

        {[...byYear].map(([year, list]) => (
          <section key={year} aria-labelledby={`y${year}`} className="mt-16">
            <h2 id={`y${year}`} className="label mb-3 flex items-baseline justify-between text-accent">
              <span>{year}</span>
              <span className="text-dust">{list.length} projects</span>
            </h2>
            <ProjectList items={list} />
          </section>
        ))}
      </div>
    </main>
  );
}
