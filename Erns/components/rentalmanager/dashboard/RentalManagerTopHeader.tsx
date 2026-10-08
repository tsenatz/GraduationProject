"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import styles from "./RentalManagerDashboard.module.css";

export function RentalManagerTopHeader() {
  return (
    <header className={styles.topHeader}>
      <Link href="/" className={styles.brandLogo}>
        <div className={styles.brandIcon}>
          <Building2 size={22} />
        </div>
        <span>ERNS</span>
        <span className={styles.brandBadge}>Rentals</span>
      </Link>
    </header>
  );
}

