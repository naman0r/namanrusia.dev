import { PhotoStrip } from "@/components/PhotoStrip";
import { Heading } from "@/components/Section";

/** The photos from the old /more page. The scene has no shot here; it morphs from the projects ring to the city. */
export function CameraRoll() {
  return (
    <section id="photos" aria-labelledby="photos-title" className="relative px-4 pb-16 pt-28 md:px-8 md:pt-40">
      <div className="mx-auto w-full max-w-[1400px]">
        <Heading id="photos" index="04" title="Camera roll" tone="coin" />
        <PhotoStrip />
      </div>
    </section>
  );
}
