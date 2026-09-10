/**
 * Contact section on Home. Email and social links live in SITE, since the
 * header/footer need them too — this file is just this section's own copy.
 * The blurb below echoes SITE.availableFrom ("Open for work") rather than
 * committing to a specific engagement type (freelance/contract/full-time) —
 * keep the two in sync if that framing changes.
 */
export const CONTACT = {
  eyebrow: "04 · Contact",
  heading: "Let's work together",
  blurb: "Open for work — a short note about the project and timeline is plenty to start.",
  emailLabel: "Email",
  elsewhereLabel: "Elsewhere",
  form: {
    nameLabel: "Name",
    emailLabel: "Email",
    projectLabel: "Project",
    submitLabel: "Send message",
    sendingLabel: "Sending…",
    submittedLabel: "Message sent — I'll reply within a day or two.",
    /** Generic fallback shown only if the server response has no error text of its own. */
    errorFallback: "Something went wrong — please try again.",
  },
};
