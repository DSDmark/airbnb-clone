import { Icon } from "@/components/icons/Icon";
import type { Highlight } from "@/lib/types";
import styles from "./Highlights.module.css";

export function Highlights({ items }: { items: Highlight[] }) {
  return (
    <section className={styles.section} aria-labelledby="highlights-heading">
      <h2 id="highlights-heading" className="visually-hidden">
        Listing highlights
      </h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.title} className={styles.item}>
            <span className={styles.icon}>
              <Icon name={item.icon} size={24} />
            </span>
            <div>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.subtitle}>{item.subtitle}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
