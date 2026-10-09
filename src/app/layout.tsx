import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import Analytics from "@/components/Analytics";
import { Nav } from "@/components/Nav";
import { SceneMount } from "@/components/SceneMount";
import { ScrollStage } from "@/components/ScrollStage";
import { Shortcuts } from "@/components/Shortcuts";
import { Terminal } from "@/components/Terminal";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/config";
import "./globals.css";

const departure = localFont({
  src: "../fonts/DepartureMono-Regular.woff2",
  variable: "--font-departure",
  display: "swap",
});
const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  // Posts use emphasis; without the italic cut the browser fakes a slant.
  style: ["normal", "italic"],
  display: "swap",
});

const description =
  "Naman Rusia: software engineer on backend, cloud and systems. CS + Business at Northeastern. Previously Sonos and Philips Healthcare.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: profile.name, template: `%s · ${profile.name}` },
  description,
  authors: [{ name: profile.name, url: siteUrl }],
  // Pages other than home set their own openGraph, which replaces this one wholesale.
  openGraph: {
    type: "website",
    siteName: profile.name,
    title: profile.name,
    description,
  },
  twitter: { card: "summary_large_image", creator: "@namanrusia1" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0c0b0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${departure.variable} ${schibsted.variable}`}>
      <body>
        <a
          href="#main"
          className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-3 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <SceneMount />
        <div
          aria-hidden
          className="dot-grid pointer-events-none fixed inset-0 z-0 opacity-40"
        />
        <ScrollStage />
        <Shortcuts />
        <Terminal />
        <Nav />
        <div className="relative z-10">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
