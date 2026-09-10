"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getPageLabel } from "@/lib/pageLabel";
import { EASE } from "@/lib/motion";

type Phase = "idle" | "covering" | "covered" | "revealing";

const COVER_MS = 550;
const MIN_HOLD_MS = 350;
const REVEAL_MS = 550;
const STAGGER_MS = 90;

/**
 * Same-origin internal pathname (hash stripped), or null if this link is out
 * of scope (external, mailto, etc). The hash itself is deliberately kept out
 * of the comparison, not dropped from scope entirely: a nav link like
 * `/#work` clicked while already on `/` is just an in-page scroll (the
 * `targetPath === pathname` check below skips the transition for that), but
 * the exact same href clicked from `/projects` or `/beyond-code` is a real
 * route change to `/` and should get the wipe like any other cross-route nav
 * — the caller still reads the hash off `href` itself when it navigates.
 */
function resolveInternalPath(absoluteHref: string): string | null {
  try {
    const url = new URL(absoluteHref);
    if (url.origin !== window.location.origin) return null;
    return url.pathname;
  } catch {
    return null;
  }
}

/** A soft wavy edge instead of a hard rectangle cut, matching the reference's panel caps. */
function WaveCap() {
  return (
    <svg
      className="absolute left-0 top-full h-4 w-full translate-y-[-1px] text-inherit"
      viewBox="0 0 100 12"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path d="M 0 0 C 30 12 70 12 100 0 Z" fill="currentColor" />
    </svg>
  );
}

function isProjectsPath(path: string): boolean {
  return path === "/projects" || /^\/projects\/[^/]+$/.test(path);
}

function isBeyondPath(path: string): boolean {
  return path === "/beyond-code";
}

interface InkPanelProps {
  animateIn: boolean;
  duration: number;
  delayMs: number;
  label: string;
}

/** The dark sweep panel, shared by the full two-tone wipe and the simplified single-color one. */
function InkPanel({ animateIn, duration, delayMs, label }: InkPanelProps) {
  return (
    <div
      className="absolute inset-x-0 top-0 flex h-full items-center justify-center bg-ink text-ink"
      style={{
        transform: animateIn ? "translateY(0%)" : "translateY(-100%)",
        transition: `transform ${duration}ms ${EASE}${delayMs ? ` ${delayMs}ms` : ""}`,
      }}
    >
      <WaveCap />
      <span className="font-quicksand text-[clamp(28px,4vw,48px)] font-light text-bg">{label}</span>
    </div>
  );
}

/**
 * Full-screen wipe played on internal navigations between `/`, `/projects`,
 * `/projects/[slug]` and `/beyond-code` — a global click interceptor, not a
 * per-link change. Any navigation touching `/` or `/beyond-code` gets the full
 * accent-then-ink two-panel wipe; navigation that stays entirely within the
 * Projects area (listing <-> a project, or project <-> project) gets a
 * simplified single ink panel instead. Skips entirely under
 * prefers-reduced-motion (navigation just happens immediately).
 */
export function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [animateIn, setAnimateIn] = useState(false);
  const [label, setLabel] = useState("");
  const [simplified, setSimplified] = useState(false);
  const pendingPath = useRef<string | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element)?.closest?.("a");
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;

      const targetPath = resolveInternalPath(anchor.href);
      if (!targetPath || targetPath === pathname) return;
      const isInScope = targetPath === "/" || isProjectsPath(targetPath) || isBeyondPath(targetPath);
      if (!isInScope) return;

      e.preventDefault();
      const href = anchor.getAttribute("href")!;
      pendingPath.current = targetPath;
      setLabel(getPageLabel(targetPath));
      setSimplified(isProjectsPath(pathname) && isProjectsPath(targetPath));
      setAnimateIn(false); // mount (or re-arm) at the hidden position first
      setPhase("covering");

      // A state flip in the very same tick as mount never actually paints the
      // "hidden" frame, so the CSS transition below would have nothing to
      // animate from. Forcing two frames guarantees the hidden position paints
      // before we flip to the covered one.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true));
      });

      const t = window.setTimeout(() => {
        setPhase("covered");
        router.push(href);
      }, COVER_MS);
      timers.current.push(t);
    };

    // Capture phase: must run before Next's own Link click handler (which lives on
    // React's root listener, a descendant of document in bubble order) so
    // preventDefault actually stops it from navigating on its own.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, router]);

  // Once the new route has actually landed, hold briefly, then reveal it.
  useEffect(() => {
    if (phase !== "covered" || pendingPath.current !== pathname) return;

    const holdTimer = window.setTimeout(() => {
      pendingPath.current = null;
      setAnimateIn(false); // already-painted true -> false: this one transitions normally
      setPhase("revealing");
      const t = window.setTimeout(() => setPhase("idle"), REVEAL_MS);
      timers.current.push(t);
    }, MIN_HOLD_MS);
    timers.current.push(holdTimer);
  }, [phase, pathname]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  if (phase === "idle") return null;

  const duration = animateIn ? COVER_MS : REVEAL_MS;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9000] overflow-hidden">
      {!simplified && (
        <div
          className="absolute inset-x-0 top-0 h-full bg-accent text-accent"
          style={{
            transform: animateIn ? "translateY(0%)" : "translateY(-100%)",
            transition: `transform ${duration}ms ${EASE}`,
          }}
        >
          <WaveCap />
        </div>
      )}
      <InkPanel
        animateIn={animateIn}
        duration={duration}
        delayMs={simplified ? 0 : animateIn ? STAGGER_MS : 0}
        label={label}
      />
    </div>
  );
}
