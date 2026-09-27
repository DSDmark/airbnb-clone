"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { cx } from "@/lib/cx";
import type { ReviewMention } from "@/lib/types";
import styles from "./MentionChips.module.css";

/** Horizontally scrolling "Guest reviews mention" chips with paging arrows. */
export function MentionChips({
  mentions,
  onSelect,
  size = "regular",
}: {
  mentions: ReviewMention[];
  onSelect?: (mention: ReviewMention) => void;
  size?: "regular" | "small";
}) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () =>
      setEdges({ start: el.scrollLeft <= 1, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const page = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    el?.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className={cx(styles.carousel, size === "small" && styles.small)}>
      <ul ref={scrollerRef} className={styles.scroller}>
        {mentions.map((mention) => (
          <li key={mention.label}>
            <button type="button" className={styles.chip} onClick={() => onSelect?.(mention)}>
              <Image src={mention.iconUrl} alt="" width={20} height={20} sizes="20px" className={styles.icon} />
              <span className={styles.label}>{mention.label}</span>
              <span className={styles.count}>{mention.count}</span>
            </button>
          </li>
        ))}
      </ul>
      {!edges.start && (
        <button type="button" className={cx(styles.arrow, styles.prev)} aria-label="Previous" onClick={() => page(-1)}>
          <Icon name="chevronLeft" size={12} />
        </button>
      )}
      {!edges.end && (
        <button type="button" className={cx(styles.arrow, styles.next)} aria-label="Next" onClick={() => page(1)}>
          <Icon name="chevronRight" size={12} />
        </button>
      )}
    </div>
  );
}
