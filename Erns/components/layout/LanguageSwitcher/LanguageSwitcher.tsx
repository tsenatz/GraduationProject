"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import styles from "./LanguageSwitcher.module.css";

interface LanguageSwitcherProps {
  isMobileDrawer?: boolean;
}

export function LanguageSwitcher({ isMobileDrawer = false }: LanguageSwitcherProps) {
  const { language, toggleLanguage } = useLanguage();

  if (isMobileDrawer) {
    return (
      <div className={styles.mobileWrapper}>
        <span className={styles.mobileLabel}>
          <Globe size={18} aria-hidden="true" />
          <span>Language / ቋንቋ</span>
        </span>
        <button
          type="button"
          onClick={toggleLanguage}
          className={styles.toggleBtn}
          aria-label={`Current language: ${language === "en" ? "English" : "Amharic"}. Click to switch.`}
        >
          <span className={`${styles.langSegment} ${language === "en" ? styles.active : ""}`}>
            EN
          </span>
          <span className={styles.divider}>/</span>
          <span className={`${styles.langSegment} ${language === "am" ? styles.active : ""}`}>
            አማ
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        onClick={toggleLanguage}
        className={styles.toggleBtn}
        title={language === "en" ? "Switch to Amharic (አማርኛ)" : "Switch to English"}
        aria-label={`Current language: ${language === "en" ? "English" : "Amharic"}. Click to switch.`}
      >
        <Globe size={15} className={styles.globeIcon} aria-hidden="true" />
        <span className={`${styles.langSegment} ${language === "en" ? styles.active : ""}`}>
          EN
        </span>
        <span className={styles.divider}>|</span>
        <span className={`${styles.langSegment} ${language === "am" ? styles.active : ""}`}>
          አማ
        </span>
      </button>
    </div>
  );
}
