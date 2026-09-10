"use client";

import { useIntroReveal } from "@/hooks/useIntroReveal";
import { BEYOND_CODE } from "@/content/beyondCode";

/** Top hero block of /beyond-code. Keys its entrance off the shared intro veil (see ProjectsHeading.tsx) since the page itself stays a Server Component for `metadata`. */
export function BeyondHero() {
  const { primary } = useIntroReveal();

  return (
    <section className="relative z-[1] mx-auto max-w-[1360px] px-[clamp(20px,5vw,64px)] pb-[clamp(56px,7vw,96px)] pt-[clamp(48px,8vw,120px)]">
      <div className="flex flex-col gap-[clamp(24px,3vw,40px)]" style={primary}>
        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-accent">{BEYOND_CODE.kicker}</span>
        <h1 className="m-0 max-w-[16ch] text-pretty font-quicksand text-[clamp(42px,6.2vw,88px)] font-light leading-[1.0] tracking-[-0.02em] text-ink">
          {BEYOND_CODE.heading}
        </h1>
        <p className="m-0 max-w-[48ch] text-[clamp(16px,1.8vw,19px)] leading-[1.75] text-soft">{BEYOND_CODE.intro}</p>
        <div className="flex flex-wrap gap-[10px] pt-2">
          {BEYOND_CODE.pills.map((pill) => (
            <span
              key={pill}
              className="rounded-full border border-accent-hair px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-ink"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
