"use client";

import Link from "next/link";
import { UserCheck, Home, Check, ArrowRight } from "lucide-react";
import { useSellLanguage } from "../LanguageContext";
import styles from "./SellingOptions.module.css";

export function SellingOptions() {
  const { t } = useSellLanguage();

  return (
    <section id="selling-options" className={styles.section} aria-label="Selling options">
      <div className={styles.sectionHeader}>
        <h2 className={styles.heading}>{t.sellingOptions.title}</h2>
        <p className={styles.subheading}>{t.sellingOptions.subtitle}</p>
      </div>

      <div className={styles.cardsGrid}>
        {/* CARD 1: FIND A VERIFIED AGENT */}
        <div className={styles.card}>
          <div>
            <span className={`${styles.tag} ${styles.tagAgent}`}>
              {t.sellingOptions.card1.tag}
            </span>

            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <UserCheck size={28} aria-hidden="true" />
              </div>
              <h3 className={styles.cardTitle}>{t.sellingOptions.card1.title}</h3>
            </div>

            <p className={styles.description}>{t.sellingOptions.card1.desc}</p>

            <ul className={styles.featureList}>
              {t.sellingOptions.card1.features.map((feat, idx) => (
                <li key={idx} className={styles.featureItem}>
                  <Check size={18} className={styles.featureIcon} aria-hidden="true" />
                  <div>
                    <strong>{feat.title}</strong>
                    <span className={styles.featureDesc}>{feat.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <Link href="/sell/agent" className={`${styles.cardButton} ${styles.buttonAgent}`}>
            <span>{t.sellingOptions.card1.buttonText}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        {/* CARD 2: LIST IT MYSELF */}
        <div className={styles.card}>
          <div>
            <span className={`${styles.tag} ${styles.tagOwner}`}>
              {t.sellingOptions.card2.tag}
            </span>

            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <Home size={28} aria-hidden="true" />
              </div>
              <h3 className={styles.cardTitle}>{t.sellingOptions.card2.title}</h3>
            </div>

            <p className={styles.description}>{t.sellingOptions.card2.desc}</p>

            <ul className={styles.featureList}>
              {t.sellingOptions.card2.features.map((feat, idx) => (
                <li key={idx} className={styles.featureItem}>
                  <Check size={18} className={styles.featureIcon} aria-hidden="true" />
                  <div>
                    <strong>{feat.title}</strong>
                    <span className={styles.featureDesc}>{feat.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <Link href="/sell/list" className={`${styles.cardButton} ${styles.buttonOwner}`}>
            <span>{t.sellingOptions.card2.buttonText}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
