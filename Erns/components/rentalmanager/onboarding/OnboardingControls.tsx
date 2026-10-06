"use client";

import styles from "./Onboarding.module.css";

interface OnboardingControlsProps {
  showBack?: boolean;
  onBack?: () => void;
  onSkip?: () => void;
  onContinue: () => void;
  canContinue?: boolean;
  continueText?: string;
}

export function OnboardingControls({
  showBack = false,
  onBack,
  onSkip,
  onContinue,
  canContinue = true,
  continueText = "Continue",
}: OnboardingControlsProps) {
  return (
    <div className={styles.controlsBar}>
      <div className={styles.leftControls}>
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            className={styles.backBtn}
          >
            Back
          </button>
        ) : (
          <div />
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className={styles.skipLinkBtn}
          >
            Skip
          </button>
        )}
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className={`${styles.continueBtn} ${
            canContinue ? styles.continueBtnActive : ""
          }`}
        >
          {continueText}
        </button>
      </div>
    </div>
  );
}
