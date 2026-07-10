import { Cursor } from "@/components/Cursor";
import TopBar from "@/components/TopBar";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { PortfolioHero } from "@/sections/portfolio/PortfolioHero";
import { PortfolioShowcase } from "@/sections/portfolio/PortfolioShowcase";
import { PortfolioCTA } from "@/sections/portfolio/PortfolioCTA";

export default function PortfolioPage() {
  return (
    <div className="bg-background text-foreground">
      <Cursor />
      <TopBar />
      <NavBar />
      <SmoothScrollProvider>
        <main>
          <PortfolioHero />
          <PortfolioShowcase />
          <PortfolioCTA />
        </main>
        <Footer />
      </SmoothScrollProvider>
    </div>
  );
}
