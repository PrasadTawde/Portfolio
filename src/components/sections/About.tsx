"use client";

import { useRef } from "react";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { ABOUT } from "@/content/about";

export function About() {
  const ref = useRef<HTMLElement>(null);
  const motion = useSectionReveal(ref);

  return (
    <section
      id="about"
      ref={ref}
      className="relative z-[1] mx-auto max-w-[1360px] px-[clamp(20px,5vw,64px)] pb-[clamp(96px,12vw,160px)] pt-[clamp(64px,8vw,112px)]"
    >
      <div style={motion}>
        <div className="flex flex-col gap-[18px] pb-[clamp(32px,4vw,52px)]">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-soft">{ABOUT.eyebrow}</span>
          <h2 className="m-0 font-quicksand text-[clamp(32px,4vw,56px)] font-light leading-[1.05] tracking-[-0.015em] text-ink">
            {ABOUT.heading}
          </h2>
        </div>

        <div className="grid gap-[clamp(24px,4vw,56px)] border-t border-hair py-[clamp(28px,3.5vw,44px)] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          <div className="flex flex-col gap-5">
            {ABOUT.paragraphs.map((para) => (
              <p key={para} className="m-0 max-w-[46ch] text-base leading-[1.8] text-soft">
                {para}
              </p>
            ))}
          </div>
          <div className="flex flex-col gap-[22px]">
            {ABOUT.principles.map((pr) => (
              <div key={pr.n} className="grid items-baseline gap-[14px] [grid-template-columns:36px_1fr]">
                <span className="text-[10px] font-medium tracking-[0.16em] text-accent">{pr.n}</span>
                <div className="flex flex-col gap-[6px]">
                  <span className="text-[15px] text-ink">{pr.title}</span>
                  <span className="max-w-[44ch] text-sm leading-[1.7] text-soft">{pr.body}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-[clamp(24px,4vw,56px)] border-t border-hair pt-[clamp(28px,3.5vw,44px)] [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          {ABOUT.skills.map((s) => (
            <div key={s.group} className="flex flex-col gap-[14px]">
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-soft">{s.group}</span>
              <div className="flex flex-col gap-[9px]">
                {s.items.map((it) => (
                  <span key={it} className="text-[15px] text-ink">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
