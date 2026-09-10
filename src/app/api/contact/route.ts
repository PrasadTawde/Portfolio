import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";

const MAX_LENGTH = { name: 200, email: 200, project: 5000 };
// A real visitor can't read the form, fill three fields and submit faster
// than this — anything quicker is almost certainly a bot filling the form
// programmatically the instant it loads.
const MIN_SUBMIT_MS = 2000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function badRequest(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}

/**
 * Contact-form submission endpoint. Validation lives here (this is about
 * deciding what's a well-formed, human-submitted request); actually sending
 * the email is delegated to src/lib/email.ts. Two lightweight, dependency-
 * free anti-spam layers — a honeypot field and a minimum-time-on-page check
 * — catch the overwhelming majority of automated form spam without needing
 * a captcha or an external rate-limiting service. If spam becomes a real
 * problem later, that's the natural next upgrade — not worth building
 * ahead of an actual need.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid request.");
  }
  if (typeof body !== "object" || body === null) return badRequest("Invalid request.");

  const { name, email, project, company, startedAt } = body as Record<string, unknown>;

  // Honeypot: a field real users never see or fill (see Contact.tsx). A bot
  // that fills every field trips this. Report success without sending
  // anything, so the bot has no signal telling it to skip the field next time.
  if (typeof company === "string" && company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }
  if (typeof startedAt === "number" && Date.now() - startedAt < MIN_SUBMIT_MS) {
    return NextResponse.json({ ok: true });
  }

  if (typeof name !== "string" || typeof email !== "string" || typeof project !== "string") {
    return badRequest("Please fill in every field.");
  }

  const trimmed = { name: name.trim(), email: email.trim(), project: project.trim() };
  if (!trimmed.name || !trimmed.email || !trimmed.project) {
    return badRequest("Please fill in every field.");
  }
  if (!EMAIL_RE.test(trimmed.email)) {
    return badRequest("That email address doesn't look right.");
  }
  if (
    trimmed.name.length > MAX_LENGTH.name ||
    trimmed.email.length > MAX_LENGTH.email ||
    trimmed.project.length > MAX_LENGTH.project
  ) {
    return badRequest("That message is too long.");
  }

  const result = await sendContactEmail(trimmed);
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
