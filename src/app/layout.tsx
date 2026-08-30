import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./LayoutWrapper";
import { MusicProvider } from "@/contexts/MusicContext";
import MusicConsentPopup from "@/components/MusicConsentPopup";
import Analytics from "@/components/Analytics";
import { siteUrl } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Naman Rusia | Portfolio",
  description:
    "Full-stack developer and software engineer specializing in modern web technologies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MusicProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
          <MusicConsentPopup />
          <Analytics />
        </MusicProvider>
      </body>
    </html>
  );
}
