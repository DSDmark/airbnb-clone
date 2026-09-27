"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import section from "@/components/listing/section.module.css";
import { Modal } from "@/components/ui/Modal";
import type { Listing } from "@/lib/types";
import { MapView } from "./MapView";
import styles from "./LocationSection.module.css";

export function LocationSection({ location }: { location: Listing["location"] }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  return (
    <section id="location" className={section.section} aria-labelledby="location-heading">
      <h2 id="location-heading" className={section.heading}>
        Where you’ll be
      </h2>
      <p className={styles.label}>{location.label}</p>
      <div className={styles.map}>
        <MapView lat={location.lat} lng={location.lng} label={location.label} />
      </div>
      <p className={styles.note}>{location.note}</p>

      <div className={styles.neighbourhood}>
        <h3 className={styles.neighbourhoodTitle}>Neighbourhood highlights</h3>
        <p className={styles.neighbourhoodText}>{location.neighbourhood}</p>
        <button type="button" className={styles.more} onClick={() => setOpen(true)}>
          <span>Show more</span>
          <Icon name="chevronRightBold" size={12} />
        </button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} labelledBy={titleId}>
        <h2 id={titleId} className={styles.modalTitle}>
          Location
        </h2>
        <p className={styles.modalLabel}>{location.label}</p>
        <p className={styles.modalText}>{location.neighbourhood}</p>
      </Modal>
    </section>
  );
}
