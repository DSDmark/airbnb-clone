"use client";

import { useEffect } from "react";

/**
 * DLS buttons "press in" by exactly 1px per side regardless of their size,
 * which a fixed CSS scale can't express. One delegated listener computes the
 * per-element scale on pointer-down and exposes it to `[data-press]:active`.
 */
export function PressFeedback() {
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>("[data-press]");
      if (!target) return;
      const { offsetWidth: w, offsetHeight: h } = target;
      if (!w || !h) return;
      target.style.setProperty("--press-x", String((w - 2) / w));
      target.style.setProperty("--press-y", String((h - 2) / h));
    };
    document.addEventListener("pointerdown", onPointerDown, { capture: true });
    return () => document.removeEventListener("pointerdown", onPointerDown, { capture: true });
  }, []);

  return null;
}
