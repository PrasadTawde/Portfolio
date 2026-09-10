import { SITE } from "@/content/site";
import { PROJECTS, PROJECTS_PAGE } from "@/content/projects";
import { BEYOND_CODE } from "@/content/beyondCode";

/** Human label for a route — shared by the route-transition wipe and the hard-load intro veil, so both name a destination the same way. */
export function getPageLabel(pathname: string): string {
  if (pathname === "/") return SITE.name;
  if (pathname === "/projects") return PROJECTS_PAGE.metaTitle;
  const match = pathname.match(/^\/projects\/([^/]+)/);
  if (match) {
    const project = PROJECTS.find((p) => p.slug === match[1]);
    if (project) return project.title;
  }
  if (pathname === "/beyond-code") return BEYOND_CODE.metaTitle;
  return "";
}
