import { getBlogPostBySlug, getBlogPosts } from "@/lib/blog";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { IoIosArrowBack } from "react-icons/io";

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <article className="max-w-3xl mx-auto">
        <Link
          href="/blogs"
          className="inline-flex items-center text-gray-500 hover:text-white transition-colors mb-8"
        >
          <IoIosArrowBack className="mr-2" /> Back to Writing
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            {post.meta.title}
          </h1>
          <time className="text-gray-500 font-mono text-sm block">
            {post.meta.date}
          </time>
        </header>

        <div className="prose prose-invert prose-lg max-w-none text-gray-300">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </div>
  );
}


