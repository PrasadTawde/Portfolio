export interface BeyondMeta {
  k: string;
  v: string;
}

export interface BeyondDestination {
  id: string;
  kind: "video" | "social";
  /** Video only: the main channel gets the larger "primary" card treatment; Shorts gets the smaller "secondary" one. */
  primary?: boolean;
  kicker: string;
  platform: string;
  title: string;
  body: string;
  /** Stat row under the copy (e.g. subscribers, videos). Leave empty to hide the row entirely until real numbers exist. */
  meta: BeyondMeta[];
  cta: { label: string; href: string };
  /** Cover image path under /public. Omit to show ImagePlaceholder, same convention as Project.image. */
  image?: string;
  /** Small circular badge overlaid on the cover image (bottom-left), YouTube-style. Populated live by src/lib/social.ts — not something to set by hand. */
  avatarUrl?: string;
}

/**
 * Copy + data for the standalone /beyond-code page — the "who I am outside of
 * work" page, extending the approved design system with its own personality
 * (per the design chat) rather than reusing the Work/Projects card style.
 *
 * TODO before shipping: the "discord" destination still has `href: "#"` and
 * an empty `meta: []` — swap in a real invite link and member count once
 * they exist (see the file-level note on that entry below). YouTube and X
 * are already real. Add a cover image per destination the same way
 * projects.ts does (`image: "/beyond/<file>.png"`) once you have thumbnails.
 */
// A plain type annotation (rather than `satisfies`) so the empty `meta: []`
// fields below are contextually typed as `BeyondMeta[]`, not narrowed to
// `never[]` — `satisfies` preserves each literal's inferred type instead of
// widening it, which is exactly wrong for an empty array literal.
const BEYOND_DESTINATIONS: BeyondDestination[] = [
  {
    id: "yt-main",
    kind: "video",
    primary: true,
    kicker: "Creator",
    platform: "YouTube",
    title: "Gaming channel",
    body: "Live streams, full playthroughs and longer gaming videos. If you want to watch me play, catch a stream, or hang out while I'm live, this is where that happens.",
    meta: [],
    cta: { label: "Watch / join live", href: "https://www.youtube.com/@IGLxFlash" },
  },
  {
    id: "yt-shorts",
    kind: "video",
    primary: false,
    kicker: "Creator",
    platform: "YouTube Shorts",
    title: "Shorts",
    body: "Short-form gaming: clips, highlights and the one good moment out of a longer session. Made for watching in a queue.",
    meta: [],
    cta: { label: "Watch Shorts", href: "https://www.youtube.com/@RyokuuX" },
  },
  {
    id: "x",
    kind: "social",
    kicker: "Thinking out loud",
    platform: "X",
    title: "Short thoughts, posted too quickly",
    body: "Things I'm making, games I'm playing, things I find interesting, and the occasional thought that probably should've stayed in my head.",
    meta: [],
    cta: { label: "Follow on X", href: "https://x.com/PrasadTawde07" },
  },
  {
    id: "discord",
    kind: "social",
    kicker: "Community",
    platform: "Discord",
    title: "Where everyone actually hangs out",
    body: "The server is the real room: chat during streams, people organising games, and a channel where nobody stays on topic. Open to anyone who watches.",
    meta: [],
    cta: { label: "Join Discord", href: "https://discord.gg/kPwGyw56p2" },
  },
];

export const BEYOND_CODE = {
  kicker: "Beyond code",
  heading: "What keeps me curious",
  intro:
    "A collection of things I create, play, explore, and enjoy — some shared with the world, some just for me.",
  pills: ["Create", "play", "Explore"],
  metaTitle: "Beyond Code",
  metaDescription: "A look at what Prasad Tawde does outside of software development — gaming content and posts elsewhere online.",
  backLabel: "Back to",
  backHeading: "What I build",
  destinations: BEYOND_DESTINATIONS,
};
