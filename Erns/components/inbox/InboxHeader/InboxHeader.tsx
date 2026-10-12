"use client";

import React from "react";
import { Compass, Building2 } from "lucide-react";
import { MainPerspective } from "../types";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { inboxTranslations } from "../translations";
import styles from "./InboxHeader.module.css";

interface InboxHeaderProps {
  activePerspective: MainPerspective;
  onPerspectiveChange: (p: MainPerspective) => void;
  perspectiveCounts: {
    buying_renting: number;
    selling_hosting: number;
  };
  totalCount: number;
}

export const InboxHeader: React.FC<InboxHeaderProps> = ({
  activePerspective,
  onPerspectiveChange,
  perspectiveCounts,
  totalCount,
}) => {
  const { isAmharic } = useLanguage();
  const t = inboxTranslations[isAmharic ? "am" : "en"];
  const currentPerspectiveConfig = t.perspectives[activePerspective];

  return (
    <header
      className={styles.headerContainer}
      aria-label="Inbox navigation and perspective switcher"
    >
      {/* Left Col: Page Title & Context Persona Subtitle */}
      <div className={styles.titleCol}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{t.title}</h1>
          <span className={styles.badge}>{totalCount}</span>
          <span className={styles.personaBadge}>
            {activePerspective === "buying_renting"
              ? isAmharic
                ? "ሚናዎ፡ ገዢ እና ተከራይ"
                : "Role: Buyer & Tenant"
              : isAmharic
              ? "ሚናዎ፡ ሻጭ እና አከራይ"
              : "Role: Seller & Landlord"}
          </span>
        </div>
        <p className={styles.subtitle}>{currentPerspectiveConfig.subtitle}</p>
      </div>

      {/* Right Col: Top Perspective Toggle (Segmented Switcher) */}
      <div
        className={styles.perspectiveSwitch}
        role="tablist"
        aria-label="Perspective Switcher"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activePerspective === "buying_renting"}
          className={`${styles.perspectiveBtn} ${
            activePerspective === "buying_renting"
              ? styles.perspectiveBtnActive
              : ""
          }`}
          onClick={() => onPerspectiveChange("buying_renting")}
        >
          <Compass size={15} />
          <span>{t.perspectives.buying_renting.title}</span>
          <span className={styles.perspectiveCount}>
            {perspectiveCounts.buying_renting}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activePerspective === "selling_hosting"}
          className={`${styles.perspectiveBtn} ${
            activePerspective === "selling_hosting"
              ? styles.perspectiveBtnActive
              : ""
          }`}
          onClick={() => onPerspectiveChange("selling_hosting")}
        >
          <Building2 size={15} />
          <span>{t.perspectives.selling_hosting.title}</span>
          <span className={styles.perspectiveCount}>
            {perspectiveCounts.selling_hosting}
          </span>
        </button>
      </div>
    </header>
  );
};

export default InboxHeader;
