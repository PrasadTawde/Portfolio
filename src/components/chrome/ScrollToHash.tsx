"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

/**
 * Next's own scroll-to-hash is disabled on the nav's anchor links (`scroll={false}`,
 * see Header.tsx) so Lenis is the only thing driving the actual scroll animation —
 * otherwise the two fight over the same click. Lenis's `anchors: true` option only
 * covers a click made while already on this page; it does nothing for a hash that's
 * already in the URL when this page mounts (a hard refresh on `/#work`, or a nav
 * link clicked from `/projects` or `/beyond-code`, which is a real page navigation
 * to `/#work`). This covers that gap on mount.
 *
 * A single immediate jump isn't reliable here: every Home section mounts at once on
 * a fresh route-in (unlike clicking an anchor while already on the page, where
 * layout is already settled), and next/font's fallback-to-custom-font swap can still
 * shift line-wraps/heights shortly after that first frame — enough to land a few
 * sections short of the real target (e.g. Work instead of Projects). Re-running the
 * jump once fonts report ready, plus a fallback timeout for any other late layout
 * settling (images, etc.), corrects the landing spot instead of leaving it wherever
 * the first, too-early measurement put it.
 */
export function ScrollToHash() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const hash = window.location.hash;
    if (!hash) return;

    let cancelled = false;
    const scroll = () => {
      if (!cancelled) lenis.scrollTo(hash, { immediate: true });
    };

    // Wait a frame so the page has laid out before the first measurement.
    const frame = requestAnimationFrame(scroll);
    document.fonts?.ready.then(scroll);
    const fallback = window.setTimeout(scroll, 400);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(fallback);
    };
  }, [lenis]);

  return null;
}
