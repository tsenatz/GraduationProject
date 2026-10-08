"use client";

import styles from "./Onboarding.module.css";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className={styles.progressSection} role="region" aria-label="Setup progress">
      <div className={styles.progressInfo}>
        <span className={styles.stepIndicatorText}>
          Question {currentStep} of {totalSteps}
        </span>
        <span className={styles.percentageText}>{percentage}% Complete</span>
      </div>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
