import { Icon } from "@/components/icons/Icon";
import styles from "./Stars.module.css";

/** Row of filled/empty stars; purely visual — callers provide the text alternative. */
export function Stars({ rating, size = 10, gap = 2 }: { rating: number; size?: number; gap?: number }) {
  const filled = Math.round(rating);
  return (
    <span className={styles.stars} style={{ gap }} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} name="star" size={size} className={i < filled ? styles.on : styles.off} />
      ))}
    </span>
  );
}
