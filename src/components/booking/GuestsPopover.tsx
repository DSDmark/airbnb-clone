"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/icons/Icon";
import { useBooking, type Guests } from "./BookingProvider";
import styles from "./GuestsPopover.module.css";

const ROWS: { key: keyof Guests; title: string; subtitle: string }[] = [
  { key: "adults", title: "Adults", subtitle: "Age 13+" },
  { key: "children", title: "Children", subtitle: "Ages 2–12" },
  { key: "infants", title: "Infants", subtitle: "Under 2" },
  { key: "pets", title: "Pets", subtitle: "Bringing a service animal?" },
];

export function GuestsPopover({ onClose }: { onClose: () => void }) {
  const { guests, setGuests, maxGuests } = useBooking();
  const panelRef = useRef<HTMLDivElement>(null);
  const seated = guests.adults + guests.children;

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const trigger = (event.target as Element).closest("[data-guests-trigger]");
      if (!panelRef.current?.contains(event.target as Node) && !trigger) onClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [onClose]);

  const limits = (key: keyof Guests) => {
    const min = key === "adults" ? 1 : 0;
    const max = key === "infants" ? 5 : key === "pets" ? 5 : maxGuests - seated + guests[key];
    return { min, max };
  };

  const change = (key: keyof Guests, delta: number) => {
    const { min, max } = limits(key);
    setGuests({ ...guests, [key]: Math.min(max, Math.max(min, guests[key] + delta)) });
  };

  return (
    <div
      ref={panelRef}
      className={styles.panel}
      role="dialog"
      aria-label="Guests"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          onClose();
        }
      }}
    >
      <ul>
        {ROWS.map((row) => {
          const { min, max } = limits(row.key);
          const value = guests[row.key];
          return (
            <li key={row.key} className={styles.row}>
              <div>
                <h3 className={styles.title}>{row.title}</h3>
                {row.key === "pets" ? (
                  <button type="button" className={styles.link}>
                    {row.subtitle}
                  </button>
                ) : (
                  <p className={styles.subtitle}>{row.subtitle}</p>
                )}
              </div>
              <div className={styles.stepper}>
                <button
                  type="button"
                  className={styles.step}
                  aria-label={`Decrease ${row.title}`}
                  disabled={value <= min}
                  onClick={() => change(row.key, -1)}
                >
                  <Icon name="stepMinus" size={12} />
                </button>
                <span className={styles.count} aria-live="polite">
                  <span className="visually-hidden">{value} {row.title}</span>
                  <span aria-hidden="true">{value}</span>
                </span>
                <button
                  type="button"
                  className={styles.step}
                  aria-label={`Increase ${row.title}`}
                  disabled={value >= max}
                  onClick={() => change(row.key, 1)}
                >
                  <Icon name="stepPlus" size={12} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <p className={styles.note}>
        This place has a maximum of {maxGuests} guests, not including infants. If you&apos;re bringing more than 2
        pets, please let your host know.
      </p>
      <div className={styles.footer}>
        <button type="button" className={styles.close} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
