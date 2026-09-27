"use client";

import { useEffect, useRef } from "react";

// Overlays stack (photo tour → lightbox → share dialog). Escape must close only
// the top-most one, and must work even when focus has fallen back to <body>
// (e.g. the focused control unmounted), so it's handled at the document level.
const stack: symbol[] = [];

export function useEscapeStack(active: boolean, onEscape: () => void) {
  const handler = useRef(onEscape);
  useEffect(() => {
    handler.current = onEscape;
  });

  useEffect(() => {
    if (!active) return;
    const token = Symbol("overlay");
    stack.push(token);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || stack[stack.length - 1] !== token) return;
      event.preventDefault();
      handler.current();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      stack.splice(stack.indexOf(token), 1);
    };
  }, [active]);
}
