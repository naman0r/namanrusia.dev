import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { getBlogPosts } from "@/lib/blog";
import { siteUrl } from "@/lib/config";

export const dynamic = "force-static";

const appDirectory = path.join(process.cwd(), "src/app");

function discoverStaticPages(directory = appDirectory): string[] {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (!entry.isDirectory()) return [];

    const segment = entry.name;
    if (
      segment === "api" ||
      segment.startsWith("_") ||
      segment.startsWith("[")
    ) {
      return [];
    }

    const childDirectory = path.join(directory, segment);
    const relativeDirectory = path.relative(appDirectory, childDirectory);
    const route = `/${relativeDirectory.split(path.sep).join("/")}`;
    const currentPage = fs.existsSync(path.join(childDirectory, "page.tsx"))
      ? [route]
      : [];

    return [...currentPage, ...discoverStaticPages(childDirectory)];
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", ...discoverStaticPages()];
  const blogRoutes = getBlogPosts().map((post) => ({
    url: `${siteUrl}/blogs/${post.slug}`,
    lastModified: new Date(post.meta.date),
  }));

  return [
    ...routes.map((route) => ({
      url: `${siteUrl}${route}`,
    })),
    ...blogRoutes,
  ];
}
