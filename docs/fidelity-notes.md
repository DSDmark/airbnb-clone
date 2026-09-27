# Fidelity notes

How the clone was matched, the measured spec it follows, and where it knowingly
differs.

## Method

1. **Reference access.** The reference is gated by Vercel BotID, which refuses
   automated browsers. That was treated as a boundary, not a puzzle: no
   evasion. See `reference/README.md` for the human-in-the-loop capture.
2. **Template proxy.** The reference is a copy of Airbnb's listing page (same
   title format, same sections as its screenshots in the brief). A live listing
   from the same host and building — *Mirashya A102* — renders the identical
   template and *can* be automated, so it served as the measuring target.
   Its content is the calibration data in `src/data/listing.ts`.
3. **Measure → build → diff.** Each section was built from a computed-style
   census (`scripts/lib/census.mjs`), rendered, then pixel-diffed against the
   template at 1440×900 until the 50/50 blend was crisp.

### Result (1440×900, clone vs template, pixelmatch)

| Scroll y | View | Diff |
| --- | --- | --- |
| 0 | header, title, hero, overview, booking card | 0.94 % |
| 800 | host row, highlights, description | 0.37 % |
| 1600 | sleeping, amenities | 0.43 % |
| 2400 | reviews summary, categories, mention chips | 1.42 % |
| 3200 | reviews grid, map | 1.86 % |
| 4000 | map, neighbourhood | 1.10 % |
| 4800 | meet your host | 1.54 % |
| 5600 | explore links | 0.19 % |
| 6400 | footer | 1.15 % |

Residual diff is mostly live data (relative review dates, map tiles, image
decoding); element positions agree to ±1–2 px.

## Spec

### Layout
- Content column max 1120 px; gutters 24 / 40 / 80 px at 0 / 744 / 1128 px.
  Header gutters 24 / 32 / 48 px at 0 / 950 / 1440 px. `html` reserves the
  scrollbar gutter (`scrollbar-gutter: stable`), exactly like the reference.
- Header 96 px (8 px top + 80 px row + hairline `#e7e7e7`), not sticky.
- Hero mosaic: 2 : 1, `max-height: calc(60vh − 64px)`, 12 px radius; left
  half one photo, right 2×2 with 8 px gutters (lower tiles give up 8 px).
- Two columns: 58.33 % content / 8.33 % gap / 33.33 % booking column, sticky
  at `top: 112px` (promo card + booking card + report link).
- Sticky subnav: fixed, 80 px, appears once the hero leaves the viewport;
  booking CTA inside it appears once the booking card scrolls beneath it.

### Type (Airbnb Cereal VF)
h1 26/30 500 · section h2 22/26 500 (−0.44 px) · sub-heads 18/24 500 ·
body 16/20–24 · meta 14/18–20 · captions 12/16 · booking labels 10/12 700 caps.
Reviews hero score 100/100 500 (−2 px). Host name 31.5/36 600.

### Colour
`#222` text, `#6c6c6c` secondary, `#ddd` hairlines, `#ebebeb` soft rules,
`#f2f2f2` grey buttons (hover `#ebebeb`), `#f7f7f7` hover plates/footer,
brand gradient `#e61e4d → #e31c5f → #d70466`.

### Motion
| Interaction | Spec |
| --- | --- |
| Modal / photo tour in | translateY 100→0 px, 400 ms `cubic-bezier(.1,.9,.2,1)`; opacity 0→1 75 ms linear |
| Modal / photo tour out | translateY 0→50 px, 150 ms `cubic-bezier(.4,0,1,1)`; fade 75 ms after 75 ms |
| Scrim | `#222` @ 0.4; 400 ms in / 250 ms out, spring-like `linear()` curve |
| Lightbox | fade in 200 ms; photo change cross-fades 200 ms; low-res preview shows instantly |
| Button press | shrinks by exactly 1 px per side (per-element scale), 250 ms |
| Grey button hover | `#f2f2f2 → #ebebeb`, 300 ms `cubic-bezier(.2,0,0,1)` |
| Gradient CTA hover | radial highlight fades in over 1.25 s and follows the pointer |
| Hero photo hover | 15 % dark overlay |
| Subnav | 100 ms fade; link hover shows a 4 px underline bar |

## Known deviations / open questions

| Area | Clone | Why |
| --- | --- | --- |
| Lightbox background | White, faint disabled ‹, outlined › | Matches the reference screenshot in the brief (live Airbnb uses black). Colours are CSS variables on `.root` in `Lightbox.module.css` — one-line swap if the reference turns out dark. |
| Photo-tour grid | 7 room tiles per row, ⅓ / ⅔ split (live Airbnb) | The brief's thumbnail hints at 8 per row; confirm with `reference/screens/state-photo-tour.png`. |
| Mention-chip counts | `#767676` | Reference `#8c8c8c` fails WCAG AA (3.4 : 1). |
| Map | Google's keyless embed with Airbnb chrome on top; not draggable | Same cartography as the reference without an API key; drag is disabled so the home marker stays on the listing. Zoom buttons swap pre-rendered frames. |
| Header search | Static pill (hover states only) | The expanded search panel is outside the three required views. |
| Prices | Placeholder nightly rate | No pricing API; the card shows totals once dates are picked. |
| Content | Calibration listing (Mirashya A102) | Swap in the reference listing's content from `reference/reference-content.json`. |
