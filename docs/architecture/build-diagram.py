#!/usr/bin/env python3
"""Generates architecture.svg / architecture.html (source of truth for the diagram).

Render to PNG + PDF with:  node docs/architecture/render.mjs
"""
from html import escape
from pathlib import Path

W, H = 2000, 1360
out = []
add = out.append

PALETTE = {
    "client":   ("#f7f7f7", "#b0b0b0", "#222222"),
    "edge":     ("#eef4ff", "#6d8fd8", "#1d3f8f"),
    "frontend": ("#f4efff", "#9474d6", "#4a2a93"),
    "service":  ("#ecf8f5", "#4fa892", "#145c4b"),
    "bus":      ("#fff4e8", "#e39545", "#8a4a07"),
    "data":     ("#eef8ea", "#6aa55a", "#2d5f22"),
    "platform": ("#f3f4f6", "#8a93a3", "#2f3746"),
    "brand":    ("#fff0f3", "#ff385c", "#b0183c"),
}

def box(x, y, w, h, title, sub="", kind="service", r=14, title_size=18):
    fill, stroke, ink = PALETTE[kind]
    add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="1.5"/>')
    ty = y + (h / 2) - (9 if sub else -6)
    add(f'<text x="{x + w/2}" y="{ty}" text-anchor="middle" font-size="{title_size}" font-weight="600" fill="{ink}">{escape(title)}</text>')
    if sub:
        for i, line in enumerate(sub.split("\n")):
            add(f'<text x="{x + w/2}" y="{ty + 22 + i*17}" text-anchor="middle" font-size="13.5" fill="#555">{escape(line)}</text>')

def band(x, y, w, h, label, kind, label_x=None):
    fill, stroke, ink = PALETTE[kind]
    lx = x + 18 if label_x is None else label_x
    add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="20" fill="none" stroke="{stroke}" stroke-width="1.5" stroke-dasharray="6 6"/>')
    add(f'<rect x="{lx}" y="{y - 12}" width="{len(label) * 8.2 + 24}" height="24" rx="12" fill="#ffffff" stroke="{stroke}" stroke-width="1.2"/>')
    add(f'<text x="{lx + 12}" y="{y + 5}" font-size="13.5" font-weight="600" fill="{ink}" letter-spacing="0.3">{escape(label.upper())}</text>')

def arrow(x1, y1, x2, y2, label="", color="#6c6c6c", dashed=False, label_dx=8, label_dy=0):
    dash = ' stroke-dasharray="5 5"' if dashed else ""
    add(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="1.8" marker-end="url(#arrow)"{dash}/>')
    if label:
        add(f'<text x="{(x1 + x2)/2 + label_dx}" y="{(y1 + y2)/2 + label_dy}" font-size="12.5" fill="#555">{escape(label)}</text>')

def path_arrow(d, label="", lx=0, ly=0, color="#6c6c6c", dashed=True):
    dash = ' stroke-dasharray="5 5"' if dashed else ""
    add(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="1.8" marker-end="url(#arrow)"{dash}/>')
    if label:
        add(f'<text x="{lx}" y="{ly}" font-size="12.5" fill="#555">{escape(label)}</text>')

add(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="\'Airbnb Cereal VF\', Circular, -apple-system, Helvetica, Arial, sans-serif">')
add('<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="#6c6c6c"/></marker></defs>')
add(f'<rect width="{W}" height="{H}" fill="#ffffff"/>')

# Title
add('<text x="40" y="62" font-size="32" font-weight="700" fill="#222">Vacation-rental marketplace — production architecture</text>')
add('<text x="40" y="92" font-size="16" fill="#6c6c6c">Read paths (browse, search, listing pages) are cached and served globally; write paths (booking, payment) are strongly consistent and region-pinned. Events keep the two in sync.</text>')

L, R = 40, 1440   # diagram area
# Row 1: clients
cy = 140
clients = [("Web (Next.js app)", "listing page · photo tour · lightbox"), ("iOS / Android", "native apps, same GraphQL API"), ("Host tools", "calendar · pricing · messaging"), ("Partners", "channel managers · public API")]
for i, (t, s) in enumerate(clients):
    box(L + i * 360, cy, 320, 70, t, s, "client")

# Row 2: edge
band(L, 250, R - L, 112, "Edge · global PoPs", "edge", label_x=L + 990)
box(L + 20, 272, 240, 72, "GeoDNS / Anycast", "latency-based routing", "edge")
box(L + 280, 272, 420, 72, "CDN + edge cache", "static assets · ISR HTML per locale/currency · SWR", "edge")
box(L + 720, 272, 320, 72, "Image CDN", "on-the-fly resize (im_w 240…2560) · AVIF/WebP", "edge")
box(L + 1060, 272, 320, 72, "WAF · bot management", "rate limits · BotID-style challenges", "edge")
for i in range(4):
    arrow(L + 160 + i * 360, cy + 70, L + 160 + i * 360, 272)

# Row 3: delivery
band(L, 398, R - L, 112, "Delivery", "frontend")
box(L + 20, 420, 640, 72, "Frontend tier — Next.js (SSR / ISR / RSC)", "edge + regional serverless · on-demand revalidation from listing.updated", "frontend")
box(L + 700, 420, 680, 72, "API gateway / GraphQL BFF", "authN (OAuth/JWT) · persisted queries · per-client quotas · request coalescing", "frontend")
arrow(L + 490, 344, L + 340, 420)
arrow(L + 1220, 344, L + 1040, 420)
arrow(L + 660, 456, L + 700, 456, "")
add(f'<text x="{L + 680}" y="{506}" font-size="12.5" fill="#555" text-anchor="middle">SSR data fetch</text>')

# Row 4: services
band(L, 548, R - L, 312, "Core services · Kubernetes per region", "service")
svc = [
    [("Listings & content", "listing, photos, amenities"), ("Search & ranking", "geo + filters + ML re-rank"), ("Availability & pricing", "calendars · dynamic pricing"), ("Booking", "saga orchestrator · idempotency")],
    [("Payments & ledger", "PCI zone · double-entry"), ("Identity & profiles", "auth · verification · KYC"), ("Reviews & ratings", "moderation pipeline"), ("Messaging", "WebSocket gateway")],
    [("Media pipeline", "upload → resize → moderate"), ("Notifications", "email · SMS · push"), ("Wishlists", "saves · collections"), ("Trust & safety", "fraud scoring · ML")],
]
for r, row in enumerate(svc):
    for c, (t, s) in enumerate(row):
        box(L + 20 + c * 345, 572 + r * 94, 325, 76, t, s, "service", title_size=17)
arrow(L + 1040, 492, L + 1040, 572)
add(f'<text x="{L + 1050}" y="{538}" font-size="12.5" fill="#555">gRPC / HTTP</text>')

# Event bus
box(L, 880, R - L, 62, "Event bus — Kafka (transactional outbox)", "listing.updated · availability.changed · price.changed · booking.created · review.published", "bus", r=12, title_size=17)
arrow(L + 700, 860, L + 700, 880)

# Data stores
band(L, 966, R - L, 124, "Storage", "data")
stores = [("Aurora PostgreSQL", "sharded by listing_id / user_id\nread replicas per region"), ("Redis cluster", "hot calendars · sessions\nlocks · rate limits"), ("OpenSearch", "geo-sharded index\nreplicas scaled for QPS"), ("S3 object storage", "photos & originals\nlifecycle → Glacier"), ("Cassandra", "messages · event timelines\nwrite-heavy, TTL")]
for i, (t, s) in enumerate(stores):
    box(L + 20 + i * 274, 986, 258, 86, t, s, "data", title_size=17)

# Data platform
band(L, 1122, R - L, 110, "Data & ML platform", "platform")
chain = [("CDC (Debezium)", "DB → Kafka"), ("Stream processing", "Flink · enrich · aggregate"), ("Lakehouse", "S3 + Iceberg"), ("Warehouse", "BigQuery / Snowflake"), ("ML platform", "feature store · training · serving")]
for i, (t, s) in enumerate(chain):
    box(L + 20 + i * 274, 1142, 240, 72, t, s, "platform", title_size=16)
    if i < len(chain) - 1:
        arrow(L + 260 + i * 274, 1178, L + 294 + i * 274, 1178)

# Feedback loops (right edge)
SEARCH_X = L + 20 + 345 + 162
path_arrow(f"M {L + 1320} 1142 L {L + 1320} 1112 L {R + 22} 1112 L {R + 22} 560 L {SEARCH_X + 60} 560 L {SEARCH_X + 60} 572", "", color="#8a93a3")
path_arrow(f"M {R + 22} 560 L {L + 20 + 690 + 162} 560 L {L + 20 + 690 + 162} 572", "", color="#8a93a3")
add(f'<text x="{R + 30}" y="{840}" font-size="12.5" fill="#555" transform="rotate(90 {R + 30} 840)">models → ranking & pricing</text>')
# indexer: bus → search
GUTTER_X = L + 20 + 325 + 10
path_arrow(f"M {GUTTER_X} 880 L {GUTTER_X} 630 L {L + 365} 630", "", color="#e39545")
add(f'<text x="{GUTTER_X + 6}" y="{872}" font-size="12.5" fill="#8a4a07">indexer (CDC)</text>')

# Ops band
band(L, 1266, R - L, 74, "Deployment & operations", "brand")
chips = ["Multi-AZ · multi-region", "EKS + HPA/KEDA autoscaling", "Terraform · Argo CD (GitOps)", "Canary + feature flags", "OpenTelemetry · SLO alerts", "Vault / KMS secrets"]
cx = L + 20
for chip in chips:
    w = len(chip) * 7.4 + 30
    add(f'<rect x="{cx}" y="{1286}" width="{w}" height="36" rx="18" fill="#fff0f3" stroke="#ff385c" stroke-width="1.2"/>')
    add(f'<text x="{cx + w/2}" y="{1309}" text-anchor="middle" font-size="13.5" font-weight="600" fill="#b0183c">{escape(chip)}</text>')
    cx += w + 10

# Right column: scaling strategy
NX, NW = 1490, 470
add(f'<rect x="{NX}" y="140" width="{NW}" height="1200" rx="24" fill="#fafafa" stroke="#dddddd"/>')
add(f'<text x="{NX + 28}" y="186" font-size="22" font-weight="700" fill="#222">Scaling strategy</text>')
notes = [
    ("Frontend", "#9474d6", [
        "Listing pages SSR/ISR, cached at the edge",
        "with stale-while-revalidate; keys include",
        "locale + currency. listing.updated events",
        "trigger on-demand revalidation + purge.",
        "Photos via image CDN in width buckets;",
        "overlay state in the URL = cacheable links.",
    ]),
    ("Backend", "#4fa892", [
        "Stateless services autoscale on RPS/latency.",
        "CQRS: writes → Postgres; reads → Redis and",
        "search projections. Booking is a saga",
        "(hold → pay → confirm) with idempotency",
        "keys + transactional outbox. Circuit",
        "breakers and bulkheads per dependency.",
    ]),
    ("Storage", "#6aa55a", [
        "Postgres sharded by listing_id / user_id,",
        "replicas per region; expand/contract",
        "migrations. Redis for hot calendars, locks,",
        "sessions. S3 media with lifecycle tiers.",
        "Cassandra for write-heavy messaging;",
        "ledger isolated in the PCI zone.",
    ]),
    ("Search", "#e39545", [
        "OpenSearch geo-sharded (geohash routing),",
        "replicas sized for peak QPS. Near-real-time",
        "indexing via CDC → Kafka → indexer.",
        "Denormalised availability/price for filters;",
        "learning-to-rank re-ranking from the",
        "feature store; cache top destinations.",
    ]),
    ("Deployment", "#ff385c", [
        "Multi-AZ everywhere; browse/search",
        "active-active across regions, bookings",
        "pinned to a home region with async",
        "replication. GitOps canaries with auto",
        "rollback on SLO burn. DR targets:",
        "RPO ≤ 1 min, RTO ≤ 15 min.",
    ]),
]
y = 226
for title, color, lines in notes:
    add(f'<rect x="{NX + 28}" y="{y - 16}" width="6" height="{24 + len(lines) * 21}" rx="3" fill="{color}"/>')
    add(f'<text x="{NX + 48}" y="{y + 2}" font-size="18" font-weight="700" fill="#222">{title}</text>')
    for i, line in enumerate(lines):
        add(f'<text x="{NX + 48}" y="{y + 28 + i * 21}" font-size="14.5" fill="#444">{escape(line)}</text>')
    y += 44 + len(lines) * 21 + 40

add(f'<text x="{NX + 28}" y="{H - 64}" font-size="13" fill="#6c6c6c">This clone = the “Web” client: statically</text>')
add(f'<text x="{NX + 28}" y="{H - 45}" font-size="13" fill="#6c6c6c">rendered Next.js page, CDN image loader,</text>')
add(f'<text x="{NX + 28}" y="{H - 26}" font-size="13" fill="#6c6c6c">client state for booking + wishlist.</text>')

add("</svg>")
svg = "\n".join(out)
here = Path(__file__).parent
(here / "architecture.svg").write_text(svg)
font = ('@font-face{font-family:"Airbnb Cereal VF";src:url("https://a0.muscache.com/airbnb/static/airbnb-dls-web/build/fonts/cereal-variable/'
        'AirbnbCerealVF_W_Wght.8816d9e5c3b6a860636193e36b6ac4e4.woff2") format("woff2-variations");font-weight:100 1000;}')
(here / "architecture.html").write_text(f'<!doctype html><html><head><meta charset="utf-8"><title>Architecture</title><style>{font}html,body{{margin:0;background:#fff}}svg{{display:block}}</style></head><body>{svg}</body></html>')
print("wrote architecture.svg / architecture.html")
