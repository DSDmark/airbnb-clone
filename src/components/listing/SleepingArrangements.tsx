"use client";

import Image from "next/image";
import { useGallery } from "@/components/gallery/GalleryProvider";
import type { Photo, SleepingSpace } from "@/lib/types";
import section from "./section.module.css";
import styles from "./SleepingArrangements.module.css";

export function SleepingArrangements({ spaces, photos }: { spaces: SleepingSpace[]; photos: Photo[] }) {
  const { openTour } = useGallery();
  const byId = new Map(photos.map((p) => [p.id, p]));

  return (
    <section className={section.section} aria-labelledby="sleep-heading">
      <h2 id="sleep-heading" className={section.heading}>
        Where you&apos;ll sleep
      </h2>
      <ul className={styles.grid}>
        {spaces.map((space) => {
          const photo = byId.get(space.photoId);
          return (
            <li key={space.title}>
              <button type="button" className={styles.card} onClick={() => openTour(space.roomId)}>
                <span className={styles.media}>
                  {photo && (
                    <Image src={photo.url} alt={photo.caption || space.title} fill sizes="(min-width: 1128px) 320px, 40vw" className={styles.image} />
                  )}
                </span>
                <span className={styles.title}>{space.title}</span>
                <span className={styles.subtitle}>{space.subtitle}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
