// ── US phone helpers ──────────────────────────────────────────────────
// Canonical field format is "+1 (xxx) xxx-xxxx" (see the project's
// forms-compliance-pattern.md). We own the country code: any leading
// "1" / "+1" the user types or pastes is stripped, and our own "+1" is
// pre-set as soon as the first significant digit lands. NANP area and
// exchange codes never start with 1, so a leading 1 is unambiguously the
// country code and is always safe to drop.

// Reduce any input to at most 10 significant US digits (country code
// removed). Shared by every helper below so they stay in lock-step.
function significantDigits(value) {
  return String(value ?? "")
    .replace(/\D/g, "")
    .replace(/^1+/, "")
    .slice(0, 10);
}

// Live client-side formatter — bind to a phone input's onChange. Shows
// "+1 (" the moment a digit exists and fills toward the full mask.
// Returns "" when there are no significant digits (so "+1"/"1" alone
// clears the field rather than leaving a lone country code).
//   formatPhoneInput("5555550100")        → "+1 (555) 555-0100"
//   formatPhoneInput("15555550100")       → "+1 (555) 555-0100"
//   formatPhoneInput("+1 (555) 555-0100") → "+1 (555) 555-0100"
//   formatPhoneInput("555")               → "+1 (555"
//   formatPhoneInput("+1")                → ""
export function formatPhoneInput(value) {
  const d = significantDigits(value);
  if (d.length === 0) return "";
  if (d.length <= 3) return `+1 (${d}`;
  if (d.length <= 6) return `+1 (${d.slice(0, 3)}) ${d.slice(3)}`;
  return `+1 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

// Server-side canonical producer — use in API-route payloads. A complete
// 10-digit number becomes "+1 (xxx) xxx-xxxx"; anything partial or empty
// becomes "" so the field stays optional and never ships a junk value.
export function normalizePhoneForSubmit(value) {
  const d = significantDigits(value);
  if (d.length !== 10) return "";
  return `+1 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

// E.164 producer ("+15555550100") — the format GHL's contact API expects
// for reliable SMS delivery and dedupe. Partial/empty → "".
export function phoneToE164(value) {
  const d = significantDigits(value);
  return d.length === 10 ? `+1${d}` : "";
}

// True only when the value holds a complete 10-digit US number. Forms use
// this to gate submit so a partially typed number can't slip through.
export function isPhoneComplete(value) {
  return significantDigits(value).length === 10;
}
