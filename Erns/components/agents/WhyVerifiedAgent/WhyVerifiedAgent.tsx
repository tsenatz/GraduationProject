"use client";

import React from "react";
import { TrendingUp, UserCheck2, FileBadge } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { agentTranslations } from "../translations";
import styles from "./WhyVerifiedAgent.module.css";

const icons = [TrendingUp, UserCheck2, FileBadge];

export const WhyVerifiedAgent: React.FC = () => {
  const { isAmharic } = useLanguage();
  const t = agentTranslations[isAmharic ? "am" : "en"].whyVerified;

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

export default WhyVerifiedAgent;
