"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ErnsLogo } from "@/components/icons/ErnsLogo";
import styles from "./Onboarding.module.css";

interface OnboardingHeaderProps {
  onSkipAll?: () => void;
  showSkip?: boolean;
}

export function OnboardingHeader({ onSkipAll, showSkip = true }: OnboardingHeaderProps) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brandLogo} aria-label="ERNS Rentals Home">
        <ErnsLogo height={24} className={styles.brandLogoSvg} priority />
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

