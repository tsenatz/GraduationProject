import Link from "next/link";
import styles from "./AuthTabs.module.css";

type AuthTab = "login" | "signup";

interface AuthTabsProps {
  activeTab: AuthTab;
}

/**
 * Sign In / Sign Up tab switcher placed in the top-right corner of auth pages.
 */
export function AuthTabs({ activeTab }: AuthTabsProps) {
  return (
    <div className={styles.topTabs}>
      <Link
        href="/login"
        className={`${styles.tab} ${activeTab === "login" ? styles.activeTab : ""}`}
      >
        Sign In
      </Link>
      <Link
        href="/signup"
        className={`${styles.tab} ${activeTab === "signup" ? styles.activeTab : ""}`}
      >
        Sign Up
      </Link>
    </div>
  );
}
