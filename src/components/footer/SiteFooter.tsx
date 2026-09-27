import { Icon } from "@/components/icons/Icon";
import styles from "./SiteFooter.module.css";

const COLUMNS: { title: string; links: string[] }[] = [
  {
    title: "Support",
    links: [
      "Help Centre",
      "Get help with a safety issue",
      "AirCover",
      "Anti-discrimination",
      "Disability support",
      "Cancellation options",
      "Report neighbourhood concern",
    ],
  },
  {
    title: "Hosting",
    links: [
      "Airbnb your home",
      "Airbnb your experience",
      "Airbnb your service",
      "AirCover for Hosts",
      "Hosting resources",
      "Community forum",
      "Hosting responsibly",
      "Join a free hosting class",
      "Find a co‑host",
      "Refer a host",
    ],
  },
  {
    title: "Airbnb",
    links: ["2026 Summer Release", "Newsroom", "Careers", "Investors", "Airbnb.org emergency stays"],
  },
];

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <h2 className="visually-hidden">Site Footer</h2>
      <div className={styles.inner}>
        <div className={styles.columns}>
          {COLUMNS.map((column) => (
            <section key={column.title} aria-labelledby={`footer-${column.title}`}>
              <h3 id={`footer-${column.title}`} className={styles.title}>
                {column.title}
              </h3>
              <ul className={styles.links}>
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className={styles.bar}>
          <p className={styles.legal}>
            <span>© 2026 Airbnb, Inc.</span>
            <span aria-hidden="true">·</span>
            <a href="#">Privacy</a>
            <span aria-hidden="true">·</span>
            <a href="#">Terms</a>
            <span aria-hidden="true">·</span>
            <a href="#">Company details</a>
          </p>
          <div className={styles.prefs}>
            <button type="button" className={styles.pref} aria-label="Choose a language">
              <Icon name="globe" size={16} />
              English (IN)
            </button>
            <button type="button" className={styles.pref} aria-label="Choose a currency">
              <span aria-hidden="true">₹</span>
              INR
            </button>
            <ul className={styles.social}>
              <li>
                <a href="#" aria-label="Navigate to Facebook">
                  <Icon name="facebook" size={16} />
                </a>
              </li>
              <li>
                <a href="#" aria-label="Navigate to Twitter">
                  <Icon name="twitter" size={16} />
                </a>
              </li>
              <li>
                <a href="#" aria-label="Navigate to Instagram">
                  <Icon name="instagram" size={16} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
