"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { ReviewsDialog } from "@/components/reviews/ReviewsDialog";
import type { Reviews } from "@/lib/types";
import { ShareDialog, type ShareSummary } from "./ShareDialog";

interface ListingActionsValue {
  saved: boolean;
  toggleSaved: () => void;
  openShare: () => void;
  /** Opens the all-reviews dialog, optionally scrolled to one review. */
  openReviews: (reviewId?: string) => void;
}

const ListingActionsContext = createContext<ListingActionsValue | null>(null);

const storageKey = (listingId: string) => `wishlist:${listingId}`;
const SAVED_CHANGE = "wishlist:change";

// The saved flag is read straight from localStorage (the stand-in for a
// wishlist backend) and stays in sync across tabs via the storage event.
function subscribeSaved(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(SAVED_CHANGE, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SAVED_CHANGE, onChange);
  };
}

function readSaved(listingId: string): boolean {
  try {
    return window.localStorage.getItem(storageKey(listingId)) === "1";
  } catch {
    return false; // Storage unavailable (e.g. privacy mode).
  }
}

/**
 * Page-level actions reachable from several places: Save and Share (title bar,
 * photo tour, lightbox) and the reviews dialog (overview badge, review cards).
 * Each dialog is rendered once here.
 */
export function ListingActionsProvider({
  listingId,
  share,
  reviews,
  children,
}: {
  listingId: string;
  share: ShareSummary;
  reviews: Reviews;
  children: ReactNode;
}) {
  const saved = useSyncExternalStore(
    subscribeSaved,
    () => readSaved(listingId),
    () => false,
  );
  const [shareOpen, setShareOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [focusReviewId, setFocusReviewId] = useState<string | null>(null);

  const toggleSaved = useCallback(() => {
    try {
      window.localStorage.setItem(storageKey(listingId), readSaved(listingId) ? "0" : "1");
    } catch {
      return;
    }
    window.dispatchEvent(new Event(SAVED_CHANGE));
  }, [listingId]);

  const value = useMemo<ListingActionsValue>(
    () => ({
      saved,
      toggleSaved,
      openShare: () => setShareOpen(true),
      openReviews: (reviewId) => {
        setFocusReviewId(reviewId ?? null);
        setReviewsOpen(true);
      },
    }),
    [saved, toggleSaved],
  );

  return (
    <ListingActionsContext.Provider value={value}>
      {children}
      <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} summary={share} />
      <ReviewsDialog
        open={reviewsOpen}
        onClose={() => setReviewsOpen(false)}
        reviews={reviews}
        focusReviewId={focusReviewId}
      />
    </ListingActionsContext.Provider>
  );
}

export function useListingActions(): ListingActionsValue {
  const ctx = useContext(ListingActionsContext);
  if (!ctx) throw new Error("useListingActions must be used inside <ListingActionsProvider>");
  return ctx;
}
