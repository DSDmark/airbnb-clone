---
name: visual-diff
description: Screenshot the clone at fixed scroll offsets and overlay states, pixel-diff against reference captures, and interpret the results. Use to verify any visual change or to hunt the biggest remaining mismatch.
---

# Visual diff loop

```bash
npm run dev                      # port 3100, keep it running
npm run visual:capture           # → artifacts/clone/page-NN-<y>.png + state-*.png
npm run visual:diff              # → artifacts/diff/*-diff.png, *-blend.png + % table
```

Reference captures must share file names and viewport (1440×900); see
`reference/README.md`. The diff crops to the smaller image when sizes differ.

## Reading the output

- **% table** — rank by it, but don't chase 0 %: photos, map tiles and
  relative dates ("6 days ago") are live noise. Well-aligned views sit around
  0.5 % at 1440 px.
- **`*-blend.png`** is the most useful artefact: both images at 50 %.
  Crisp text = aligned. Doubled glyphs = offset (measure the gap). A ghost
  block = element missing on one side. Soft edges on a card = radius/shadow
  mismatch.
- **`*-diff.png`** (pixelmatch) highlights changed pixels in red; good for
  spotting colour-only differences such as a wrong grey.

## Typical fixes by symptom

| Symptom | Usually |
| --- | --- |
| Everything below a block shifted by N px | that block's height (padding, a stray gap, an inline strut) |
| Same text, different width | weight (400 vs 500), letter-spacing, or a thin vs normal space (` ` in times) |
| Line wraps differ | container max-width off by a few px |
| Whole page 7–8 px sideways | scrollbar gutter (`scrollbar-gutter: stable` on `html`) |
| Header 8 px taller | child margin collapsing through a parent — use padding |

After fixing, re-run capture + diff and include the before/after % in your summary.
