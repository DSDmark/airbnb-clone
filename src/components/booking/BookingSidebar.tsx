"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import button from "@/components/ui/button.module.css";
import { GradientButton } from "@/components/ui/GradientButton";
import { formatInputDate } from "@/lib/dates";
import { formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/types";
import { guestSummary, useBooking } from "./BookingProvider";
import { DatePickerPopover } from "./DatePickerPopover";
import { GuestsPopover } from "./GuestsPopover";
import styles from "./BookingSidebar.module.css";

export const BOOKING_CARD_ID = "book-it";

export function BookingSidebar({ promo }: { promo: Listing["booking"]["promo"] }) {
  return (
    <div className={styles.sticky}>
      <div className={styles.promo}>
        <Image src="/assets/promo-tag.png" alt="" width={32} height={32} unoptimized className={styles.promoIcon} />
        <p className={styles.promoText}>
          {promo.text}{" "}
          <a href="#" className={styles.promoLink}>
            {promo.linkLabel}
          </a>
        </p>
        <button type="button" className={`${button.chip} ${styles.claim}`} data-press>
          {promo.action}
        </button>
      </div>
      <BookingCard />
      <div className={styles.report}>
        <button type="button" className={styles.reportLink}>
          <Icon name="flag" size={16} />
          <span>Report this listing</span>
        </button>
      </div>
    </div>
  );
}

function BookingCard() {
  const booking = useBooking();
  const { checkIn, checkOut, nights, guests, nightlyRate, datePickerOpen, openDatePicker } = booking;
  const [guestsOpen, setGuestsOpen] = useState(false);
  const closeGuests = useCallback(() => setGuestsOpen(false), []);
  const total = nights * nightlyRate;
  const serviceFee = Math.round(total * 0.14);

  const datesLabel = `Change dates; Check-in: ${checkIn ? formatInputDate(checkIn) : "Add date"}; Checkout: ${
    checkOut ? formatInputDate(checkOut) : "Add date"
  }`;

  return (
    <section id={BOOKING_CARD_ID} className={styles.card} aria-label="Booking">
      <div>
        {nights > 0 ? (
          <h2 className={styles.price}>
            <span className={styles.amount}>{formatPrice(total)}</span>{" "}
            <span className={styles.per}>
              for {nights} {nights === 1 ? "night" : "nights"}
            </span>
          </h2>
        ) : (
          <h2 className={styles.prompt}>Add dates for prices</h2>
        )}
      </div>

      <div className={styles.picker}>
        <button type="button" className={styles.dates} aria-label={datesLabel} onClick={openDatePicker}>
          <span className={styles.field}>
            <span className={styles.label}>Check-in</span>
            <span className={checkIn ? styles.value : styles.placeholder}>
              {checkIn ? formatInputDate(checkIn) : "Add date"}
            </span>
          </span>
          <span className={styles.field}>
            <span className={styles.label}>Checkout</span>
            <span className={checkOut ? styles.value : styles.placeholder}>
              {checkOut ? formatInputDate(checkOut) : "Add date"}
            </span>
          </span>
        </button>
        <button
          type="button"
          className={styles.guests}
          data-guests-trigger
          aria-expanded={guestsOpen}
          aria-label={`Guests: ${guestSummary(guests)}`}
          onClick={() => setGuestsOpen((v) => !v)}
        >
          <span className={styles.label}>Guests</span>
          <span className={styles.guestValue}>{guestSummary(guests)}</span>
          <Icon name={guestsOpen ? "chevronUp" : "chevronDown"} size={16} className={styles.chevron} />
        </button>
        {datePickerOpen && <DatePickerPopover />}
        {guestsOpen && <GuestsPopover onClose={closeGuests} />}
      </div>

      <GradientButton className={styles.cta} onClick={nights > 0 ? undefined : openDatePicker}>
        {nights > 0 ? "Reserve" : "Check availability"}
      </GradientButton>

      {nights > 0 && (
        <>
          <p className={styles.notCharged}>You won&apos;t be charged yet</p>
          <dl className={styles.breakdown}>
            <div>
              <dt>
                {formatPrice(nightlyRate)} x {nights} {nights === 1 ? "night" : "nights"}
              </dt>
              <dd>{formatPrice(total)}</dd>
            </div>
            <div>
              <dt>Airbnb service fee</dt>
              <dd>{formatPrice(serviceFee)}</dd>
            </div>
            <div className={styles.total}>
              <dt>Total before taxes</dt>
              <dd>{formatPrice(total + serviceFee)}</dd>
            </div>
          </dl>
        </>
      )}
    </section>
  );
}
