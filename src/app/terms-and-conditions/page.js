import { Cursor } from "@/components/Cursor";
import TopBar from "@/components/TopBar";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { LegalDocument } from "@/sections/legal/LegalDocument";

export const metadata = {
  title: "Terms & Conditions · Agency 1776 Nonprofit",
  description:
    "The terms that govern your use of the Agency 1776 website and the nonprofit digital services we provide.",
};

const INTRO = [
  'These Terms and Conditions ("Terms") govern your use of the Agency 1776 website and the services we provide. Please read them carefully.',
  "By accessing our website or engaging our services, you agree to be bound by these Terms.",
];

const SECTIONS = [
  {
    heading: "1. Services",
    body: [
      "Agency 1776 provides digital services for nonprofit organizations, including websites, donation pages, campaign pages, supporter follow-up, and related creative support. The specific scope of any engagement is defined in a separate proposal or agreement.",
    ],
  },
  {
    heading: "2. Use of the Website",
    body: [
      "You agree to use our website lawfully and not to misuse it, interfere with its operation, or attempt to access it in an unauthorized way.",
    ],
  },
  {
    heading: "3. Inquiries and Communication",
    body: [
      "Submitting a form or inquiry does not create a binding agreement. A project begins only once both parties agree to a defined scope, timeline, and terms in writing.",
    ],
  },
  {
    heading: "4. Intellectual Property",
    body: [
      "All content on this website — including text, graphics, logos, and design — is the property of Agency 1776 or its licensors and is protected by applicable laws. You may not reproduce or reuse it without permission. Ownership of deliverables created for a client is addressed in the project agreement.",
    ],
  },
  {
    heading: "5. Client Responsibilities",
    body: [
      "For project work, clients are responsible for providing accurate information, timely feedback, and any content, access, or approvals needed to complete the work.",
    ],
  },
  {
    heading: "6. Fees and Payments",
    body: [
      "Fees, payment schedules, and ongoing monthly support terms are set out in each project proposal or agreement. Recurring services continue until cancelled according to the agreed terms.",
    ],
  },
  {
    heading: "7. Third-Party Tools and Links",
    body: [
      "Our services and website may reference or integrate third-party tools and platforms. We are not responsible for the content, availability, or practices of third parties.",
    ],
  },
  {
    heading: "8. Disclaimers",
    body: [
      'Our website and services are provided "as is" without warranties of any kind, whether express or implied, to the fullest extent permitted by law. We do not guarantee specific results such as donation, volunteer, or fundraising outcomes.',
    ],
  },
  {
    heading: "9. Limitation of Liability",
    body: [
      "To the fullest extent permitted by law, Agency 1776 shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or services.",
    ],
  },
  {
    heading: "10. Termination",
    body: [
      "We may suspend or discontinue access to our website at any time. Termination of project services is governed by the applicable project agreement.",
    ],
  },
  {
    heading: "11. Governing Law",
    body: [
      "These Terms are governed by the laws of the jurisdiction in which Agency 1776 operates, without regard to conflict-of-law principles.",
    ],
  },
  {
    heading: "12. Changes to These Terms",
    body: [
      "We may update these Terms from time to time. Continued use of our website after changes take effect constitutes acceptance of the revised Terms.",
    ],
  },
  {
    heading: "13. Contact Us",
    body: [
      "For questions about these Terms, contact us at outdevelopment@op1776.com.",
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-background text-foreground">
      <Cursor />
      <TopBar />
      <NavBar />
      <SmoothScrollProvider>
        <main>
          <LegalDocument
            eyebrow="Terms · Agency 1776"
            title="Terms & Conditions"
            updated="August 5, 2026"
            intro={INTRO}
            sections={SECTIONS}
          />
        </main>
        <Footer />
      </SmoothScrollProvider>
    </div>
  );
}
