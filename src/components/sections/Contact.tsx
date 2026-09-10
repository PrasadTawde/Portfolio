"use client";

import { useRef, useState, type FormEvent } from "react";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { SITE } from "@/content/site";
import { CONTACT } from "@/content/contact";

const fieldClass =
  "border-0 border-b border-hair bg-transparent py-[6px] font-inter text-[15px] text-ink outline-none disabled:opacity-60";

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const motion = useSectionReveal(ref, { exit: false });
  const [status, setStatus] = useState<Status>("idle");
  const [errorText, setErrorText] = useState("");
  // Captured once via useState's lazy-initializer form (the sanctioned way
  // to compute an impure initial value — a bare `useRef(Date.now())` calls
  // Date.now() on every render, which the React Compiler's purity rule
  // rejects even though useRef only keeps the first result). The API route
  // rejects a submission that arrives faster than a human could plausibly
  // fill the form — one of two dependency-free anti-spam layers, see route.ts.
  const [startedAt] = useState(() => Date.now());
  // Only the in-flight request locks the fields — once a send succeeds the
  // form clears (via form.reset() below) and re-enables immediately, so
  // another message can be sent right away without a page reload.
  const locked = status === "sending";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setErrorText("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          project: data.get("project"),
          company: data.get("company"), // honeypot — see the hidden field below
          startedAt,
        }),
      });
      const result = (await res.json().catch(() => null)) as { ok: boolean; error?: string } | null;

      if (result?.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
        setErrorText(result?.error || CONTACT.form.errorFallback);
      }
    } catch {
      setStatus("error");
      setErrorText(CONTACT.form.errorFallback);
    }
  }

  // "sent" no longer changes the button label — it's conveyed by the
  // confirmation message beside the button instead, so the button itself
  // just reverts to ready-to-send once the request finishes.
  const buttonLabel = status === "sending" ? CONTACT.form.sendingLabel : CONTACT.form.submitLabel;

  return (
    <section
      id="contact"
      ref={ref}
      className="relative z-[1] mx-auto max-w-[1360px] px-[clamp(20px,5vw,64px)] pb-[clamp(56px,7vw,88px)] pt-[clamp(64px,8vw,112px)]"
    >
      <div style={motion}>
        <div className="flex flex-col gap-[18px] pb-[clamp(32px,4vw,52px)]">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-soft">{CONTACT.eyebrow}</span>
          <h2 className="m-0 font-quicksand text-[clamp(32px,4.6vw,64px)] font-light leading-[1.05] tracking-[-0.015em] text-ink">
            {CONTACT.heading}
          </h2>
          <p className="m-0 max-w-[44ch] text-base leading-[1.8] text-soft">{CONTACT.blurb}</p>
        </div>

        <div className="grid gap-[clamp(24px,4vw,56px)] border-t border-hair py-[clamp(28px,3.5vw,44px)] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          <div className="flex flex-col gap-[26px]">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-soft">
                {CONTACT.emailLabel}
              </span>
              <a
                href={`mailto:${SITE.email}`}
                data-cursor="link"
                className="self-start border-b border-hair pb-1 font-quicksand text-[clamp(20px,2.2vw,28px)] font-normal text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                {SITE.email}
              </a>
            </div>
            <div className="flex flex-col gap-[10px]">
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-soft">
                {CONTACT.elsewhereLabel}
              </span>
              <div className="flex flex-wrap gap-[18px] text-[15px]">
                {SITE.social.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="link"
                    className="text-soft transition-colors duration-300 hover:text-ink"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-[22px]">
            {/* Honeypot: off-screen (not display:none/visibility:hidden — the two things
                unsophisticated bots specifically check for and skip), aria-hidden and
                unreachable by keyboard, so a real visitor never sees or fills it. A bot
                that fills every input it finds in the DOM trips it instead. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                Company
                <input type="text" name="company" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-soft">
                {CONTACT.form.nameLabel}
              </span>
              <input type="text" name="name" required disabled={locked} data-cursor="field" className={fieldClass} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-soft">
                {CONTACT.form.emailLabel}
              </span>
              <input type="email" name="email" required disabled={locked} data-cursor="field" className={fieldClass} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-soft">
                {CONTACT.form.projectLabel}
              </span>
              <textarea
                name="project"
                rows={3}
                required
                disabled={locked}
                data-cursor="field"
                className={`${fieldClass} leading-[1.7] resize-y`}
              />
            </label>

            {status === "error" && <p className="m-0 text-sm text-accent">{errorText}</p>}

            <div className="flex flex-wrap items-center gap-4 self-start">
              <button
                type="submit"
                data-cursor="link"
                disabled={locked}
                className="inline-flex items-center gap-[9px] border-0 border-b border-accent-hair bg-transparent pb-[3px] font-inter text-sm font-medium text-accent transition-colors duration-300 hover:border-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                {buttonLabel}{" "}
                <span className={`inline-block text-[13px] ${status === "sending" ? "anim-spin" : ""}`}>↗</span>
              </button>

              {/* Always rendered (never unmounted) so the fade + rise transition plays
                  on both the way in and the way back out; re-submitting hides it by
                  flipping status to "sending" before the next success shows it again. */}
              <div
                aria-live="polite"
                className={`flex items-center gap-[10px] text-[13px] text-accent transition-[opacity,transform] duration-[400ms] ease-[var(--ease-out)] ${
                  status === "sent" ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1.5 opacity-0"
                }`}
              >
                <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-accent" />
                <span>{CONTACT.form.submittedLabel}</span>
              </div>
            </div>
          </form>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-hair pt-[clamp(24px,3vw,36px)]">
          <span className="font-quicksand text-[15px] font-medium text-ink">{SITE.name}</span>
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-soft">
            © {SITE.copyrightYear} · {SITE.location}
          </span>
        </div>
      </div>
    </section>
  );
}
