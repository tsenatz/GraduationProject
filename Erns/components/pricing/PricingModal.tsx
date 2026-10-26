"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import styles from "./PricingModal.module.css";
import { PricingCards } from "./PricingCards";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier?: "FREE" | "STANDARD" | "PREMIUM";
  currentCredits?: number;
  isUnlimited?: boolean;
  onPlanSelected?: (tier: "FREE" | "STANDARD" | "PREMIUM") => void;
}

export function PricingModal({
  isOpen,
  onClose,
  currentTier = "FREE",
  currentCredits = 0,
  isUnlimited = false,
  onPlanSelected,
}: PricingModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <PricingCards
          currentTier={currentTier}
          currentCredits={currentCredits}
          isUnlimited={isUnlimited}
          onPlanSelected={(tier) => {
            if (onPlanSelected) onPlanSelected(tier);
          }}
          isModal={true}
        />
      </div>
    </div>
  );
}
