# Reference capture

The reference (<https://airbnb-clone-umber-two.vercel.app>) is served through
**Vercel BotID**: automated/headless browsers are refused ("This page could not
be verified"). That gate is intentional, so this project does **not** try to
evade it. Reference material is captured by a person in a normal browser, and
the agent works from those captures.

## 1. Content + measurements (2 minutes)

1. Open the reference in Chrome at a **1440 px wide** window.
2. DevTools → Console → paste [`capture-snippet.js`](./capture-snippet.js) → Enter.
3. It opens the photo tour, a photo, and the description / amenities / reviews
   dialogs by itself, then downloads `reference-content.json`.
4. Move that file into this folder.

It records visible text, image URLs and computed-style measurements only — no
markup, class names or scripts (the brief forbids lifting the reference's code).

## 2. Screenshots for pixel diffing

Save these into `reference/screens/` at a 1440×900 viewport (DevTools device
toolbar → Responsive → 1440 × 900), using exactly these names so
`npm run visual:diff` can pair them with `npm run visual:capture` output:

| File | State |
| --- | --- |
| `page-00-0.png` … `page-08-6400.png` | Page scrolled to 0, 800, 1600 … 6400 px |
| `state-photo-tour.png` | After clicking **Show all photos** |
| `state-lightbox.png` | After clicking the first photo in the tour |
| `state-lightbox-next.png` | After pressing → once |
| `state-modal-description.png` | Description **Show more** dialog |
| `state-modal-amenities.png` | **Show all N amenities** dialog |
| `state-modal-reviews.png` | **Show all N reviews** dialog |

A screen recording of opening/closing the tour and the lightbox (and arrowing
through photos) is also useful for matching timing — note the approximate
durations in `notes.md`.

## Calibration data

Until `reference-content.json` exists, `src/data/listing.ts` holds the public
Airbnb listing *Mirashya A102* — same host, building and page template as the
reference listing. It let the layout be measured and diffed against a live
page that automation *is* allowed to load; the clone matches it to within
~1–2 px per section at 1440 px.
