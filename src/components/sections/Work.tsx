"use client";

import { useRef } from "react";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { SITE } from "@/content/site";
import { WORK } from "@/content/work";

export function Work() {
  const ref = useRef<HTMLElement>(null);
  const motion = useSectionReveal(ref);

  return (
    <section
      id="work"
      ref={ref}
      className="relative z-[1] mx-auto max-w-[1360px] px-[clamp(20px,5vw,64px)] pb-[clamp(96px,12vw,160px)] pt-[clamp(64px,8vw,112px)]"
    >
      <div style={motion}>
        <div className="flex flex-wrap items-baseline justify-between gap-5 pb-[clamp(32px,4vw,52px)]">
          <div className="flex flex-col gap-[18px]">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-soft">{WORK.eyebrow}</span>
            <h2 className="m-0 font-quicksand text-[clamp(32px,4vw,56px)] font-light leading-[1.05] tracking-[-0.015em] text-ink">
              {WORK.heading}
            </h2>
          </div>
          <a
            href={SITE.resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            className="inline-flex items-center gap-[9px] border-b border-accent-hair pb-[3px] text-sm font-medium text-accent transition-colors duration-300 hover:border-accent"
          >
            {WORK.resumeLabel} <span className="text-[13px]">↗</span>
          </a>
        </div>

        {WORK.roles.map((r) => (
          <div
            key={r.period}
            className="grid gap-[clamp(20px,3.5vw,56px)] border-t border-hair py-[clamp(28px,3.5vw,44px)] [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]"
          >
            <div className="flex flex-col gap-[10px]">
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-soft">{r.period}</span>
              <h3 className="m-0 font-quicksand text-[clamp(22px,2.3vw,32px)] font-normal leading-[1.15] tracking-[-0.01em] text-ink">
                {r.company}
              </h3>
              <span className="text-sm text-ink">{r.role}</span>
              <span className="text-[13px] text-soft">{r.place}</span>
            </div>

            <div className="flex flex-col gap-[18px]">
              <div className="flex flex-col gap-[10px]">
                {r.points.map((pt) => (
                  <div key={pt} className="flex items-baseline gap-3">
                    <span className="mt-[-3px] h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
                    <span className="max-w-[56ch] text-[15px] leading-[1.7] text-soft">{pt}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {r.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-hair px-[13px] py-[6px] text-[11px] font-medium uppercase tracking-[0.06em] text-soft"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
