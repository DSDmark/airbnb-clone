# Airbnb listing clone

A desktop clone of an Airbnb listing page with its two overlay views — the
**photo tour** and the **lightbox** — built to match the reference visually
and behaviourally. Next.js 16 (App Router) · React 19 · TypeScript · CSS
Modules. No backend: listing content is a typed module, wishlist state lives
in `localStorage`.

> **Content status:** the reference is protected by Vercel BotID and cannot be
> loaded by automation, so the page currently renders a *calibration listing*
> (Airbnb's "Mirashya A102": same host, building and template). Swapping in the
> reference listing's content is a data-only change — see
> [Reference access](#reference-access).

## Quick start

```bash
npm install
npm run dev              # http://localhost:3100
```

| Command | What it does |
| --- | --- |
| `npm run build && npm start` | Production build (the page is statically prerendered) |
| `npm run check` | Type check + ESLint + Playwright E2E & axe accessibility suite |
| `npm run test:e2e` | E2E only (`npx playwright install chromium` once, or set `PW_CHROMIUM_PATH`) |
| `npm run visual:capture` / `visual:diff` | Screenshot the clone / pixel-diff it against `reference/screens` |
| `npm run measure -- --url <url>` | Computed-style census of a page (boxes, fonts, colours, shadows) |
| `npm run package` | Build `submission/airbnb-clone.zip` |

## What's implemented

**Listing page** — header with search pill and account menu; title with Share
/ Save; 5-photo hero mosaic (hover dim, 1 px press, keyboard focus ring);
overview with Guest-favourite badge; host row; highlights; description with
"About this space" dialog; where you'll sleep; amenities with the full
grouped dialog; sticky booking card (date-range calendar with full keyboard
grid navigation, guests popover, pointer-tracking gradient CTA, priced totals);
promo card; reviews (score hero, category breakdown, "guest reviews mention"
carousel, review grid, all-reviews dialog with sort + search); map with Airbnb
controls; host card with co-hosts; things to know (+ dialogs); SEO links;
footer; sticky subnav that fades in after the photos and grows a booking CTA.

**Photo tour** — full-screen sheet (slides up 100 px over 400 ms), room tiles
that smooth-scroll to their section, rooms laid out in the full/half/half
rhythm, Share/Save, Back arrow.

**Lightbox** — opened from any tour photo; ←/→ keys and arrow buttons,
counter, captions, cross-fade between photos, instant low-res preview,
Share/Save, live-region announcements.

**Behaviour shared by all overlays** — URL-backed state
(`?modal=PHOTO_TOUR_SCROLLABLE&modalItem=<id>`, so Back closes them and links
deep-link into them), focus moved in and trapped, Escape closes only the
top-most layer, focus restored to the opener (the lightbox returns it to the
last photo viewed), scroll lock without layout shift, `prefers-reduced-motion`.

## Structure

```
src/app/                 layout (metadata, font), page
src/data/listing.ts      all page content (shape = src/lib/types.ts)
src/components/
  listing/  gallery/  booking/  reviews/  location/  host/  header/  footer/
  ui/                    Modal, button variants, GradientButton, Stars, PressFeedback
  icons/                 icon registry (path data) + brand SVGs
src/hooks/               useFocusTrap, useEscapeStack, useScrollLock, usePresence, useInView, useIsClient
src/lib/                 types, format, dates, photo-tour layout, CDN image loader
tests/e2e/               Playwright behaviour + axe specs (15 tests)
scripts/                 capture, visual-diff, measure, package
docs/                    architecture diagram, fidelity notes
reference/               reference capture kit (snippet + checklist)
```

Key decisions:
- **Measured, not eyeballed.** Every size, colour, radius, shadow and timing
  came from a computed-style census or frame-by-frame animation recording of
  the template; the clone is within ±1–2 px per section at 1440 px
  ([fidelity notes](docs/fidelity-notes.md)).
- **CSS Modules + tokens** (`globals.css`) instead of a utility framework —
  exact values stay readable and reviewable.
- **Assets, not code, are reused:** listing photos and avatars stream from
  Airbnb's CDN through a custom `next/image` loader that maps widths to the
  CDN's allowed sizes; icons are Airbnb's glyph path data; the Cereal font is
  loaded from Airbnb's CDN. No markup/CSS/JS was taken from the reference.

## AI-assisted workflow

Built with Claude Code. The configuration is part of the submission:

- `AGENTS.md` — tool-agnostic project rules (also read by Codex/Cursor);
  `CLAUDE.md` imports it and adds the Claude workflow.
- `.claude/agents/` — **fidelity-reviewer** (capture + pixel diff + cause),
  **motion-inspector** (frame-level animation checks), **a11y-auditor**
  (axe + scripted keyboard pass), **code-reviewer** (conventions, hooks,
  originality). All read-only reviewers.
- `.claude/skills/` — **measure-page**, **visual-diff**, **design-system**,
  **reference-capture**.
- `.claude/settings.json` — permission allow-list, a deny on `git push` (the
  brief forbids public repos), and a PostToolUse hook that ESLints every edited
  TS/TSX file and feeds problems straight back to the agent.
- [`PROMPTS.md`](PROMPTS.md) — the prompt log for this build.

## Reference access

The reference answers automated browsers with "This page could not be
verified" (Vercel BotID). Rather than evading that, capture is done by a person:

1. Open the reference, paste [`reference/capture-snippet.js`](reference/capture-snippet.js)
   into DevTools → `reference-content.json` (text per view, image URLs,
   photo-tour rooms, measurements — no markup).
2. Save the screenshots listed in [`reference/README.md`](reference/README.md)
   into `reference/screens/`.
3. Update `src/data/listing.ts`, then `npm run visual:capture && npm run visual:diff`.

## Deliverables

- Source (this repo) · `docs/architecture/architecture.png` + `.pdf`
- AI configs: `AGENTS.md`, `CLAUDE.md`, `.claude/`
- Prompt log: `PROMPTS.md`
