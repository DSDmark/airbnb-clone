"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type=hidden])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function focusableWithin(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.getClientRects().length > 0 && !el.closest("[inert]"),
  );
}

interface Options {
  /** The overlay is showing: take focus on open, hand it back on close. */
  open: boolean;
  /** Keep Tab / Shift+Tab inside. Defaults to `open`; a covered overlay (tour
   *  under the lightbox) stays open but stops trapping. */
  trap?: boolean;
  /** Element to focus on open; defaults to the container itself. */
  initialFocus?: RefObject<HTMLElement | null>;
}

/**
 * Modal focus management: moves focus in when the overlay opens, cycles Tab
 * within it, and restores focus to the opener when it closes.
 */
export function useFocusTrap(container: RefObject<HTMLElement | null>, { open, trap = open, initialFocus }: Options) {
  useEffect(() => {
    const root = container.current;
    if (!open || !root) return;
    const opener = document.activeElement as HTMLElement | null;
    if (!root.contains(document.activeElement)) {
      (initialFocus?.current ?? root).focus({ preventScroll: true });
    }
    return () => {
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open, container, initialFocus]);

  useEffect(() => {
    const root = container.current;
    if (!open || !trap || !root) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusableWithin(root);
      if (items.length === 0) {
        event.preventDefault();
        root.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      if (!root.contains(current)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && (current === first || current === root)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, trap, container]);
}
