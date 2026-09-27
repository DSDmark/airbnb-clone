"use client";

import Image from "next/image";
import { useGallery } from "@/components/gallery/GalleryProvider";
import { Icon } from "@/components/icons/Icon";
import button from "@/components/ui/button.module.css";
import { cx } from "@/lib/cx";
import type { Photo } from "@/lib/types";
import styles from "./HeroGallery.module.css";

const SIZES = ["(min-width: 1128px) 560px, 50vw", "(min-width: 1128px) 280px, 25vw"];

/** Five-photo mosaic; every tile and "Show all photos" opens the photo tour. */
export function HeroGallery({ photos, title }: { photos: Photo[]; title: string }) {
  const { openTour } = useGallery();

  return (
    <section id="photos" className={styles.hero} aria-label="Listing photos">
      <div className={styles.grid}>
        {photos.map((photo, i) => (
          <div key={photo.id} className={cx(styles.cell, styles[`cell${i}`])}>
            <button
              type="button"
              className={styles.photo}
              aria-label={photo.caption || title}
              onClick={() => openTour()}
            >
              <Image
                src={photo.url}
                alt=""
                fill
                sizes={SIZES[i === 0 ? 0 : 1]}
                className={styles.image}
                loading="eager"
                fetchPriority={i === 0 ? "high" : "auto"}
              />
            </button>
          </div>
        ))}
      </div>
      <button type="button" className={cx(button.chip, styles.showAll)} data-press onClick={() => openTour()}>
        <Icon name="dotsGrid" size={16} />
        Show all photos
      </button>
    </section>
  );
}
