import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "more | naman rusia",
  description: "the desk. photos, hobbies, and the stuff that isn't on the resume.",
};

// Applies a pinned theme before first paint so a stored choice doesn't flash the system one.
const themeScript = `try{var t=localStorage.getItem("more-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default function MoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-more
      className={`${instrumentSerif.variable} min-h-screen bg-desk text-ink antialiased [font-family:var(--font-geist-sans),system-ui,sans-serif]`}
      style={{
        backgroundImage:
          "radial-gradient(color-mix(in srgb, var(--ink) 13%, transparent) 1px, transparent 1.3px)",
        backgroundSize: "34px 34px",
      }}
    >
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      {children}
    </div>
  );
}
