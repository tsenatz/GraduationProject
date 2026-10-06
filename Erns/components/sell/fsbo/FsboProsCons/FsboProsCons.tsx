"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations } from "@/components/sell/translations";
import styles from "./FsboProsCons.module.css";

export const FsboProsCons: React.FC = () => {
  const { isAmharic } = useLanguage();
  const t = translations[isAmharic ? "am" : "en"].fsbo.prosCons;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t.title}</h2>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </div>

        <div className={styles.comparisonRow}>
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <div className={styles.iconCirclePros}>
                <ShieldCheck size={22} />
              </div>
              <h3 className={styles.columnTitle}>{t.prosTitle}</h3>
            </div>

            <div className={styles.itemList}>
              {t.pros.map((item, idx) => (
                <div key={idx} className={styles.item}>
                  <CheckCircle2 size={20} className={styles.itemBulletPros} />
                  <div className={styles.itemContent}>
                    <h4 className={styles.itemTitle}>{item.title}</h4>
                    <p className={styles.itemDesc}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <div className={styles.iconCircleCons}>
                <Clock size={22} />
              </div>
              <h3 className={styles.columnTitle}>{t.consTitle}</h3>
            </div>

            <div className={styles.itemList}>
              {t.cons.map((item, idx) => (
                <div key={idx} className={styles.item}>
                  <AlertCircle size={20} className={styles.itemBulletCons} />
                  <div className={styles.itemContent}>
                    <h4 className={styles.itemTitle}>{item.title}</h4>
                    <p className={styles.itemDesc}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.agentBanner}>
          <p className={styles.agentBannerText}>{t.agentBannerText}</p>
          <Link href="/sell/agent" className={styles.agentBannerBtn}>
            <span>{t.agentBannerBtn}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FsboProsCons;
