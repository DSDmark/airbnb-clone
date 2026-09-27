---
name: measure-page
description: Measure a rendered page precisely — element boxes, fonts, colours, radii, shadows, transitions and overlay animation timelines — so UI can be rebuilt from numbers instead of eyeballing. Use when implementing or correcting a section, or when a visual diff shows an offset you need to explain.
---

# Measure a page

Parity comes from numbers. Collect them, then write CSS.

## Static census

```bash
npm run measure -- --url http://localhost:3100/ --out artifacts/census-clone.json          # whole page
npm run measure -- --url http://localhost:3100/ --out artifacts/census-main.json --root main
```

`scripts/lib/census.mjs` records, per visible element: text (first 80 chars),
page-space box `[x, y, w, h]`, `font-size/line-height weight`, letter-spacing,
colour, decoration; for controls also padding, radius, background (incl.
gradients), border, shadow and transition; image boxes, `object-fit`, `src`;
and every surface with a shadow or border.

The reference cannot be automated (bot-protected — see `reference-capture`);
its census arrives in `reference/reference-content.json` → `views.census`,
produced by the human-run snippet.

### Reading it

- Compare the *same text run* on both sides: `y` gives vertical rhythm,
  `x` gives gutters, width differences of a few px on identical text usually
  mean letter-spacing, weight or padding.
- Inline spans report their font *content area* (taller than the line box);
  convert with `lineTop = y + (rectHeight - lineHeight) / 2` before comparing
  with a block element.
- Transform presses: a `matrix(0.99, 0, 0, 0.958…)` on a 208×48 button means
  "shrink by 1 px per side", not a fixed `scale(0.96)`.

## Motion

`recordMotion(ms)` (same module) samples every dialog each animation frame
and keeps only frames that changed. Inject it, trigger the interaction, then
read back the frames:

```js
import { recordMotion } from "../scripts/lib/census.mjs";
const recording = page.evaluate(`(${recordMotion.toString()})(1200)`);
await page.getByRole("button", { name: "Show all photos" }).click();
console.log(await recording);
```

Derive: duration (first→last changing frame), distance (translate at t0),
curve (compare with computed `animation-timing-function`), and ordering when
several layers animate (scrim vs sheet).

Record anything new in `docs/fidelity-notes.md` so the next change reuses it.
