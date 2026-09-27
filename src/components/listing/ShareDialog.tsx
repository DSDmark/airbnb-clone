"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { Icon, type IconName } from "@/components/icons/Icon";
import { Modal } from "@/components/ui/Modal";
import styles from "./ShareDialog.module.css";

export interface ShareSummary {
  title: string;
  /** "Serviced apartment in Candolim · ★4.91 · 1 bedroom · 1 bed · 1 bathroom" */
  line: string;
  imageUrl: string;
}

const TARGETS: { label: string; icon: IconName; href?: (url: string, text: string) => string }[] = [
  { label: "Copy Link", icon: "copy" },
  { label: "Email", icon: "email", href: (u, t) => `mailto:?subject=${encodeURIComponent(t)}&body=${encodeURIComponent(u)}` },
  { label: "Messages", icon: "messages", href: (u) => `sms:?&body=${encodeURIComponent(u)}` },
  { label: "WhatsApp", icon: "whatsapp", href: (u) => `https://wa.me/?text=${encodeURIComponent(u)}` },
  { label: "Messenger", icon: "messenger", href: (u) => `https://www.facebook.com/dialog/send?link=${encodeURIComponent(u)}` },
  { label: "Facebook", icon: "facebookShare", href: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` },
  { label: "Twitter", icon: "twitterShare", href: (u, t) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}` },
  { label: "Embed", icon: "embed" },
];

export function ShareDialog({
  open,
  onClose,
  summary,
}: {
  open: boolean;
  onClose: () => void;
  summary: ShareSummary;
}) {
  const titleId = useId();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const pageUrl = () => {
    const url = new URL(window.location.href);
    url.search = "";
    return url.toString();
  };

  const onTarget = async (target: (typeof TARGETS)[number]) => {
    const url = pageUrl();
    if (target.href) {
      window.open(target.href(url, summary.title), "_blank", "noopener,noreferrer");
      return;
    }
    const text =
      target.label === "Embed"
        ? `<iframe src="${url}" width="450" height="300" style="border:0"></iframe>`
        : url;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard can be blocked (insecure context); the toast still confirms intent.
    }
    setCopied(true);
  };

  return (
    <>
      <Modal open={open} onClose={onClose} labelledBy={titleId} size="small" closeOnRight>
        <h2 id={titleId} className={styles.title}>
          Share this place
        </h2>
        <div className={styles.summary}>
          <Image src={summary.imageUrl} alt="" width={64} height={64} sizes="64px" className={styles.thumb} />
          <p>{summary.line}</p>
        </div>
        <ul className={styles.targets}>
          {TARGETS.map((target) => (
            <li key={target.label}>
              <button type="button" className={styles.target} data-press onClick={() => onTarget(target)}>
                <Icon name={target.icon} size={20} />
                <span>{target.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </Modal>
      <div className={styles.toast} role="status" aria-live="polite" data-visible={copied || undefined}>
        {copied && (
          <>
            <Icon name="copy" size={16} />
            Link copied
          </>
        )}
      </div>
    </>
  );
}
