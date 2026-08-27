import Image from "next/image";

/** Sits under the overview chart in the sticky column, so it stays narrow and
 *  quiet enough not to compete with the timeline. */
export default function EducationCard() {
  return (
    <div className="mt-8">
      <p className="mb-3 font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/30">
        Education
      </p>

      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white p-1">
            <Image
              src="/logos/northeastern.png"
              alt=""
              width={32}
              height={32}
              className="h-full w-full object-contain"
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[12.5px] leading-tight text-[#e9e4da]">
              Northeastern University
            </span>
            <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.12em] text-white/30">
              Boston, MA
            </span>
          </span>
        </div>

        <p className="mt-3 border-t border-white/[0.07] pt-2.5 text-[11.5px] leading-5 text-white/55">
          BS Computer Science &amp; Business Administration
        </p>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[9.5px] uppercase tracking-[0.12em] text-white/35">
          <span>Spring 2028</span>
          <span className="text-white/15">·</span>
          <span>3.8/4.0 GPA</span>
          <span className="text-white/15">·</span>
          <span>Dean&apos;s List</span>
        </div>
      </div>
    </div>
  );
}
