"use client";

import { useEffect, useState, type CSSProperties, type RefObject } from "react";
import { useReducedMotion } from "./useReducedMotion";

const MAX_BLUR_PX = 8;

function smoothstep(q: number) {
  return q * q * (3 - 2 * q);
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

interface SectionRevealOptions {
  /** Fade + blur out symmetrically as the section scrolls past, in addition to the entrance. Default true. */
  exit?: boolean;
}

/**
 * Rise + fade-in motion for a section as it approaches the viewport, mirroring the
 * prototype's `motionFor`. When `exit` is enabled (the default), a matching fade
 * plays as the section leaves, with a blur added on both ends — sharp only while
 * fully settled in view.
 *
 * The exit window is anchored to this section's own `bottom` but measured against
 * the *viewport bottom* (mirroring how entrance is measured), offset by one `span`.
 * Since sections are contiguous, this section's bottom is the next section's top —
 * so this starts the exit at exactly the scroll position where the next section's
 * own entrance finishes, instead of leaving a dead zone where both sit fully
 * visible at once (entrance resolves quickly, being anchored to the viewport
 * bottom over just `span` px, while an exit anchored to the viewport top only
 * starts `span` before this section is fully gone — those two points don't
 * otherwise coincide).
 */
export function useSectionReveal(ref: RefObject<HTMLElement | null>, options: SectionRevealOptions = {}): CSSProperties {
  const { exit = true } = options;
  const reduced = useReducedMotion();
  const [style, setStyle] = useState<CSSProperties>({});

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      if (reduced) {
        setStyle({});
        return;
      }
      const el = ref.current;
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const span = viewportHeight * 0.35 || 1;
      const rect = el?.getBoundingClientRect();
      const top = rect ? rect.top + scrollY : viewportHeight;
      const bottom = rect ? top + rect.height : viewportHeight;

      const enterQ = clamp01((scrollY + viewportHeight - top) / span);
      const enterE = smoothstep(enterQ);

      const exitE = exit ? smoothstep(clamp01((scrollY + viewportHeight - bottom - span) / span)) : 0;

      const visibility = enterE * (1 - exitE);
      const blur = Math.round((1 - visibility) * MAX_BLUR_PX * 10) / 10;

      const next: CSSProperties = {
        transform: `translate3d(0, ${(1 - enterE) * 44}px, 0)`,
        opacity: 0.25 + visibility * 0.75,
        pointerEvents: visibility < 0.15 ? "none" : "auto",
        willChange: "transform, opacity, filter",
      };
      if (blur > 0.05) next.filter = `blur(${blur}px)`;
      setStyle(next);
    };

    // Deferred to the next frame so the DOM read + resulting setState happen in a
    // callback, not directly in the effect body (also keeps every update rAF-throttled).
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, reduced, exit]);

  return style;
}
