import { Cursor } from "@/components/Cursor";
import TopBar from "@/components/TopBar";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { ContactHero } from "@/sections/contact/ContactHero";
import { ContactForm } from "@/sections/contact/ContactForm";
import { ContactClose } from "@/sections/contact/ContactClose";

export const metadata = {
  title: "Contact · Agency 1776 Nonprofit",
  description:
    "Tell us about your mission. Agency 1776 helps nonprofits build websites, donation pages, volunteer paths, campaigns, and digital support.",
};

export default function ContactPage() {
  return (
    <div className="bg-background text-foreground">
      <Cursor />
      <TopBar />
      <NavBar />
      <SmoothScrollProvider>
        <main>
          <ContactHero />
          <ContactForm />
          <ContactClose />
        </main>
        <Footer />
      </SmoothScrollProvider>
    </div>
  );
}
