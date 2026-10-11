import Link from "next/link";
import { GlobeDrag } from "@/components/GlobeDrag";
import { HeroLinks } from "@/components/HeroLinks";
import { HomeLine } from "@/components/HomeLine";
import { Name } from "@/components/Name";
import { profile } from "@/content/profile";
import { getPosts, isRecent } from "@/lib/blog";

/** A quiet pointer to the newest post, under the character line. */
async function LatestPost() {
  const [post] = await getPosts();
  if (!post) return null;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="label group mt-4 inline-flex max-w-full items-center gap-2.5 text-dust transition-colors hover:text-bone"
      style={{ "--c": post.color } as React.CSSProperties}
    >
      <span aria-hidden className="size-1.5 shrink-0 bg-(--c)" />
      <span className="shrink-0">{isRecent(post) ? "New post" : "Latest post"}</span>
      <span aria-hidden className="text-line">/</span>
      <span className="truncate normal-case tracking-normal text-bone/75 group-hover:text-bone">{post.title}</span>
      <span aria-hidden className="shrink-0 transition-transform duration-150 ease-(--ease-step) group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      data-shot="globe"
      aria-labelledby="top-title"
      className="relative flex min-h-[100svh] flex-col px-4 pb-8 pt-20 md:px-8"
    >
      <GlobeDrag />
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col">
        {/* On phones the globe owns the top of the screen and the copy sits at the bottom. */}
        <div
          data-globe-floor
          className="relative mt-auto max-w-[900px] md:my-auto"
        >
          <p className="label mb-5 flex items-center gap-2.5 text-[11px] normal-case tracking-normal text-bone md:mb-6">
            <span className="blink size-2 shrink-0 bg-lime" aria-hidden />
            <span className="md:hidden">
              Open to Spring + Summer 2027 co-ops
            </span>
            <span className="max-md:hidden">{profile.status}</span>
          </p>
          <Name />
          <p className="mt-7 max-w-xl text-lg leading-snug text-bone md:text-xl">
            Software engineer interested in{" "}
            <strong className="font-semibold text-lime">
              backend, cloud, and fullstack
            </strong>{" "}
            software. CS + Business at Northeastern. Prev software engineering
            intern at Sonos, Philips Healthcare, and more
          </p>
          <p className="mt-4 font-mono text-sm text-dust [@media(max-height:720px)]:max-md:hidden">
            {profile.motto}
          </p>
          <HeroLinks />
          <HomeLine />
          <LatestPost />
        </div>

        <dl className="relative mt-6 hidden grid-cols-4 gap-x-6 border-t-2 border-line bg-ink pb-2 pt-5 md:grid">
          {profile.glance.map((g, i) => (
            <div key={g.label}>
              <dt
                className={`label ${["text-lime", "text-accent", "text-coin", "text-lime"][i]}`}
              >
                {g.label}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-bone/80">
                {g.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
