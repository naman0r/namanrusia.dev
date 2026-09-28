import { PhotoStrip } from "@/components/PhotoStrip";
import { Heading } from "@/components/Section";

/** The photos from the old /more page. The scene behind rebuilds whichever one you point at. */
export function CameraRoll() {
  return (
    <section
      id="photos"
      data-shot="photos"
      aria-labelledby="photos-title"
      // Phones keep the mosaic on top of the screen and the photos underneath it.
      className="relative flex min-h-[100svh] flex-col justify-end px-4 pb-16 pt-[42svh] md:justify-between md:px-8 md:pt-28"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <Heading id="photos" index="04" title="Camera roll" tone="coin" />
        <p className="-mt-6 max-w-sm text-dust md:-mt-8">Point at a photo and the voxels rebuild it.</p>
      </div>
      <div className="mx-auto mt-12 w-full max-w-[1400px]">
        <PhotoStrip />
      </div>
    </section>
  );
}
