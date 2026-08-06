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
  "Volunteer signup path",
  "Fundraising campaign page",
  "Supporter follow-up",
  "Donor thank-you messaging",
  "Volunteer communication",
  "Social media assets",
  "Email / supporter copy",
  "Ongoing monthly support",
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
  "Yes - logo and colors are ready",
  "Partially",
  "No - we need help",
  "Not sure",
];

const DONATION_PLATFORM = ["Yes", "Partially", "No", "Not sure"];

const MONTHLY_SUPPORT = [
  "Around $1,000/month",
  "Around $1,500/month",
  "Around $2,000/month",
  "Custom / not sure",
];

const GHL_LOCATION_ID = "8TREyhjak2hmHw12ESeq";

// ── Phone helpers ─────────────────────────────────────────────────────
// US numbers only (the org is US-based). We format as the user types and
// hard-cap the significant digits so junk like "123123123213..." can't be
// entered, and an incomplete number is caught on submit.

// Strip to digits, dropping an optional leading "1" country code, capped
// at 10 significant digits.
function phoneDigits(value) {
  let d = (value || "").replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  return d.slice(0, 10);
}

// Progressive display formatting → "(XXX) XXX-XXXX".
function formatUsPhone(value) {
  const d = phoneDigits(value);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

// A complete US number has exactly 10 significant digits.
function isCompleteUsPhone(value) {
  return phoneDigits(value).length === 10;
}

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
        className="text-[11px] font-medium uppercase tracking-[0.28em] text-foreground/70"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const controlBase =
  "w-full appearance-none border border-foreground/15 bg-[color:var(--color-input)] px-4 py-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-foreground/40 focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_18%,transparent)] md:text-base";

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
  // Phone is tracked so the SMS opt-in checkboxes stay disabled until a
  // COMPLETE number is present — TCPA-style: no consent without a valid
  // target number. `phoneError` surfaces incomplete-number validation.
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const smsEnabled = isCompleteUsPhone(phone);

  const onPhoneChange = (e) => {
    setPhone(formatUsPhone(e.target.value));
    if (phoneError) setPhoneError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Phone is optional, but if one is entered it must be complete.
    const digits = phoneDigits(phone);
    if (digits.length > 0 && digits.length !== 10) {
      setPhoneError("Enter a complete 10-digit US phone number.");
      form.querySelector("#phone")?.focus();
      return;
    }
    setPhoneError("");

    const fullName = (data.get("fullName") || "").toString().trim();
    const [firstName, ...restName] = fullName.split(/\s+/);
    const lastName = restName.join(" ");

    const payload = {
      locationId: GHL_LOCATION_ID,
      full_name: fullName,
      first_name: firstName || "",
      last_name: lastName || "",
      email: (data.get("email") || "").toString().trim(),
      phone: digits ? `+1${digits}` : "",
      organization_name: (data.get("organizationName") || "").toString().trim(),
      organization_type: (data.get("organizationType") || "").toString(),
      need: (data.get("need") || "").toString(),
      goal: (data.get("goal") || "").toString(),
      branding: (data.get("branding") || "").toString(),
      donation_platform: (data.get("donationPlatform") || "").toString(),
      monthly_support: (data.get("monthlySupport") || "").toString(),
      message: (data.get("message") || "").toString().trim(),
      sms_account_consent: data.get("smsAccountConsent") ? "Yes" : "No",
      sms_marketing_consent: data.get("smsMarketingConsent") ? "Yes" : "No",
      source: "Agency 1776 Nonprofit — Contact Form",
      submitted_at: new Date().toISOString(),
      page_url:
        typeof window !== "undefined" ? window.location.href : "",
    };

    setStatus("submitting");

    try {
      // Posts same-origin to our server route, which upserts the contact
      // (all custom fields + SMS consent/DND) through the GHL API with a
      // server-side token, then forwards to the main webhook.
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.ok) {
        throw new Error(result.error || `Request failed (${res.status})`);
      }

      setStatus("submitted");
      form.reset();
      setPhone("");
    } catch (err) {
      console.error("Contact form submission failed:", err);
      setStatus("error");
    }
  };

  return (
    <SectionShell
      id="contact-form"
      revealMode="once"
      innerClassName="relative mx-auto max-w-[1600px] px-6 py-20 md:px-10 md:py-28"
    >
      <TacticalDivider
        label="Doctrine 02 · Contact"
        labelClassName="text-[11px] font-medium"
        className="mb-14 md:mb-20"
      />

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
                inputMode="tel"
                autoComplete="tel"
                maxLength={14}
                value={phone}
                onChange={onPhoneChange}
                placeholder="(555) 123-4567"
                aria-invalid={phoneError ? "true" : undefined}
                aria-describedby={phoneError ? "phone-error" : undefined}
                className={cn(
                  controlBase,
                  phoneError &&
                    "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_color-mix(in_srgb,#ef4444_18%,transparent)]"
                )}
                style={chamferClip}
              />
              {phoneError && (
                <p
                  id="phone-error"
                  role="alert"
                  className="text-xs leading-relaxed text-red-500"
                >
                  {phoneError}
                </p>
              )}
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

            <Field label="Monthly Support Range" htmlFor="monthly-support">
              <select
                id="monthly-support"
                name="monthlySupport"
                defaultValue=""
                className={cn(controlBase, "themed-select")}
                style={chamferClip}
              >
                <option value="" disabled>
                  Select an option
                </option>
                {MONTHLY_SUPPORT.map((o) => (
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

            {/* SMS preferences — consent checkboxes stay disabled until a
                phone number is entered above (no opt-in without a number). */}
            <div className="md:col-span-2 flex flex-col gap-3">
              <span className="text-xs uppercase tracking-[0.28em] text-foreground/60">
                SMS preferences
              </span>
              {!smsEnabled && (
                <p className="text-sm leading-relaxed text-foreground/45 md:text-base">
                  Enter a phone number above to opt in to SMS messages.
                </p>
              )}
              <div
                className={cn(
                  "flex flex-col gap-3 transition-opacity duration-200",
                  !smsEnabled && "opacity-50"
                )}
              >
                <label
                  data-cursor={smsEnabled ? undefined : "disabled"}
                  className={cn(
                    "flex items-start gap-3 text-[15px] font-medium leading-relaxed text-foreground/80 md:text-base",
                    !smsEnabled && "cursor-not-allowed"
                  )}
                >
                  <input
                    type="checkbox"
                    name="smsAccountConsent"
                    disabled={!smsEnabled}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--color-accent)] disabled:cursor-not-allowed"
                  />
                  <span>
                    I agree to receive account and project-related text messages
                    from Agency 1776 at the number provided. Message
                    frequency varies. Msg &amp; data rates may apply. Reply STOP
                    to opt out, HELP for help.
                  </span>
                </label>
                <label
                  data-cursor={smsEnabled ? undefined : "disabled"}
                  className={cn(
                    "flex items-start gap-3 text-[15px] font-medium leading-relaxed text-foreground/80 md:text-base",
                    !smsEnabled && "cursor-not-allowed"
                  )}
                >
                  <input
                    type="checkbox"
                    name="smsMarketingConsent"
                    disabled={!smsEnabled}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[color:var(--color-accent)] disabled:cursor-not-allowed"
                  />
                  <span>
                    I agree to receive occasional promotional and marketing text
                    messages from Agency 1776. Message frequency
                    varies. Msg &amp; data rates may apply. Reply STOP to opt
                    out, HELP for help.
                  </span>
                </label>
              </div>
            </div>

            <div className="md:col-span-2 mt-2 flex flex-col items-start gap-4">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="tac-btn tac-btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                data-cursor="button"
              >
                <span className="relative z-10 inline-block">
                  {status === "submitting"
                    ? "Sending…"
                    : "Send Nonprofit Inquiry"}
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
              {status === "error" && (
                <p
                  role="status"
                  className="text-[11px] uppercase tracking-[0.28em] text-red-500"
                >
                  Submission failed — please try again or email us directly.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </SectionShell>
  );
}
