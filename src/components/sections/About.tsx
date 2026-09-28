import { PhotoStrip } from "@/components/PhotoStrip";
import { Heading, Section } from "@/components/Section";
import { about, countriesVisited, homes } from "@/content/profile";

export function About() {
  return (
    <Section id="about" shot="globe" className="py-28 md:py-40">
      <Heading id="about" index="01" title="About" kicker="Character bio" />
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="space-y-6 text-lg leading-relaxed text-bone/85 lg:col-span-6">
          {about.paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "text-xl text-bone md:text-2xl md:leading-snug" : ""}>
              {p}
            </p>
          ))}
          <p className="border-l-4 border-accent pl-4 text-base text-dust">
            <span className="label text-accent">Off the clock</span>
            <br />
            {about.offline}
          </p>
        </div>

        {/* The globe spins in the empty columns to the right; this is its legend. */}
        <div className="lg:col-span-6 lg:row-start-2">
          <p className="label mb-3 text-dust">Route so far</p>
          <ol className="flex flex-wrap items-center gap-2">
            {homes.map((h, i) => (
              <li key={h.code} className="flex items-center gap-2" title={h.label}>
                <span className={`font-display px-2 py-1 text-sm ${i === homes.length - 1 ? "bg-bone text-ink" : "bg-accent text-ink"}`}>
                  {h.code}
                </span>
                {i < homes.length - 1 && <span className="text-dust">→</span>}
              </li>
            ))}
          </ol>
          <p className="label mt-3 text-dust">{countriesVisited} countries visited · one satellite each</p>
        </div>
      </div>

      <div className="mt-20">
        <p className="label mb-4 flex justify-between text-dust">
          <span>Camera roll</span>
          <span className="max-sm:hidden">drag or scroll sideways →</span>
        </p>
        <PhotoStrip />
      </div>
    </Section>
  );
}
