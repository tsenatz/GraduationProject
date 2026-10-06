"use client";

import React from "react";
import { Users, Globe, ShieldCheck, Scale } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { applyTranslations } from "../applyTranslations";
import styles from "./ApplyBenefits.module.css";

const icons = [Users, Globe, ShieldCheck, Scale];

export const ApplyBenefits: React.FC = () => {
  const { isAmharic } = useLanguage();
  const t = applyTranslations[isAmharic ? "am" : "en"].benefits;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t.title}</h2>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </div>

        <div className={styles.grid}>
          {t.cards.map((card, idx) => {
            const IconComp = icons[idx % icons.length];
            return (
              <div key={idx} className={styles.card}>
                <div className={styles.iconWrapper}>
                  <IconComp size={26} />
                </div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ApplyBenefits;
