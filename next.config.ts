import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets phones and laptops on the tailnet load the dev server.
  allowedDevOrigins: ["**.ts.net"],
  // Old pages folded into the landing page keep working.
  redirects: async () => [
    { source: "/more", destination: "/#about", permanent: true },
    { source: "/me", destination: "/#about", permanent: true },
    { source: "/contact", destination: "/#contact", permanent: true },
    { source: "/links", destination: "/#contact", permanent: true },
    { source: "/terminal", destination: "/#terminal", permanent: true },
    { source: "/resume", destination: "/resume.pdf", permanent: true },
    { source: "/blogs/:path*", destination: "/blog/:path*", permanent: true },
  ],
};

// Turbopack needs plugins by name rather than imported functions.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-slug"],
  },
});

export default withMDX(nextConfig);
