"use client";

import { useId, useState } from "react";
import { useBooking } from "@/components/booking/BookingProvider";
import { Icon } from "@/components/icons/Icon";
import { Modal } from "@/components/ui/Modal";
import type { PolicyBlock } from "@/lib/types";
import styles from "./ThingsToKnow.module.css";

export function ThingsToKnow({ policies }: { policies: PolicyBlock[] }) {
  const [active, setActive] = useState<PolicyBlock | null>(null);
  const { openDatePicker } = useBooking();
  const titleId = useId();

  const onLink = (policy: PolicyBlock) => {
    if (policy.linkLabel === "Add dates") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      openDatePicker();
    } else {
      setActive(policy);
    }
  };

  return (
    <section className={styles.section} aria-labelledby="things-heading">
      <h2 id="things-heading" className={styles.heading}>
        Things to know
      </h2>
      <ul className={styles.grid}>
        {policies.map((policy) => (
          <li key={policy.title} className={styles.item}>
            <Icon name={policy.icon} size={24} />
            <h3 className={styles.title}>{policy.title}</h3>
            {policy.lines.map((line) => (
              <p key={line} className={styles.line}>
                {line}
              </p>
            ))}
            <button
              type="button"
              className={styles.link}
              aria-label={policy.linkLabel === "Learn more" ? `Learn more about ${policy.title}` : undefined}
              onClick={() => onLink(policy)}
            >
              {policy.linkLabel}
            </button>
          </li>
        ))}
      </ul>

      <Modal open={!!active} onClose={() => setActive(null)} labelledBy={titleId}>
        {active && (
          <>
            <h2 id={titleId} className={styles.modalTitle}>
              {active.title}
            </h2>
            <ul className={styles.modalList}>
              {active.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </>
        )}
      </Modal>
    </section>
  );
}
