"use client";

import { useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/icons/Icon";
import { useEscapeStack } from "@/hooks/useEscapeStack";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useIsClient } from "@/hooks/useIsClient";
import { usePresence } from "@/hooks/usePresence";
import { useScrollLock } from "@/hooks/useScrollLock";
import { cx } from "@/lib/cx";
import styles from "./Modal.module.css";

/** Longest exit animation (backdrop fade) — keep in sync with Modal.module.css. */
const EXIT_MS = 250;

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name; pass `labelledBy` instead when a visible heading exists. */
  label?: string;
  labelledBy?: string;
  /** Panel width preset. */
  size?: "small" | "medium" | "large";
  /** Close button on the right instead of the left (share / reviews dialogs). */
  closeOnRight?: boolean;
  /** Let the body run underneath the close button (full-bleed tinted headers). */
  floatingHeader?: boolean;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}

export function Modal(props: ModalProps) {
  const { mounted, state } = usePresence(props.open, EXIT_MS);
  const isClient = useIsClient();

  if (!mounted || !isClient) return null;
  return createPortal(<ModalSurface {...props} state={state} />, document.body);
}

function ModalSurface({
  onClose,
  label,
  labelledBy,
  size = "medium",
  closeOnRight = false,
  floatingHeader = false,
  className,
  bodyClassName,
  children,
  state,
}: ModalProps & { state: "open" | "closing" }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const open = state === "open";

  useScrollLock(true);
  useFocusTrap(panelRef, { open });
  useEscapeStack(open, onClose);

  return (
    <div className={styles.root} data-state={state}>
      <div className={styles.backdrop} aria-hidden="true" onClick={onClose} />
      <div className={styles.frame}>
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={labelledBy ? undefined : label}
          aria-labelledby={labelledBy}
          tabIndex={-1}
          className={cx(styles.panel, styles[size], className)}
        >
          <div className={cx(styles.header, closeOnRight && styles.headerEnd, floatingHeader && styles.headerFloating)}>
            <button type="button" className={styles.close} aria-label="Close" onClick={onClose}>
              <Icon name="close" size={16} />
            </button>
          </div>
          <div className={cx(styles.body, bodyClassName)}>{children}</div>
        </div>
      </div>
    </div>
  );
}
