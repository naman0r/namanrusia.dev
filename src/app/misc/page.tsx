import Link from "next/link";
import React from "react";

const MiscPage = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-neutral-100 mb-8">Misc</h1>
        <p className="underline">
          favorite <Link href="/media">Media</Link>
        </p>
        <p>
          blog posts: <Link href="/blogs">Blogs</Link>
        </p>
        <Link href="/playground">Playground page (only works on computer)</Link>
      </div>
    </div>
  );
};

export default MiscPage;
