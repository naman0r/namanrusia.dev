import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import { CodeBlock } from "@/components/CodeBlock";

// Posts set --post to their color; everything here that says "accent" reads it.
const LINK = "text-bone underline decoration-(--post) decoration-2 underline-offset-4 transition-colors hover:text-(--post)";

/** Callout for an aside the main text shouldn't stop for. Usable in any post as `<Note title="…">`. */
function Note({ title = "Note", children }: { title?: string; children: React.ReactNode }) {
  return (
    <aside className="my-10 border-2 border-dashed border-line bg-ink/60 px-5 py-4 [&_p]:my-2 [&_p]:text-base/7">
      <p className="label text-(--post)">{title}</p>
      {children}
    </aside>
  );
}

const components: MDXComponents = {
  h2: ({ id, children }) =>
    // remark-gfm's footnotes bring their own visually hidden heading.
    id === "footnote-label" ? (
      <h2 id={id} className="sr-only">
        {children}
      </h2>
    ) : (
      <h2 id={id} className="post-h2 font-display mb-6 mt-16 text-3xl text-bone md:text-4xl">
        <a href={`#${id}`} className="group/h">
          {children}
          <span aria-hidden className="ml-3 text-dust opacity-0 transition-opacity group-hover/h:opacity-100">
            #
          </span>
        </a>
      </h2>
    ),
  h3: ({ id, children }) => (
    <h3 id={id} className="mb-3 mt-10 text-xl font-semibold text-bone">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="my-6 text-lg/8 text-bone/85">{children}</p>,
  a: ({ href = "", children, ...rest }) =>
    href.startsWith("/") || href.startsWith("#") ? (
      <Link href={href} className={LINK} {...rest}>
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noreferrer" className={LINK} {...rest}>
        {children}
      </a>
    ),
  strong: ({ children }) => <strong className="font-semibold text-bone">{children}</strong>,
  ul: ({ children }) => <ul className="my-6 list-[square] space-y-2 pl-6 text-lg/8 text-bone/85 marker:text-(--post) [&_p]:my-2">{children}</ul>,
  ol: ({ children }) => (
    <ol className="my-6 list-[decimal-leading-zero] space-y-2 pl-9 text-lg/8 text-bone/85 marker:font-mono marker:text-sm marker:text-(--post) [&_p]:my-2">
      {children}
    </ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-10 border-l-4 border-(--post) pl-6 [&_p]:my-3 [&_p]:text-2xl/9 [&_p]:text-bone">{children}</blockquote>
  ),
  hr: () => (
    <div role="separator" className="my-14 flex justify-center gap-3">
      {[0, 1, 2].map((i) => (
        <span key={i} className="size-1.5 bg-(--post)" />
      ))}
    </div>
  ),
  // Markdown wraps images in a paragraph, so the figure is built from spans to stay valid inside one.
  img: ({ src, alt = "", title }) => (
    <span className="my-10 block">
      <Image
        src={src as string}
        alt={alt}
        width={1600}
        height={1000}
        sizes="(min-width: 768px) 672px, 100vw"
        className="block h-auto w-full border-2 border-bone"
      />
      {title && <span className="label mt-3 block text-dust">{title}</span>}
    </span>
  ),
  code: ({ children }) => <code className="border border-line bg-coal px-1.5 py-0.5 font-mono text-base text-bone">{children}</code>,
  pre: ({ children }) => {
    const { className = "", children: code } = (children as ReactElement<{ className?: string; children: string }>).props;
    return <CodeBlock code={code.replace(/\n$/, "")} lang={className.replace("language-", "") || "text"} />;
  },
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto border-2 border-line">
      <table className="w-full text-left text-base">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="label border-b-2 border-line bg-coal px-4 py-2.5 font-normal text-dust">{children}</th>,
  td: ({ children }) => <td className="border-t border-line px-4 py-2.5 text-bone/85">{children}</td>,
  Note,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
