"use client";

import { Icon } from "@/components/icons/Icon";
import { useListingActions } from "@/components/listing/ListingActions";
import button from "@/components/ui/button.module.css";
import { formatRating } from "@/lib/format";
import type { Reviews } from "@/lib/types";
import { GuestFavouriteScore } from "./GuestFavouriteScore";
import { MentionChips } from "./MentionChips";
import { RatingBreakdown } from "./RatingBreakdown";
import { ReviewCard } from "./ReviewCard";
import styles from "./ReviewsSection.module.css";

export function ReviewsSection({ reviews }: { reviews: Reviews }) {
  const { openReviews } = useListingActions();

  return (
    <section id="reviews" className={styles.section} aria-labelledby="reviews-heading">
      {reviews.isGuestFavourite ? (
        <GuestFavouriteScore rating={reviews.overall} count={reviews.count} titleId="reviews-heading" />
      ) : (
        <h2 id="reviews-heading" className={styles.plainHeading}>
          <Icon name="star" size={20} />
          <span className="visually-hidden">
            {formatRating(reviews.overall)} out of 5 stars from {reviews.count} reviews
          </span>
          <span aria-hidden="true">
            {formatRating(reviews.overall)} · {reviews.count} reviews
          </span>
        </h2>
      )}

      <div className={styles.breakdown}>
        <RatingBreakdown reviews={reviews} />
      </div>

      <div className={styles.mentions}>
        <h3 className={styles.mentionsTitle}>Guest reviews mention</h3>
        <MentionChips mentions={reviews.mentions} onSelect={() => openReviews()} />
      </div>

      <ul className={styles.grid}>
        {reviews.items.slice(0, 6).map((review) => (
          <li key={review.id} className={styles.cell}>
            <ReviewCard review={review} onShowMore={() => openReviews(review.id)} />
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={`${button.secondary} ${styles.all}`}
        data-press
        aria-label={`Show all ${reviews.count} reviews, Opens modal dialog`}
        onClick={() => openReviews()}
      >
        Show all {reviews.count} reviews
      </button>
    </section>
  );
}
