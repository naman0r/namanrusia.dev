"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Post } from "@/lib/blog";
import { stage } from "@/lib/stage";
import { SHAPES } from "./Nav";

/** The post's scene as a one-color pixel icon, so the list hints at what's behind each post. */
function SceneGlyph({ scene }: { scene: Post["scene"] }) {
  const d = SHAPES[scene].flatMap((row, y) => [...row].map((c, x) => (c === "." ? "" : `M${x} ${y}h1v1h-1z`))).join("");
  return (
    <svg viewBox="0 0 13 9" className="h-[18px] w-[26px] shrink-0" aria-hidden shapeRendering="crispEdges" fill="currentColor">
      <path d={d} />
    </svg>
  );
}

/** Rows that light up in their post's color. Hovering one slides its page out of the stack behind. */
export function PostList({ posts, dates }: { posts: Post[]; dates: string[] }) {
  const [hovered, setHovered] = useState(-1);

  useEffect(() => {
    stage.posts = posts.map((p) => p.color);
  }, [posts]);
  useEffect(() => {
    stage.hoveredPost = hovered;
  }, [hovered]);

  return (
    <ol className="border-b-2 border-line" onPointerLeave={() => setHovered(-1)}>
      {posts.map((p, i) => (
        <li key={p.slug}>
          <Link
            href={`/blog/${p.slug}`}
            onPointerEnter={() => setHovered(i)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(-1)}
            style={{ "--c": p.color } as React.CSSProperties}
            className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-2 border-t-2 border-line bg-ink/85 py-6 transition-colors hover:bg-(--c) focus-visible:bg-(--c) md:grid-cols-[8.5rem_minmax(0,1fr)_auto] md:px-4"
          >
            <span className="label whitespace-nowrap pt-1.5 text-dust group-hover:text-ink/70 group-focus-visible:text-ink/70 max-md:col-span-2">
              {dates[i]}
            </span>
            <span>
              <span className="block text-2xl font-semibold leading-tight text-bone group-hover:text-ink group-focus-visible:text-ink">
                {p.title}
                {p.draft && <span className="label ml-3 inline-block bg-coin px-1 align-middle text-ink">Draft</span>}
              </span>
              <span className="mt-2 block max-w-xl text-base text-dust group-hover:text-ink/75 group-focus-visible:text-ink/75">
                {p.summary}
              </span>
            </span>
            <span className="label flex items-start gap-4 pt-1.5 text-dust group-hover:text-ink group-focus-visible:text-ink max-md:col-start-2 max-md:row-start-2">
              <span className="text-(--c) group-hover:text-ink group-focus-visible:text-ink">
                <SceneGlyph scene={p.scene} />
              </span>
              <span className="whitespace-nowrap max-sm:hidden">{p.minutes} min</span>
              <span aria-hidden className="transition-transform duration-150 ease-(--ease-step) group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
