import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

/** Scenes a post can sit in front of, built in src/scene/shots.ts. Each reseeds itself from the post's slug. */
export const POST_SCENES = ["grove", "orbit", "rain"] as const;
export type PostScene = (typeof POST_SCENES)[number];

/** What every post exports as `meta` at the top of its .mdx file. */
export type PostMeta = {
  title: string;
  /** One or two sentences, shown under the title, in the list, and in link previews. */
  summary: string;
  /** Publish date as YYYY-MM-DD; the list sorts on it. */
  date: string;
  /** The voxel scene behind the post. */
  scene: PostScene;
  /** Tints the scene, the drop cap, links and rules, as a hex like "#ff8fb8". */
  color: string;
  /** Drafts only render under `next dev`. */
  draft?: boolean;
};

export type Post = PostMeta & { slug: string; minutes: number };

const DIR = path.join(process.cwd(), "src/content/blog");

// A typo in meta fails the build with the file's name, instead of shipping a broken page.
function check(slug: string, meta: Partial<PostMeta> | undefined): PostMeta {
  const where = `src/content/blog/${slug}.mdx`;
  const missing = (["title", "summary", "date", "scene", "color"] as const).filter((k) => !meta?.[k]);
  if (!meta || missing.length) throw new Error(`${where}: \`export const meta\` is missing ${missing.join(", ")}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date!)) throw new Error(`${where}: date must be YYYY-MM-DD, got "${meta.date}"`);
  if (!POST_SCENES.includes(meta.scene!)) throw new Error(`${where}: scene must be one of ${POST_SCENES.join(", ")}`);
  if (!/^#[0-9a-f]{6}$/i.test(meta.color!)) throw new Error(`${where}: color must be a 6-digit hex, got "${meta.color}"`);
  return meta as PostMeta;
}

/** Every post in src/content/blog, newest first. */
export const getPosts = cache(async (): Promise<Post[]> => {
  const slugs = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.slice(0, -4));
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { meta } = await import(`@/content/blog/${slug}.mdx`);
      const words = fs.readFileSync(path.join(DIR, `${slug}.mdx`), "utf8").split(/\s+/).length;
      return { ...check(slug, meta), slug, minutes: Math.max(1, Math.round(words / 230)) };
    }),
  );
  return posts
    .filter((p) => !p.draft || process.env.NODE_ENV !== "production")
    .sort((a, b) => b.date.localeCompare(a.date));
});

/** Whether the home page calls it a new post. The page rebuilds every few hours, which keeps this current. */
export const isRecent = (post: Post) => Date.now() - Date.parse(post.date) < 30 * 864e5;

export const formatDate = (iso: string, month: "short" | "long" = "short") =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { timeZone: "UTC", day: "numeric", month, year: "numeric" });
