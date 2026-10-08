"use client";

import { OnboardingControls } from "./OnboardingControls";
import styles from "./Onboarding.module.css";

interface Step4LocationProps {
  companyName: string;
  city: string;
  address: string;
  onChangeCompany: (val: string) => void;
  onChangeCity: (val: string) => void;
  onChangeAddress: (val: string) => void;
  onFinish: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function Step4Location({
  companyName,
  city,
  address,
  onChangeCompany,
  onChangeCity,
  onChangeAddress,
  onFinish,
  onBack,
  onSkip,
}: Step4LocationProps) {
  const canContinue = city.trim().length > 0;

  return (
    <div>
      <div className={styles.stepMeta}>Question 4 of 4</div>
      <h1 className={styles.stepTitle}>Where are your properties located?</h1>
      <p className={styles.stepSubtitle}>
        Provide your primary business address or property portfolio location.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (canContinue) onFinish();
        }}
      >
        <div className={styles.formGroup}>
          <label htmlFor="companyName" className={styles.label}>
            Business / Portfolio Name (Optional)
          </label>
          <input
            id="companyName"
            type="text"
            placeholder="e.g. Apex Property Management"
            value={companyName}
            onChange={(e) => onChangeCompany(e.target.value)}
            className={styles.textInput}
          />
        </div>

        <div className={styles.inputGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="city" className={styles.label}>
              City / Region
            </label>
            <input
              id="city"
              type="text"
              placeholder="e.g. Addis Ababa"
              value={city}
              onChange={(e) => onChangeCity(e.target.value)}
              className={styles.textInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address" className={styles.label}>
              Street Address / Subcity
            </label>
            <input
              id="address"
              type="text"
              placeholder="e.g. Bole Subcity, Woreda 03"
              value={address}
              onChange={(e) => onChangeAddress(e.target.value)}
              className={styles.textInput}
            />
          </div>
        </div>

        <OnboardingControls
          showBack={true}
          onBack={onBack}
          onSkip={onSkip}
          onContinue={onFinish}
          canContinue={canContinue}
          continueText="Complete setup"
        />
      </form>
    </div>
  );
}
