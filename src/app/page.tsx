import { HeroCrosshairs } from "@/components/chrome/BackgroundLayers";
import { ScrollCue } from "@/components/chrome/ScrollCue";
import { ScrollToHash } from "@/components/chrome/ScrollToHash";
import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import { About } from "@/components/sections/About";
import { ProjectsPreview } from "@/components/sections/ProjectsPreview";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <ScrollToHash />
      <HeroCrosshairs />
      <Hero />
      <Work />
      <About />
      <ProjectsPreview />
      <Contact />
      <ScrollCue />
    </>
  );
}
