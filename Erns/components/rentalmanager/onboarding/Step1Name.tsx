"use client";

import { OnboardingControls } from "./OnboardingControls";
import styles from "./Onboarding.module.css";

interface Step1NameProps {
  firstName: string;
  lastName: string;
  onChangeFirstName: (val: string) => void;
  onChangeLastName: (val: string) => void;
  onNext: () => void;
  onSkip: () => void;
}

export function Step1Name({
  firstName,
  lastName,
  onChangeFirstName,
  onChangeLastName,
  onNext,
  onSkip,
}: Step1NameProps) {
  const canContinue = firstName.trim().length > 0 && lastName.trim().length > 0;

  return (
    <div>
      <div className={styles.stepMeta}>Question 1 of 4</div>
      <h1 className={styles.stepTitle}>What&apos;s your name?</h1>
      <p className={styles.stepSubtitle}>
        We&apos;ll use this to personalize your rental management experience.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (canContinue) onNext();
        }}
      >
        <div className={styles.inputGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName" className={styles.label}>
              First name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="e.g. Abebe"
              value={firstName}
              onChange={(e) => onChangeFirstName(e.target.value)}
              className={styles.textInput}
              autoFocus
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName" className={styles.label}>
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="e.g. Kebede"
              value={lastName}
              onChange={(e) => onChangeLastName(e.target.value)}
              className={styles.textInput}
              required
            />
          </div>
        </div>

        <OnboardingControls
          showBack={false}
          onSkip={onSkip}
          onContinue={onNext}
          canContinue={canContinue}
          continueText="Continue"
        />
      </form>
    </div>
  );
}
