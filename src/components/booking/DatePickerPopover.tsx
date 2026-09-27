"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/icons/Icon";
import { formatInputDate, startOfDay } from "@/lib/dates";
import { cx } from "@/lib/cx";
import { useBooking } from "./BookingProvider";
import { Calendar } from "./Calendar";
import styles from "./DatePickerPopover.module.css";

/** Floating date-range picker anchored over the booking card's date fields. */
export function DatePickerPopover() {
  const { checkIn, checkOut, nights, setDates, closeDatePicker } = useBooking();
  const panelRef = useRef<HTMLDivElement>(null);
  const today = startOfDay(new Date());

  useEffect(() => {
    const panel = panelRef.current;
    panel?.querySelector<HTMLButtonElement>("button[tabindex='0']")?.focus({ preventScroll: true });
    const onPointerDown = (event: PointerEvent) => {
      if (!panel?.contains(event.target as Node)) closeDatePicker();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [closeDatePicker]);

  const onSelect = (day: Date) => {
    if (!checkIn || checkOut || day <= checkIn) setDates(day, null);
    else setDates(checkIn, day);
  };

  const heading = checkIn && checkOut ? `${nights} ${nights === 1 ? "night" : "nights"}` : checkIn ? "Select checkout date" : "Select dates";

  return (
    <div
      ref={panelRef}
      className={styles.panel}
      role="dialog"
      aria-label="Select dates"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          closeDatePicker();
        }
      }}
    >
      <div className={styles.header}>
        <div className={styles.heading}>
          <h2 className={styles.title}>{heading}</h2>
          <p className={styles.subtitle}>Add your travel dates for exact pricing</p>
        </div>
        <div className={styles.fields}>
          <div className={cx(styles.field, !checkIn && styles.active)}>
            <span className={styles.label}>Check-in</span>
            <span className={cx(styles.value, !checkIn && styles.placeholder)}>
              {checkIn ? formatInputDate(checkIn) : "DD/MM/YYYY"}
            </span>
          </div>
          <div className={cx(styles.field, checkIn && !checkOut && styles.active, !checkIn && styles.idle)}>
            <span className={styles.label}>Checkout</span>
            <span className={cx(styles.value, !checkOut && styles.placeholder)}>
              {checkOut ? formatInputDate(checkOut) : checkIn ? "DD/MM/YYYY" : "Add date"}
            </span>
          </div>
        </div>
      </div>

      <Calendar checkIn={checkIn} checkOut={checkOut} minDate={today} onSelect={onSelect} />

      <div className={styles.footer}>
        <span className={styles.keyboard} aria-hidden="true">
          <Icon name="keyboard" size={24} />
        </span>
        <div className={styles.footerActions}>
          <button type="button" className={styles.clear} onClick={() => setDates(null, null)}>
            Clear dates
          </button>
          <button type="button" className={styles.close} data-press onClick={closeDatePicker}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
