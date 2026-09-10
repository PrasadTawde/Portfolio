# Project Status

Personal portfolio for **Prasad Tawde**, built with Next.js (App Router), TypeScript and Tailwind CSS v4. Originally scaffolded from a design prototype handoff (`Portfolio.dc.html` / `Portfolio Loader B.dc.html`), then ported to real React components and populated with real content from a resume.

Last updated: 2026-09-11 (console-warning fixes, project-detail refactor, Discord card added).

## Architecture at a glance

```
src/
  app/                    Routes (App Router): /, /projects, /projects/[slug], /beyond-code
                           api/contact           — POST endpoint, sends via Resend (see lib/email.ts)
  components/
    chrome/               Cross-page UI: header, cursor, background, page/intro transitions
    sections/             Home page sections: Hero, Work, About, ProjectsPreview, Contact
                           Beyond Code page sections: BeyondHero, BeyondChannels, BeyondSocials
    projects/             Project card / detail / listing-heading components
    common/               Small shared bits (ImagePlaceholder)
  content/                All editable site copy & data — see below
  context/                PaletteContext (the 5-theme color system)
  hooks/                  useIntroStep, useIntroReveal, useHeroMotion, useSectionReveal, useReducedMotion, useSpinLinkClick
  lib/                    palettes.ts, pageLabel.ts, motion.ts (shared, non-content utilities)
                           social.ts — live YouTube/X profile data, see below
                           email.ts — Resend delivery for the Contact form, see below
```

### The content layer

Everything a non-technical editor would want to change lives in `src/content/*.ts`, typed so mistakes get caught at build time:

- `site.ts` — name, role, location, email, social links, résumé link, copyright year (auto-derived from the current date, not hardcoded)
- `hero.ts` — hero bio + CTA
- `work.ts` — career history (`WORK.roles`)
- `about.ts` — bio paragraphs, principles, skills
- `projects.ts` — the project list (`PROJECTS`) plus copy for the preview/listing/detail views
- `contact.ts` — contact section heading/blurb/form labels
- `beyondCode.ts` — copy + data for the standalone `/beyond-code` page (destinations array, pills, intro)

No component code needs touching to update copy, swap projects, or change identity info — only files in `content/`.

## What's been done

**Design system port** — Recreated the approved design prototype pixel-for-pixel in React/Tailwind: 5-palette color system (`PaletteContext` + `lib/palettes.ts`), custom circle cursor, ambient background layers (grain, tint washes, hairline grid), scroll-driven section reveals, hero parallax.

**"Name Set" intro loader** (`IntroLoader.tsx` + `hooks/useIntroStep.ts`) — Full-screen veil that shows the current route's name/title, holds, then lifts away to reveal the page underneath. Runs once per hard page load/reload (module-level state resets on real navigation, survives client-side routing), route-aware label (home shows the site name, `/projects` shows "Projects", a project page shows its own title), skips straight to the revealed state under `prefers-reduced-motion`.

**Route transitions** (`PageTransition.tsx`) — Two-panel accent→ink wipe for any navigation touching Home; a simplified single ink-panel wipe for navigation that stays entirely within the Projects area (listing ↔ a project, project ↔ project), per explicit request to keep that case simpler.

**Content migration from resume** — Replaced all placeholder/fictional content (name, role, bio, career history, skills, projects) with real data from the provided resume. Two real projects (Exxpense, Uptra) replaced the five fictional ones, including real cover images and live-site links (opening in a new tab).

**Profile photo** — Wired into the hero via `next/image`, with a soft all-sides mask-fade into the page background and a dark-palette-only vignette overlay so the (bright, daylight) photo doesn't clash with the dark "Dusk" theme.

**Custom cursor field mode** — Hovering a text input now grows the cursor circle (matching link-hover) with an "I" glyph instead of hiding the cursor entirely.

**Various layout fixes** — Hero name font size/wrapping, project-detail "All projects" link alignment (now inline with the category/year row, matching the listing page's "Back to home" pattern), external links get `target="_blank" rel="noopener noreferrer"`.

**Code cleanup** — Extracted the one repeated easing curve (`cubic-bezier(0.22, 0.61, 0.36, 1)`, previously copy-pasted in 4 places) into `lib/motion.ts` (JS/TSX) and a `--ease-out` custom property (CSS), reducing that to two canonical definitions that must stay in sync (documented in both places). Audited the full `src/` tree for dead code, unused exports and lint issues — found none; `tsc`, `eslint` and `next build` are all clean.

**Beyond Code page** (`/beyond-code`) — Ported from the design chat's concept (a page for "who I am outside of work") into the real design system: `BeyondHero` (giant Quicksand heading + drifting-circle background, replacing the rigid Home crosshairs), `BeyondChannels` (a large primary card for the main YouTube channel, a smaller secondary card for Shorts — same `useSectionReveal` scroll-reveal as every other section), and `BeyondSocials` (accent-hairline panel grid, currently just X). Nav gets a "Beyond Code" item between Projects and Contact; route transitions treat it like Home (full accent→ink wipe, not the simplified Projects-only one); it's in the sitemap and participates in the hard-load intro veil like every other route. Scoped down from the original design concept per instruction: no Discord, no Instagram gallery, no interests grid — all real per-platform data (URLs, stats, cover images) is still `#`/empty and marked `// TODO` in `content/beyondCode.ts`, since inventing specific numbers/handles for a real person's public page isn't something to guess at.

**Data wiring pass (started with Hero)** — Going through the site's remaining placeholders one section at a time. Hero: `HERO.bio` rewritten in Prasad's own voice (drawn from the already-real `SITE.description`/`ABOUT.paragraphs`, no new facts invented) and `HERO.ctaHref` now points at `/#contact` instead of `"#"`. Résumé: Read.cv shut down, so that social-link slot now points at a live Uptra-built résumé (`https://uptra.vercel.app/r/lpZjUBXl8fY`), renamed from "Read.cv" to "Résumé"; `SITE.resumeHref` (the Work section's "Résumé" button) now points at the same link, resolving that TODO too since it was the identical gap. Beyond Code destinations also got their real URLs, titles and body copy filled in directly.

**Live social data** (`src/lib/social.ts`) — The Beyond Code YouTube cards (main channel `@IGLxFlash`, Shorts `@RyokuuX`) now pull their cover image and stats (subscribers, videos, "since" year) live from the YouTube Data API v3, instead of needing a manual edit every time the channel art or subscriber count changes. One file, divided by platform, with a `getLiveDestinations()` aggregator that `beyond-code/page.tsx` (now an async Server Component) calls once and passes down as props — see the file's own doc comment for the full contract. Two things worth knowing:
- **Performance**: every fetch runs server-side with `next: { revalidate: 86400 }` (24h) — the page stays statically prerendered and a visitor never waits on or triggers a live API call; Next just refreshes the cached result in the background once a day.
- **Resilience**: no API key, a failed fetch, or a quota limit all just fall back to whatever's already in `content/beyondCode.ts` per destination — never breaks the build or blanks out a working channel because another one failed.
- **X/Twitter has no live source** — its API removed free-tier read access to profile data in 2023 (reading avatar/banner/follower count now requires a paid "Basic" tier, ~$100+/mo). `fetchXProfile` exists as a same-shaped stub for whenever that changes; the X card stays manually edited in `content/beyondCode.ts` for now.
- Needs `YOUTUBE_API_KEY` in `.env.local` to actually go live (see `.env.example` and the setup steps below) — without it, the page still works fine on the static fallback content.

**Security review** — Audited for XSS vectors, tabnabbing, open redirects, hardcoded secrets, and dependency CVEs (`npm audit`: 0 vulnerabilities). No issues found.

**Contact form** (`src/lib/email.ts` + `src/app/api/contact/route.ts`) — Actually sends now, via [Resend](https://resend.com): the form POSTs JSON to `/api/contact`, which validates server-side then calls `sendContactEmail`. Same one-file-per-concern shape as `social.ts` — `email.ts` only knows how to send, the route only knows what counts as a valid request, `Contact.tsx` only knows about UI state (`idle`/`sending`/`sent`/`error`, with the submit button and all three fields disabled while a send is in flight). A few things worth knowing:
- **Anti-spam, no captcha or external service**: a honeypot field (visually off-screen — not `display:none`/`visibility:hidden`, which is specifically what unsophisticated bots check for — real users never reach it, most bots fill every field they find) and a minimum-time-since-page-load check (rejects a submission faster than a human could plausibly type one). Both silently report success without sending, so a bot gets no signal to adapt. Proportionate for a personal portfolio; if real spam shows up later, a proper rate limiter (e.g. Upstash) or Turnstile/hCaptcha is the next step — not worth building ahead of an actual need.
- **Delivery**: plain-text email (not HTML — sidesteps ever needing to HTML-escape visitor input), sent to `CONTACT_TO_EMAIL` (defaults to `SITE.email`) from `CONTACT_FROM_EMAIL`, with the visitor's own address set as `reply_to` so hitting Reply in your inbox goes straight back to them.
- **Works with zero setup**: with no `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` unset falls back to Resend's shared `onboarding@resend.dev` test sender (works before any domain is verified), and with no key at all the form still degrades gracefully — it shows a clear "email isn't configured yet, reach out directly instead" message rather than pretending to have sent something.
- Server-side validation independent of the browser: required fields, a real email-shaped `email`, and length caps (name/email 200 chars, message 5000) — never trusts the client alone.

**SEO groundwork** — Added `metadataBase`, Open Graph and Twitter Card tags, and a `Person` JSON-LD block (`layout.tsx`) so search engines and link previews can identify the site as specifically about `SITE.name`. Added `src/app/robots.ts` and `src/app/sitemap.ts` (Next.js App Router convention routes — generate `/robots.txt` and `/sitemap.xml` automatically from `PROJECTS`). Added per-page canonical URLs + Open Graph to `/projects` and each `/projects/[slug]`. All of this reads from a new `SITE.url` field (currently `https://prasadtawde.dev`, from the resume) — **update that once the site is actually deployed**, since none of it does anything until then.

**Console-warning cleanup + a project-detail refactor** — Traced and fixed every warning the dev console was actually printing (verified live against the running dev server's log, not guessed):
- `Image with src "..." has "fill" and parent element with invalid "position"` — the Beyond Code cover images (`BeyondChannels.tsx`) sit inside a rotating wrapper `<div>` (the hover-tilt effect) that never got `relative` itself; it inherited positioning visually from its own grandparent, but `next/image`'s `fill` mode requires the *direct* parent to be positioned. Added `relative` to that wrapper in both the primary and secondary card — no visual change, just a correct positioning context.
- `Image with src "..." was detected as the Largest Contentful Paint (LCP)` — none of the actual above-the-fold images (`ProjectDetail`'s hero shot, the Beyond Code primary channel cover, the first featured/listed project card) had `priority`, so the browser had no hint which to preload. `ProjectCard` now takes an optional `priority` prop, set on the first card in both `ProjectsPreview` and `/projects`.
- `Detected scroll-behavior: smooth on the <html> element` — added `data-scroll-behavior="smooth"` to `<html>` (`layout.tsx`) per Next's own suggested fix, so route transitions don't fight the CSS smooth-scroll during scroll restoration.

Also split `ProjectDetail.tsx` (was 224 lines, one big component): the seven near-identical "label + body" row blocks are now one small `DetailRow` helper, and the click-to-spin-then-open-in-new-tab logic for the Links row moved into `src/hooks/useSpinLinkClick.ts`, matching the existing `hooks/` convention — same DOM/classes, so nothing visual changed. Added a `discord` destination to `content/beyondCode.ts` (own card in the Beyond Code social grid, same formatting as the `x` one) with `href: "#"` and empty `meta` until a real invite link and member count exist.

## What's left to do

Nothing is broken — these are content/polish items, mostly ones already flagged during the resume import and deliberately deferred:

- [x] ~~Contact blurb~~ — now echoes "Open for work" instead of committing to freelance/contract framing (matches `SITE.availableFrom`).
- [x] ~~About paragraphs & principles~~ — reviewed, approved as-is.
- [x] ~~Project case-study depth~~ — `process` and `results` for both Exxpense and Uptra are filled in with real per-project detail (`content/projects.ts`), not placeholder strings.
- [ ] **Project years** — both projects are dated 2026 per instruction; confirm this is accurate per-project if it matters later.
- [ ] **`detailImage` per project** — both projects currently reuse their card `image` as the detail-page hero shot too; add a separate, larger screenshot per project if desired.
- [ ] **Work history density** — all 4 roles are separate rows under the same company name (a full promotion trail); consider condensing the two Junior titles into one row if the repetition reads oddly.
- [ ] **Per-role tech stack tags** (`content/work.ts`) — inferred from each role's description (the resume only lists one overall skill set, not per-role); spot-check these.
- [ ] **Asset size** — `public/profile.png` is ~1.6MB. `next/image` serves optimized/resized versions at request time regardless, so this doesn't hurt production performance, but a pre-compressed source would shrink the repo/deploy footprint.
- [x] ~~Phone number~~ — intentionally left off the site.
- [ ] **Deploy the site** — `prasadtawde.dev` is registered and resolving, but currently serves a generic "under maintenance" placeholder, not this codebase (checked live 2026-09-11). Needs an actual deploy (Vercel is the zero-config fit for Next.js) pointed at that domain before anything SEO-related below can do anything.
- [ ] **Search Console / Bing Webmaster Tools** — free indexing tools, separate from deploying: after the real site is live at `prasadtawde.dev`, register the domain in [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters), verify ownership, and submit `/sitemap.xml` (already auto-generated by `src/app/sitemap.ts`) so both engines crawl/index it faster instead of waiting to discover it on their own.
- [ ] **Backlinks** — links *from* other sites pointing *to* `prasadtawde.dev`; Google treats these as evidence the domain really belongs to this person. Checked what's verifiable publicly right now (2026-09-11):
  - ✅ GitHub (`github.com/PrasadTawde`) — profile's "website" field is already set to `https://prasadtawde.dev`.
  - ❓ LinkedIn (`linkedin.com/in/prasad-tawde-07`) — couldn't check automatically, LinkedIn blocks unauthenticated fetches; confirm the "Contact info" panel has the website link.
  - Since the domain is still showing the maintenance placeholder (see "Deploy the site" above), none of these backlinks are pointing at real content yet — they'll start counting for SEO the moment the real deploy goes live, with no further action needed on the backlink side.
  - Any other places you've already added the link (Discord bio, other communities, a README, etc.) — list them and they can be spot-checked the same way.
- [x] ~~`YOUTUBE_API_KEY` not set yet~~ — configured; Beyond Code is showing real channel art/stats.
- [x] ~~`RESEND_API_KEY` not set yet~~ — a key is present in `.env`. `CONTACT_FROM_EMAIL`/`CONTACT_TO_EMAIL` are still unset, so it's sending from Resend's shared `onboarding@resend.dev` test sender rather than a verified domain — worth one real test submission to confirm delivery end-to-end, and worth adding a verified domain for `CONTACT_FROM_EMAIL` when there's one to point at.
- [ ] **Discord invite + member count** (`content/beyondCode.ts` → the `discord` destination) — card added with real title/body copy, but `cta.href` is still `"#"` and `meta` is empty; drop in the real invite link and a member count once you have them.
- [ ] **A proper Open Graph image** — currently reusing `profile.png` (a portrait crop) as the social-preview image; a purpose-made 1200×630 landscape graphic would look better when the link is shared on social media/Slack/etc.

## Getting a YouTube Data API v3 key

Needed for the live Beyond Code data in `src/lib/social.ts`. Free, no billing account required, about 5 minutes:

1. Go to [console.cloud.google.com](https://console.cloud.google.com/) and sign in with the Google account tied to (or just any account with access to) the YouTube channels.
2. Top-left project dropdown → **New Project** → give it any name (e.g. "portfolio-site") → **Create**. (Or reuse an existing project if you already have one.)
3. Left sidebar (or the search bar) → **APIs & Services → Library** → search **"YouTube Data API v3"** → open it → **Enable**.
4. **APIs & Services → Credentials** → **+ Create Credentials → API key**. A key appears immediately — copy it.
5. Recommended: click the new key to edit it → under **API restrictions** choose **Restrict key** → check only **YouTube Data API v3** → **Save**. (No need to restrict by IP/referrer — this runs server-side on Vercel's dynamic IPs, so scope-restriction is the meaningful protection here.)
6. In the project root, copy `.env.example` to `.env.local` and paste the key in:
   ```
   YOUTUBE_API_KEY=your-key-here
   ```
7. Restart the dev server (`npm run dev`) — `.env.local` is only read on startup. The Beyond Code cards should now show your real channel art/stats on the next request (or immediately in dev; in production it fills in within the 24h revalidate window after deploy).

The free quota is 10,000 units/day; each channel lookup costs 1 unit, so even far more frequent revalidation than the current 24h would stay nowhere near the limit.

## Notes for future editors

- Palette state lives in `localStorage` under `ar.palette` (index 0–4); `lib/palettes.ts` exports `DARK_INDEX` for any code that needs to special-case the dark theme (see `Hero.tsx`'s vignette).
- The intro-loader and route-transition systems are independent: the loader only ever plays once per hard page load; the route wipe plays on every qualifying in-app navigation. Both derive their label text from the same `lib/pageLabel.ts`.
- `ImagePlaceholder` is intentionally still used as a fallback wherever a `Project.image`/`detailImage` isn't set — it's not dead code.
- `getLiveDestinations` (in `social.ts`) uses each destination's own `cta.href` to find the YouTube handle to fetch — it doesn't take a separately-maintained channel-ID list. Change a channel's URL in `content/beyondCode.ts` and the live fetch follows it automatically; no second place to update.
- When a live fetch succeeds, it overwrites `image` with the channel's **banner** (not the avatar) — a wide banner fits the primary card's 16:10 frame and reads as "channel art." If the portrait Shorts card ever looks oddly cropped with a wide banner, swap `profile.bannerUrl` for `profile.avatarUrl` for that one destination in `getLiveDestinations` — the service already fetches both, it's a one-line change.
- Each channel card also shows a small circular avatar badge (bottom-left of the cover image) from `profile.avatarUrl` — a sibling of the rotating cover-image wrapper in `BeyondChannels.tsx`, not a child of it, so it stays level while the banner tilts on hover.
- The Contact form's honeypot field and timing check are cheap by design, not bulletproof — they're sized for "stop the automated spam a public form attracts," not "withstand targeted abuse." If that assumption stops holding, upgrade `src/app/api/contact/route.ts`, not `Contact.tsx` — validation is deliberately kept out of the component.
