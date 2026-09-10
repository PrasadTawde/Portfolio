import type { CSSProperties } from "react";

export interface Palette {
  name: string;
  bg: string;
  ink: string;
  accent: string;
}

export const PALETTES: Palette[] = [
  { name: "Clay", bg: "oklch(0.935 0.014 65)", ink: "oklch(0.26 0.022 55)", accent: "oklch(0.54 0.085 45)" },
  { name: "Sage", bg: "oklch(0.935 0.012 150)", ink: "oklch(0.25 0.018 155)", accent: "oklch(0.5 0.06 155)" },
  { name: "Mist", bg: "oklch(0.94 0.009 250)", ink: "oklch(0.25 0.016 265)", accent: "oklch(0.52 0.065 262)" },
  { name: "Bone", bg: "oklch(0.955 0.005 80)", ink: "oklch(0.22 0.008 80)", accent: "oklch(0.5 0.045 60)" },
  { name: "Dusk", bg: "oklch(0.245 0.014 265)", ink: "oklch(0.93 0.008 265)", accent: "oklch(0.74 0.06 250)" },
];

export const DARK_INDEX = 4;

/** CSS custom properties for the given palette index, mirroring the design prototype's derivation exactly. */
export function paletteCssVars(index: number): CSSProperties {
  const p = PALETTES[index] ?? PALETTES[0];
  const dark = index === DARK_INDEX;

  return {
    "--bg": p.bg,
    "--ink": p.ink,
    "--accent": p.accent,
    "--soft": dark ? "oklch(0.78 0.012 265)" : "oklch(0.44 0.022 55)",
    "--hair": dark ? "oklch(0.93 0.008 265 / 0.16)" : "oklch(0.26 0.02 55 / 0.14)",
    "--accentHair": dark ? "oklch(0.74 0.06 250 / 0.4)" : "oklch(0.54 0.085 45 / 0.35)",
    "--tintA": dark ? "oklch(0.4 0.03 265 / 0.5)" : "oklch(1 0 0 / 0.55)",
    "--tintB": dark ? "oklch(0.2 0.02 265 / 0.6)" : "oklch(0.86 0.03 60 / 0.45)",
  } as CSSProperties;
}
