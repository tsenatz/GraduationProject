"use client";

import Link from "next/link";
import { ErnsLogo } from "@/components/icons/ErnsLogo";
import styles from "./RentalManagerDashboard.module.css";

export function RentalManagerTopHeader() {
  return (
    <header className={styles.topHeader}>
      <Link href="/" className={styles.brandLogo} aria-label="ERNS Rentals Home">
        <ErnsLogo height={24} className={styles.brandLogoSvg} priority />
        <span className={styles.brandBadge}>Rentals</span>
      </Link>
    </header>
  );
}

