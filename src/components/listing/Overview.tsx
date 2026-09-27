"use client";

import { LaurelLeft, LaurelRight } from "@/components/icons/brand";
import { Stars } from "@/components/ui/Stars";
import { formatRating } from "@/lib/format";
import type { Listing } from "@/lib/types";
import { useListingActions } from "./ListingActions";
import section from "./section.module.css";
import styles from "./Overview.module.css";

export function Overview({ listing }: { listing: Listing }) {
  const { openReviews } = useListingActions();
  const { reviews } = listing;

  return (
    <section className={styles.overview}>
      <h2 className={section.heading}>
        {listing.propertyType} in {listing.locationLabel}
      </h2>
      <ol className={styles.capacity}>
        {listing.capacity.map((item, i) => (
          <li key={item}>
            {i > 0 && <span aria-hidden="true"> · </span>}
            {item}
          </li>
        ))}
      </ol>

      {reviews.isGuestFavourite ? (
        <button type="button" className={styles.favourite} onClick={() => openReviews()}>
          <span className={styles.badge}>
            <LaurelLeft className={styles.laurel} />
            <span className={styles.badgeText}>
              Guest
              <br />
              favourite
            </span>
            <LaurelRight className={styles.laurel} />
          </span>
          <span className={styles.favouriteCopy}>One of the most loved homes on Airbnb, according to guests</span>
          <span className={styles.metric}>
            <span className="visually-hidden">Rated {formatRating(reviews.overall)} out of 5 stars.</span>
            <span className={styles.metricValue} aria-hidden="true">
              {formatRating(reviews.overall)}
            </span>
            <Stars rating={reviews.overall} size={10} />
          </span>
          <span className={styles.metricDivider} aria-hidden="true" />
          <span className={styles.metric}>
            <span className={styles.metricValue}>{reviews.count}</span>
            <span className={styles.metricLabel}>Reviews</span>
          </span>
        </button>
      ) : (
        <p className={styles.rating}>
          <span aria-hidden="true">★ </span>
          <span className="visually-hidden">Rated {formatRating(reviews.overall)} out of 5 stars.</span>
          <span aria-hidden="true">{formatRating(reviews.overall)}</span>
          <span aria-hidden="true"> · </span>
          <button type="button" className={styles.ratingLink} onClick={() => openReviews()}>
            {reviews.count} reviews
          </button>
        </p>
      )}
    </section>
  );
}
