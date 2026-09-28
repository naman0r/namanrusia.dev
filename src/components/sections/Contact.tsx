import { Continue } from "@/components/Continue";
import { profile } from "@/content/profile";

const links = [
  { label: "GitHub", value: `@${profile.handle}`, href: profile.links.github },
  { label: "LinkedIn", value: "in/namanrusia", href: profile.links.linkedin },
  { label: "X", value: "@namanrusia1", href: profile.links.x },
  { label: "Resume", value: "resume.pdf", href: profile.resume },
];

export function Contact() {
  const [user, domain] = profile.email.split("@");
  return (
    <section
      id="contact"
      data-shot="monogram"
      aria-labelledby="contact-title"
      // Phones get the monogram above the copy instead of behind it.
      className="relative flex min-h-[100svh] flex-col px-4 pb-8 pt-[40svh] md:justify-center md:px-8 md:pb-10 md:pt-28"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <p className="label text-dust">
          <span className="text-accent">05</span> · Thanks for playing
        </p>
        <h2 id="contact-title" className="mt-4 max-w-3xl text-2xl leading-tight text-bone md:text-5xl">
          Recruiting for Spring or Summer 2027, building something, or just want to talk Clash Royale? Write to me.
        </h2>
        <a
          href={`mailto:${profile.email}`}
          className="font-display mt-6 inline-block md:mt-10 text-[clamp(1.4rem,3.6vw,3.25rem)] text-accent decoration-4 underline-offset-8 hover:text-bone hover:underline"
        >
          {user}@
          <wbr />
          {domain}
        </a>

        <ul className="mt-8 grid max-w-3xl md:mt-12 grid-cols-2 gap-px border-2 border-line bg-line sm:grid-cols-4">
          {links.map((l) => (
            <li key={l.label} className="bg-ink">
              <a href={l.href} target="_blank" rel="noreferrer" className="group block px-4 py-3 hover:bg-bone">
                <span className="label block text-[10px] text-dust group-hover:text-ink/60">{l.label}</span>
                <span className="block text-bone group-hover:text-ink">{l.value} ↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer className="mx-auto mt-12 flex w-full max-w-[1400px] flex-wrap items-end justify-between gap-6 border-t-2 border-line pt-6 md:mt-32">
        <Continue />
        <p className="label max-w-md text-[10px] leading-relaxed text-dust">
          Built from scratch by Naman in Boston ·{" "}
          <a href={profile.links.source} target="_blank" rel="noreferrer" className="text-bone hover:text-accent">
            source
          </a>{" "}
          · press <kbd className="bg-coal px-1 text-bone">~</kbd> for a terminal
        </p>
      </footer>
    </section>
  );
}
