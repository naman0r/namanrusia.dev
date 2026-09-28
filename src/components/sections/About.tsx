import { Heading, Section } from "@/components/Section";
import { about } from "@/content/profile";

export function About() {
  return (
    <Section id="about" shot="cube" className="py-28 md:py-40">
      <Heading id="about" index="01" title="About" tone="lime" />
      <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-bone/85">
        {about.paragraphs.map((p, i) => (
          <p key={i} className={i === 0 ? "text-xl text-bone md:text-2xl md:leading-snug" : ""}>
            {p}
          </p>
        ))}
      </div>
    </Section>
  );
}
