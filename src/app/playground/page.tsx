import type { Metadata } from "next";
import { Arena } from "@/components/Arena";

// Unlisted for now: reachable by link, kept out of search and the sitemap.
export const metadata: Metadata = {
  title: "Playground",
  description: "Bridge Brawl: a tiny lane battler against a bot.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/playground" },
};

export default function Playground() {
  return (
    <main id="main" data-shot="tower" className="px-4 pb-4 pt-[4.5rem] md:px-8 lg:pt-20">
      <Arena />
    </main>
  );
}
