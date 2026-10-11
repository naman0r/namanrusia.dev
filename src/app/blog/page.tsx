import type { Metadata } from "next";
import Link from "next/link";
import { PostList } from "@/components/PostList";
import { formatDate, getPosts } from "@/lib/blog";

const description = "Writing by Naman Rusia: notes on what I'm building, and what it taught me.";

export const metadata: Metadata = {
  title: "Writing",
  description,
  alternates: { canonical: "/blog" },
  openGraph: { title: "Writing · Naman Rusia", description, url: "/blog" },
};

export default async function BlogIndex() {
  const posts = await getPosts();

  return (
    <main id="main" data-shot="folio" className="px-4 pb-24 pt-24 md:px-8">
      <div className="mx-auto max-w-[1400px]">
        <Link href="/" className="label text-dust hover:text-bone">
          ← Home
        </Link>
        <header className="mt-10">
          <p className="label text-dust">
            <span className="text-lime">{String(posts.length).padStart(2, "0")}</span> · {posts.length === 1 ? "Post" : "Posts"}
          </p>
          <h1 className="font-display mt-3 text-[clamp(3rem,10vw,7.5rem)] text-bone">Writing</h1>
          <p className="mt-5 max-w-2xl text-lg text-dust">Notes on what I&apos;m building, and what it taught me.</p>
        </header>

        <section aria-label="Posts" className="mt-16 lg:w-[60%]">
          {posts.length ? (
            <PostList posts={posts} dates={posts.map((p) => formatDate(p.date))} />
          ) : (
            <p className="label border-2 border-dashed border-line bg-ink/85 px-5 py-8 text-dust">
              Nothing published yet<span className="blink">_</span>
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
