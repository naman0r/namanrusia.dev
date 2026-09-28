import { GlobeDrag } from "@/components/GlobeDrag";
import { HeroLinks } from "@/components/HeroLinks";
import { HomeLine } from "@/components/HomeLine";
import { Name } from "@/components/Name";
import { profile } from "@/content/profile";

export function Hero() {
  return (
    <section
      id="top"
      data-shot="globe"
      aria-labelledby="top-title"
      className="relative flex min-h-[100svh] flex-col px-4 pb-8 pt-20 md:px-8 md:pt-24"
    >
      <GlobeDrag />
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col">
        {/* On phones the globe owns the top of the screen and the copy sits at the bottom. */}
        <div data-globe-floor className="relative mt-auto max-w-[900px] md:my-auto md:py-10">
          <HomeLine />
          <Name />
          <p className="mt-7 max-w-xl text-lg leading-snug text-bone md:text-xl">
            Software engineer on <strong className="font-semibold text-lime">backend, cloud, and systems</strong>. CS + Business at
            Northeastern. Previously a software engineering intern at Sonos and Philips Healthcare.
          </p>
          <p className="mt-4 font-mono text-sm text-dust [@media(max-height:720px)]:max-md:hidden">&ldquo;{profile.motto}&rdquo;</p>
          <HeroLinks />
          <p className="label mt-5 flex items-center gap-2.5 text-[11px] normal-case tracking-normal text-bone md:mt-6">
            <span className="blink size-2 shrink-0 bg-lime" aria-hidden />
            <span className="md:hidden">Open to Spring + Summer 2027 co-ops</span>
            <span className="max-md:hidden">{profile.status}</span>
          </p>
        </div>

        <dl className="relative mt-10 hidden grid-cols-4 gap-x-6 border-t-2 border-line bg-ink/80 pt-6 md:grid">
          {profile.glance.map((g, i) => (
            <div key={g.label}>
              <dt className={`label ${["text-lime", "text-accent", "text-coin", "text-lime"][i]}`}>{g.label}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-bone/80">{g.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
