import { SaveButton, ShareButton } from "./ActionButtons";
import styles from "./TitleBar.module.css";

export function TitleBar({ title }: { title: string }) {
  return (
    <div className={styles.bar}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.actions}>
        <ShareButton />
        <SaveButton />
      </div>
    </div>
  );
}
