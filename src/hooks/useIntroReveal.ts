"use client";

import type { CSSProperties } from "react";
import { useIntroStep } from "./useIntroStep";
import { EASE } from "@/lib/motion";

export interface IntroReveal {
  reveal: boolean;
  /** Above-the-fold heading block — settles first. */
  primary: CSSProperties;
  /** A second block (e.g. a hero image) — settles slightly after `primary`. */
  secondary: CSSProperties;
}

/**
 * Reveal styles for whatever a route's own "Hero" block is, keyed off the shared
 * intro-veil step (see IntroLoader). On a hard load, both stay hidden until the
 * veil starts fading (step >= 3) and settle in the same beat it uncovers them —
 * matching Hero.tsx's heroLeft/heroRight. On a client-side navigation the intro
 * has usually already finished, so `reveal` is already true and both render in
 * their settled state immediately, with no transition ever visible.
 */
export function useIntroReveal(): IntroReveal {
  const reveal = useIntroStep() >= 3;
  return {
    reveal,
    primary: {
      opacity: reveal ? 1 : 0,
      transform: reveal ? "none" : "translateY(14px)",
      transition: `opacity 0.55s ${EASE}, transform 0.55s ${EASE}`,
    },
    secondary: {
      opacity: reveal ? 1 : 0,
      transform: reveal ? "none" : "translateY(18px)",
      transition: `opacity 0.65s ${EASE} 0.08s, transform 0.65s ${EASE} 0.08s`,
    },
  };
}
