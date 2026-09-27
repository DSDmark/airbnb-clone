import Image from "next/image";
import { PaymentProtection } from "@/components/icons/brand";
import { Icon } from "@/components/icons/Icon";
import button from "@/components/ui/button.module.css";
import { formatRating } from "@/lib/format";
import type { Host } from "@/lib/types";
import styles from "./HostSection.module.css";

export function HostSection({ host }: { host: Host }) {
  return (
    <section id="host" className={styles.section} aria-labelledby="host-heading">
      <h2 id="host-heading" className={styles.heading}>
        Meet your host
      </h2>
      <div className={styles.layout}>
        <div className={styles.aside}>
          <a href="#" className={styles.card} aria-label="Go to Host full profile">
            <div className={styles.identity}>
              <span className={styles.avatarWrap}>
                <Image src={host.avatarUrl} alt="" width={88} height={88} sizes="88px" className={styles.avatar} />
                {host.isVerified && (
                  <span className={styles.badge}>
                    <span className="visually-hidden">Identity verified</span>
                    <Icon name="verified" size={16} />
                  </span>
                )}
              </span>
              <span className={styles.name}>{host.name}</span>
              <span className={styles.role}>{host.isSuperhost ? "Superhost" : "Host"}</span>
            </div>
            <dl className={styles.stats}>
              <div>
                <dt className="visually-hidden">{host.reviewCount.toLocaleString("en-IN")} reviews</dt>
                <dd className={styles.statValue} aria-hidden="true">
                  {host.reviewCount}
                </dd>
                <dd className={styles.statLabel} aria-hidden="true">
                  Reviews
                </dd>
              </div>
              <div>
                <dt className="visually-hidden">{formatRating(host.rating)} out of 5 average rating</dt>
                <dd className={styles.statValue} aria-hidden="true">
                  {formatRating(host.rating)}
                  <Icon name="starSmall" size={14} />
                </dd>
                <dd className={styles.statLabel} aria-hidden="true">
                  Rating
                </dd>
              </div>
              <div>
                <dt className="visually-hidden">{host.yearsHosting} years of hosting</dt>
                <dd className={styles.statValue} aria-hidden="true">
                  {host.yearsHosting}
                </dd>
                <dd className={styles.statLabel} aria-hidden="true">
                  Years hosting
                </dd>
              </div>
            </dl>
          </a>
          <ul className={styles.facts}>
            {host.facts.map((fact) => (
              <li key={fact.text}>
                <Icon name={fact.icon} size={24} />
                <span>{fact.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.details}>
          {host.coHosts.length > 0 && (
            <>
              <h3 className={styles.subheading}>Co-Hosts</h3>
              <ul className={styles.coHosts}>
                {host.coHosts.map((person) => (
                  <li key={person.name}>
                    <a href="#" className={styles.coHost} aria-label={`Learn more about the host, ${person.name}.`}>
                      <span className={styles.coHostAvatar}>
                        {person.avatarUrl && <Image src={person.avatarUrl} alt="" width={40} height={40} sizes="40px" />}
                      </span>
                      <span aria-hidden="true">{person.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
          <h3 className={styles.subheading}>Host details</h3>
          <p className={styles.response}>
            Response rate: {host.responseRate}
            <br />
            {host.responseTime}
          </p>
          <a href="#" className={`${button.secondary} ${styles.message}`} data-press>
            Message host
          </a>
          <p className={styles.notice}>
            <PaymentProtection />
            <span>To help protect your payment, always use Airbnb to send money and communicate with hosts.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
