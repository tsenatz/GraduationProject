"use client";

import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";
import styles from "./Onboarding.module.css";

interface OnboardingHeaderProps {
  onSkipAll?: () => void;
  showSkip?: boolean;
}

export function OnboardingHeader({ onSkipAll, showSkip = true }: OnboardingHeaderProps) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brandLogo}>
        <div className={styles.brandIcon}>
          <Building2 size={22} />
        </div>
        <span>ERNS</span>
        <span className={styles.brandBadge}>Rentals</span>
      </Link>

      {showSkip && (
        <button
          type="button"
          onClick={onSkipAll}
          className={styles.skipSetupBtn}
          aria-label="Skip setup wizard"
        >
          <span>Skip setup</span>
          <ArrowRight size={16} />
        </button>
      )}
    </header>
  );
}

