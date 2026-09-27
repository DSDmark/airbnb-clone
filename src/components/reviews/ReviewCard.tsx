import Image from "next/image";
import { Stars } from "@/components/ui/Stars";
import type { Review } from "@/lib/types";
import styles from "./ReviewCard.module.css";

export function ReviewCard({
  review,
  clamp = true,
  onShowMore,
}: {
  review: Review;
  /** Truncate the body to three lines (page grid) or show it all (dialog). */
  clamp?: boolean;
  onShowMore?: () => void;
}) {
  return (
    <article className={styles.card} aria-label={`Review by ${review.author.name}`}>
      <header className={styles.author}>
        <span className={styles.avatar}>
          {review.author.avatarUrl && (
            <Image src={review.author.avatarUrl} alt={review.author.name} width={48} height={48} sizes="48px" />
          )}
        </span>
        <div className={styles.who}>
          <h3 className={styles.name}>{review.author.name}</h3>
          <p className={styles.tenure}>{review.tenure}</p>
        </div>
      </header>
      <p className={styles.meta}>
        <span className="visually-hidden">Rating, {review.rating} stars, </span>
        <Stars rating={review.rating} size={9} gap={1} />
        <span aria-hidden="true" className={styles.dot}>
          ·
        </span>
        <span>{review.date}</span>
      </p>
      <p className={clamp ? styles.textClamped : styles.text}>{review.text}</p>
      {clamp && review.hasMore && onShowMore && (
        <button type="button" className={styles.more} onClick={onShowMore}>
          Show more
        </button>
      )}
    </article>
  );
}
