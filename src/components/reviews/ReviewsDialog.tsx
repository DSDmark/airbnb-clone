"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { Modal } from "@/components/ui/Modal";
import type { Reviews } from "@/lib/types";
import { GuestFavouriteScore } from "./GuestFavouriteScore";
import { MentionChips } from "./MentionChips";
import { RatingBreakdown } from "./RatingBreakdown";
import { ReviewCard } from "./ReviewCard";
import styles from "./ReviewsDialog.module.css";

type Sort = "relevant" | "recent" | "highest" | "lowest";

const SORTS: { value: Sort; label: string }[] = [
  { value: "relevant", label: "Most relevant" },
  { value: "recent", label: "Most recent" },
  { value: "highest", label: "Highest rated" },
  { value: "lowest", label: "Lowest rated" },
];

export function ReviewsDialog({
  open,
  onClose,
  reviews,
  focusReviewId,
}: {
  open: boolean;
  onClose: () => void;
  reviews: Reviews;
  /** Review to scroll into view when opened from its "Show more". */
  focusReviewId: string | null;
}) {
  const titleId = useId();
  const [sort, setSort] = useState<Sort>("relevant");
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q ? reviews.items.filter((r) => r.text.toLowerCase().includes(q)) : reviews.items;
    const sorted = [...filtered];
    if (sort === "highest") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "lowest") sorted.sort((a, b) => a.rating - b.rating);
    return sorted;
  }, [reviews.items, sort, query]);

  useEffect(() => {
    if (!open || !focusReviewId) return;
    const frame = requestAnimationFrame(() =>
      document.getElementById(`dialog-review-${focusReviewId}`)?.scrollIntoView({ block: "center" }),
    );
    return () => cancelAnimationFrame(frame);
  }, [open, focusReviewId]);

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} size="large" closeOnRight floatingHeader bodyClassName={styles.body}>
      <div className={styles.summary}>
        {reviews.isGuestFavourite ? (
          <GuestFavouriteScore rating={reviews.overall} count={reviews.count} titleId={titleId} size="dialog" />
        ) : (
          <h2 id={titleId} className={styles.plainTitle}>
            {reviews.overall} · {reviews.count} reviews
          </h2>
        )}
        <div className={styles.breakdown}>
          <RatingBreakdown reviews={reviews} compact />
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.mentionsTitle}>Guest reviews mention</h3>
        <MentionChips mentions={reviews.mentions} size="small" onSelect={(m) => setQuery(m.label)} />

        <div className={styles.toolbar}>
          <h3 className={styles.count}>{reviews.count} reviews</h3>
          <div className={styles.tools}>
            <label className={styles.sort}>
              <span className="visually-hidden">Sort reviews</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <Icon name="chevronDown" size={12} />
            </label>
            {searching ? (
              <input
                className={styles.search}
                type="search"
                placeholder="Search reviews"
                aria-label="Search reviews"
                value={query}
                autoFocus
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => !query && setSearching(false)}
              />
            ) : (
              <button type="button" className={styles.searchButton} aria-label="Search reviews" onClick={() => setSearching(true)}>
                <Icon name="search" size={16} strokeWidth={4} />
              </button>
            )}
          </div>
        </div>

        <ul className={styles.list}>
          {items.map((review) => (
            <li key={review.id} id={`dialog-review-${review.id}`}>
              <ReviewCard review={review} clamp={false} />
            </li>
          ))}
          {items.length === 0 && <li className={styles.empty}>No reviews match “{query}”.</li>}
        </ul>
      </div>
    </Modal>
  );
}
