"use client";

import React from "react";
import { FileText, ShieldAlert, BadgeCheck, Scale, Banknote } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations } from "@/components/sell/translations";
import styles from "./FsboLegalChecklist.module.css";

const stepIcons = [FileText, ShieldAlert, BadgeCheck, Scale, Banknote];

export const FsboLegalChecklist: React.FC = () => {
  const { isAmharic } = useLanguage();
  const t = translations[isAmharic ? "am" : "en"].fsbo.legalChecklist;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t.title}</h2>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </div>

        <div className={styles.checklistList}>
          {t.items.map((item, idx) => {
            const IconComponent = stepIcons[idx % stepIcons.length];
            return (
              <div key={idx} className={styles.checklistItem}>
                <div className={styles.iconCircle}>
                  <IconComponent size={22} />
                </div>
                <div className={styles.itemContent}>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.itemDesc}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FsboLegalChecklist;
