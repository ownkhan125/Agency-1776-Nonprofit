"use client";

import { useState } from "react";
import { SectionShell } from "@/components/SectionShell";
import { SplitText } from "@/components/SplitText";
import { StarMark } from "@/components/StarMark";
import { TacticalDivider } from "@/components/TacticalDivider";
import { cn } from "@/utils/cn";

// ── Exact-content dropdown option lists ───────────────────────────────
// EVERY option below is a verbatim copy from the user's supplied brief.
// Do not reorder, rename, add, or remove entries.

const ORG_TYPES = [
  "Local nonprofit",
  "Community organization",
  "Faith-based organization",
  "Education / youth nonprofit",
  "Health and human services nonprofit",
  "Veteran support organization",
  "Advocacy nonprofit",
  "Foundation",
  "Animal welfare organization",
  "Grassroots movement",
  "Other",
];

const NEEDS = [
  "New nonprofit website",
  "Website redesign",
  "Donation page",
  "Volunteer signup page",
  "Fundraising campaign page",
  "Social media assets",
  "Email / supporter copy",
  "Full supporter engagement build",
  "Not sure yet",
];

const GOALS = [
  "Increase donations",
  "Recruit volunteers",
  "Build credibility",
  "Explain programs clearly",
  "Promote events",
  "Launch a fundraising campaign",
  "Grow email list",
  "Modernize outdated website",
  "Other",
];

const BRANDING = [
  "Yes — logo and colors are ready",
  "Partially",
  "No — we need help",
  "Not sure",
];

const DONATION_PLATFORM = ["Yes", "Partially", "No", "Not sure"];

/**
 * Reusable field wrapper with the site's tactical language.
 * Renders label above the control; the control itself is a chamfered
 * plate that echoes the angular-panel geometry. Every control uses the
 * same base styling so the form reads as a single engineered plate,
 * not a stack of generic inputs.
 */
function Field({ label, htmlFor, children, span = 1 }) {
  return (
    <div className={cn("flex flex-col gap-2", span === 2 && "md:col-span-2")}>
      <label
        htmlFor={htmlFor}
        className="text-[10px] uppercase tracking-[0.28em] text-foreground/60"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const controlBase =
  "w-full appearance-none border border-foreground/15 bg-[color:var(--color-input)] px-4 py-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-foreground/40 focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_18%,transparent)]";

// Chamfered clip so inputs pick up the same cut-corner language as the
// angular-panel plates used elsewhere on the site.
const chamferClip = {
  clipPath:
    "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
};

/**
 * Contact Form section — H2 + subtext + the 10 fields the user
 * specified, in the order given, with the labels, placeholders,
 * dropdown options and submit button copy exactly as supplied. Nothing
 * added, nothing removed, nothing rewritten.
 *
 * Validation: HTML5 `required` on Full Name, Email Address, and
 * Message (three fields commonly required for inquiry submission).
 * Every other field is optional per the brief — the user didn't mark
 * any as required so nothing else forces a value.
 */
export function ContactForm() {
  const [status, setStatus] = useState("idle");

  const onSubmit = (e) => {
    e.preventDefault();
    // No backend endpoint in scope — this handler exists so the form
    // is functional and doesn't full-page-reload. In production wire
    // to the /api/contact route.
    setStatus("submitted");
  };

  return (
    <SectionShell
      id="contact-form"
      revealMode="once"
      innerClassName="relative mx-auto max-w-[1600px] px-6 py-20 md:px-10 md:py-28"
    >
      <TacticalDivider label="Doctrine 02 · Contact" className="mb-14 md:mb-20" />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-20">
        <div className="max-w-xl">
          <div className="mb-6 flex items-center gap-4">
            <StarMark className="h-5 w-5 text-accent" />
          </div>
          <SplitText
            as="h2"
            scrub
            className="text-[clamp(2rem,4.6vw,3.75rem)] font-semibold leading-[1.05] tracking-tight"
            text="Start the Conversation."
          />
          <SplitText
            as="p"
            className="mt-8 text-base leading-relaxed text-foreground/70 md:text-lg"
            text="Complete the form below so we can understand your mission, your goals, and the digital support you need."
          />
        </div>

        <div
          className="angular-panel relative p-8 md:p-12"
          data-animate-border
          style={{
            "--ap-cut": "22px",
            "--ap-bg": "var(--color-surface)",
            "--ap-border-color":
              "color-mix(in srgb, var(--color-foreground) 12%, transparent)",
          }}
        >
          <span className="tac-bracket tac-bracket-tl" />
          <span className="tac-bracket tac-bracket-br" />

          <form
            onSubmit={onSubmit}
            noValidate={false}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-x-6 md:gap-y-7"
          >
            <Field label="Full Name" htmlFor="full-name">
              <input
                id="full-name"
                name="fullName"
                type="text"
                required
                placeholder="Enter your full name"
                className={controlBase}
                style={chamferClip}
              />
            </Field>

            <Field label="Email Address" htmlFor="email">
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email address"
                className={controlBase}
                style={chamferClip}
              />
            </Field>

            <Field label="Phone Number" htmlFor="phone">
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                className={controlBase}
                style={chamferClip}
              />
            </Field>

            <Field label="Organization Name" htmlFor="org-name">
              <input
                id="org-name"
                name="organizationName"
                type="text"
                placeholder="Enter your nonprofit or organization name"
                className={controlBase}
                style={chamferClip}
              />
            </Field>

            <Field label="Organization Type" htmlFor="org-type">
              <select
                id="org-type"
                name="organizationType"
                defaultValue=""
                className={cn(controlBase, "themed-select")}
                style={chamferClip}
              >
                <option value="" disabled>
                  Select an option
                </option>
                {ORG_TYPES.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="What Do You Need Help With?" htmlFor="need">
              <select
                id="need"
                name="need"
                defaultValue=""
                className={cn(controlBase, "themed-select")}
                style={chamferClip}
              >
                <option value="" disabled>
                  Select an option
                </option>
                {NEEDS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Main Goal" htmlFor="goal">
              <select
                id="goal"
                name="goal"
                defaultValue=""
                className={cn(controlBase, "themed-select")}
                style={chamferClip}
              >
                <option value="" disabled>
                  Select an option
                </option>
                {GOALS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Do You Already Have Branding?" htmlFor="branding">
              <select
                id="branding"
                name="branding"
                defaultValue=""
                className={cn(controlBase, "themed-select")}
                style={chamferClip}
              >
                <option value="" disabled>
                  Select an option
                </option>
                {BRANDING.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Do You Already Have a Donation Platform?"
              htmlFor="donation-platform"
              span={2}
            >
              <select
                id="donation-platform"
                name="donationPlatform"
                defaultValue=""
                className={cn(controlBase, "themed-select")}
                style={chamferClip}
              >
                <option value="" disabled>
                  Select an option
                </option>
                {DONATION_PLATFORM.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Message" htmlFor="message" span={2}>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Tell us about your mission, who you serve, and what you need help building."
                className={cn(controlBase, "resize-y")}
                style={chamferClip}
              />
            </Field>

            <div className="md:col-span-2 mt-2 flex flex-col items-start gap-4">
              <button
                type="submit"
                className="tac-btn tac-btn-primary"
                data-cursor="button"
              >
                <span className="relative z-10 inline-block">
                  Send Nonprofit Inquiry
                </span>
                <span
                  aria-hidden="true"
                  className="relative z-10 inline-block"
                >
                  →
                </span>
              </button>
              {status === "submitted" && (
                <p
                  role="status"
                  className="text-[11px] uppercase tracking-[0.28em] text-accent"
                >
                  Inquiry received — we'll be in touch.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </SectionShell>
  );
}
