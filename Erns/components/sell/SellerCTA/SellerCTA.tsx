"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, Home, UserCheck, ArrowRight } from "lucide-react";
import { useSellLanguage } from "../LanguageContext";
import { SellingPathQuizModal } from "./SellingPathQuizModal";
import styles from "./SellerCTA.module.css";

export function SellerCTA() {
  const { t } = useSellLanguage();
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <>
      <section className={styles.ctaSection} aria-label="Selling path finder">
        <div className={styles.ctaContainer}>
          <div className={styles.badgeWrapper}>
            <span className={styles.ctaBadge}>
              <Compass size={15} aria-hidden="true" />
              <span>ERNS Decision Tool</span>
            </span>
          </div>

          <h2 className={styles.title}>{t.cta.title}</h2>
          <p className={styles.description}>{t.cta.subtitle}</p>

          <div className={styles.mainActionWrapper}>
            <button
              type="button"
              className={styles.exploreBtn}
              onClick={() => setIsQuizOpen(true)}
            >
              <span>{t.cta.btnQuiz}</span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.directLinksRow}>
            <span className={styles.directLabel}>{t.cta.orBrowse}</span>
            <div className={styles.directButtonGroup}>
              <Link href="/sell/list" className={styles.directBtn}>
                <Home size={16} aria-hidden="true" />
                <span>{t.cta.btnListDirect}</span>
              </Link>
              <span className={styles.dividerDot}>•</span>
              <Link href="/sell/agent" className={styles.directBtn}>
                <UserCheck size={16} aria-hidden="true" />
                <span>{t.cta.btnAgentDirect}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SellingPathQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />
    </>
  );
}

export default SellerCTA;
