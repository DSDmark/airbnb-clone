"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/icons/Icon";
import button from "@/components/ui/button.module.css";
import styles from "./UserMenu.module.css";

const HOST_ILLUSTRATION =
  "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-UserProfile/original/5347d650-16de-4f5a-a38e-79edc988befa.png";

/** Header account menu, following the WAI-ARIA menu-button pattern. */
export function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const items = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? []);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    items()[0]?.focus();
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  const onMenuKeyDown = (event: KeyboardEvent) => {
    const list = items();
    const index = list.indexOf(document.activeElement as HTMLElement);
    const focusAt = (i: number) => list[(i + list.length) % list.length]?.focus();
    switch (event.key) {
      case "ArrowDown":
        focusAt(index + 1);
        break;
      case "ArrowUp":
        focusAt(index - 1);
        break;
      case "Home":
        focusAt(0);
        break;
      case "End":
        focusAt(list.length - 1);
        break;
      case "Escape":
        close(true);
        break;
      case "Tab":
        close(false);
        return;
      default:
        return;
    }
    event.preventDefault();
  };

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        ref={triggerRef}
        type="button"
        className={button.circle}
        data-press
        aria-label="Main navigation menu"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !open) {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <Icon name="menu" size={16} />
      </button>

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label="Main navigation menu"
          className={styles.menu}
          onKeyDown={onMenuKeyDown}
        >
          <a role="menuitem" tabIndex={-1} href="#" className={styles.item}>
            <Icon name="help" size={16} />
            Help Centre
          </a>
          <hr className={styles.rule} />
          <a role="menuitem" tabIndex={-1} href="#" className={styles.hostItem}>
            <span className={styles.hostCopy}>
              <span className={styles.hostTitle}>Become a host</span>
              <span className={styles.hostSubtitle}>It’s easy to start hosting and earn extra income.</span>
            </span>
            <Image src={HOST_ILLUSTRATION} alt="" width={48} height={48} sizes="48px" />
          </a>
          <hr className={styles.rule} />
          <a role="menuitem" tabIndex={-1} href="#" className={styles.item}>
            Refer a host
          </a>
          <a role="menuitem" tabIndex={-1} href="#" className={styles.item}>
            Find a co-host
          </a>
          <hr className={styles.rule} />
          <a role="menuitem" tabIndex={-1} href="#" className={styles.item}>
            Log in or sign up
          </a>
        </div>
      )}
    </div>
  );
}
