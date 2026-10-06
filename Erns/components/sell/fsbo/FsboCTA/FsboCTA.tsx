"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations } from "@/components/sell/translations";
import styles from "./FsboCTA.module.css";

export const FsboCTA: React.FC = () => {
  const { isAmharic } = useLanguage();
  const t = translations[isAmharic ? "am" : "en"].fsbo.cta;

  const scrollToBuilder = () => {
    const el = document.getElementById("fsbo-builder");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.glow} />
      <div className={styles.container}>
        <h2 className={styles.title}>{t.title}</h2>
        <p className={styles.desc}>{t.desc}</p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.startBtn}
            onClick={scrollToBuilder}
          >
            <span>{t.btnStart}</span>
            <ArrowRight size={18} />
          </button>

          <Link href="/sell/agent" className={styles.agentBtn}>
            <span>{t.btnAgent}</span>
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FsboCTA;
