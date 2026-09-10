export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  title: string;
  year: string;
  category: string;
  /** Shown in the Home preview when true — keep it to one or two projects. */
  featured: boolean;
  short: string;
  /** Cover image shown on project cards (Home preview + the /projects grid). Path under /public, e.g. "/projects/exxpense-cover.png". Omit to show a placeholder. */
  image?: string;
  /** Larger hero image at the top of the project's detail page. Falls back to `image` when omitted. */
  detailImage?: string;
  stack: string[];
  overview: string;
  context: string;
  solution: string;
  role: string;
  features: string[];
  process: string[];
  results: string[];
  /** Only links that actually exist for this project — omit rather than pointing at "#". */
  links: ProjectLink[];
}

/** Every project, in the order they should appear. Add, remove or reorder freely — every page (Home preview, the listing, and each detail page) reads from this one list. */
export const PROJECTS: Project[] = [
  {
    slug: "exxpense",
    title: "Exxpense",
    year: "2026",
    category: "Full-stack app",
    featured: true,
    short: "A personal finance platform for tracking spending, understanding cash flow, and making better day-to-day financial decisions.",
    stack: [
      "Next.js",
      "TypeScript",
      "React",
      "Tailwind CSS",
      "PostgreSQL",
      "Prisma",
      "NextAuth.js",
      "Google Auth",
      "Zustand",
      "TanStack React Query",
      "React Hook Form",
      "Zod",
    ],
    overview: "Expense is a full-stack personal finance application built and deployed end to end, covering everything from data modeling and authentication to subscriptions and billing.",
    context: "Personal finance data is sensitive, so the application needed real security, not just a login form. It also needed to support the workflows people actually use to track spending: importing data, visualizing it, and managing the subscription behind the product.",
    solution: "Secure authentication with field-level AES-256-GCM encryption, subscription billing via Razorpay, and responsive data workflows built on Zustand and TanStack React Query, including Excel import/export and data visualization. Deployed on Vercel with Neon PostgreSQL.",
    role: "Sole developer — built and deployed the full stack, from schema and auth through billing integration.",
    features: [
      "Field-level AES-256-GCM encryption for sensitive financial data",
      "Subscription billing via Razorpay",
      "Excel import/export",
      "Data visualization for spending patterns",
      "Google authentication"
    ],
    process: ["Expense started as a personal tool to understand and reduce my own spending. Rather than reading transaction notifications from SMS or email, I designed it around explicit user-entered data, so the application only knows what the user chooses to record.",
      "Privacy became a core technical requirement from the beginning. Financial data is encrypted before it is stored, which means the database does not contain readable transaction information.",
      "From there, the application grew into a complete product around that model: authentication, encrypted storage, transaction management, data import and export, spending visualizations, and subscription billing. Each part was built around keeping the user's financial information useful to them without requiring access to their messages or email."],
    results: ["What started as a personal spending tracker became a complete privacy-focused finance application. It allows users to record and understand their spending without granting the application access to their SMS messages or email, while keeping stored financial data encrypted.",
      "The final product covers the full journey from authentication and secure storage to transaction management, data import/export, spending visualization, and subscription billing."],
    links: [{ label: "Live site", href: "https://exxpense.in" }],
    image: "/projects/exxpense-cover.png",
  },
  {
    slug: "uptra",
    title: "Uptra",
    year: "2026",
    category: "SaaS product",
    featured: true,
    short: "A browser-based resume builder designed around real-time editing, flexible templates, and production-ready PDF export.",
    stack: ["Next.js", "TypeScript", "React", "Tailwind CSS", "PostgreSQL", "Prisma", "NextAuth.js", "Zustand", "React Hook Form", "Zod"],
    overview: "Uptra is a SaaS resume builder built around real-time editing, live preview, customizable templates, and reliable browser-based PDF export. The goal was to make creating a resume feel like editing the final document, rather than designing one version and hoping the downloaded PDF matches it.",
    context: "Resume builders often create a disconnect between the editing experience and the final document. What looks correct in the browser can shift when exported, with differences in spacing, layout, typography, or page breaks. Uptra was built to solve that problem by treating the live preview and exported PDF as two parts of the same experience.",
    solution: "A structured builder with real-time editing and a browser-based PDF generation workflow that keeps exports visually consistent with the live preview, with a responsive builder experience designed for both desktop and mobile.",
    role: "Built the product end to end, from the resume editing experience and application architecture to template handling and the PDF export pipeline.",
    features: [
      "Real-time resume editing with live preview",
      "Reusable and customizable resume templates",
      "Browser-based PDF export matching the live preview",
      "Responsive builder experience for desktop and mobile",
    ],
    process: [
      "Started with the core editing experience and a structured resume data model, keeping the user's content separate from how each template presents it.",
      "Built the editor around real-time updates so changes made to resume content are immediately reflected in the preview instead of requiring separate editing and preview steps.",
      "Designed the template system to make presentation reusable and customizable, allowing the same underlying resume data to work across different layouts.",
      "The most important technical challenge was PDF generation. Instead of treating the exported document as a separate representation, the export workflow was designed around the same structure used by the live preview to keep the final PDF visually consistent with what the user sees.",
      "The builder was also designed responsively so the editing workflow remains usable on smaller screens without compromising the document preview experience.",
    ],

    results: [
      "Turned the resume-building workflow into a single browser-based experience from editing through final PDF export.",
      "Reduced the gap between the live editor and the final document by making export fidelity a core part of the product architecture rather than an afterthought.",
      "Built a complete SaaS product covering authentication, resume management, template-driven rendering, responsive editing, and production-ready PDF generation.",
    ],
    links: [{ label: "Live site", href: "https://uptra.vercel.app" }],
    image: "/projects/uptra-cover.png",
  },
];

/** "Featured projects" preview section on Home. */
export const PROJECTS_PREVIEW = {
  eyebrow: "03 · Projects",
  heading: "Featured projects",
  ctaLabel: "Show all projects",
};

/** Copy for the standalone /projects listing page, including its <title>/description. */
export const PROJECTS_PAGE = {
  eyebrow: "Projects",
  heading: "Things I've built",
  intro: "Client work and personal tools, most of them built end to end. Open any project for the full account.",
  backToHomeLabel: "Back to home",
  metaTitle: "Projects",
  metaDescription: "Things Prasad Tawde has built — client work and personal tools.",
};

/** Copy for the reusable project-detail page shell (see ProjectDetail.tsx). */
export const PROJECT_DETAIL = {
  allProjectsLabel: "All projects",
  nextProjectLabel: "Next project",
  startProjectLabel: "Start a project",
};
