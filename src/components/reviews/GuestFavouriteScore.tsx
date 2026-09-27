import Image from "next/image";
import { formatRating } from "@/lib/format";
import { cx } from "@/lib/cx";
import styles from "./GuestFavouriteScore.module.css";

const LAUREL_LEFT =
  "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-GuestFavorite/original/78b7687c-5acf-4ef8-a5ea-eda732ae3b2f.png";
const LAUREL_RIGHT =
  "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-GuestFavorite/original/b4005b30-79ff-4287-860c-67829ecd7412.png";

/** Laurel-framed score used at the top of the reviews section and dialog. */
export function GuestFavouriteScore({
  rating,
  count,
  titleId,
  size = "page",
}: {
  rating: number;
  count: number;
  titleId?: string;
  size?: "page" | "dialog";
}) {
  return (
    <div className={cx(styles.block, size === "dialog" && styles.dialog)}>
      <div className={styles.score}>
        <Image src={LAUREL_LEFT} alt="" width={87} height={132} sizes="120px" className={styles.laurel} />
        <span className="visually-hidden">
          Rated {formatRating(rating)} out of 5 from {count} reviews.
        </span>
        <span className={styles.value} aria-hidden="true">
          {formatRating(rating)}
        </span>
        <Image src={LAUREL_RIGHT} alt="" width={87} height={132} sizes="120px" className={styles.laurel} />
      </div>
      <h2 id={titleId} className={styles.title}>
        Guest favourite
      </h2>
      <p className={styles.copy}>This home is a guest favourite based on ratings, reviews and reliability</p>
      <button type="button" className={styles.how}>
        How reviews work
      </button>
    </div>
  );
}
