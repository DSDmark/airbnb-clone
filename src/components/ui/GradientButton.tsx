"use client";

import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { cx } from "@/lib/cx";
import button from "./button.module.css";
import styles from "./GradientButton.module.css";

/**
 * Brand CTA. On hover a radial highlight fades in and tracks the pointer
 * (`--mouse-x/--mouse-y` in % of the button), as on the reference.
 */
export function GradientButton({ className, children, onMouseMove, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const track = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mouse-x", String(((event.clientX - rect.left) / rect.width) * 100));
    event.currentTarget.style.setProperty("--mouse-y", String(((event.clientY - rect.top) / rect.height) * 100));
    onMouseMove?.(event);
  };

  return (
    <button type="button" className={cx(button.primary, styles.gradient, className)} data-press onMouseMove={track} {...rest}>
      <span className={styles.glow} aria-hidden="true" />
      <span className={styles.label}>{children}</span>
    </button>
  );
}
