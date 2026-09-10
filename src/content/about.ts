export interface Principle {
  n: string;
  title: string;
  body: string;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

/** About section on Home. */
export const ABOUT = {
  eyebrow: "02 · About",
  heading: "Building enterprise frontend, end to end",
  paragraphs: [
    "I'm a senior web developer with 4+ years of experience building complex React and Angular applications for enterprise products. Most of my work sits at the intersection of interactive browser-based editors and the everyday features that keep a large product stable — from requirement analysis and effort estimation to shipping production-ready solutions that customers depend on.",

    "I've led critical application migrations from Angular to React that cut load times by 60%, introduced Redux Toolkit to simplify state across large datasets, and mentored junior developers through code reviews and sprint planning. I care about code that survives contact with real customers and real deadlines.",
  ],
  principles: [
    { n: "01", title: "Ship what's stable", body: "New functionality gets balanced against performance and maintainability, not chased for its own sake." },
    { n: "02", title: "Own the requirement, not just the ticket", body: "Translating a customer's ask into the right technical solution matters as much as writing the code." },
    { n: "03", title: "Leave the codebase better", body: "Code reviews, mentorship and modernization work are part of the job, not extra credit." },
  ] satisfies Principle[],
  skills: [
    { group: "Frontend", items: ["React.js", "Angular", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS"] },
    { group: "State Management & Data", items: ["Redux Toolkit", "Zustand", "TanStack React Query"] },
    { group: "Backend & Database", items: ["Node.js", "REST APIs", "PostgreSQL", "MySQL"] },
    { group: "Tools & Services", items: ["Git", "Vercel", "Razorpay", "PostgreSQL via Prisma"] },
  ] satisfies SkillGroup[],
};
