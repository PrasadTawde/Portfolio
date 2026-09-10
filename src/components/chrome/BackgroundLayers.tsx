/** Ambient tint washes, grain texture and hairline dividers — present on every page, behind all content. */
export function BackgroundLayers() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 18% 8%, var(--tintA) 0%, transparent 55%), radial-gradient(90% 70% at 88% 92%, var(--tintB) 0%, transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.038]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-y-0 left-1/3 w-px bg-ink opacity-[0.055]" />
        <div className="absolute inset-y-0 left-2/3 w-px bg-ink opacity-[0.055]" />
      </div>
    </>
  );
}

/** /beyond-code-only decorative drifting circles, replacing the rigid Home crosshairs so the page's background reads looser (matches BeyondCode.dc.html). */
export function BeyondDrift() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="anim-drift-a absolute rounded-full border border-ink opacity-[0.07]"
        style={{ top: "12%", left: "-6%", width: "clamp(240px, 32vw, 460px)", height: "clamp(240px, 32vw, 460px)" }}
      />
      <div
        className="anim-drift-b absolute rounded-full border border-accent opacity-[0.14]"
        style={{ bottom: "6%", right: "-8%", width: "clamp(200px, 26vw, 380px)", height: "clamp(200px, 26vw, 380px)" }}
      />
    </div>
  );
}

/** Home-only decorative "+" crosshair marks layered over the dividers above (matches Portfolio.dc.html exactly). */
export function HeroCrosshairs() {
  const positions = [
    { top: "22%", left: "33.33%" },
    { top: "22%", left: "66.66%" },
    { top: "78%", left: "33.33%" },
    { top: "78%", left: "66.66%" },
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {positions.map(({ top, left }) => (
        <span
          key={`${top}-${left}`}
          className="absolute -translate-x-1/2 -translate-y-1/2 text-[13px] font-light text-ink opacity-[0.16]"
          style={{ top, left }}
        >
          +
        </span>
      ))}
    </div>
  );
}
