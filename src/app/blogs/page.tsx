import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";

export default function BlogsPage() {
  const posts = getBlogPosts();

  return (
    <div className="min-h-screen bg-black text-white py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-12">
          List of my random thoughts and reflections
        </h1>
        <p className=" pl-5 text-xs text-grey-900 pb-10">
          Please keep in mind I am not particularly a good writer
        </p>

        <div className="grid gap-8">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}`}
              className="group block border border-gray-900 rounded-2xl p-6 hover:border-gray-700 transition-colors bg-gray-900/20"
            >
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-3">
                <h2 className="text-2xl font-light group-hover:text-blue-400 transition-colors">
                  {post.meta.title}
                </h2>
                <time className="text-sm text-gray-500 font-mono">
                  {post.meta.date}
                </time>
              </div>
              <p className="text-gray-400 leading-relaxed">
                {post.meta.description}
              </p>
            </Link>
          ))}
          {posts.length === 0 && (
            <p className="text-gray-500 italic">No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
