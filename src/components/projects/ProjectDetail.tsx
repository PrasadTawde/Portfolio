"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useIntroReveal } from "@/hooks/useIntroReveal";
import { useSpinLinkClick } from "@/hooks/useSpinLinkClick";
import { ImagePlaceholder } from "@/components/common/ImagePlaceholder";
import { PROJECT_DETAIL, type Project } from "@/content/projects";

const rowClass =
  "grid gap-[clamp(24px,4vw,56px)] border-t border-hair py-[clamp(32px,4vw,52px)] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]";
const labelTextClass = "text-[10px] font-medium uppercase tracking-[0.16em] text-soft";
const bodyClass = "min-w-0 [grid-column:span_2]";
const paragraphClass = "m-0 max-w-[64ch] text-base leading-[1.85] text-soft";

/**
 * One label + body row — the shell every section below shares (Overview,
 * Context, My role, ...). Pulled out since it was the same three-`div`
 * wrapper repeated verbatim seven times; only the label, the body's own
 * layout classes and its content actually differ per section.
 */
function DetailRow({
  label,
  bodyClassName = "",
  outerClassName = "",
  children,
}: {
  label: string;
  bodyClassName?: string;
  outerClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={`${rowClass} ${outerClassName}`.trim()}>
      <div className="flex flex-col gap-[10px]">
        <span className={labelTextClass}>{label}</span>
      </div>
      <div className={`${bodyClass} ${bodyClassName}`.trim()}>{children}</div>
    </div>
  );
}

interface ProjectDetailProps {
  project: Project;
  nextProject: Project;
}

export function ProjectDetail({ project, nextProject }: ProjectDetailProps) {
  const hasLinks = project.links.length > 0;
  const { primary, secondary } = useIntroReveal();
  const detailImage = project.detailImage ?? project.image;
  const { pendingHref, onLinkClick } = useSpinLinkClick();

  return (
    <section className="relative z-[1] mx-auto max-w-[1360px] px-[clamp(20px,5vw,64px)] pb-[clamp(72px,10vw,120px)] pt-[clamp(40px,6vw,80px)]">
      <div
        className="flex flex-wrap items-baseline justify-between gap-5 py-[clamp(28px,4vw,48px)] pb-[clamp(32px,4vw,52px)]"
        style={primary}
      >
        <div className="flex flex-col gap-5">
          <div className="flex gap-5 text-[10px] font-medium uppercase tracking-[0.16em] text-soft">
            <span>{project.category}</span>
            <span>{project.year}</span>
          </div>
          <h1 className="m-0 font-quicksand text-[clamp(38px,5.4vw,80px)] font-light leading-[1.02] tracking-[-0.015em] text-ink">
            {project.title}
          </h1>
          <p className="m-0 max-w-[52ch] text-[17px] leading-[1.75] text-soft">{project.short}</p>
        </div>
        <Link
          href="/projects"
          data-cursor="link"
          className="inline-flex items-center gap-[9px] text-[13px] font-medium text-soft transition-colors duration-300 hover:text-ink"
        >
          <span className="text-[13px]">↖</span> {PROJECT_DETAIL.allProjectsLabel}
        </Link>
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-hair" style={secondary}>
        {detailImage ? (
          <Image
            src={detailImage}
            alt={`${project.title} — key screen`}
            fill
            priority
            sizes="(min-width: 1024px) 1200px, 100vw"
            className="object-cover"
          />
        ) : (
          <ImagePlaceholder label={`${project.title} — key screen`} />
        )}
      </div>

      <DetailRow label="Overview" outerClassName="mt-[clamp(32px,4vw,52px)]">
        <p className={paragraphClass}>{project.overview}</p>
      </DetailRow>

      <DetailRow label="Context" bodyClassName="flex flex-col gap-[26px]">
        <p className={paragraphClass}>{project.context}</p>
        <div className="flex flex-col gap-[10px]">
          <span className={labelTextClass}>Solution</span>
          <p className={paragraphClass}>{project.solution}</p>
        </div>
      </DetailRow>

      <DetailRow label="My role" bodyClassName="flex flex-col gap-[26px]">
        <p className={paragraphClass}>{project.role}</p>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-hair px-[13px] py-[6px] text-[11px] font-medium uppercase tracking-[0.06em] text-soft"
            >
              {tech}
            </span>
          ))}
        </div>
      </DetailRow>

      <DetailRow label="Key features" bodyClassName="flex flex-col gap-3">
        {project.features.map((f) => (
          <div key={f} className="flex items-baseline gap-3">
            <span className="mt-[-3px] h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
            <span className="max-w-[60ch] text-[15px] leading-[1.75] text-soft">{f}</span>
          </div>
        ))}
      </DetailRow>

      <DetailRow label="Process" bodyClassName="flex flex-col gap-5">
        {project.process.map((pc) => (
          <p key={pc} className={paragraphClass}>
            {pc}
          </p>
        ))}
      </DetailRow>

      <DetailRow label="Results" bodyClassName="flex flex-col gap-5">
        {project.results.map((rs) => (
          <p key={rs} className={paragraphClass}>
            {rs}
          </p>
        ))}
      </DetailRow>

      {hasLinks && (
        <DetailRow label="Links" bodyClassName="flex flex-wrap gap-6">
          {project.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              onClick={(e) => onLinkClick(e, l.href)}
              className="inline-flex items-center gap-[9px] border-b border-accent-hair pb-[3px] text-sm font-medium text-accent transition-colors duration-300 hover:border-accent"
            >
              {l.label}{" "}
              <span className={`inline-block text-[13px] ${pendingHref === l.href ? "anim-spin" : ""}`}>↗</span>
            </a>
          ))}
        </DetailRow>
      )}

      <div className="flex flex-wrap items-center justify-between gap-5 border-t border-hair pt-[clamp(28px,3.5vw,44px)]">
        <Link
          href={`/projects/${nextProject.slug}`}
          data-cursor="link"
          className="flex flex-col gap-[6px] text-ink transition-colors duration-[400ms] hover:text-accent"
        >
          <span className={labelTextClass}>{PROJECT_DETAIL.nextProjectLabel}</span>
          <span className="font-quicksand text-[clamp(22px,2.4vw,32px)] font-normal text-inherit">
            {nextProject.title} ↗
          </span>
        </Link>
        <Link
          href="/#contact"
          data-cursor="link"
          className="inline-flex items-center gap-[9px] border-b border-accent-hair pb-[3px] text-sm font-medium text-accent transition-colors duration-300 hover:border-accent"
        >
          {PROJECT_DETAIL.startProjectLabel} <span className="text-[13px]">↗</span>
        </Link>
      </div>
    </section>
  );
}
