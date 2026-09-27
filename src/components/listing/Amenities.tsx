"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import button from "@/components/ui/button.module.css";
import { Modal } from "@/components/ui/Modal";
import type { Amenity, AmenityGroup } from "@/lib/types";
import section from "./section.module.css";
import styles from "./Amenities.module.css";

function AmenityLabel({ amenity }: { amenity: Amenity }) {
  if (amenity.available) return <>{amenity.title}</>;
  return (
    <>
      <span className="visually-hidden">Unavailable: {amenity.title}</span>
      <del aria-hidden="true">{amenity.title}</del>
    </>
  );
}

export function Amenities({
  preview,
  groups,
  total,
}: {
  preview: Amenity[];
  groups: AmenityGroup[];
  total: number;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  return (
    <section id="amenities" className={section.section} aria-labelledby="amenities-heading">
      <h2 id="amenities-heading" className={section.heading}>
        What this place offers
      </h2>
      <ul className={styles.grid}>
        {preview.map((amenity) => (
          <li key={amenity.title} className={styles.item}>
            <Icon name={amenity.icon} size={24} />
            <span>
              <AmenityLabel amenity={amenity} />
            </span>
          </li>
        ))}
      </ul>
      <button type="button" className={`${button.secondary} ${styles.more}`} data-press onClick={() => setOpen(true)}>
        Show all {total} amenities
      </button>

      <Modal open={open} onClose={() => setOpen(false)} labelledBy={titleId}>
        <h2 id={titleId} className={`${section.heading} ${styles.modalTitle}`}>
          What this place offers
        </h2>
        {groups.map((group) => (
          <section key={group.title} className={styles.group} aria-label={group.title}>
            <h3 className={section.subheading}>{group.title}</h3>
            <ul>
              {group.items.map((amenity) => (
                <li key={amenity.title} className={styles.row}>
                  <Icon name={amenity.icon} size={24} />
                  <div>
                    <div className={styles.rowTitle}>
                      <AmenityLabel amenity={amenity} />
                    </div>
                    {amenity.subtitle && <div className={styles.rowSubtitle}>{amenity.subtitle}</div>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Modal>
    </section>
  );
}
