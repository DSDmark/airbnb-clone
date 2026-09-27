"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { SaveButton, ShareButton } from "@/components/listing/ActionButtons";
import { useEscapeStack } from "@/hooks/useEscapeStack";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { usePresence } from "@/hooks/usePresence";
import { orderPhotosByRoom } from "@/lib/photo-layout";
import type { Photo, PhotoRoom } from "@/lib/types";
import { useGallery } from "./GalleryProvider";
import styles from "./Lightbox.module.css";

const EXIT_MS = 150;
const CROSSFADE_MS = 200;

export function Lightbox({ photos, rooms }: { photos: Photo[]; rooms: PhotoRoom[] }) {
  const { photoId } = useGallery();
  const ordered = useMemo(() => orderPhotosByRoom(photos, rooms), [photos, rooms]);
  const index = photoId ? ordered.findIndex((p) => p.id === photoId) : -1;
  const { mounted, state } = usePresence(index >= 0, EXIT_MS);

  // Keep showing the last photo while the exit animation runs.
  const [lastIndex, setLastIndex] = useState(0);
  if (index >= 0 && index !== lastIndex) setLastIndex(index);

  if (!mounted) return null;
  return <LightboxSurface photos={ordered} index={index >= 0 ? index : lastIndex} state={state} />;
}

function LightboxSurface({
  photos,
  index,
  state,
}: {
  photos: Photo[];
  index: number;
  state: "open" | "closing";
}) {
  const { closePhoto, showPhoto } = useGallery();
  const rootRef = useRef<HTMLDivElement>(null);
  const photo = photos[index];
  const hasPrev = index > 0;
  const hasNext = index < photos.length - 1;

  useFocusTrap(rootRef, { open: state === "open" });
  useEscapeStack(state === "open", closePhoto);

  // The outgoing photo stays mounted briefly so the two can cross-fade.
  const [outgoing, setOutgoing] = useState<Photo | null>(null);
  const [current, setCurrent] = useState(photo);
  if (photo.id !== current.id) {
    setOutgoing(current);
    setCurrent(photo);
  }
  useEffect(() => {
    if (!outgoing) return;
    const timer = window.setTimeout(() => setOutgoing(null), CROSSFADE_MS);
    return () => window.clearTimeout(timer);
  }, [outgoing]);

  const go = useCallback(
    (delta: number) => {
      const next = photos[index + delta];
      if (next) showPhoto(next.id);
    },
    [photos, index, showPhoto],
  );

  useEffect(() => {
    if (state !== "open") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") go(-1);
      else if (event.key === "ArrowRight") go(1);
      else return;
      event.preventDefault();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [go, state]);

  const neighbours = [photos[index - 1], photos[index + 1]].filter(Boolean) as Photo[];

  return (
    <div
      ref={rootRef}
      className={styles.root}
      data-state={state}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      tabIndex={-1}
    >
      <div className={styles.toolbar}>
        <button type="button" className={styles.close} data-press onClick={closePhoto}>
          <Icon name="closeSmall" size={12} />
          <span>Close</span>
        </button>
        <p className={styles.counter} aria-hidden="true">
          {index + 1} / {photos.length}
        </p>
        <div className={styles.actions}>
          <ShareButton variant="icon" />
          <SaveButton variant="icon" />
        </div>
      </div>

      <p className="visually-hidden" aria-live="polite">
        Showing photo {index + 1} of {photos.length}
        {photo.caption ? `: ${photo.caption}` : ""}
      </p>

      <figure className={styles.stage}>
        <div className={styles.frame}>
          {outgoing && (
            <Image
              key={`out-${outgoing.id}`}
              src={outgoing.url}
              alt=""
              fill
              sizes="(min-width: 1440px) 1248px, 100vw"
              className={`${styles.image} ${styles.leaving}`}
            />
          )}
          {/* Same rendition the tour grid already loaded: shows instantly while
              the full-size image streams in on top. */}
          <Image
            key={`preview-${photo.id}`}
            src={photo.url}
            alt=""
            fill
            sizes="741px"
            className={`${styles.image} ${outgoing ? styles.entering : ""}`}
            loading="eager"
          />
          <FullImage key={photo.id} photo={photo} />
        </div>
        {photo.caption && <figcaption className={styles.caption}>{photo.caption}</figcaption>}
      </figure>

      <button
        type="button"
        className={`${styles.nav} ${styles.prev}`}
        aria-label="Previous photo"
        disabled={!hasPrev}
        onClick={() => go(-1)}
      >
        <Icon name="chevronLeft" size={12} />
      </button>
      <button
        type="button"
        className={`${styles.nav} ${styles.next}`}
        aria-label="Next photo"
        disabled={!hasNext}
        onClick={() => go(1)}
      >
        <Icon name="chevronRight" size={12} />
      </button>

      {/* Warm the cache so arrowing through feels instant. */}
      <div className={styles.preload} aria-hidden="true">
        {neighbours.map((p) => (
          <Image key={p.id} src={p.url} alt="" fill sizes="(min-width: 1440px) 1248px, 100vw" loading="eager" />
        ))}
      </div>
    </div>
  );
}

/** Full-resolution photo that fades in over the preview once decoded. */
function FullImage({ photo }: { photo: Photo }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      src={photo.url}
      alt={photo.caption}
      fill
      sizes="(min-width: 1440px) 1248px, 100vw"
      className={`${styles.image} ${styles.full}`}
      data-loaded={loaded || undefined}
      loading="eager"
      fetchPriority="high"
      onLoad={() => setLoaded(true)}
    />
  );
}
