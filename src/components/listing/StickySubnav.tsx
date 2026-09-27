"use client";

import { useEffect, useState } from "react";
import { BOOKING_CARD_ID } from "@/components/booking/BookingSidebar";
import { useBooking } from "@/components/booking/BookingProvider";
import { Icon } from "@/components/icons/Icon";
import { GradientButton } from "@/components/ui/GradientButton";
import { formatPrice, formatRating } from "@/lib/format";
import styles from "./StickySubnav.module.css";

const SUBNAV_HEIGHT = 80;
/** Where the booking card rests once stuck: sidebar sticky top + promo card + gap. */
const BOOKING_CARD_REST_Y = 112 + 68 + 24;

const LINKS = [
  { label: "Photos", target: "photos" },
  { label: "Amenities", target: "amenities" },
  { label: "Reviews", target: "reviews" },
  { label: "Location", target: "location" },
];

/** Scroll-linked in-page nav: appears once the photos leave the viewport, and
 *  grows a booking CTA once the booking card has scrolled away. */
export function StickySubnav({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const [visible, setVisible] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const { nights, nightlyRate, openDatePicker } = useBooking();

  useEffect(() => {
    const hero = document.getElementById("photos");
    const card = document.getElementById(BOOKING_CARD_ID);
    const observers: IntersectionObserver[] = [];
    if (hero) {
      const io = new IntersectionObserver(([entry]) => {
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      });
      io.observe(hero);
      observers.push(io);
    }
    if (card) {
      const io = new IntersectionObserver(
        ([entry]) => setShowCta(!entry.isIntersecting && entry.boundingClientRect.top < SUBNAV_HEIGHT),
        { rootMargin: `-${SUBNAV_HEIGHT}px 0px 0px 0px` },
      );
      io.observe(card);
      observers.push(io);
    }
    return () => observers.forEach((io) => io.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = id === "photos" ? 0 : el.getBoundingClientRect().top + window.scrollY - SUBNAV_HEIGHT + 2;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const bookNow = () => {
    const card = document.getElementById(BOOKING_CARD_ID);
    if (card) {
      window.scrollTo({ top: card.getBoundingClientRect().top + window.scrollY - BOOKING_CARD_REST_Y, behavior: "smooth" });
    }
    openDatePicker();
  };

  return (
    // `visibility: hidden` (CSS) keeps the bar out of the tab order and the
    // accessibility tree until it is shown.
    <nav className={styles.subnav} data-visible={visible || undefined} aria-label="Listing sections">
      <div className={styles.inner}>
        <ul className={styles.links}>
          {LINKS.map((link) => (
            <li key={link.target}>
              <button type="button" className={styles.link} onClick={() => scrollTo(link.target)}>
                <span className={styles.linkLabel}>{link.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.cta} data-visible={showCta || undefined}>
          <div className={styles.ctaText}>
            {nights > 0 ? (
              <span className={styles.ctaTitle}>
                {formatPrice(nights * nightlyRate)} <span className={styles.ctaPer}>for {nights} nights</span>
              </span>
            ) : (
              <span className={styles.ctaTitle}>Add dates for prices</span>
            )}
            <span className={styles.ctaRating}>
              <Icon name="star" size={8} />
              <span className={styles.ctaScore}>{formatRating(rating)}</span>
              <span aria-hidden="true">·</span>
              <span>{reviewCount} reviews</span>
            </span>
          </div>
          <GradientButton className={styles.ctaButton} onClick={bookNow}>
            {nights > 0 ? "Reserve" : "Check availability"}
          </GradientButton>
        </div>
      </div>
    </nav>
  );
}
