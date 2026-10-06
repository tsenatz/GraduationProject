"use client";

import { OnboardingControls } from "./OnboardingControls";
import styles from "./Onboarding.module.css";

export type UnitRange =
  | "1_unit"
  | "2_10_units"
  | "11_50_units"
  | "51_200_units"
  | "200_plus_units";

interface Step3UnitsProps {
  selectedUnits: UnitRange | null;
  onSelectUnits: (units: UnitRange) => void;
  onOpenExampleModal: () => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const UNIT_OPTIONS: { id: UnitRange; label: string }[] = [
  { id: "1_unit", label: "1 unit" },
  { id: "2_10_units", label: "2–10 units" },
  { id: "11_50_units", label: "11–50 units" },
  { id: "51_200_units", label: "51–200 units" },
  { id: "200_plus_units", label: "200+ units" },
];

export function Step3Units({
  selectedUnits,
  onSelectUnits,
  onOpenExampleModal,
  onNext,
  onBack,
  onSkip,
}: Step3UnitsProps) {
  const canContinue = selectedUnits !== null;

  return (
    <div>
      <div className={styles.stepMeta}>Question 3 of 4</div>
      <h1 className={styles.stepTitle}>How many units do you manage?</h1>
      <p className={styles.stepSubtitle}>
        Units can be single-family homes or individual units in a building.
        <button
          type="button"
          onClick={onOpenExampleModal}
          className={styles.exampleLink}
        >
          Get an example
        </button>
      </p>

      <div className={styles.optionsList}>
        {UNIT_OPTIONS.map((opt) => {
          const isSelected = selectedUnits === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectUnits(opt.id)}
              className={`${styles.optionCard} ${
                isSelected ? styles.optionCardSelected : ""
              }`}
            >
              <span className={styles.optionTitle}>{opt.label}</span>
              <div className={styles.optionRadioCircle}>
                {isSelected && <div className={styles.radioDot} />}
              </div>
            </button>
          );
        })}
      </div>

      <OnboardingControls
        showBack={true}
        onBack={onBack}
        onSkip={onSkip}
        onContinue={onNext}
        canContinue={canContinue}
        continueText="Continue"
      />
    </div>
  );
}
