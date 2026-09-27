"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { useEscapeStack } from "@/hooks/useEscapeStack";
import { cx } from "@/lib/cx";
import styles from "./MapView.module.css";

const SUGGESTIONS = ["Find things to do", "Try a local café", "Find public transport", "Explore dining"];
const MIN_ZOOM = 3;
const MAX_ZOOM = 18;

const embedUrl = (lat: number, lng: number, zoom: number) =>
  `https://maps.google.com/maps?ll=${lat},${lng}&z=${zoom}&t=m&hl=en&output=embed`;

/**
 * "Where you'll be" map. Google's keyless embed supplies the same cartography
 * as the reference; the Airbnb chrome on top (search pill, round controls,
 * home marker) is ours. The embed itself is non-interactive so the marker
 * always sits on the listing; zooming loads a frame at the new level and
 * cross-fades to it once it has rendered.
 */
export function MapView({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  const [zoom, setZoom] = useState(13);
  const [frames, setFrames] = useState([{ zoom: 13, ready: false }]);
  const [fullscreen, setFullscreen] = useState(false);
  const [hint, setHint] = useState(0);
  const [query, setQuery] = useState("");

  const zoomTo = (next: number) => {
    const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next));
    if (z === zoom) return;
    setZoom(z);
    setFrames((current) => [...current.filter((f) => f.ready && f.zoom !== z).slice(-1), { zoom: z, ready: false }]);
  };

  const onFrameLoad = (z: number) =>
    setFrames((current) => {
      const loaded = current.map((f) => (f.zoom === z ? { ...f, ready: true } : f));
      // Once the newest frame is ready, the ones underneath can go.
      const newest = loaded.findLastIndex((f) => f.ready);
      return loaded.slice(Math.max(0, newest));
    });

  useEscapeStack(fullscreen, () => setFullscreen(false));

  // Rotate the search suggestions like the reference's animated placeholder.
  useEffect(() => {
    if (query) return;
    const timer = window.setInterval(() => setHint((i) => (i + 1) % SUGGESTIONS.length), 3000);
    return () => window.clearInterval(timer);
  }, [query]);

  return (
    <div className={cx(styles.frame, fullscreen && styles.fullscreen)}>
      <div className={styles.canvas} role="img" aria-label={`Map of ${label}, zoom level ${zoom}`}>
        {frames.map((f) => (
          <iframe
            key={f.zoom}
            className={cx(styles.embed, f.ready && styles.embedReady)}
            src={embedUrl(lat, lng, f.zoom)}
            title={`Map of ${label}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            tabIndex={-1}
            aria-hidden="true"
            onLoad={() => onFrameLoad(f.zoom)}
          />
        ))}
        <span className={styles.marker} aria-hidden="true">
          <Icon name="home" size={22} />
        </span>
      </div>

      <label className={styles.search}>
        <Icon name="search" size={12} strokeWidth={4} className={styles.searchIcon} />
        <span className="visually-hidden">Search the map</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
          autoComplete="off"
        />
        {!query && (
          <span key={hint} className={styles.hint} aria-hidden="true">
            {SUGGESTIONS[hint]}
          </span>
        )}
      </label>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.control}
          aria-label={fullscreen ? "Exit full-screen map" : "Show full-screen map"}
          aria-pressed={fullscreen}
          onClick={() => setFullscreen((v) => !v)}
        >
          <Icon name="expand" size={16} />
        </button>
        <div className={styles.zoom}>
          <button
            type="button"
            className={styles.zoomButton}
            aria-label="Zoom in"
            disabled={zoom >= MAX_ZOOM}
            onClick={() => zoomTo(zoom + 1)}
          >
            <Icon name="plus" size={16} />
          </button>
          <button
            type="button"
            className={styles.zoomButton}
            aria-label="Zoom out"
            disabled={zoom <= MIN_ZOOM}
            onClick={() => zoomTo(zoom - 1)}
          >
            <Icon name="minus" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
