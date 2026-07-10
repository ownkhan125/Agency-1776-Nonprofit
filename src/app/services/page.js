import { Cursor } from "@/components/Cursor";
import TopBar from "@/components/TopBar";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { ServicesHero } from "@/sections/services/ServicesHero";
import { Categories } from "@/sections/services/Categories";
import { Deliverables } from "@/sections/services/Deliverables";
import { Moments } from "@/sections/services/Moments";
import { Outcomes } from "@/sections/services/Outcomes";
import { Solutions } from "@/sections/services/Solutions";
import { ServicesFinalCTA } from "@/sections/services/ServicesFinalCTA";

export default function ServicesPage() {
  return (
    <div className="bg-background text-foreground">
      <Cursor />
      <TopBar />
      <NavBar />
      <SmoothScrollProvider>
        <main>
          <ServicesHero />
          <Categories />
          <Deliverables />
          <Moments />
          <Outcomes />
          <Solutions />
          <ServicesFinalCTA />
        </main>
        <Footer />
      </SmoothScrollProvider>
    </div>
  );
}
