"use client";

import React from "react";
import { UserCheck, MessageSquare, ArrowUp } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { applyTranslations } from "../applyTranslations";
import styles from "./ApplyCTA.module.css";

export const ApplyCTA: React.FC = () => {
  const { isAmharic } = useLanguage();
  const t = applyTranslations[isAmharic ? "am" : "en"].cta;

  const handleScrollToTop = () => {
    const el = document.getElementById("agent-application-wizard");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.glow} />
      <div className={styles.container}>
        <h2 className={styles.title}>{t.title}</h2>
        <p className={styles.desc}>{t.subtitle}</p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleScrollToTop}
          >
            <UserCheck size={18} />
            <span>{t.btnApply}</span>
            <ArrowUp size={16} />
          </button>

          <a
            href="https://t.me/erns_support"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryBtn}
          >
            <MessageSquare size={18} />
            <span>{t.btnContactSupport}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ApplyCTA;
