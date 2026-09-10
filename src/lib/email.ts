import { SITE } from "@/content/site";

/**
 * Contact-form email delivery via Resend (https://resend.com). Same shape as
 * src/lib/social.ts: one file, reads its own env vars, never throws — the
 * route handler that calls this is the only other thing that needs to know
 * delivery exists at all. Swapping providers later means rewriting this
 * file's body, not the form or the route.
 *
 * Plain `fetch` against Resend's REST API rather than their SDK — the whole
 * integration is one POST with a JSON body, not worth a dependency for.
 */

const RESEND_API_URL = "https://api.resend.com/emails";

// Resend's own shared address — works immediately with zero setup, before a
// custom sending domain is verified. Once your domain's verified in Resend,
// set CONTACT_FROM_EMAIL (e.g. "Portfolio <contact@yourdomain.com>") and
// this fallback stops being used.
const FALLBACK_FROM = "Portfolio Contact <onboarding@resend.dev>";

export interface ContactMessage {
  name: string;
  email: string;
  project: string;
}

export interface SendResult {
  ok: boolean;
  /** User-facing message — never raw provider/error details. */
  error?: string;
}

/**
 * Sends the visitor's message as a plain-text email to CONTACT_TO_EMAIL
 * (defaults to SITE.email) from CONTACT_FROM_EMAIL (defaults to Resend's
 * test sender), with the visitor's own address set as reply-to so replying
 * from an inbox goes straight back to them. Plain text, not HTML — this is
 * a notification email to yourself, not something that needs a template,
 * and it sidesteps ever having to think about HTML-escaping visitor input.
 */
export async function sendContactEmail(msg: ContactMessage): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY is not set — message was not sent.");
    return { ok: false, error: "Email isn't configured yet. Reach out directly instead — see the address above." };
  }

  const to = process.env.CONTACT_TO_EMAIL || SITE.email;
  const from = process.env.CONTACT_FROM_EMAIL || FALLBACK_FROM;

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: msg.email,
        subject: `New message from ${msg.name} — ${SITE.name} portfolio`,
        text: `${msg.name} <${msg.email}> wrote:\n\n${msg.project}`,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[contact] Resend request failed:", res.status, body);
      return { ok: false, error: "Couldn't send that — please try again in a moment." };
    }

    return { ok: true };
  } catch (err) {
    console.error("[contact] Resend request threw:", err);
    return { ok: false, error: "Couldn't send that — please try again in a moment." };
  }
}
