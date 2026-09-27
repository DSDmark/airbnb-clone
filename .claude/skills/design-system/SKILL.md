---
name: design-system
description: The clone's design tokens, button variants, overlay primitives and section patterns. Read before adding or restyling any UI so new work stays consistent and measured.
---

# Design system

## Tokens (`src/app/globals.css`)

- **Colour:** `--c-text #222`, `--c-text-secondary #6c6c6c`, `--c-text-muted #8c8c8c`,
  `--c-border #ddd`, `--c-border-soft #ebebeb`, `--c-border-input #8c8c8c`,
  `--c-surface-raised #f2f2f2` (grey buttons) → hover `#ebebeb`,
  `--c-surface-hover #f7f7f7`, `--c-brand #ff385c`, `--gradient-primary`.
- **Elevation:** `--shadow-card` (booking card), `--shadow-floating` (promo, map
  pill), `--shadow-raised` (host card, map controls), `--shadow-modal`,
  `--shadow-chip`, `--shadow-search`.
- **Motion:** `--ease-standard` (hover/press), `--ease-sheet` + `--duration-sheet`
  (overlays in), `--ease-overlay` (scrims), `--focus-ring`.
- **Layout:** content max-width `--page-max-width` 1120 px with
  `--page-gutter` 24/40/80 px at 0/744/1128 px; header uses `--header-gutter`
  24/32/48 at 0/950/1440 px. `html` reserves the scrollbar gutter.

Typography: Airbnb Cereal VF (CDN). Sizes used: 26/30 (h1, 500), 22/26
(section h2, 500, −0.44px), 18/24 (sub-heads, 500), 16/20–24 (body), 14/18–20,
12/16, 10/12 caps (booking labels).

## Buttons (`src/components/ui/button.module.css`)

`secondary` (grey 48px pill-ish, 12px radius) · `chip` (32px, 8px radius) ·
`ghost` (underlined label, #f7f7f7 hover plate) · `link` (inline underline) ·
`primary` (via `GradientButton`: gradient + pointer-tracking highlight) ·
`circle` (40px header icons). Add `data-press` for the 1px press-in.

## Overlays

- `ui/Modal` — sizes `small` 568 / `medium` 780 / `large` 720×800, optional
  `closeOnRight`, `floatingHeader`. Handles portal, scrim, sheet animation,
  focus trap/restore, Escape (stacked), scroll lock.
- `gallery/PhotoTour` + `gallery/Lightbox` — state lives in the URL via
  `GalleryProvider` (`openTour`, `openPhoto`, `showPhoto`, `closePhoto`).
- Popovers (date picker, guests, user menu) close on outside pointer-down and
  Escape and keep focus inside while open.

## Section pattern

`listing/section.module.css`: `.section` = hairline top + 48px padding,
`.heading` = 22/26 500. Two-column area is 7/12 content, 1/12 gap, 4/12
sticky booking column (`top: 112px`).

## Adding UI checklist

1. Content → `Listing` type + `src/data/listing.ts`.
2. Measure the reference (`measure-page`), reuse tokens/variants.
3. Keyboard + screen-reader path, focus ring, reduced motion.
4. Visual diff, `npm run check`.
