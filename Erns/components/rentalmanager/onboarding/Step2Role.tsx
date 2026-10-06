"use client";

import { Building2, Key, UserCheck, TrendingUp } from "lucide-react";
import { OnboardingControls } from "./OnboardingControls";
import styles from "./Onboarding.module.css";

export type RentalRole =
  | "property_manager"
  | "owner_landlord"
  | "agent_broker"
  | "investor";

interface Step2RoleProps {
  selectedRole: RentalRole | null;
  onSelectRole: (role: RentalRole) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

const ROLES: { id: RentalRole; title: string; icon: typeof Building2 }[] = [
  {
    id: "property_manager",
    title: "Property manager",
    icon: Building2,
  },
  {
    id: "owner_landlord",
    title: "Property owner or landlord",
    icon: Key,
  },
  {
    id: "agent_broker",
    title: "Agent or broker",
    icon: UserCheck,
  },
  {
    id: "investor",
    title: "Real estate investor",
    icon: TrendingUp,
  },
];

export function Step2Role({
  selectedRole,
  onSelectRole,
  onNext,
  onBack,
  onSkip,
}: Step2RoleProps) {
  const canContinue = selectedRole !== null;

  return (
    <div>
      <div className={styles.stepMeta}>Question 2 of 4</div>
      <h1 className={styles.stepTitle}>Which best describes you?</h1>
      <p className={styles.stepSubtitle}>
        This helps us tailor your experience to the way you work.
      </p>

      <div className={styles.optionsList}>
        {ROLES.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelectRole(role.id)}
              className={`${styles.optionCard} ${
                isSelected ? styles.optionCardSelected : ""
              }`}
            >
              <div className={styles.optionIconWrapper}>
                <Icon size={22} />
              </div>
              <span className={styles.optionTitle}>{role.title}</span>
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
