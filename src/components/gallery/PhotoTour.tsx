"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/icons/Icon";
import { SaveButton, ShareButton } from "@/components/listing/ActionButtons";
import { useEscapeStack } from "@/hooks/useEscapeStack";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useIsClient } from "@/hooks/useIsClient";
import { usePresence } from "@/hooks/usePresence";
import { useScrollLock } from "@/hooks/useScrollLock";
import { buildMediaBlocks } from "@/lib/photo-layout";
import type { Photo, PhotoRoom } from "@/lib/types";
import { useGallery } from "./GalleryProvider";
import { Lightbox } from "./Lightbox";
import styles from "./PhotoTour.module.css";

const EXIT_MS = 250;
const VISIBLE_HIGHLIGHTS = 6;

interface PhotoTourProps {
  photos: Photo[];
  rooms: PhotoRoom[];
}

export function PhotoTour({ photos, rooms }: PhotoTourProps) {
  const { tourOpen } = useGallery();
  const { mounted, state } = usePresence(tourOpen, EXIT_MS);
  const isClient = useIsClient();

  if (!isClient) return null;
  return createPortal(
    <>
      {mounted && <TourSurface photos={photos} rooms={rooms} state={state} />}
      <Lightbox photos={photos} rooms={rooms} />
    </>,
    document.body,
  );
}

function TourSurface({ photos, rooms, state }: PhotoTourProps & { state: "open" | "closing" }) {
  const { closeTour, openPhoto, photoId, pendingRoomId, consumePendingRoom } = useGallery();
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const byId = useMemo(() => new Map(photos.map((p) => [p.id, p])), [photos]);
  const lightboxOpen = photoId !== null;

  useScrollLock(true);
  useFocusTrap(rootRef, { open: state === "open", trap: !lightboxOpen });
  useEscapeStack(state === "open", closeTour);

  // The tour is inert under the lightbox, so the lightbox can't hand focus
  // back itself: return it to the last photo viewed, scrolled into view.
  const lastViewed = useRef<string | null>(null);
  useEffect(() => {
    if (photoId) {
      lastViewed.current = photoId;
      return;
    }
    if (!lastViewed.current) return;
    const button = rootRef.current?.querySelector<HTMLElement>(`[data-photo-id="${lastViewed.current}"]`);
    button?.focus({ preventScroll: true });
    button?.scrollIntoView({ block: "nearest" });
    lastViewed.current = null;
  }, [photoId]);

  // "Where you'll sleep" cards open the tour already scrolled to their room.
  useEffect(() => {
    if (!pendingRoomId) return;
    const top = roomScrollTop(scrollerRef.current, pendingRoomId);
    if (top !== null) scrollerRef.current?.scrollTo({ top });
    consumePendingRoom();
  }, [pendingRoomId, consumePendingRoom]);

  const scrollToRoom = (roomId: string) => {
    const top = roomScrollTop(scrollerRef.current, roomId);
    if (top !== null) scrollerRef.current?.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div
      ref={rootRef}
      className={styles.root}
      data-state={state}
      role="dialog"
      aria-modal="true"
      aria-label="Photo tour"
      tabIndex={-1}
      inert={lightboxOpen}
    >
      <div className={styles.bar}>
        <button type="button" className={styles.back} aria-label="Close" onClick={closeTour}>
          <Icon name="back" size={16} />
        </button>
        <div className={styles.actions}>
          <ShareButton />
          <SaveButton />
        </div>
      </div>

      <div ref={scrollerRef} className={styles.scroller}>
        <div className={styles.content}>
          <h1 className={styles.title}>Photo tour</h1>

          <ul className={styles.rooms} aria-label="Rooms">
            {rooms.map((room) => {
              const cover = byId.get(room.photoIds[0]);
              return (
                <li key={room.id}>
                  <button
                    type="button"
                    className={styles.roomTile}
                    aria-label={`Scroll to ${room.title}`}
                    onClick={() => scrollToRoom(room.id)}
                  >
                    <span className={styles.roomThumb}>
                      {cover && <Image src={cover.url} alt="" fill sizes="146px" className={styles.cover} />}
                    </span>
                    <span className={styles.roomName}>{room.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className={styles.sections}>
            {rooms.map((room) => (
              <RoomSection
                key={room.id}
                room={room}
                photos={room.photoIds.map((id) => byId.get(id)).filter((p): p is Photo => !!p)}
                onOpenPhoto={openPhoto}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Scroller offset that parks a room's heading 24px below the tour's top bar. */
function roomScrollTop(scroller: HTMLElement | null, roomId: string): number | null {
  const section = document.getElementById(`tour-room-${roomId}`);
  if (!scroller || !section) return null;
  return section.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 24;
}

function RoomSection({
  room,
  photos,
  onOpenPhoto,
}: {
  room: PhotoRoom;
  photos: Photo[];
  onOpenPhoto: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const headingId = `tour-room-${room.id}-title`;
  const overflow = room.highlights.length > VISIBLE_HIGHLIGHTS;
  const shown = expanded || !overflow ? room.highlights : room.highlights.slice(0, VISIBLE_HIGHLIGHTS);

  const photoButton = (photo: Photo, index: number, sizes: string) => (
    <button
      key={photo.id}
      type="button"
      data-photo-id={photo.id}
      className={styles.photo}
      aria-label={`${room.title}, photo ${index + 1} of ${photos.length}${photo.caption ? `: ${photo.caption}` : ""}`}
      onClick={() => onOpenPhoto(photo.id)}
    >
      <Image src={photo.url} alt="" fill sizes={sizes} className={styles.cover} />
    </button>
  );

  let index = 0;
  return (
    <section id={`tour-room-${room.id}`} className={styles.section} aria-labelledby={headingId}>
      <div className={styles.sectionInfo}>
        <h2 id={headingId} className={styles.sectionTitle}>
          {room.title}
        </h2>
        {room.highlights.length > 0 && (
          <p className={styles.highlights}>
            {shown.join(" · ")}
            {overflow && !expanded && (
              <>
                {" · "}
                <button type="button" className={styles.more} onClick={() => setExpanded(true)}>
                  Show more
                </button>
              </>
            )}
          </p>
        )}
      </div>
      <div className={styles.sectionPhotos}>
        {buildMediaBlocks(photos).map((block) =>
          block.kind === "single" ? (
            <div key={block.photo.id} className={styles.single}>
              {photoButton(block.photo, index++, "(min-width: 1128px) 741px, 66vw")}
            </div>
          ) : (
            <div key={block.photos[0].id} className={styles.pair}>
              {photoButton(block.photos[0], index++, "(min-width: 1128px) 367px, 33vw")}
              {photoButton(block.photos[1], index++, "(min-width: 1128px) 367px, 33vw")}
            </div>
          ),
        )}
      </div>
    </section>
  );
}
