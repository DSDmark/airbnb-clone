# Architecture diagram

`architecture.png` / `architecture.pdf` — high-level architecture for a
production-scale vacation-rental marketplace, with the scaling strategy for
frontend, backend, storage, search and deployment in the right-hand column.

Source: `build-diagram.py` (emits `architecture.svg` + `architecture.html`),
rendered with `render.mjs`:

```bash
python3 docs/architecture/build-diagram.py
node docs/architecture/render.mjs   # PW_CHROMIUM_PATH=… if Playwright browsers aren't installed
```

## Reading it

- **Read path** (browse, search, listing pages): client → GeoDNS → CDN/edge
  cache (ISR HTML, static assets) + image CDN → Next.js tier → GraphQL BFF →
  services, answering mostly from Redis and search projections. Everything on
  this path is cacheable and served active-active from every region.
- **Write path** (booking): BFF → Booking saga → Availability (hold) →
  Payments (charge, ledger) → confirm; each step idempotent, state changes
  published through a transactional outbox to Kafka. Bookings are pinned to the
  listing's home region to keep them strongly consistent.
- **Events** (`listing.updated`, `availability.changed`, `price.changed`,
  `booking.created`…) fan out to the search indexer, CDN/ISR revalidation,
  notifications and the data platform.
- **Data & ML**: CDC into the lakehouse/warehouse; the ML platform trains
  ranking, pricing and fraud models and serves them back to Search, Pricing and
  Trust & safety.

## How this repo maps onto it

The clone is the *Web* client: a statically rendered Next.js page whose photos
go through a CDN loader with width buckets (`src/lib/image-loader.ts`), whose
overlay state lives in the URL (cacheable deep links), and whose booking and
wishlist state are client-side stand-ins for the Booking and Wishlists services.
