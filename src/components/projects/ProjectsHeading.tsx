"use client";

import Link from "next/link";
import { useIntroReveal } from "@/hooks/useIntroReveal";
import { PROJECTS_PAGE } from "@/content/projects";

/** Top heading block of the standalone /projects page — split out so it can key its entrance off the intro veil while the page itself stays a Server Component (for `metadata`). */
export function ProjectsHeading() {
  const { primary } = useIntroReveal();

  return (
    <div
      className="flex flex-wrap items-baseline justify-between gap-5 pb-[clamp(36px,4.5vw,60px)]"
      style={primary}
    >
      <div className="flex flex-col gap-[18px]">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-soft">
          {PROJECTS_PAGE.eyebrow}
        </span>
        <h1 className="m-0 font-quicksand text-[clamp(36px,5vw,72px)] font-light leading-[1.03] tracking-[-0.015em] text-ink">
          {PROJECTS_PAGE.heading}
        </h1>
        <p className="m-0 max-w-[46ch] text-base leading-[1.8] text-soft">{PROJECTS_PAGE.intro}</p>
      </div>
      <Link
        href="/"
        data-cursor="link"
        className="inline-flex items-center gap-[9px] border-b border-accent-hair pb-[3px] text-sm font-medium text-accent transition-colors duration-300 hover:border-accent"
      >
        <span className="text-[13px]">↖</span> {PROJECTS_PAGE.backToHomeLabel}
      </Link>
    </div>
  );
}
