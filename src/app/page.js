import { Cursor } from "@/components/Cursor";
import TopBar from "@/components/TopBar";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { Hero } from "@/sections/Hero";
import { Approach } from "@/sections/Approach";
import { Journey } from "@/sections/Journey";
import { Audience } from "@/sections/Audience";
import { Process } from "@/sections/Process";
import { Offerings } from "@/sections/Offerings";
import { FinalCTA } from "@/sections/FinalCTA";

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <Cursor />
      <TopBar />
      <NavBar />
      <SmoothScrollProvider>
        <main>
          <Hero />
          <Approach />
          <Journey />
          <Audience />
          <Process />
          <Offerings />
          <FinalCTA />
        </main>
        <Footer />
      </SmoothScrollProvider>
    </div>
  );
}
