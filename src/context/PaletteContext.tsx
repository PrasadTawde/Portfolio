"use client";

import { createContext, useCallback, useContext, useSyncExternalStore, type ReactNode } from "react";
import { DARK_INDEX, PALETTES, paletteCssVars } from "@/lib/palettes";

const STORAGE_KEY = "ar.palette";
const listeners = new Set<() => void>();

function readIndex(): number {
  const saved = parseInt(window.localStorage.getItem(STORAGE_KEY) ?? String(DARK_INDEX), 10);
  return Number.isNaN(saved) || saved < 0 || saved >= PALETTES.length ? DARK_INDEX : saved;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getServerSnapshot() {
  return DARK_INDEX;
}

interface PaletteContextValue {
  index: number;
  setIndex: (index: number) => void;
}

const PaletteContext = createContext<PaletteContextValue | null>(null);

export function PaletteProvider({ children }: { children: ReactNode }) {
  const index = useSyncExternalStore(subscribe, readIndex, getServerSnapshot);

  const setIndex = useCallback((next: number) => {
    window.localStorage.setItem(STORAGE_KEY, String(next));
    listeners.forEach((listener) => listener());
  }, []);

  return (
    <PaletteContext.Provider value={{ index, setIndex }}>
      <div
        style={paletteCssVars(index)}
        className="relative min-h-screen w-full overflow-x-hidden bg-bg font-inter text-ink transition-colors duration-500 [cursor:none]"
      >
        {children}
      </div>
    </PaletteContext.Provider>
  );
}

export function usePalette() {
  const ctx = useContext(PaletteContext);
  if (!ctx) throw new Error("usePalette must be used within a PaletteProvider");
  return ctx;
}
