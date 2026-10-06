"use client";

import { ShieldCheck, Tag, CheckCircle2 } from "lucide-react";
import { useSellLanguage } from "../LanguageContext";
import styles from "./TrustStrip.module.css";

const PILLAR_ICONS = [ShieldCheck, Tag, CheckCircle2];

export function TrustStrip() {
  const { t } = useSellLanguage();

  return (
    <section className={styles.stripContainer} aria-label="ERNS Trust and safety">
      <div className={styles.innerContent}>
        <div className={styles.titleWrapper}>
          <h3 className={styles.title}>{t.trust.title}</h3>
          <p className={styles.subtitle}>{t.trust.subtitle}</p>
        </div>

        <div className={styles.grid}>
          {t.trust.pillars.map((pillar, idx) => {
            const Icon = PILLAR_ICONS[idx] || ShieldCheck;
            return (
              <div key={idx} className={styles.pillarCard}>
                <div className={styles.iconBox}>
                  <Icon size={24} aria-hidden="true" />
                </div>
                <div className={styles.pillarContent}>
                  <h4 className={styles.pillarTitle}>{pillar.title}</h4>
                  <p className={styles.pillarDesc}>{pillar.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
