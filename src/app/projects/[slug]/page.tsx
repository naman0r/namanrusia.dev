import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PixelPlaceholder } from "@/components/PixelPlaceholder";
import { ProjectFocus } from "@/components/ProjectFocus";
import { StatusTag } from "@/components/StatusTag";
import { getProject, neighbors, projects } from "@/content/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  const description = `${p.tagline} ${p.summary}`;
  return {
    title: p.title,
    description,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: `${p.title} · Naman Rusia`, description, url: `/projects/${p.slug}` },
  };
}

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t-2 border-line pt-8">
      <h2 className="font-display mb-5 flex items-baseline gap-3 text-2xl text-bone md:text-3xl">
        <span className="label text-accent">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const { prev, next } = neighbors(p.slug);
  const index = projects.indexOf(p) + 1;

  const blocks: { title: string; body: React.ReactNode }[] = [];
  blocks.push({
    title: "The problem",
    body: (p.problem ?? [p.summary]).map((t) => (
      <p key={t} className="mb-4 text-lg leading-relaxed text-bone/85">
        {t}
      </p>
    )),
  });
  if (p.built)
    blocks.push({
      title: "What I built",
      body: (
        <>
          {p.built.intro && <p className="mb-5 text-lg text-bone/85">{p.built.intro}</p>}
          <ol className="grid gap-px border-2 border-line bg-line sm:grid-cols-2">
            {p.built.features.map((f, i) => (
              <li key={f.title} className="bg-ink p-5">
                <p className="label text-[10px] text-dust">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 font-semibold text-bone">{f.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-bone/75">{f.body}</p>
              </li>
            ))}
          </ol>
        </>
      ),
    });
  if (p.architecture)
    blocks.push({
      title: "Architecture",
      body: (
        <div className="space-y-4 text-[17px] leading-relaxed text-bone/85">
          {p.architecture.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      ),
    });
  if (p.learned)
    blocks.push({
      title: "Challenges & lessons",
      body: (
        <div className="space-y-6">
          {p.learned.map((l) => (
            <div key={l.title} className="border-l-4 pl-5" style={{ borderColor: p.color }}>
              <h3 className="font-semibold text-bone">{l.title}</h3>
              <p className="mt-1.5 leading-relaxed text-bone/80">{l.body}</p>
            </div>
          ))}
        </div>
      ),
    });
  if (p.history)
    blocks.push({
      title: p.history.title,
      body: (
        <div className="space-y-4 border-2 border-dashed border-line p-5 text-bone/75">
          {p.history.body.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      ),
    });
  if (p.gallery && p.gallery.length > (p.image === p.gallery[0].src ? 1 : 0))
    blocks.push({
      title: "Screens",
      body: (
        <ul className="grid gap-6 sm:grid-cols-2">
          {p.gallery.map((g) => (
            <li key={g.src}>
              <figure className="border-2 border-line bg-coal">
                <Image src={g.src} alt={g.caption} width={900} height={560} className="block h-auto w-full" />
                <figcaption className="label border-t-2 border-line px-3 py-2 text-[10px] normal-case tracking-normal text-dust">
                  {g.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      ),
    });

  const facts: [string, string | undefined][] = [
    ["Period", p.period],
    ["Type", p.kind],
    ["Role", p.role],
    ["Team", p.team],
  ];

  return (
    <main id="main" data-shot="monolith" className="px-4 pb-16 pt-24 md:px-8">
      <ProjectFocus slug={p.slug} />
      <div className="mx-auto max-w-[1200px]">
        <nav aria-label="Breadcrumb" className="label flex items-center justify-between text-dust">
          <Link href="/projects" className="hover:text-bone">
            ← All projects
          </Link>
          <span>
            {index} / {projects.length}
          </span>
        </nav>

        <header className="mt-10 md:mt-16">
          <p className="label flex flex-wrap items-center gap-3 text-dust">
            <StatusTag status={p.status} />
            {p.period}
          </p>
          <h1 className="font-display mt-4 text-[clamp(3rem,10vw,8rem)] text-bone">{p.title}</h1>
          <p className="mt-4 max-w-3xl text-2xl leading-snug text-bone md:text-3xl">{p.tagline}</p>
          {p.links.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-3">
              {p.links.map((l, i) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className={
                      i === 0
                        ? "block bg-accent px-4 py-2 text-sm text-ink shadow-[3px_3px_0_0_var(--color-bone)] hover:-translate-y-px"
                        : "block border-2 border-line px-4 py-1.5 text-sm text-bone hover:border-bone"
                    }
                  >
                    {l.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </header>

        <div className="mt-12 border-2 border-bone bg-ink" style={{ boxShadow: `8px 8px 0 0 ${p.color}` }}>
          {p.video ? (
            <video
              src={p.video}
              poster={p.image}
              autoPlay
              muted
              loop
              playsInline
              className="block aspect-[2/1] w-full object-cover"
              aria-label={`${p.title} demo loop`}
            />
          ) : p.image ? (
            <Image
              src={p.image}
              alt={`${p.title} screenshot`}
              width={1600}
              height={900}
              preload
              className="block h-auto max-h-[70vh] w-full object-cover object-top"
            />
          ) : (
            <PixelPlaceholder seed={p.slug} color={p.color} label={p.title} />
          )}
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[280px_1fr] lg:gap-16">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border-2 border-line bg-coal p-5">
              <p className="text-[15px] leading-relaxed text-bone/85">{p.summary}</p>
              <dl className="mt-5 space-y-3 border-t-2 border-line pt-5 text-sm">
                {facts
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k}>
                      <dt className="label text-[10px] text-dust">{k}</dt>
                      <dd className="mt-0.5 text-bone">{v}</dd>
                    </div>
                  ))}
                <div>
                  <dt className="label text-[10px] text-dust">Stack</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1">
                    {p.stack.map((s) => (
                      <span key={s} className="border border-line bg-ink px-1.5 py-0.5 text-[13px] text-bone">
                        {s}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>

          <div className="space-y-14 bg-ink/85">
            {blocks.map((b, i) => (
              <Block key={b.title} n={String(i + 1).padStart(2, "0")} title={b.title}>
                {b.body}
              </Block>
            ))}
          </div>
        </div>

        <nav aria-label="More projects" className="mt-24 grid gap-px border-2 border-line bg-line sm:grid-cols-2">
          {[
            { p: prev, dir: "← Previous" },
            { p: next, dir: "Next →" },
          ].map(({ p: q, dir }, i) => (
            <Link key={dir} href={`/projects/${q.slug}`} className={`group bg-ink p-6 hover:bg-bone ${i ? "sm:text-right" : ""}`}>
              <span className="label text-dust group-hover:text-ink/60">{dir}</span>
              <span className="font-display mt-2 block text-3xl text-bone group-hover:text-ink">{q.title}</span>
              <span className="mt-1 block text-sm text-dust group-hover:text-ink/70">{q.tagline}</span>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
