import type { Metadata } from "next";
import Link from "next/link";
import { BeyondDrift } from "@/components/chrome/BackgroundLayers";
import { BeyondHero } from "@/components/sections/BeyondHero";
import { BeyondChannels } from "@/components/sections/BeyondChannels";
import { BeyondSocials } from "@/components/sections/BeyondSocials";
import { SITE } from "@/content/site";
import { BEYOND_CODE } from "@/content/beyondCode";
import { getLiveDestinations } from "@/lib/social";

const title = `${BEYOND_CODE.metaTitle} — ${SITE.name}`;

export const metadata: Metadata = {
  title,
  description: BEYOND_CODE.metaDescription,
  alternates: {
    canonical: "/beyond-code",
  },
  openGraph: {
    type: "website",
    url: "/beyond-code",
    title,
    description: BEYOND_CODE.metaDescription,
  },
};

export default async function BeyondCodePage() {
  // Server-side only, cached via next:{revalidate} in getLiveDestinations —
  // never blocks or slows down a visitor's request. See src/lib/social.ts.
  const destinations = await getLiveDestinations(BEYOND_CODE.destinations);

  return (
    <>
      <BeyondDrift />
      <BeyondHero />
      <BeyondChannels destinations={destinations} />
      <BeyondSocials destinations={destinations} />

      <section className="relative z-[1] mx-auto max-w-[1360px] px-[clamp(20px,5vw,64px)] pb-[clamp(48px,6vw,80px)]">
        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-hair pt-[clamp(28px,3.5vw,44px)]">
          <Link
            href="/"
            data-cursor="link"
            className="flex flex-col gap-[6px] text-ink transition-colors duration-[400ms] hover:text-accent"
          >
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-soft">{BEYOND_CODE.backLabel}</span>
            <span className="font-quicksand text-[clamp(22px,2.4vw,32px)] font-normal text-inherit">
              {BEYOND_CODE.backHeading} ↖
            </span>
          </Link>
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-soft">
            © {SITE.copyrightYear} · {SITE.location}
          </span>
        </div>
      </section>
    </>
  );
}
