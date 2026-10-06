"use client";

import Link from "next/link";
import { ArrowRight, Home, UserCheck } from "lucide-react";
import { useSellLanguage } from "../LanguageContext";
import styles from "./SellerCTA.module.css";

export function SellerCTA() {
  const { t } = useSellLanguage();

  return (
    <section className={styles.ctaSection} aria-label="Get started selling">
      <div className={styles.ctaContainer}>
        <h2 className={styles.title}>{t.cta.title}</h2>
        <p className={styles.description}>{t.cta.desc}</p>

        <div className={styles.buttonGroup}>
          <Link href="/sell/list" className={styles.primaryBtn}>
            <Home size={18} aria-hidden="true" />
            <span>{t.cta.btnList}</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>

          <Link href="/sell/agent" className={styles.secondaryBtn}>
            <UserCheck size={18} aria-hidden="true" />
            <span>{t.cta.btnAgent}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
