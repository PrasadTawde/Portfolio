import Link from "next/link";
import Image from "next/image";
import { ImagePlaceholder } from "@/components/common/ImagePlaceholder";
import type { Project } from "@/content/projects";

interface ProjectCardProps {
  project: Project;
  /** "preview" = featured cards on Home (slightly larger heading, no entrance animation — the section already reveals as a whole). "grid" = the standalone /projects listing (entrance rise animation, tighter heading). */
  variant?: "preview" | "grid";
  /** Set on the first card in a listing — it's the one likely to be the page's LCP element, so it skips next/image's default lazy-loading instead of the browser warning about it. */
  priority?: boolean;
}

export function ProjectCard({ project, variant = "grid", priority = false }: ProjectCardProps) {
  const isPreview = variant === "preview";

  return (
    <Link
      href={`/projects/${project.slug}`}
      data-cursor="link"
      className={`flex flex-col text-ink transition-colors duration-[400ms] hover:text-accent ${
        isPreview ? "gap-[18px]" : "anim-rise gap-4"
      }`}
    >
      <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl border border-hair">
        {project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} cover`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
        ) : (
          <ImagePlaceholder label={`${project.title} cover`} />
        )}
      </div>
      <div className="flex gap-[18px] text-[10px] font-medium uppercase tracking-[0.16em] text-soft">
        <span>{project.category}</span>
        <span>{project.year}</span>
      </div>
      {isPreview ? (
        <h3 className="m-0 font-quicksand text-[clamp(22px,2.3vw,30px)] font-normal leading-[1.15] tracking-[-0.01em] text-inherit">
          {project.title}
        </h3>
      ) : (
        <h2 className="m-0 font-quicksand text-[clamp(20px,2vw,26px)] font-normal leading-[1.2] tracking-[-0.01em] text-inherit">
          {project.title}
        </h2>
      )}
      <p className={`m-0 text-[15px] leading-[1.7] text-soft ${isPreview ? "max-w-[44ch]" : "max-w-[42ch]"}`}>
        {project.short}
      </p>
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
    </Link>
  );
}
