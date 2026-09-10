/**
 * Site-wide identity. Edit these to make this template yours — every value
 * here is reused across the header, hero, footer, contact section and page
 * <title>/description, so changing it here changes it everywhere.
 */
export const SITE = {
  name: "Prasad Tawde",
  /** Production domain, no trailing slash. Used for canonical URLs, the sitemap, robots.txt and Open Graph tags — update this once the site is actually deployed somewhere. */
  url: "https://prasadtawde.dev",
  /** Shown under the name in the hero and used in the page <title>. */
  role: "Senior Web Developer",
  /** One-line summary used for the page meta description (SEO/link previews). */
  description:
    "Senior Web Developer with 4+ years building complex React and Angular applications, interactive visual editors, and enterprise product features.",
  location: "Goa, India",
  workingScope: "Worldwide",
  /** Shown under "Available" in the hero meta row. */
  availableFrom: "Open for work",
  email: "prasadtawde1997@gmail.com",
  /** Link for the "Résumé" button in the Work section — a live resume built with Uptra. */
  resumeHref: "https://uptra.vercel.app/r/lpZjUBXl8fY",
  /** Shown in every "© <year>" footer line. Derived from the current date so it never needs a manual update — on a statically-generated page this is the year of the last build/deploy. */
  copyrightYear: String(new Date().getFullYear()),
  social: [
    { label: "LinkedIn", href: "https://linkedin.com/in/prasadtawde07" },
    { label: "GitHub", href: "https://github.com/PrasadTawde" },
    { label: "Résumé", href: "https://uptra.vercel.app/r/lpZjUBXl8fY" },
  ],
};
