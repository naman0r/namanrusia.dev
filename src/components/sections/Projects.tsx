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
      <div className="mt-12">
        <CtaLink href="/projects" shadow="var(--color-coin)">
          Browse all {projects.length} projects
        </CtaLink>
      </div>
    </Section>
  );
}
