"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { startIntroSequence, useIntroStep } from "@/hooks/useIntroStep";
import { getPageLabel } from "@/lib/pageLabel";
import { EASE } from "@/lib/motion";

/**
 * "Name Set" loading intro (Portfolio Loader B): the page's own name/title holds
 * centre-stage, then lifts and shrinks away as the veil fades, uncovering the
 * page's own hero block — which reveals in the same beat via `useIntroReveal`
 * (see Hero.tsx, ProjectsHeading.tsx, ProjectDetail.tsx). Mounted once in the
 * root layout so it plays on whichever route is hard-loaded/reloaded, labelled
 * for that route; never replays on client-side navigation. Skips straight to
 * the revealed state under prefers-reduced-motion.
 */
export function IntroLoader() {
  const step = useIntroStep();
  const pathname = usePathname();
  // Lazy init: fixes the label to whatever route was actually hard-loaded,
  // so a quick client-side navigation mid-sequence can't relabel it.
  const [label] = useState(() => getPageLabel(pathname));

  useEffect(() => {
    startIntroSequence();
  }, []);

  if (step >= 4 || !label) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9998] flex flex-col items-center justify-center gap-[22px] bg-bg"
      style={{
        opacity: step >= 3 ? 0 : 1,
        transition: `opacity 0.62s ${EASE}`,
      }}
    >
      <h2
        className="m-0 font-quicksand text-[clamp(46px,6.4vw,92px)] font-light leading-none tracking-[-0.015em] text-ink"
        style={{
          opacity: step === 0 ? 0 : step >= 2 ? 0 : 1,
          transform: step === 0 ? "translateY(12px)" : step >= 2 ? "translateY(-16px) scale(0.955)" : "none",
          transition: `opacity 0.5s ${EASE}, transform 0.62s ${EASE}`,
        }}
      >
        {label}
      </h2>
      <span
        className="h-px origin-center bg-ink opacity-20"
        style={{
          width: "clamp(120px, 18vw, 220px)",
          transform: `scaleX(${step === 1 ? 1 : 0})`,
          transition: `transform 0.6s ${EASE}`,
        }}
      />
    </div>
  );
}
