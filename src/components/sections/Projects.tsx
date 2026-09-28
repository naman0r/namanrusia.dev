import Link from "next/link";
import { HeroCartridge } from "@/components/HeroCartridge";
import { ProjectList } from "@/components/ProjectList";
import { CtaLink, Heading, Section } from "@/components/Section";
import { StatusTag } from "@/components/StatusTag";
import { featured, projects } from "@/content/projects";

/** Only the featured set lives here; the ring of cartridges behind it is the same set. */
export function Projects() {
  const [lead, ...rest] = featured;
  return (
    <Section id="projects" shot="carts" className="py-28 md:py-40">
      <Heading
        id="projects"
        index="03"
        title="Projects"
        kicker="Level select"
        href="/projects"
        cta={`All ${projects.length} projects`}
        tone="coin"
      />

      <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <HeroCartridge project={lead} />
        <div className="border-2 border-line bg-ink p-6 lg:col-span-5">
          <p className="label flex flex-wrap items-center gap-3 text-dust">
            <StatusTag status={lead.status} /> {lead.period} · {lead.role}
          </p>
          <h3 className="font-display mt-4 text-[clamp(2.5rem,5vw,4rem)] text-bone">{lead.title}</h3>
          <p className="mt-3 text-xl text-bone">{lead.tagline}</p>
          <p className="mt-3 text-dust">{lead.summary}</p>
          <p className="label mt-5 text-[11px] normal-case leading-relaxed tracking-normal text-dust">
            {lead.stack.slice(0, 10).join(" / ")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/projects/${lead.slug}`}
              className="label bg-accent px-4 py-2 text-ink shadow-[3px_3px_0_0_var(--color-bone)] transition-transform hover:-translate-y-px active:translate-y-0.5 active:shadow-none"
            >
              Play level →
            </Link>
            {lead.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="border-2 border-line px-4 py-1.5 text-sm text-bone hover:border-bone"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        </div>
      </article>

      <div className="mt-24 max-w-[1000px]">
        <h3 className="label mb-4 text-accent">World 1 · featured</h3>
        <ProjectList items={rest} start={2} />
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4">
        <CtaLink href="/projects">Browse all {projects.length} projects</CtaLink>
        <p className="text-sm text-dust">
          {projects.length - featured.length} more, from a Clash Royale RL bot to a Chrome extension on the Web Store.
        </p>
      </div>
    </Section>
  );
}
