<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Airbnb listing clone — agent guide

Pixel- and behaviour-faithful clone of one Airbnb listing page (desktop only)
with its photo tour and lightbox. Next.js 16 App Router, React 19, TypeScript,
CSS Modules. No backend: content is a typed module, wishlist state lives in
`localStorage`.

## Commands

| Task | Command |
| --- | --- |
| Dev server (port 3100) | `npm run dev` |
| Type check / lint | `npm run typecheck` · `npm run lint` |
| E2E + axe (starts dev server) | `npm run test:e2e` (set `PW_CHROMIUM_PATH` to reuse a local Chromium) |
| Everything above | `npm run check` |
| Screenshot the clone | `npm run visual:capture` |
| Diff against reference captures | `npm run visual:diff` |
| Measure a page | `npm run measure -- --url <url> --out artifacts/x.json` |
| Build the submission zip | `npm run package` |

## Map

```
src/app/                 layout (metadata, fonts), page → <ListingPage>
src/data/listing.ts      ALL page content (typed by src/lib/types.ts)
src/components/
  listing/               page sections + ListingPage composition + ListingActions (save/share/reviews)
  gallery/               GalleryProvider (URL-backed state), PhotoTour, Lightbox
  booking/               BookingProvider, sidebar card, date picker, guests popover
  reviews/ location/ host/ header/ footer/
  ui/                    Modal, buttons (button.module.css), GradientButton, Stars, PressFeedback
  icons/                 registry.ts (path data) + Icon; brand.tsx for multi-part SVGs
src/hooks/               focus trap, escape stack, scroll lock, presence (exit animations)…
src/lib/                 types, formatting, dates, photo-tour layout, CDN image loader
scripts/                 capture / visual-diff / measure / package tooling
tests/e2e/               Playwright behaviour + axe accessibility specs
reference/               how to capture the (bot-protected) reference; captures land here
```

## Rules

- **Content only in `src/data/listing.ts`.** Components never hard-code
  listing text; if the reference shows something new, extend `Listing` first.
- **Styling:** CSS Modules + the tokens in `src/app/globals.css`
  (`--c-*`, `--shadow-*`, `--ease-*`, gutters). No Tailwind, no UI kits, no
  inline style objects except dynamic values. Reuse `ui/button.module.css`
  variants before inventing a button.
- **Numbers come from measurement,** not taste: every size/colour/timing should
  trace to a census or screenshot of the reference. Leave a comment when a
  value intentionally deviates (e.g. contrast fixes).
- **Overlays:** use `Modal` or the gallery components. Every overlay must trap
  focus (`useFocusTrap`), close on Escape via `useEscapeStack`, lock scroll
  (`useScrollLock`), restore focus to its opener, and animate in/out with the
  sheet timings (400 ms `--ease-sheet` in, 150 ms out).
- **Accessibility is part of parity:** semantic landmarks/headings, labelled
  controls, visible `:focus-visible` rings, keyboard paths for everything a
  mouse can do. `npm run test:e2e` includes axe — keep it at zero
  serious/critical issues.
- **Images:** listing photos are CDN URLs rendered through `next/image`; the
  custom loader in `src/lib/image-loader.ts` maps widths to the CDN's allowed
  sizes. Don't download or commit third-party photos.
- **Originality:** never copy markup, class names, CSS or JS from the reference
  or from other public clones of this assignment. Measure, then write it.
  Icons/fonts/photos are assets and may be reused.
- **Don't automate around the reference's bot protection.** Use
  `reference/README.md` (human capture) instead.

## Definition of done

`npm run check` passes, the change was verified in a browser (screenshot or
visual diff for visual work), and anything that could not be matched is noted
in the final summary rather than silently approximated.
