"use client";

import { useEffect, useState } from "react";

/** Fixed bottom-center "scroll to explore" cue; fades out once the user starts scrolling. Home page only. */
export function ScrollCue() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let frame = 0;
    const measure = () => setVisible(window.scrollY <= 40);
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-[26px] left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-[10px] text-center transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-soft">Scroll to explore</span>
      <span className="anim-nudge block text-sm text-soft">↓</span>
    </div>
  );
}
