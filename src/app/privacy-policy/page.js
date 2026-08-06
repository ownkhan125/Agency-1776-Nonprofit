import { Cursor } from "@/components/Cursor";
import TopBar from "@/components/TopBar";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { LegalDocument } from "@/sections/legal/LegalDocument";

export const metadata = {
  title: "Privacy Policy · Agency 1776 Nonprofit",
  description:
    "How Agency 1776 collects, uses, and protects the information you share when using our website or submitting a nonprofit inquiry.",
};

const INTRO = [
  'Agency 1776 ("we," "us," or "our") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains what we collect, how we use it, and the choices you have.',
  "By using our website or submitting an inquiry, you agree to the practices described in this policy.",
];

const SECTIONS = [
  {
    heading: "1. Information We Collect",
    body: [
      "We collect information you provide directly to us and information gathered automatically when you use our website.",
    ],
    list: [
      "Contact details you submit through our forms — name, email address, phone number, and organization name.",
      "Details about your organization and project — organization type, goals, support needs, donation setup, and budget range.",
      "Message content and any information you choose to include in your inquiry.",
      "Technical data such as browser type, device information, and pages visited, collected automatically.",
    ],
  },
  {
    heading: "2. How We Use Your Information",
    body: ["We use the information we collect to:"],
    list: [
      "Respond to your inquiries and communicate with you about your project.",
      "Provide, operate, and improve our services and website.",
      "Prepare proposals, recommendations, and follow-up communication.",
      "Send updates you have requested or that relate to an active engagement.",
    ],
  },
  {
    heading: "3. How We Share Information",
    body: [
      "We do not sell your personal information. We may share information only in these limited situations:",
    ],
    list: [
      "With trusted service providers who help us operate our business (for example, form processing and CRM tools), under confidentiality obligations.",
      "When required by law, regulation, or valid legal process.",
      "To protect the rights, safety, and property of Agency 1776, our clients, or others.",
    ],
  },
  {
    heading: "4. Third-Party Services",
    body: [
      "Our forms and website may rely on third-party tools to process submissions and manage communication. These providers handle your data according to their own privacy policies.",
    ],
  },
  {
    heading: "5. Data Retention",
    body: [
      "We keep your information only as long as needed to fulfill the purposes described in this policy, to maintain business records, and to comply with legal obligations.",
    ],
  },
  {
    heading: "6. Cookies and Analytics",
    body: [
      "Our website may use cookies or similar technologies to understand how visitors use the site and to improve performance. You can control cookies through your browser settings.",
    ],
  },
  {
    heading: "7. Data Security",
    body: [
      "We take reasonable technical and organizational measures to protect your information. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    heading: "8. Your Rights",
    body: [
      "Depending on your location, you may have the right to access, correct, or delete the personal information we hold about you, or to object to certain processing. To make a request, contact us using the details below.",
    ],
  },
  {
    heading: "9. Children's Privacy",
    body: [
      "Our website and services are not directed to children under 13, and we do not knowingly collect personal information from them.",
    ],
  },
  {
    heading: "10. Changes to This Policy",
    body: [
      'We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top of this page.',
    ],
  },
  {
    heading: "11. Contact Us",
    body: [
      "If you have questions about this Privacy Policy or how we handle your information, contact us at outdevelopment@op1776.com.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background text-foreground">
      <Cursor />
      <TopBar />
      <NavBar />
      <SmoothScrollProvider>
        <main>
          <LegalDocument
            eyebrow="Privacy · Agency 1776"
            title="Privacy Policy"
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
