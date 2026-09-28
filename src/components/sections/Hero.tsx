import { BostonClock } from "@/components/Clock";
import { Name } from "@/components/Name";
import { heroKeys, profile } from "@/content/profile";

export function Hero() {
  return (
    <section
      id="top"
      data-shot="cube"
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

        {/* On phones the cube owns the top of the screen, so the copy starts below it. */}
        <div className="mt-auto max-w-[800px] pt-[34svh] md:pt-16">
          <p className="label mb-6 inline-flex items-center gap-2.5 bg-coal px-3 py-1.5 normal-case tracking-normal text-bone">
            <span className="blink size-2 bg-live" aria-hidden />
            {profile.status}
          </p>

          <Name />

          <p className="mt-8 max-w-xl text-xl leading-snug text-bone md:text-2xl">{profile.thesis}</p>
          <p className="mt-4 max-w-xl text-dust">{profile.intro}</p>

          <ul className="mt-8 flex flex-wrap gap-3">
            {Object.entries(heroKeys).map(([key, k]) => (
              <li key={key}>
                <a
                  href={k.href}
                  target={k.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noreferrer"
                  aria-keyshortcuts={key.toUpperCase()}
                  className="group flex items-center gap-2.5 border-2 border-line bg-ink py-1.5 pl-1.5 pr-3.5 text-sm text-bone transition-colors hover:border-bone"
                >
                  <kbd className="font-display grid size-6 place-items-center bg-bone text-xs text-ink shadow-[0_3px_0_0_var(--color-dust)] transition-transform duration-100 group-hover:translate-y-[2px] group-hover:shadow-[0_1px_0_0_var(--color-dust)]">
                    {key}
                  </kbd>
                  {k.label}
                </a>
              </li>
            ))}
          </ul>
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
