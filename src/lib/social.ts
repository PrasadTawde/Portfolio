import type { BeyondDestination } from "@/content/beyondCode";

/**
 * Live social-profile data for the Beyond Code page. One file, divided by
 * platform below, so adding a new platform later (or handing this whole
 * template to someone else) means adding one function here and one line in
 * `getLiveDestinations` — nothing else in the app needs to change.
 *
 * Performance contract: every fetch below runs server-side only, inside
 * `next: { revalidate: REVALIDATE_SECONDS }`. That means Next statically
 * prerenders the page using cached results and silently refreshes them in
 * the background on that interval — a visitor never triggers or waits on a
 * live API call, they always get instant, pre-baked HTML. Update your
 * YouTube banner/avatar and it reaches the site on its own within a day,
 * with zero manual edits.
 *
 * Resilience contract: every function here returns `null` instead of
 * throwing — a missing API key, a network error, a quota limit, or a
 * platform with no live source yet (X, for now) all just mean "use the
 * static fallback already in content/beyondCode.ts". Nothing here can break
 * a build or take the page down.
 */

const REVALIDATE_SECONDS = 60 * 60 * 24; // 24h — banners/avatars/counts don't change often.

export interface SocialProfile {
  avatarUrl?: string;
  bannerUrl?: string;
  stats?: { k: string; v: string }[];
}

/** 18400 -> "18.4k", 2100000 -> "2.1M". Matches the compact stat style already used across the site. */
function formatCount(n: number): string {
  if (n >= 1_000_000) return trimZero(n / 1_000_000) + "M";
  if (n >= 1_000) return trimZero(n / 1_000) + "k";
  return String(n);
}
function trimZero(n: number): string {
  return n % 1 === 0 ? String(n) : n.toFixed(1);
}

// ── YouTube ─────────────────────────────────────────────────────────────

interface YouTubeChannelResponse {
  items?: Array<{
    snippet?: {
      publishedAt?: string;
      thumbnails?: { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
    };
    statistics?: { subscriberCount?: string; videoCount?: string; hiddenSubscriberCount?: boolean };
    brandingSettings?: { image?: { bannerExternalUrl?: string } };
  }>;
}

/**
 * Fetches a channel's avatar, banner and stats by @handle via the YouTube
 * Data API v3 (`channels.list`, part=snippet,statistics,brandingSettings).
 * Read-only public data — an API key is enough, no OAuth. Setup steps are in
 * PROJECT_STATUS.md. Costs 1 quota unit per call against a 10,000/day free
 * quota, so the 24h revalidate above is nowhere near the limit.
 */
async function fetchYouTubeChannel(handle: string): Promise<SocialProfile | null> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;

  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&forHandle=${encodeURIComponent(handle)}&key=${key}`;
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;

    const data = (await res.json()) as YouTubeChannelResponse;
    const channel = data.items?.[0];
    if (!channel) return null;

    const avatarUrl = channel.snippet?.thumbnails?.high?.url ?? channel.snippet?.thumbnails?.medium?.url;
    const bannerUrl = channel.brandingSettings?.image?.bannerExternalUrl;

    const stats: SocialProfile["stats"] = [];
    const subs = channel.statistics?.subscriberCount;
    if (subs && !channel.statistics?.hiddenSubscriberCount) {
      stats.push({ k: "Subscribers", v: formatCount(Number(subs)) });
    }
    const videos = channel.statistics?.videoCount;
    if (videos) stats.push({ k: "Videos", v: formatCount(Number(videos)) });
    const since = channel.snippet?.publishedAt;
    if (since) stats.push({ k: "Since", v: String(new Date(since).getFullYear()) });

    return { avatarUrl, bannerUrl, stats };
  } catch {
    return null;
  }
}

/** Pulls the @handle out of a youtube.com/@handle URL, or null if the href isn't shaped like one. */
function youTubeHandleFrom(href: string): string | null {
  const m = href.match(/youtube\.com\/@([^/?#]+)/i);
  return m ? m[1] : null;
}

// ── X ────────────────────────────────────────────────────────────────────

/**
 * No live source yet: reading a profile's avatar/banner/follower count via
 * the X API requires a paid tier (the free tier lost read access to user
 * lookup endpoints in 2023) — see the research notes in PROJECT_STATUS.md.
 * Kept as a real function with the same shape as the YouTube one so wiring
 * X in later (once there's API access, or a scraping-free alternative) is a
 * body swap here, not a new integration.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept for signature symmetry with fetchYouTubeChannel, see doc comment above.
async function fetchXProfile(handle: string): Promise<SocialProfile | null> {
  return null;
}

// ── Aggregator ──────────────────────────────────────────────────────────

/**
 * Takes the static destinations from content/beyondCode.ts and, for any
 * whose platform has a live source, merges in fresh avatar/banner/stats —
 * per destination, so one channel's fetch failing never blanks out another.
 * Anything without a live source (or that fails) passes through unchanged.
 */
export async function getLiveDestinations(destinations: BeyondDestination[]): Promise<BeyondDestination[]> {
  return Promise.all(
    destinations.map(async (d) => {
      let profile: SocialProfile | null = null;

      if (d.platform === "YouTube" || d.platform === "YouTube Shorts") {
        const handle = youTubeHandleFrom(d.cta.href);
        if (handle) profile = await fetchYouTubeChannel(handle);
      } else if (d.platform === "X") {
        profile = await fetchXProfile(d.cta.href);
      }

      if (!profile) return d;
      return {
        ...d,
        image: profile.bannerUrl ?? d.image,
        avatarUrl: profile.avatarUrl ?? d.avatarUrl,
        meta: profile.stats && profile.stats.length > 0 ? profile.stats : d.meta,
      };
    })
  );
}
