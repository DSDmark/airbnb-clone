"use client";

import { useId, useState } from "react";
import button from "@/components/ui/button.module.css";
import { Modal } from "@/components/ui/Modal";
import type { DescriptionSection } from "@/lib/types";
import styles from "./Description.module.css";

function DescriptionBody({ sections }: { sections: DescriptionSection[] }) {
  return (
    <>
      {sections.map((s, i) => (
        <span key={s.title ?? i}>
          {i > 0 && "\n\n"}
          {s.title && (
            <>
              <span className={styles.sectionTitle}>{s.title}</span>
              {"\n"}
            </>
          )}
          {s.body}
        </span>
      ))}
    </>
  );
}

export function Description({ sections, translated }: { sections: DescriptionSection[]; translated: boolean }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  return (
    <section className={styles.section} aria-label="About this place">
      {translated && (
        <p className={styles.notice}>
          Some info has been automatically translated.{" "}
          <button type="button" className={button.link}>
            Show original
          </button>
        </p>
      )}
      <div className={styles.preview}>
        <DescriptionBody sections={sections} />
      </div>
      <button
        type="button"
        className={`${button.secondary} ${styles.more}`}
        data-press
        aria-label="Show more about this place"
        onClick={() => setOpen(true)}
      >
        Show more
      </button>

      <Modal open={open} onClose={() => setOpen(false)} labelledBy={titleId}>
        <h2 id={titleId} className={styles.modalTitle}>
          About this space
        </h2>
        <div className={styles.full}>
          <DescriptionBody sections={sections} />
        </div>
      </Modal>
    </section>
  );
}
