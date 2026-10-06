"use client";

import React from "react";
import { Award, CheckCircle2, ArrowRight, FileCheck } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { applyTranslations } from "../applyTranslations";
import styles from "./ApplyHero.module.css";

export const ApplyHero: React.FC = () => {
  const { isAmharic } = useLanguage();
  const t = applyTranslations[isAmharic ? "am" : "en"].hero;

  const handleScrollToForm = () => {
    const el = document.getElementById("agent-application-wizard");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToRequirements = () => {
    const el = document.getElementById("agent-application-requirements");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.glow} />
      <div className={styles.container}>
        <div className={styles.badge}>
          <Award size={16} />
          <span>{t.badge}</span>
        </div>

        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>

        <div className={styles.perksGrid}>
          {t.perks.map((perk, idx) => (
            <div key={idx} className={styles.perkPill}>
              <CheckCircle2 size={16} className={styles.perkIcon} />
              <span>{perk}</span>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.applyBtn}
            onClick={handleScrollToForm}
          >
            <span>{t.btnApply}</span>
            <ArrowRight size={18} />
          </button>
          <button
            type="button"
            className={styles.learnBtn}
            onClick={handleScrollToRequirements}
          >
            <FileCheck size={18} />
            <span>{t.btnLearnMore}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ApplyHero;
