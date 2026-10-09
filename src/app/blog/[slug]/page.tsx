import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostFocus } from "@/components/PostFocus";
import { profile } from "@/content/profile";
import { formatDate, getPosts } from "@/lib/blog";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

async function find(slug: string) {
  const posts = await getPosts();
  const i = posts.findIndex((p) => p.slug === slug);
  return { posts, i, post: posts[i] };
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { post } = await find((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: `${post.title} · Naman Rusia`,
      description: post.summary,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [profile.name],
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { posts, i, post } = await find((await params).slug);
  if (!post) notFound();
  const { default: Body } = await import(`@/content/blog/${post.slug}.mdx`);
  const around = [
    { p: posts[i + 1], dir: "← Older" },
    { p: posts[i - 1], dir: "Newer →" },
  ];

  return (
    <main
      id="main"
      data-shot={post.scene}
      className="px-4 pb-16 pt-24 md:px-8"
      style={{ "--post": post.color } as React.CSSProperties}
    >
      <PostFocus slug={post.slug} color={post.color} />
      {/* Keeps the reading column calm and lets the scene glow on the right. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-ink/50 lg:bg-[linear-gradient(90deg,var(--color-ink)_0%,var(--color-ink)_38%,transparent_68%)]"
      />
      <div className="mx-auto max-w-[1400px]">
        <nav aria-label="Breadcrumb" className="label flex max-w-2xl items-center justify-between text-dust">
          <Link href="/blog" className="hover:text-bone">
            ← All writing
          </Link>
          <span>No. {String(posts.length - i).padStart(2, "0")}</span>
        </nav>

        <article className="max-w-2xl">
          <header className="mt-12 md:mt-20">
            <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-dust">
              <time dateTime={post.date}>{formatDate(post.date, "long")}</time>
              <span className="text-line">/</span>
              <span>{post.minutes} min read</span>
              {post.draft && <span className="bg-coin px-1.5 text-ink">Draft</span>}
            </p>
            <h1 className="font-display mt-6 text-5xl text-bone md:text-6xl">{post.title}</h1>
            <p className="mt-6 text-xl/8 text-bone/75 md:text-2xl/9">{post.summary}</p>
            <div aria-hidden className="mt-10 flex h-0.5 bg-line">
              <span className="w-16 bg-(--post)" />
            </div>
          </header>

          <div className="post-body mt-10">
            <Body />
          </div>

          <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t-2 border-line pt-6">
            <p className="label flex items-center gap-3 text-dust">
              <span className="font-display grid size-7 place-items-center bg-(--post) text-xs text-ink">NR</span>
              {profile.name}
            </p>
            <a
              href={`mailto:${profile.email}?subject=${encodeURIComponent(`Re: ${post.title}`)}`}
              className="label text-dust transition-colors hover:text-(--post)"
            >
              Reply by email →
            </a>
          </footer>
        </article>

        {posts.length > 1 && (
          <nav aria-label="More writing" className="mt-20 grid max-w-2xl gap-px border-2 border-line bg-line sm:grid-cols-2">
            {around.map(({ p, dir }, k) =>
              p ? (
                <Link key={dir} href={`/blog/${p.slug}`} className={`group bg-ink p-6 hover:bg-bone ${k ? "sm:col-start-2 sm:text-right" : ""}`}>
                  <span className="label text-dust group-hover:text-ink/60">{dir}</span>
                  <span className="mt-2 block text-xl font-semibold leading-snug text-bone group-hover:text-ink">{p.title}</span>
                </Link>
              ) : null,
            )}
          </nav>
        )}
      </div>
    </main>
  );
}
