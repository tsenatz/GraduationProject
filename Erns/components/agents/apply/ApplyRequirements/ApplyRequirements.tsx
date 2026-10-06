"use client";

import React from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { applyTranslations } from "../applyTranslations";
import styles from "./ApplyRequirements.module.css";

export const ApplyRequirements: React.FC = () => {
  const { isAmharic } = useLanguage();
  const t = applyTranslations[isAmharic ? "am" : "en"].requirements;

  return (
    <section id="agent-application-requirements" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t.title}</h2>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </div>

        <div className={styles.grid}>
          {t.cards.map((card, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.numberBadge}>{card.number}</div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDesc}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApplyRequirements;
