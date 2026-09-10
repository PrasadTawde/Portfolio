"use client";

import { useRef } from "react";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import type { BeyondDestination } from "@/content/beyondCode";

/** Social-panel destinations (kind: "social") — a grid of hairline cards with an accent top edge, distinct from the Work/Projects card style. */
export function BeyondSocials({ destinations }: { destinations: BeyondDestination[] }) {
  const ref = useRef<HTMLElement>(null);
  const motion = useSectionReveal(ref);
  const socials = destinations.filter((d) => d.kind === "social");

  if (socials.length === 0) return null;

  return (
    <section ref={ref} className="relative z-[1] mx-auto max-w-[1360px] px-[clamp(20px,5vw,64px)] py-[clamp(48px,6vw,88px)]">
      <div style={motion} className="grid gap-[clamp(16px,2.4vw,28px)] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        {socials.map((d) => (
          <div
            key={d.id}
            className="relative flex flex-col gap-[18px] overflow-hidden rounded-3xl border border-hair p-[clamp(24px,3vw,44px)] transition-[border-color,transform] duration-[450ms] ease-out hover:-translate-y-[5px] hover:border-accent-hair"
          >
            <span className="absolute inset-x-0 top-0 h-px bg-accent opacity-45" />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
              {d.kicker} &nbsp;·&nbsp; {d.platform}
            </span>
            <h2 className="m-0 max-w-[22ch] font-quicksand text-[clamp(24px,2.8vw,36px)] font-light leading-[1.08] tracking-[-0.02em] text-ink">
              {d.title}
            </h2>
            <p className="m-0 max-w-[44ch] text-[15px] leading-[1.8] text-soft">{d.body}</p>
            {d.meta.length > 0 && (
              <div className="flex flex-wrap gap-[clamp(20px,3vw,36px)] pt-[2px]">
                {d.meta.map((m) => (
                  <div key={m.k} className="flex flex-col gap-[5px]">
                    <span className="font-quicksand text-[clamp(20px,2.2vw,26px)] leading-none text-ink">{m.v}</span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-soft">{m.k}</span>
                  </div>
                ))}
              </div>
            )}
            <a
              href={d.cta.href}
              target={d.cta.href === "#" ? undefined : "_blank"}
              rel={d.cta.href === "#" ? undefined : "noopener noreferrer"}
              data-cursor="link"
              className="mt-auto inline-flex items-center gap-[9px] self-start border-b border-accent-hair pb-[3px] text-sm font-medium text-accent transition-colors duration-300 hover:border-accent"
            >
              {d.cta.label} <span className="text-[13px]">↗</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
