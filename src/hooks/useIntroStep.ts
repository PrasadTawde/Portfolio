"use client";

import { useSyncExternalStore } from "react";

/** [delay-ms, step] — mirrors the approved "Name Set" loader's runIntro timings. */
const STEP_TIMINGS: Array<[number, number]> = [
  [60, 1],
  [760, 2],
  [900, 3],
  [1560, 4],
];

let step = 0;
let started = false;
const listeners = new Set<() => void>();

function setStep(next: number) {
  if (next === step) return;
  step = next;
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return step;
}

function getServerSnapshot() {
  return 0;
}

/**
 * Kicks off the once-per-page-load intro sequence. Module-level `started` guard
 * means only the first caller (IntroLoader, mounted once on Home) actually
 * schedules anything — re-mounts within the same page load are no-ops. The
 * module state itself resets on every hard navigation/reload (fresh JS
 * execution) but survives client-side route changes, so the intro plays once
 * per real page load and never replays when navigating within the app.
 */
export function startIntroSequence() {
  if (started) return;
  started = true;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setStep(4);
    return;
  }

  for (const [delay, target] of STEP_TIMINGS) {
    window.setTimeout(() => setStep(target), delay);
  }
}

/** Read-only subscription to the shared intro step (0-4). Safe to call from any component. */
export function useIntroStep(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
