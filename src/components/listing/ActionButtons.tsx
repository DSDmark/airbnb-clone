"use client";

import { Icon } from "@/components/icons/Icon";
import button from "@/components/ui/button.module.css";
import { cx } from "@/lib/cx";
import { useListingActions } from "./ListingActions";
import styles from "./ActionButtons.module.css";

type Variant = "labelled" | "icon";

export function ShareButton({ variant = "labelled", className }: { variant?: Variant; className?: string }) {
  const { openShare } = useListingActions();
  if (variant === "icon") {
    return (
      <button type="button" className={cx(styles.iconButton, className)} aria-label="Share" onClick={openShare}>
        <Icon name="share" size={16} />
      </button>
    );
  }
  return (
    <button type="button" className={cx(button.ghost, className)} data-press onClick={openShare}>
      <Icon name="share" size={16} />
      <span className={button.ghostLabel}>Share</span>
    </button>
  );
}

export function SaveButton({ variant = "labelled", className }: { variant?: Variant; className?: string }) {
  const { saved, toggleSaved } = useListingActions();
  const heart = <Icon name="heart" size={16} className={cx(styles.heart, saved && styles.heartSaved)} />;

  if (variant === "icon") {
    return (
      <button
        type="button"
        className={cx(styles.iconButton, className)}
        aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={saved}
        onClick={toggleSaved}
      >
        {heart}
      </button>
    );
  }
  return (
    <button
      type="button"
      className={cx(button.ghost, className)}
      data-press
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={saved}
      onClick={toggleSaved}
    >
      {heart}
      <span className={button.ghostLabel} aria-hidden="true">
        {saved ? "Saved" : "Save"}
      </span>
    </button>
  );
}
