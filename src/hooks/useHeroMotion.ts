"use client";

import { useEffect, useState, type CSSProperties, type RefObject } from "react";
import { useReducedMotion } from "./useReducedMotion";

const MAX_BLUR_PX = 8;

function smoothstep(q: number) {
  return q * q * (3 - 2 * q);
}

const BASE: CSSProperties = { width: "100%" };

/** Translate/scale/fade the hero out as the user scrolls through its own height. */
export function useHeroMotion(heroRef: RefObject<HTMLElement | null>): CSSProperties {
  const reduced = useReducedMotion();
  const [style, setStyle] = useState<CSSProperties>(BASE);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      if (reduced) {
        setStyle(BASE);
        return;
      }
      const heroEl = heroRef.current;
      const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight;
      const p = Math.min(1, Math.max(0, window.scrollY / Math.max(1, heroHeight)));
      const e = smoothstep(p);
      const blur = Math.round(e * MAX_BLUR_PX * 10) / 10;
      const next: CSSProperties = {
        ...BASE,
        transform: `translate3d(0, ${-e * 64}px, 0) scale(${1 - e * 0.025})`,
        opacity: 1 - e * 0.62,
        transformOrigin: "50% 20%",
        pointerEvents: e > 0.55 ? "none" : "auto",
        willChange: "transform, opacity, filter",
      };
      if (blur > 0.05) next.filter = `blur(${blur}px)`;
      setStyle(next);
    };

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
  }, [heroRef, reduced]);

  return style;
}
