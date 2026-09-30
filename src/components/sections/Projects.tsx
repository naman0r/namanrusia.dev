import { ProjectCard } from "@/components/ProjectCard";
import { CtaLink, Heading, Section } from "@/components/Section";
import { featured, projects } from "@/content/projects";

/** Only the featured projects live here; the ring of cartridges behind them is the same set. */
export function Projects() {
  return (
    <Section id="projects" shot="carts" className="py-28 md:py-40">
      <Heading
        id="projects"
        index="03"
        title="Projects"
        href="/projects"
        cta={`All ${projects.length} projects`}
        tone="coin"
      />
      <div className="space-y-5 lg:w-[62%]">
        {featured.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
      <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4">
        <CtaLink href="/projects" shadow="var(--color-coin)">
          Browse all {projects.length} projects
        </CtaLink>
        <p className="text-sm text-dust">
          view more cool things and software I've built
        </p>
      </div>
    </Section>
  );
}
