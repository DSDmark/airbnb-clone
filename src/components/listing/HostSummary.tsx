import Image from "next/image";
import type { Host } from "@/lib/types";
import styles from "./HostSummary.module.css";

export function HostSummary({ host }: { host: Host }) {
  const meta = [host.isSuperhost && "Superhost", `${host.yearsHosting} years hosting`].filter(Boolean);
  return (
    <div className={styles.row}>
      <a href="#host" className={styles.avatar} aria-label={`Learn more about the host, ${host.name}.`}>
        <Image src={host.avatarUrl} alt="" width={40} height={40} sizes="40px" />
      </a>
      <div>
        <p className={styles.name}>Hosted by {host.name}</p>
        <ol className={styles.meta}>
          {meta.map((item, i) => (
            <li key={String(item)}>
              {i > 0 && <span aria-hidden="true"> · </span>}
              {item}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
