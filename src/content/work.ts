export interface Role {
  period: string;
  company: string;
  role: string;
  place: string;
  points: string[];
  stack: string[];
}

/** Career-experience section on Home. Add, remove or reorder `roles` freely — the layout handles any number of entries. */
export const WORK = {
  eyebrow: "01 · Work",
  heading: "Where I've worked",
  resumeLabel: "Résumé",
  roles: [
    {
      period: "June 2024 — Present",
      company: "InBetween Software Development Private Limited",
      role: "Senior Web Developer",
      place: "Goa, India",
      points: [
        "Lead end-to-end development of complex product features and interactive browser-based editors, from requirement analysis through production release.",
        "Delivered solutions for requirements across 7+ enterprise customers, including effort estimation, custom feature development, production issue resolution, and product demonstrations.",
        "Drive feature planning and technical execution, balancing new functionality with application stability, performance, and maintainability.",
        "Mentor junior developers and contribute to code reviews, sprint planning, and technical estimation.",
      ],
      stack: ["React", "TypeScript", "Next.js"],
    },
    {
      period: "April 2023 — June 2024",
      company: "InBetween Software Development Private Limited",
      role: "Web Developer",
      place: "Goa, India",
      points: [
        "Migrated critical application modules from Angular to React, achieving a 60% average performance improvement.",
        "Implemented Redux Toolkit to streamline state management and data flow, and optimized applications handling large datasets to reduce load times.",
        "Modernized legacy UI components, supported the broader Angular-to-React transition, developed new features, and resolved customer-specific and production issues.",
      ],
      stack: ["React", "Angular", "Redux Toolkit"],
    },
    {
      period: "June 2022 — April 2023",
      company: "InBetween Software Development Private Limited",
      role: "Junior Web Developer",
      place: "Goa, India",
      points: [
        "Developed and enhanced product functionality using Angular across multiple web applications, improving performance and responsiveness.",
        "Contributed to modernizing and maintaining existing codebases, improving UI behavior across devices and overall code quality.",
      ],
      stack: ["Angular"],
    },
    {
      period: "January 2022 — June 2022",
      company: "InBetween Software Development Private Limited",
      role: "Junior Web Developer Intern",
      place: "Goa, India",
      points: [
        "Contributed to Angular-based application development, implementing feature enhancements and resolving bugs.",
        "Debugged functional and UI issues across Angular and Vanilla JavaScript applications while learning production-level development practices.",
      ],
      stack: ["Angular", "JavaScript"],
    },
  ] satisfies Role[],
};
