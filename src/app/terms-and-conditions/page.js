import Link from "next/link";
import TopBar from "@/components/TopBar";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { LegalDocument } from "@/sections/legal/LegalDocument";

export const metadata = {
  title: "Terms & Conditions · Agency 1776",
  description:
    "The terms that govern your use of the Agency 1776 website.",
};

const linkClass =
  "text-accent underline underline-offset-4 decoration-accent/40 transition-colors hover:decoration-accent";

const INTRO = [
  "These Terms & Conditions govern your use of the Agency 1776 website. By accessing or using this website, you agree to these Terms.",
];

const SECTIONS = [
  {
    heading: "1. Website Use",
    body: [
      "You agree to use this website only for lawful purposes and in a manner that does not interfere with its operation or the experience of other visitors.",
      "You may not:",
    ],
    list: [
      "Submit false or misleading information",
      "Attempt unauthorized access to our systems",
      "Introduce malicious software or harmful code",
      "Use this website for unlawful purposes",
    ],
  },
  {
    heading: "2. Intellectual Property",
    body: [
      "All content on this website, including text, graphics, branding, logos, images, designs, videos, and other creative materials, is the property of Agency 1776 unless otherwise stated.",
      "No content may be reproduced, copied, modified, or distributed without prior written permission.",
    ],
  },
  {
    heading: "3. Project Inquiries",
    body: [
      "Submitting a project inquiry or consultation request does not establish a contractual relationship or guarantee that Agency 1776 will accept a project.",
    ],
  },
  {
    heading: "4. SMS Terms",
    content: [
      {
        type: "p",
        text: "If you opt in to receive SMS communications:",
      },
      {
        type: "list",
        items: [
          "Message frequency varies.",
          "Message and data rates may apply.",
          "Reply STOP to unsubscribe.",
          "Reply HELP for assistance.",
        ],
      },
      {
        type: "p",
        text: "SMS consent is not a condition of purchasing services.",
      },
      {
        type: "p",
        text: "SMS opt-in information and consent will not be shared, sold, rented, or disclosed to third parties or affiliates for marketing purposes.",
      },
      {
        type: "p",
        text: (
          <>
            Please review our{" "}
            <Link href="/privacy-policy" className={linkClass}>
              Privacy Policy
            </Link>{" "}
            to learn how we collect, use, and protect your personal information.
          </>
        ),
      },
    ],
  },
  {
    heading: "5. Third-Party Services",
    body: [
      "Our website may include links to external websites or services. Agency 1776 is not responsible for the content or practices of those third-party websites.",
    ],
  },
  {
    heading: "6. Disclaimer",
    body: [
      "Information on this website is provided for general informational purposes. While we strive to keep content accurate and up to date, we make no guarantees regarding completeness or accuracy.",
    ],
  },
  {
    heading: "7. Limitation of Liability",
    body: [
      "To the fullest extent permitted by law, Agency 1776 shall not be liable for any indirect, incidental, consequential, or special damages arising from the use of this website.",
    ],
  },
  {
    heading: "8. Changes to These Terms",
    body: [
      "We reserve the right to update these Terms & Conditions at any time. Any changes will become effective upon publication on this page.",
    ],
  },
  {
    heading: "9. Governing Law",
    body: [
      "These Terms & Conditions are governed by the laws of the State of Arizona, without regard to its conflict of law principles.",
    ],
  },
  {
    heading: "10. Contact",
    content: [
      {
        type: "p",
        text: (
          <>
            Agency 1776
            <br />
            2325 E Camelback Rd, Suite 400
            <br />
            Phoenix, AZ 85016, USA
          </>
        ),
      },
      {
        type: "p",
        text: (
          <>
            Email:{" "}
            <a href="mailto:outdevelopment@op1776.com" className={linkClass}>
              outdevelopment@op1776.com
            </a>
          </>
        ),
      },
      {
        type: "p",
        text: (
          <>
            Phone:{" "}
            <a href="tel:+18446201776" className={linkClass}>
              +1 (844) 620-1776
            </a>
          </>
        ),
      },
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-background text-foreground">
      <TopBar />
      <NavBar />
      <SmoothScrollProvider>
        <main>
          <LegalDocument
            eyebrow="Terms · Agency 1776"
            title="Terms & Conditions"
            updated="August 2026"
            intro={INTRO}
            sections={SECTIONS}
          />
        </main>
        <Footer />
      </SmoothScrollProvider>
    </div>
  );
}
