import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteUrl } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/experience", "/projects", ...projects.map((p) => `/projects/${p.slug}`)].map((path) => ({ url: `${siteUrl}${path}` }));
}
