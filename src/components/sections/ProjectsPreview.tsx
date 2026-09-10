"use client";

import { useRef } from "react";
import Link from "next/link";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { PROJECTS, PROJECTS_PREVIEW } from "@/content/projects";

export function ProjectsPreview() {
  const ref = useRef<HTMLElement>(null);
  const motion = useSectionReveal(ref);
  const featured = PROJECTS.filter((p) => p.featured);

  return (
    <section
      id="projects"
      ref={ref}
      className="relative z-[1] mx-auto max-w-[1360px] px-[clamp(20px,5vw,64px)] pb-[clamp(96px,12vw,160px)] pt-[clamp(64px,8vw,112px)]"
    >
      <div style={motion}>
        <div className="flex flex-wrap items-baseline justify-between gap-5 pb-[clamp(32px,4vw,52px)]">
          <div className="flex flex-col gap-[18px]">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-soft">
              {PROJECTS_PREVIEW.eyebrow}
            </span>
            <h2 className="m-0 font-quicksand text-[clamp(32px,4vw,56px)] font-light leading-[1.05] tracking-[-0.015em] text-ink">
              {PROJECTS_PREVIEW.heading}
            </h2>
          </div>
          <Link
            href="/projects"
            data-cursor="link"
            className="inline-flex items-center gap-[9px] border-b border-accent-hair pb-[3px] text-sm font-medium text-accent transition-colors duration-300 hover:border-accent"
          >
            {PROJECTS_PREVIEW.ctaLabel} <span className="text-[13px]">↗</span>
          </Link>
        </div>

        <div className="grid gap-[clamp(24px,4vw,48px)] border-t border-hair pt-[clamp(28px,3.5vw,44px)] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          {featured.map((p, i) => (
            <ProjectCard key={p.slug} project={p} variant="preview" priority={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
