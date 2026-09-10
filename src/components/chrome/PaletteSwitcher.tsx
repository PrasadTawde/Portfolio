"use client";

import { PALETTES } from "@/lib/palettes";
import { usePalette } from "@/context/PaletteContext";

export function PaletteSwitcher() {
  const { index, setIndex } = usePalette();

  return (
    <div className="flex items-center gap-2">
      {PALETTES.map((p, i) => (
        <button
          key={p.name}
          type="button"
          title={p.name}
          onClick={() => setIndex(i)}
          className="h-[13px] w-[13px] rounded-full border-0 p-0 transition-transform duration-300 hover:scale-[1.18]"
          style={{
            background: p.accent,
            boxShadow: i === index ? "0 0 0 2px var(--bg), 0 0 0 3px var(--ink)" : "none",
          }}
        />
      ))}
    </div>
  );
}
