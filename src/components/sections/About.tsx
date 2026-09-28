import { CubeTimer } from "@/components/CubeTimer";
import { PhotoStrip } from "@/components/PhotoStrip";
import { Heading } from "@/components/Section";
import { about } from "@/content/profile";

/** Two scenes in one section: the story, still over the title screen's globe, then the hobbies over the cube. */
export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative px-4 md:px-8">
      <div id="about-story" data-shot="globe" className="mx-auto max-w-[1400px] pb-20 pt-28 md:pt-40">
        <Heading id="about" index="01" title="About" kicker="Character bio" />
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="space-y-6 text-lg leading-relaxed text-bone/85 lg:col-span-6">
            {about.paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? "text-xl text-bone md:text-2xl md:leading-snug" : ""}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* On phones the cube sits above the copy instead of behind it. */}
      <div id="about-cube" data-shot="cube" className="mx-auto max-w-[1400px] pb-28 pt-[38svh] md:pb-40 md:pt-24">
        <div className="lg:w-1/2">
          <h3 className="label text-accent">Off the clock</h3>
          <p className="mt-3 text-lg leading-relaxed text-bone/85">{about.offline}</p>
          <CubeTimer />
        </div>

        <div className="mt-24">
          <p className="label mb-4 flex justify-between text-dust">
            <span>Camera roll</span>
            <span className="max-sm:hidden">drag or scroll sideways →</span>
          </p>
          <PhotoStrip />
        </div>
      </div>
    </section>
  );
}
