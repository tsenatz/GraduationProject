"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import styles from "./LanguageSwitcher.module.css";

interface LanguageSwitcherProps {
  isMobileDrawer?: boolean;
}

export function LanguageSwitcher({ isMobileDrawer = false }: LanguageSwitcherProps) {
  const { language, toggleLanguage } = useLanguage();

  // Show only ONE language name at a time:
  // - When the site is in English, show "አማ" (clicking it switches to Amharic)
  // - When the site is in Amharic, show "EN" (clicking it switches to English)
  const displayLabel = language === "en" ? "አማ" : "EN";
  const targetTitle =
    language === "en"
      ? "ቀይር ወደ አማርኛ (Switch to Amharic)"
      : "Switch to English";

  if (isMobileDrawer) {
    return (
      <div className={styles.mobileWrapper}>
        <span className={styles.mobileLabel}>
          <span>{language === "en" ? "Language" : "ቋንቋ"}</span>
        </span>
        <button
          type="button"
          onClick={toggleLanguage}
          className={styles.toggleBtn}
          title={targetTitle}
          aria-label={targetTitle}
        >
          <span className={styles.singleLangText}>{displayLabel}</span>
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
        title={targetTitle}
        aria-label={targetTitle}
      >
        <span className={styles.singleLangText}>{displayLabel}</span>
      </button>
    </div>
  );
}
