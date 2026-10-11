import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { getPosts } from "@/lib/blog";
import { siteUrl } from "@/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  return [
    "",
    "/experience",
    "/projects",
    ...projects.map((p) => `/projects/${p.slug}`),
    "/blog",
    ...posts.map((p) => `/blog/${p.slug}`),
  ].map((path) => ({ url: `${siteUrl}${path}` }));
}
