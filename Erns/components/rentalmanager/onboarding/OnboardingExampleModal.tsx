"use client";

import { X, Info } from "lucide-react";
import styles from "./Onboarding.module.css";

interface OnboardingExampleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingExampleModal({ isOpen, onClose }: OnboardingExampleModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Info size={22} color="#30360E" />
            <h3 className={styles.modalTitle}>Counting Your Units</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={styles.modalCloseBtn}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <p>
            A unit represents any residential or commercial rental property space you manage.
            Here are common examples:
          </p>
          <ul className={styles.exampleList}>
            <li className={styles.exampleItem}>
              <span className={styles.exampleItemBullet}>•</span>
              <div>
                <strong>Single-Family Home / Condo:</strong> Counts as 1 unit.
              </div>
            </li>
            <li className={styles.exampleItem}>
              <span className={styles.exampleItemBullet}>•</span>
              <div>
                <strong>Duplex / Triplex:</strong> Counts as 2 or 3 units.
              </div>
            </li>
            <li className={styles.exampleItem}>
              <span className={styles.exampleItemBullet}>•</span>
              <div>
                <strong>Apartment Complex:</strong> Total count of all individual rentable apartments in the building (e.g. 24 units).
              </div>
            </li>
          </ul>
          <button
            type="button"
            onClick={onClose}
            className={styles.continueBtn}
            style={{ width: "100%" }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
