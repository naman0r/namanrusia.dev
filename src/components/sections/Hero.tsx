import { BostonClock } from "@/components/Clock";
import { Name } from "@/components/Name";
import { GlobeLegend } from "@/components/GlobeLegend";
import { HeroLinks } from "@/components/HeroLinks";
import { profile } from "@/content/profile";

export function Hero() {
  return (
    <section
      id="top"
      data-shot="globe"
      aria-labelledby="top-title"
      className="relative flex min-h-[100svh] flex-col px-4 pb-8 pt-24 md:px-8"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col">
        <div className="label flex items-start justify-between gap-4 text-dust">
          <p>
            <span className="text-accent">P1</span> · {profile.handle}
          </p>
          <p className="text-right">
            Boston{" "}
            <span className="text-bone">
              <BostonClock />
            </span>
          </p>
        </div>

        {/* On phones the scene owns the top of the screen, so the copy starts below it. */}
        <div className="mt-auto max-w-[900px] pt-[33svh] md:pt-16">
          <GlobeLegend />
          <p className="label mb-6 inline-flex items-center gap-2.5 bg-coal px-3 py-1.5 normal-case tracking-normal text-bone">
            <span className="blink size-2 bg-live" aria-hidden />
            {profile.status}
          </p>

          <Name />

          <p className="mt-8 max-w-xl text-xl leading-snug text-bone md:text-2xl">{profile.thesis}</p>
          <p className="mt-4 max-w-xl text-dust">{profile.intro}</p>

          <HeroLinks />
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-6 border-t-2 border-line bg-ink/80 pt-6 lg:grid-cols-4">
          {profile.glance.map((g) => (
            <div key={g.label}>
              <dt className="label text-accent">{g.label}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-bone/80">{g.value}</dd>
            </div>
          ))}
        </dl>

        <a href="#about" className="label mt-8 self-start text-dust hover:text-bone">
          Press <span className="text-bone">↓</span> to start<span className="blink">_</span>
        </a>
      </div>
    </section>
  );
}
