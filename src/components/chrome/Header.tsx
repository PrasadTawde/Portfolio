"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/content/site";
import { PaletteSwitcher } from "./PaletteSwitcher";

interface NavLinkProps {
  href: string;
  label: string;
  active: boolean;
}

function NavLink({ href, label, active }: NavLinkProps) {
  return (
    <Link
      href={href}
      scroll={false}
      data-cursor="link"
      className={`flex items-center gap-[7px] transition-colors duration-300 ${
        active ? "text-ink" : "text-soft hover:text-ink"
      }`}
    >
      {active && <span className="h-1 w-1 rounded-full bg-accent" />}
      {label}
    </Link>
  );
}

/** Nav highlight is static per page (Work on Home, Projects on /projects*) — matches the design, not scroll-driven. */
export function Header() {
  const pathname = usePathname();
  const onProjects = pathname.startsWith("/projects");
  const onBeyond = pathname.startsWith("/beyond-code");

  return (
    <header className="relative z-10 flex flex-wrap items-center justify-between gap-6 px-[clamp(20px,5vw,64px)] py-[26px]">
      <Link href="/" className="font-quicksand text-base font-medium tracking-[0.01em] text-ink">
        {SITE.name}
        <sup className="relative -top-1.5 text-[9px] opacity-55">®</sup>
      </Link>

      <div className="flex items-center gap-[clamp(16px,3vw,28px)]">
        <nav className="flex items-center gap-[clamp(14px,2.4vw,26px)] text-[13px] font-medium tracking-[0.01em]">
          <NavLink href="/#work" label="Work" active={!onProjects && !onBeyond} />
          <NavLink href="/#about" label="About" active={false} />
          <NavLink href="/#projects" label="Projects" active={onProjects} />
          <NavLink href="/beyond-code" label="Beyond Code" active={onBeyond} />
          <NavLink href="/#contact" label="Contact" active={false} />
        </nav>
        <span className="h-4 w-px bg-ink opacity-[0.14]" />
        <PaletteSwitcher />
      </div>
    </header>
  );
}
