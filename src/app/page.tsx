import { About } from "@/components/sections/About";
import { Activity } from "@/components/sections/Activity";
import { CameraRoll } from "@/components/sections/CameraRoll";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { profile } from "@/content/profile";
import { getContributions } from "@/lib/github";

// Rebuilt in the background every six hours, which is what keeps the contribution graph current.
export const revalidate = 21600;

export default async function Home() {
  const days = await getContributions(profile.handle);
  return (
    <main id="main">
      <Hero />
      <About />
      <Experience />
      <Projects />
      <CameraRoll />
      {days && <Activity days={days} />}
      <Contact />
    </main>
  );
}
