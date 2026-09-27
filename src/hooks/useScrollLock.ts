"use client";

import { useEffect } from "react";

// Overlays can stack (photo tour → lightbox → share dialog), so the lock is
// reference-counted and only the first/last holder touches <body>. The root
// reserves its scrollbar gutter (globals.css), so locking causes no reflow.
let holders = 0;
let previousOverflow = "";

function lock() {
  if (holders++ > 0) return;
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
}

function unlock() {
  if (--holders > 0) return;
  document.body.style.overflow = previousOverflow;
}

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lock();
    return unlock;
  }, [active]);
}
