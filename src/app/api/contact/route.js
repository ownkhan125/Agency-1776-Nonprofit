import { NextResponse } from "next/server";

// ── Server-only GHL integration ───────────────────────────────────────
// The contact form POSTs here (same-origin). This route runs on the
// server, so the GHL private-integration token stays server-side and is
// never shipped to the browser. It upserts the contact through the GHL
// API — mapping every form field to its custom field — and sets the
// SMS DND state from the two consent checkboxes. It then forwards the
// raw payload to the existing "main" webhook so any automations already
// wired to that workflow (notifications, etc.) keep firing.

const GHL_API = "https://services.leadconnectorhq.com";
const TOKEN = process.env.GHL_TOKEN;
const LOCATION_ID = process.env.GHL_LOCATION_ID;
// Two workflow webhook triggers for this location, fanned out on every
// submit (same pattern as the other Agency 1776 sites). Both are baked in
// as defaults (env overrides) so the form works without .env config. The
// contact webhook drives the primary contact/automation workflow; the SMS
// webhook drives the consent/opt-in workflow. Both receive the identical
// payload. Location hook 8TREyhjak2hmHw12ESeq matches GHL_LOCATION_ID.
const CONTACT_WEBHOOK_URL =
  process.env.GHL_MAIN_WEBHOOK_URL ||
  "https://services.leadconnectorhq.com/hooks/8TREyhjak2hmHw12ESeq/webhook-trigger/pA71jqUh6XBL5zdivsmw";

const SMS_WEBHOOK_URL =
  process.env.GHL_SMS_WEBHOOK_URL ||
  "https://services.leadconnectorhq.com/hooks/8TREyhjak2hmHw12ESeq/webhook-trigger/RtibjvVl4DWD6JYxTlqO";

// Custom field IDs (verified/created via the GHL API for this location).
const CUSTOM_FIELD_IDS = {
  organization_name: "Bjyi1APXyxP308z4F9iu",
  organization_type: "cNELH5eArRTRA5SaYs1b",
  need: "p0t4BKHqIizZDzE3q1Ks",
  goal: "aOaeaLTEZWmEYubO040J",
  branding: "CmeOGNiZ2isyRmUgRYdm",
  donation_platform: "PJxdHd12fNtybgLrWDPf",
  monthly_support: "oq4dzqihppemWhvQ59sA",
  message: "OHuTwEgxie6vyEpnVkbS",
  sms_account_consent: "9Ba0nl7To8pVpI53Snn0",
  sms_marketing_consent: "tveI1kdakUfVWANU77Sf",
};

const str = (v) => (v == null ? "" : String(v).trim());

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // SMS DND: "inactive" = allowed (opted in), "active" = suppressed.
  // We allow SMS when either consent box is Yes; both are also recorded
  // as custom fields (below) for a compliance trail.
  const accountConsent = str(body.sms_account_consent).toLowerCase() === "yes";
  const marketingConsent =
    str(body.sms_marketing_consent).toLowerCase() === "yes";
  const smsAllowed = accountConsent || marketingConsent;

  // ── Primary path: fire the workflow webhook(s) ──────────────────────
  // The contact webhook fires on EVERY submit — its GHL workflow creates/
  // updates the contact and drives base automation from the payload.
  //
  // The SMS opt-in webhook fires ONLY when the user actually consented.
  // Its workflow applies the "sms optin" tag and opt-in state, so firing
  // it unconditionally tagged every contact as opted-in even when no box
  // was checked (the reported bug). Gating it on `smsAllowed` is the fix.
  //
  // Per-URL `.catch` so one dead webhook can't block the other. At least
  // one must succeed for a 200.
  const webhookUrls = [
    CONTACT_WEBHOOK_URL,
    smsAllowed ? SMS_WEBHOOK_URL : null,
  ].filter(Boolean);

  let webhookOk = false;
  if (webhookUrls.length > 0) {
    const results = await Promise.all(
      webhookUrls.map((url) =>
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }).catch((err) => {
          console.error("Webhook forward error:", err?.message);
          return { ok: false };
        })
      )
    );
    // Partial failure still succeeds — one live workflow is enough.
    webhookOk = results.some((r) => r.ok);
    if (!webhookOk) {
      console.error("All webhook forwards failed.");
    }
  } else {
    console.error("No webhook URLs configured.");
  }

  // ── Best-effort: upsert the contact via the GHL REST API ────────────
  // Runs only when a private-integration token is configured. It enriches
  // the contact with mapped custom fields + explicit SMS DND state, but is
  // never required — a failure here does not fail the submission.
  let contactId = null;
  if (TOKEN && LOCATION_ID) {
    const customFields = [];
    for (const [key, id] of Object.entries(CUSTOM_FIELD_IDS)) {
      const value = str(body[key]);
      if (value) customFields.push({ id, value });
    }

    const contactPayload = {
      locationId: LOCATION_ID,
      name: str(body.full_name),
      firstName: str(body.first_name),
      lastName: str(body.last_name),
      email: str(body.email),
      phone: str(body.phone),
      companyName: str(body.organization_name),
      source: str(body.source) || "Agency 1776 Nonprofit — Contact Form",
      customFields,
      dndSettings: {
        SMS: {
          status: smsAllowed ? "inactive" : "active",
          message: "Contact form SMS consent",
        },
      },
    };

    try {
      const res = await fetch(`${GHL_API}/contacts/upsert`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Version: "2021-07-28",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(contactPayload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        contactId = data?.contact?.id ?? null;
      } else {
        console.error("GHL upsert failed:", res.status, data);
      }
    } catch (err) {
      console.error("GHL upsert error:", err?.message);
    }
  }

  // Succeed as long as the automation was triggered by at least one path.
  if (!webhookOk && !contactId) {
    return NextResponse.json(
      { ok: false, error: "Submission could not be delivered" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, contactId, smsAllowed });
}
