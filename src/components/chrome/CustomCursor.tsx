"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const COARSE_QUERY = "(pointer: coarse)";

function subscribeCoarsePointer(callback: () => void) {
  const mq = window.matchMedia(COARSE_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getIsCoarsePointer() {
  return window.matchMedia(COARSE_QUERY).matches;
}

function getIsCoarsePointerServer() {
  return false;
}

type CursorMode = "default" | "link" | "field";

/**
 * Custom circle cursor: small dark dot by default, grows over
 * `[data-cursor="link"]` elements with an arrow inside, and over
 * `[data-cursor="field"]` (text inputs) with an "I" (I-beam) glyph instead.
 */
export function CustomCursor() {
  const isCoarsePointer = useSyncExternalStore(
    subscribeCoarsePointer,
    getIsCoarsePointer,
    getIsCoarsePointerServer,
  );
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [mode, setMode] = useState<CursorMode>("default");

  useEffect(() => {
    if (isCoarsePointer) return;

    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const onOver = (e: MouseEvent) => {
      const target = (e.target as Element)?.closest?.("[data-cursor]");
      if (!target) return;
      setMode(target.getAttribute("data-cursor") === "field" ? "field" : "link");
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element)?.closest?.("[data-cursor]")) setMode("default");
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [isCoarsePointer]);

  if (isCoarsePointer) return null;

  const size = mode === "default" ? 12 : 30;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full bg-ink text-[12px] text-bg transition-[width,height] duration-200 ease-out"
      style={{
        width: size,
        height: size,
        transform: `translate(${pos.x - size / 2}px, ${pos.y - size / 2}px)`,
      }}
    >
      {mode === "link" && "↗"}
      {mode === "field" && "I"}
    </div>
  );
}
