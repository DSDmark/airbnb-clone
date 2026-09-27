---
name: reference-capture
description: How reference material for this clone is obtained and turned into data. The reference site is protected by Vercel BotID; use this whenever you need reference content, screenshots or measurements, and before any attempt to load the reference with automation.
---

# Reference capture

## Ground rules

- <https://airbnb-clone-umber-two.vercel.app> serves its content only to
  browsers that pass Vercel BotID. Headless/automated browsers get
  "This page could not be verified". **Do not try to defeat that** (stealth
  flags, UA spoofing, replaying tokens, etc.). Stop and use the human path.
- The brief forbids lifting the reference's code. Capture *content and
  measurements*, never markup, class names, CSS or scripts. The same applies
  to other candidates' public clones — don't open them for code.

## Human path

1. Ask the user to follow `reference/README.md`:
   - run `reference/capture-snippet.js` in DevTools on the reference →
     `reference/reference-content.json` (text per view, image URLs in order,
     photo-tour rooms with photos, style census);
   - save the listed screenshots into `reference/screens/`.
2. Map the JSON onto the `Listing` type in `src/data/listing.ts`:
   - `views.page.text` → title, property type, capacity, highlights,
     description preview, sleeping, amenities preview, reviews summary, host,
     policies, SEO links;
   - `views.photoTour.rooms` → `rooms` + `photos` (dedupe by URL, strip
     `im_w`, keep order; orientation from the image's natural ratio);
   - `views.description|amenities|reviews` → full description sections,
     amenity groups (+ availability), review list;
   - hero order = the first five page images inside the photo grid, in DOM order.
3. Pick icons from `src/components/icons/registry.ts`; if an amenity needs a
   glyph that isn't there, ask for a screenshot and add the path data.
4. Re-run `npm run check` and the `visual-diff` skill against
   `reference/screens/`.

## Proxies while waiting

A live Airbnb listing from the same host/template (currently "Mirashya A102",
calibration data in `src/data/listing.ts`) is fine to automate for layout and
motion measurements; it is not the source of truth for content.
