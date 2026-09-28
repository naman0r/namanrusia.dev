import Link from "next/link";
import type { ShotId } from "@/lib/stage";

/** A landing-page section: an anchor for the nav and a `data-shot` for the scene. */
export function Section({
  id,
  shot,
  className = "",
  children,
}: {
  id: string;
  shot: ShotId;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} data-shot={shot} aria-labelledby={`${id}-title`} className={`relative px-4 md:px-8 ${className}`}>
      <div className="mx-auto w-full max-w-[1400px]">{children}</div>
    </section>
  );
}

// Each section has its own color, so the page doesn't read as one blue.
const TONES = {
  accent: { text: "text-accent", hover: "hover:text-accent", arrow: "group-hover:text-accent", shadow: "var(--color-accent)" },
  lime: { text: "text-lime", hover: "hover:text-lime", arrow: "group-hover:text-lime", shadow: "var(--color-lime)" },
  coin: { text: "text-coin", hover: "hover:text-coin", arrow: "group-hover:text-coin", shadow: "var(--color-coin)" },
};

/** A section title. With `href` the title itself and a button both lead to the full page. */
export function Heading({
  id,
  index,
  title,
  kicker,
  href,
  cta,
  tone = "accent",
}: {
  id: string;
  index: string;
  title: string;
  kicker?: string;
  href?: string;
  cta?: string;
  tone?: keyof typeof TONES;
}) {
  const t = TONES[tone];
  return (
    <header className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 md:mb-14">
      <div>
        <p className="label mb-3 text-dust">
          <span className={t.text}>{index}</span>
          {kicker && <> · {kicker}</>}
        </p>
        <h2 id={`${id}-title`} className="font-display text-[clamp(2.75rem,7vw,5.5rem)] text-bone">
          {href ? (
            <Link href={href} className={`group inline-flex items-baseline gap-4 ${t.hover}`}>
              {title}
              <span
                aria-hidden
                className={`text-[0.5em] text-dust transition-transform duration-150 ease-(--ease-step) group-hover:translate-x-1 ${t.arrow}`}
              >
                →
              </span>
            </Link>
          ) : (
            title
          )}
        </h2>
      </div>
      {href && cta && (
        <CtaLink href={href} shadow={t.shadow}>
          {cta}
        </CtaLink>
      )}
    </header>
  );
}

export function CtaLink({ href, shadow = "var(--color-accent)", children }: { href: string; shadow?: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="label group inline-flex items-center gap-3 border-2 border-bone bg-ink px-4 py-2.5 text-bone shadow-[4px_4px_0_0_var(--cta-shadow)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
      style={{ "--cta-shadow": shadow } as React.CSSProperties}
    >
      {children}
      <span aria-hidden className="transition-transform duration-150 ease-(--ease-step) group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}
