import Link from "next/link";
import { Home, User } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Left Navigation Items - aligned to flex-end towards the logo */}
        <nav className={styles.navSectionLeft}>
          <Link href="/buy" className={styles.navLink}>Buy</Link>
          <Link href="/rent" className={styles.navLink}>Rent</Link>
          <Link href="/sell" className={styles.navLink}>Sell</Link>
          <Link href="/mortgage" className={styles.navLink}>Get a mortgage</Link>
          <Link href="/agents" className={styles.navLink}>Find an agent</Link>
        </nav>

        {/* Center Brand */}
        <div className={styles.brandContainer}>
          <Link href="/" className={styles.brand}>
            <Home className={styles.brandIcon} />
            <span className={styles.brandText}>ERNS</span>
          </Link>
        </div>

        {/* Right Navigation Items - aligned to flex-start outwards */}
        <nav className={styles.navSectionRight}>
          <Link href="/manage-rentals" className={styles.navLink}>Manage rentals</Link>
          <Link href="/advertise" className={styles.navLink}>Advertise</Link>
          <Link href="/get-help" className={styles.navLink}>Get help</Link>
          <Link href="/profile" className={styles.avatarBtn} aria-label="Profile">
            <User className={styles.avatarIcon} />
          </Link>
        </nav>
      </div>
    </header>
  );
}