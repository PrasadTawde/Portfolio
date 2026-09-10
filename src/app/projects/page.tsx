import type { Metadata } from "next";
import Link from "next/link";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectsHeading } from "@/components/projects/ProjectsHeading";
import { SITE } from "@/content/site";
import { PROJECTS, PROJECTS_PAGE, PROJECT_DETAIL } from "@/content/projects";

const title = `${PROJECTS_PAGE.metaTitle} — ${SITE.name}`;

export const metadata: Metadata = {
  title,
  description: PROJECTS_PAGE.metaDescription,
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    type: "website",
    url: "/projects",
    title,
    description: PROJECTS_PAGE.metaDescription,
  },
};

export default function ProjectsPage() {
  return (
    <section className="relative z-[1] mx-auto max-w-[1360px] px-[clamp(20px,5vw,64px)] pb-[clamp(72px,10vw,132px)] pt-[clamp(48px,7vw,96px)]">
      <ProjectsHeading />

      <div className="grid gap-[clamp(28px,4vw,48px)] border-t border-hair pt-[clamp(32px,4vw,52px)] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.slug} project={p} variant="grid" priority={i === 0} />
        ))}
      </div>

      <div className="mt-[clamp(56px,7vw,96px)] flex flex-wrap items-center justify-between gap-4 border-t border-hair pt-[clamp(24px,3vw,36px)]">
        <Link
          href="/#contact"
          data-cursor="link"
          className="inline-flex items-center gap-[9px] border-b border-accent-hair pb-[3px] text-sm font-medium text-accent transition-colors duration-300 hover:border-accent"
        >
          {PROJECT_DETAIL.startProjectLabel} <span className="text-[13px]">↗</span>
        </Link>
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-soft">
          © {SITE.copyrightYear} · {SITE.location}
        </span>
      </div>
    </section>
  );
}
