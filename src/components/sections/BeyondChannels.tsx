"use client";

import { useRef } from "react";
import Image from "next/image";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { ImagePlaceholder } from "@/components/common/ImagePlaceholder";
import type { BeyondDestination } from "@/content/beyondCode";

/**
 * Circular avatar badge inset into the cover frame's bottom-left corner,
 * mirroring YouTube's own banner+avatar composition. A sibling of the
 * rotating cover-image wrapper (not a child of it) so it stays level while
 * the banner tilts on hover, and sits inside the frame's own overflow-hidden
 * bounds so nothing needs to escape the rounded corners.
 */
function AvatarBadge({ src, size }: { src: string; size: number }) {
  return (
    <div
      className="absolute bottom-3 left-3 overflow-hidden rounded-full border-2 border-bg shadow-[0_2px_10px_rgba(0,0,0,0.25)]"
      style={{ width: size, height: size }}
    >
      <Image src={src} alt="" fill sizes={`${size}px`} className="object-cover" />
    </div>
  );
}

function MetaRow({ meta }: { meta: BeyondDestination["meta"] }) {
  if (meta.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-[clamp(24px,4vw,48px)] pt-2">
      {meta.map((m) => (
        <div key={m.k} className="flex flex-col gap-[5px]">
          <span className="font-quicksand text-[clamp(24px,2.6vw,34px)] leading-none text-ink">{m.v}</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-soft">{m.k}</span>
        </div>
      ))}
    </div>
  );
}

/** Large card for the main channel: image left, copy right, filled accent CTA. */
function PrimaryChannelCard({ d }: { d: BeyondDestination }) {
  const ref = useRef<HTMLElement>(null);
  const motion = useSectionReveal(ref);

  return (
    <section ref={ref} className="relative z-[1] mx-auto max-w-[1360px] px-[clamp(20px,5vw,64px)] py-[clamp(32px,4vw,56px)]">
      <div style={motion} className="grid items-center gap-[clamp(28px,4vw,64px)] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
        <div className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-hair">
          <div className="relative h-full w-full rotate-[-1.2deg] transition-transform duration-500 ease-out group-hover:rotate-0">
            {d.image ? (
              <Image
                src={d.image}
                alt={`${d.platform} — ${d.title}`}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <ImagePlaceholder label={`${d.platform} — ${d.title}`} />
            )}
          </div>
          {d.avatarUrl && <AvatarBadge src={d.avatarUrl} size={72} />}
        </div>
        <div className="flex flex-col gap-[18px]">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
            {d.kicker} &nbsp;·&nbsp; {d.platform}
          </span>
          <h2 className="m-0 font-quicksand text-[clamp(30px,4.4vw,60px)] font-light leading-[1.02] tracking-[-0.02em] text-ink">{d.title}</h2>
          <p className="m-0 max-w-[46ch] text-base leading-[1.8] text-soft">{d.body}</p>
          <MetaRow meta={d.meta} />
          <a
            href={d.cta.href}
            target={d.cta.href === "#" ? undefined : "_blank"}
            rel={d.cta.href === "#" ? undefined : "noopener noreferrer"}
            data-cursor="link"
            className="mt-2 inline-flex items-center gap-[10px] self-start rounded-full bg-accent px-6 py-[13px] text-sm font-medium text-bg transition-opacity duration-300 hover:opacity-[0.86]"
          >
            {d.cta.label} <span className="text-[13px]">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/** Smaller, secondary-treatment card (e.g. Shorts): image right, underline CTA instead of a filled pill. */
function SecondaryChannelCard({ d }: { d: BeyondDestination }) {
  const ref = useRef<HTMLElement>(null);
  const motion = useSectionReveal(ref);

  return (
    <section ref={ref} className="relative z-[1] mx-auto max-w-[1360px] px-[clamp(20px,5vw,64px)] py-[clamp(40px,5vw,72px)]">
      <div style={motion} className="grid items-center gap-[clamp(24px,4vw,56px)] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        <div className="order-2 flex flex-col gap-4">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
            {d.kicker} &nbsp;·&nbsp; {d.platform}
          </span>
          <h2 className="m-0 font-quicksand text-[clamp(26px,3.2vw,42px)] font-light leading-[1.05] tracking-[-0.02em] text-ink">{d.title}</h2>
          <p className="m-0 max-w-[44ch] text-base leading-[1.8] text-soft">{d.body}</p>
          <MetaRow meta={d.meta} />
          <a
            href={d.cta.href}
            target={d.cta.href === "#" ? undefined : "_blank"}
            rel={d.cta.href === "#" ? undefined : "noopener noreferrer"}
            data-cursor="link"
            className="mt-1 inline-flex items-center gap-[9px] self-start border-b border-accent-hair pb-[3px] text-sm font-medium text-accent transition-colors duration-300 hover:border-accent"
          >
            {d.cta.label} <span className="text-[13px]">↗</span>
          </a>
        </div>
        <div className="group relative order-1 aspect-[4/5] w-full max-w-[340px] overflow-hidden rounded-2xl border border-hair">
          <div className="relative h-full w-full rotate-[1.4deg] transition-transform duration-500 ease-out group-hover:rotate-0">
            {d.image ? (
              <Image src={d.image} alt={`${d.platform} — ${d.title}`} fill sizes="(min-width: 1024px) 340px, 100vw" className="object-cover" />
            ) : (
              <ImagePlaceholder label={`${d.platform} — ${d.title}`} />
            )}
          </div>
          {d.avatarUrl && <AvatarBadge src={d.avatarUrl} size={56} />}
        </div>
      </div>
    </section>
  );
}

/** Video destinations (kind: "video"): the primary channel gets the large card, everything else gets the secondary treatment. */
export function BeyondChannels({ destinations }: { destinations: BeyondDestination[] }) {
  const videos = destinations.filter((d) => d.kind === "video");
  const primary = videos.filter((d) => d.primary);
  const secondary = videos.filter((d) => !d.primary);

  return (
    <>
      {primary.map((d) => (
        <PrimaryChannelCard key={d.id} d={d} />
      ))}
      {secondary.map((d) => (
        <SecondaryChannelCard key={d.id} d={d} />
      ))}
    </>
  );
}
