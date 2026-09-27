"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Tracks whether `target` intersects the viewport. `rootMargin` lets callers
 * account for fixed chrome, e.g. "-80px 0px 0px 0px" for the sticky subnav.
 */
export function useInView(
  target: RefObject<Element | null>,
  { rootMargin = "0px", initial = true }: { rootMargin?: string; initial?: boolean } = {},
) {
  const [inView, setInView] = useState(initial);

  useEffect(() => {
    const el = target.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, rootMargin]);

  return inView;
}
