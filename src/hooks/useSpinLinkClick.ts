"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

/**
 * One full turn of the shared `.anim-spin` keyframe (globals.css) — the
 * delay before the link's tab opens is pinned to it so the arrow always
 * lands back at rest instead of freezing mid-spin.
 */
const SPIN_MS = 800;

/**
 * Spins an external link's arrow icon (the same `.anim-spin` class the
 * contact form's send button uses while a request is in flight) for one
 * turn before actually opening the tab — used by any "↗" link that opens
 * `target="_blank"`. See ProjectDetail.tsx's "Links" row for the anchor
 * wiring this pairs with.
 *
 * Returns the href currently mid-animation (or null) so the caller can
 * conditionally apply `.anim-spin` to that one link's icon, plus the click
 * handler to spread onto each anchor.
 */
export function useSpinLinkClick() {
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  function onLinkClick(e: MouseEvent<HTMLAnchorElement>, href: string) {
    // Modifier/middle clicks ("open in background tab", "open in new window")
    // bypass the animation and follow the anchor's own target/rel natively.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (pendingHref) return;

    setPendingHref(href);
    timeoutRef.current = setTimeout(() => {
      window.open(href, "_blank", "noopener,noreferrer");
      setPendingHref(null);
      timeoutRef.current = null;
    }, SPIN_MS);
  }

  return { pendingHref, onLinkClick };
}
