import Image from "next/image";
import Link from "next/link";
import { AirbnbLogo } from "@/components/icons/brand";
import { Icon } from "@/components/icons/Icon";
import button from "@/components/ui/button.module.css";
import { cx } from "@/lib/cx";
import { UserMenu } from "./UserMenu";
import styles from "./SiteHeader.module.css";

const HOUSE_ICON =
  "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/4aae4ed7-5939-4e76-b100-e69440ebeae4.png";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.row}>
        <div className={styles.start}>
          <Link href="/" className={styles.logo} aria-label="Airbnb homepage">
            <AirbnbLogo />
          </Link>
        </div>

        <div className={styles.search} role="search">
          <span className="visually-hidden">Start your search</span>
          <button type="button" className={cx(styles.segment, styles.segmentFirst)}>
            <Image src={HOUSE_ICON} alt="" width={48} height={48} sizes="48px" className={styles.house} />
            <span className="visually-hidden">Location</span>
            <span className={styles.segmentText}>Anywhere</span>
          </button>
          <span className={styles.divider} aria-hidden="true" />
          <button type="button" className={styles.segment}>
            <span className="visually-hidden">Check in / Check out</span>
            <span className={styles.segmentText}>Anytime</span>
          </button>
          <span className={styles.divider} aria-hidden="true" />
          <button type="button" className={cx(styles.segment, styles.segmentLast)}>
            <span className="visually-hidden">Guests</span>
            <span className={styles.segmentText}>Add guests</span>
            <span className={styles.searchButton} aria-hidden="true">
              <Icon name="search" size={12} />
            </span>
          </button>
        </div>

        <nav className={styles.end} aria-label="Account">
          <a href="#" className={styles.host} data-press>
            Become a host
          </a>
          <button type="button" className={button.circle} data-press aria-label="Choose a language and currency">
            <Icon name="globe" size={16} />
          </button>
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}
