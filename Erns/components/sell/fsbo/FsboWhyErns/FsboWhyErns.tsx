"use client";

import React from "react";
import { Camera, Globe, PhoneCall } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations } from "@/components/sell/translations";
import styles from "./FsboWhyErns.module.css";

const cardIcons = [Camera, Globe, PhoneCall];

export const FsboWhyErns: React.FC = () => {
  const { isAmharic } = useLanguage();
  const t = translations[isAmharic ? "am" : "en"].fsbo.whyErns;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t.title}</h2>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </div>

        <div className={styles.grid}>
          {t.cards.map((card, idx) => {
            const IconComponent = cardIcons[idx % cardIcons.length];
            return (
              <div key={idx} className={styles.card}>
                <div className={styles.iconWrapper}>
                  <IconComponent size={26} />
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

export default FsboWhyErns;
