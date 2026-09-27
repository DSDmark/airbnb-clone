import { Icon } from "@/components/icons/Icon";
import { formatRating } from "@/lib/format";
import type { RatingCategoryKey, Reviews } from "@/lib/types";
import styles from "./RatingBreakdown.module.css";

const ICONS: Record<RatingCategoryKey, Parameters<typeof Icon>[0]["name"]> = {
  cleanliness: "cleanliness",
  accuracy: "accuracy",
  checkIn: "checkIn",
  communication: "communication",
  location: "location",
  value: "value",
};

/** "Overall rating" histogram followed by the six category scores. */
export function RatingBreakdown({ reviews, compact = false }: { reviews: Reviews; compact?: boolean }) {
  return (
    <div className={compact ? styles.compact : styles.row}>
      <div className={styles.overall}>
        <p className={styles.label}>Overall rating</p>
        <ol className={styles.bars}>
          {reviews.distribution.map((share, i) => (
            <li key={i} className={styles.bar}>
              <span className="visually-hidden">
                {5 - i} stars, {Math.round(share * 100)}% of reviews
              </span>
              <span className={styles.barLabel} aria-hidden="true">
                {5 - i}
              </span>
              <span className={styles.track} aria-hidden="true">
                <span className={styles.fill} style={{ width: `${share * 100}%` }} />
              </span>
            </li>
          ))}
        </ol>
      </div>
      {reviews.categories.map((category) => (
        <div key={category.key} className={styles.category}>
          <div className={styles.categoryText}>
            <h3 className="visually-hidden">
              Rated {formatRating(category.value)} out of 5 stars for {category.label.toLowerCase()}
            </h3>
            <p className={styles.label} aria-hidden="true">
              {category.label}
            </p>
            <p className={styles.label} aria-hidden="true">
              {formatRating(category.value)}
            </p>
          </div>
          <Icon name={ICONS[category.key]} size={24} />
        </div>
      ))}
    </div>
  );
}
