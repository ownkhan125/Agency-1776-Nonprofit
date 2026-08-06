import TopBar from "@/components/TopBar";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { BuildFinderHero } from "@/sections/build-finder/BuildFinderHero";
import { BuildFinderExperience } from "@/sections/build-finder/BuildFinderExperience";
import { BuildFinderCTA } from "@/sections/build-finder/BuildFinderCTA";

export const metadata = {
  title: "Build Finder · Agency 1776 Nonprofit",
  description:
    "Find the right nonprofit build. Answer a few questions about your organization, goals, donation setup, and monthly support range, and Agency 1776 will recommend the website and support path that fits your mission.",
};

export default function BuildFinderPage() {
  return (
    <div className="bg-background text-foreground">
      <TopBar />
      <NavBar />
      <SmoothScrollProvider>
        <main>
          <BuildFinderHero />
          <BuildFinderExperience />
          <BuildFinderCTA />
        </main>
        <Footer />
      </SmoothScrollProvider>
    </div>
  );
}
