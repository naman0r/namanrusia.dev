import { PhotoStrip } from "@/components/PhotoStrip";
import { Heading } from "@/components/Section";

/** The photos from the old /more page, over experiment 1's green landscape. */
export function CameraRoll() {
  return (
    <section
      id="photos"
      data-shot="terrain"
      aria-labelledby="photos-title"
      // Phones keep the landscape on top of the screen and the photos underneath it.
      className="relative flex min-h-[100svh] flex-col justify-end px-4 pb-16 pt-[42svh] md:justify-between md:px-8 md:pt-28"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <Heading id="photos" index="04" title="Camera roll" tone="coin" />
      </div>
      <div className="mx-auto w-full max-w-[1400px]">
        <PhotoStrip />
      </div>
    </section>
  );
}
