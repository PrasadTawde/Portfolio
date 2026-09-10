"use client";

import { useRef } from "react";
import Image from "next/image";
import { useHeroMotion } from "@/hooks/useHeroMotion";
import { useIntroReveal } from "@/hooks/useIntroReveal";
import { usePalette } from "@/context/PaletteContext";
import { DARK_INDEX } from "@/lib/palettes";
import { SITE } from "@/content/site";
import { HERO } from "@/content/hero";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const heroMotion = useHeroMotion(heroRef);
  const { primary: heroLeftStyle, secondary: heroRightStyle } = useIntroReveal();
  const { index: paletteIndex } = usePalette();
  const isDarkPalette = paletteIndex === DARK_INDEX;

  return (
    <section
      ref={heroRef}
      className="relative z-[1] mx-auto flex max-w-[1360px] items-center px-[clamp(20px,5vw,64px)] pb-[clamp(28px,3.5vw,44px)] pt-[clamp(24px,4vw,56px)]"
      style={{ minHeight: "calc(100vh - 92px)" }}
    >
      <div style={heroMotion}>
        <div className="grid w-full items-center gap-[clamp(40px,6vw,88px)] [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
          <div className="flex flex-col gap-7" style={heroLeftStyle}>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-soft">{SITE.role}</span>
            <h1 className="m-0 whitespace-nowrap font-quicksand text-[clamp(34px,5vw,72px)] font-light leading-none tracking-[-0.015em] text-ink">
              {SITE.name}
            </h1>
            <p className="m-0 max-w-[40ch] text-base leading-[1.75] text-soft">{HERO.bio}</p>
            <div className="flex flex-wrap gap-[clamp(28px,4vw,56px)] border-t border-hair pt-6">
              <div className="flex flex-col gap-[5px]">
                <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-soft">Located in</span>
                <span className="text-sm text-ink">{SITE.location}</span>
              </div>
              <div className="flex flex-col gap-[5px]">
                <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-soft">Working</span>
                <span className="text-sm text-ink">{SITE.workingScope}</span>
              </div>
              <div className="flex flex-col gap-[5px]">
                <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-soft">Available</span>
                <span className="text-sm text-ink">{SITE.availableFrom}</span>
              </div>
            </div>
            <a
              href={HERO.ctaHref}
              data-cursor="link"
              className="inline-flex items-center gap-[9px] self-start border-b border-accent-hair pb-[3px] text-sm font-medium text-accent transition-colors duration-300 hover:border-accent"
            >
              {HERO.ctaLabel} <span className="text-[13px]">↗</span>
            </a>
          </div>

          <div className="relative ml-auto w-full max-w-[480px]" style={heroRightStyle}>
            <div
              style={{
                maskImage: "linear-gradient(to top, transparent 0%, black 36%)",
                WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 36%)",
              }}
            >
              <div
                style={{
                  maskImage: "linear-gradient(to right, transparent 0%, black 32%)",
                  WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 32%)",
                }}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <Image
                    src="/profile.png"
                    alt={`Portrait of ${SITE.name}`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 480px, 100vw"
                    className="object-cover"
                  />
                  {isDarkPalette && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(25, 29, 38, 0) 0%, rgba(25, 29, 38, 0.45) 40%, rgba(25, 29, 38, 0.88) 100%)",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <span className="absolute -bottom-[26px] right-[2px] text-[10px] font-medium uppercase tracking-[0.12em] text-soft">
              © {SITE.copyrightYear}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
