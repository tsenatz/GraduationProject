import Link from "next/link";
import { Search, Bell, Heart, ClipboardCheck, Inbox } from "lucide-react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/search" className={styles.navLink}>
            <Search className={styles.icon} />
            <span className={styles.label}>Search</span>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/updates" className={styles.navLink}>
            <Bell className={styles.icon} />
            <span className={styles.label}>Updates</span>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/favorites" className={styles.navLink}>
            <Heart className={styles.icon} />
            <span className={styles.label}>Favorites</span>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/plan" className={styles.navLink}>
            <ClipboardCheck className={styles.icon} />
            <span className={styles.label}>Plan</span>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/inbox" className={styles.navLink}>
            <Inbox className={styles.icon} />
            <span className={styles.label}>Inbox</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
}
