"use client";

import { useEffect, useState } from "react";

export type PresenceState = "open" | "closing";

/**
 * Keeps an overlay mounted for `exitMs` after `open` turns false so its exit
 * animation can play; `state` drives the CSS (`data-state="closing"`).
 */
export function usePresence(open: boolean, exitMs: number) {
  const [mounted, setMounted] = useState(open);

  if (open && !mounted) setMounted(true);

  useEffect(() => {
    if (open || !mounted) return;
    const timer = window.setTimeout(() => setMounted(false), exitMs);
    return () => window.clearTimeout(timer);
  }, [open, mounted, exitMs]);

  return { mounted, state: (open ? "open" : "closing") as PresenceState };
}
