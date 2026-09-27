import { Icon } from "@/components/icons/Icon";
import type { Listing } from "@/lib/types";
import styles from "./SeoLinks.module.css";

export function SeoLinks({ listing }: { listing: Listing }) {
  const nearby = listing.locationLabel.split(",")[0];
  return (
    <div className={styles.band}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumbs">
        <ol className={styles.inner}>
          {listing.breadcrumbs.map((crumb, i) => (
            <li key={crumb.label} className={styles.crumb}>
              <a href={crumb.href}>{crumb.label}</a>
              {i < listing.breadcrumbs.length - 1 && <Icon name="breadcrumbChevron" size={7} />}
            </li>
          ))}
        </ol>
      </nav>
      <section className={styles.explore} aria-labelledby="explore-heading">
        <div className={styles.inner}>
          <h2 id="explore-heading" className={styles.heading}>
            Explore other options in and around {nearby}
          </h2>
          <ul className={styles.nearby}>
            {listing.exploreNearby.map((item) => (
              <li key={item.title}>
                <a href={item.href} className={styles.nearbyLink}>
                  <span className={styles.nearbyTitle}>{item.title}</span>
                  <span className={styles.nearbySubtitle}>{item.subtitle}</span>
                </a>
              </li>
            ))}
          </ul>
          <h3 className={styles.subheading}>Other types of stays on Airbnb</h3>
          <ul className={styles.stays}>
            {listing.otherStays.map((item) => (
              <li key={item.label}>
                <a href={item.href} className={styles.stayLink}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
