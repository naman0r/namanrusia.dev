import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" data-shot="lost" className="flex min-h-[100svh] flex-col justify-end px-4 pb-16 pt-24 md:px-8">
      <div className="mx-auto w-full max-w-[1200px]">
        <p className="label text-accent">Error 404 · level not found</p>
        <h1 className="font-display mt-4 max-w-3xl text-[clamp(2.5rem,7vw,5.5rem)] text-bone">You fell off the map.</h1>
        <p className="mt-5 max-w-xl text-lg text-dust">This page doesn&apos;t exist, or it moved when the site did.</p>
        <ul className="mt-10 flex flex-wrap gap-3 text-sm">
          <li>
            <Link href="/" className="block bg-accent px-4 py-2 text-ink shadow-[3px_3px_0_0_var(--color-bone)] hover:-translate-y-px">
              Respawn at start
            </Link>
          </li>
          <li>
            <Link href="/projects" className="block border-2 border-line px-4 py-1.5 text-bone hover:border-bone">
              Projects
            </Link>
          </li>
          <li>
            <Link href="/experience" className="block border-2 border-line px-4 py-1.5 text-bone hover:border-bone">
              Experience
            </Link>
          </li>
        </ul>
      </div>
    </main>
  );
}
