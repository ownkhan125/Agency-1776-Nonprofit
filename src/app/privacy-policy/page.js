import Link from "next/link";
import TopBar from "@/components/TopBar";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { LegalDocument } from "@/sections/legal/LegalDocument";

export const metadata = {
  title: "Privacy Policy · Agency 1776",
  description:
    "How Agency 1776 collects, uses, discloses, and safeguards the information you share when using our website, submitting an inquiry, or communicating with us.",
};

const linkClass =
  "text-accent underline underline-offset-4 decoration-accent/40 transition-colors hover:decoration-accent";

const INTRO = [
  "Agency 1776 values your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, submit an inquiry, or communicate with us.",
];

const SECTIONS = [
  {
    heading: "1. Information We Collect",
    content: [
      {
        type: "p",
        text: "We may collect information you voluntarily provide, including:",
      },
      {
        type: "list",
        items: [
          "Full name",
          "Email address",
          "Phone number",
          "Company or organization name",
          "Project details or inquiry information",
          "SMS communication preferences",
          "Any additional information you choose to share with us",
        ],
      },
      {
        type: "p",
        text: "We may also automatically collect certain technical information, including:",
      },
      {
        type: "list",
        items: [
          "IP address",
          "Browser and device information",
          "Website usage data",
          "Pages visited",
          "Cookies and analytics information",
        ],
      },
    ],
  },
  {
    heading: "2. How We Use Your Information",
    body: ["We may use your information to:"],
    list: [
      "Respond to inquiries and consultation requests",
      "Discuss branding, website, marketing, or creative projects",
      "Provide requested services and project updates",
      "Improve our website and customer experience",
      "Send account, appointment, or service-related communications",
      "Send promotional communications where you have provided consent",
      "Meet legal and regulatory obligations",
    ],
  },
  {
    heading: "3. SMS Communications",
    content: [
      {
        type: "p",
        text: "If you choose to opt in to SMS communications, you may receive informational text messages regarding your inquiry, appointments, project updates, account notifications, or requested services.",
      },
      {
        type: "p",
        text: "If you separately opt in to promotional SMS communications, you may receive updates about Agency 1776, announcements, special offers, or marketing communications.",
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
        text: "Consent to receive SMS messages is voluntary and is not a condition of purchasing services.",
      },
    ],
  },
  {
    heading: "4. SMS Privacy",
    body: [
      "SMS opt-in data and consent are used solely to provide the messaging services you request. Agency 1776 does not sell, rent, share, or disclose SMS opt-in information or consent with third parties or affiliates for their own marketing purposes.",
    ],
  },
  {
    heading: "5. Information Sharing",
    content: [
      {
        type: "p",
        text: "We may share information only when necessary to:",
      },
      {
        type: "list",
        items: [
          "Deliver requested services",
          "Work with trusted vendors or service providers supporting our business operations",
          "Comply with legal requirements",
          "Protect our legal rights and business interests",
        ],
      },
      {
        type: "p",
        text: "We do not sell personal information.",
      },
    ],
  },
  {
    heading: "6. Cookies & Analytics",
    body: [
      "We may use cookies and similar technologies to understand website performance, improve functionality, and enhance your browsing experience.",
      "You can manage or disable cookies through your browser settings.",
    ],
  },
  {
    heading: "7. Data Retention",
    body: [
      "We retain personal information only for as long as necessary to fulfill the purposes described in this Privacy Policy or as required by applicable law.",
    ],
  },
  {
    heading: "8. Data Security",
    body: [
      "We maintain reasonable administrative, technical, and organizational safeguards to protect your personal information.",
    ],
  },
  {
    heading: "9. Children's Privacy",
    body: [
      "Our website is not intended for children under the age of 13, and we do not knowingly collect personal information from children.",
    ],
  },
  {
    heading: "10. Third-Party Links",
    body: [
      "Our website may contain links to third-party websites. We are not responsible for their privacy practices or content.",
    ],
  },
  {
    heading: "11. Changes to This Privacy Policy",
    body: [
      "We may update this Privacy Policy periodically. Updates will be posted on this page with a revised effective date.",
    ],
  },
  {
    heading: "12. Additional Information",
    content: [
      {
        type: "p",
        text: (
          <>
            For additional information about your use of our website and
            services, please review our{" "}
            <Link href="/terms-and-conditions" className={linkClass}>
              Terms &amp; Conditions
            </Link>
            .
          </>
        ),
      },
    ],
  },
  {
    heading: "13. Contact Us",
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

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background text-foreground">
      <TopBar />
      <NavBar />
      <SmoothScrollProvider>
        <main>
          <LegalDocument
            eyebrow="Privacy · Agency 1776"
            title="Privacy Policy"
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
