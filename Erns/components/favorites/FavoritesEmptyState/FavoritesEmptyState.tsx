"use client";

import React from "react";
import Link from "next/link";
import { Heart, Search, Key, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { favoritesTranslations } from "../translations";
import styles from "./FavoritesEmptyState.module.css";

export function FavoritesEmptyState() {
  const { isAmharic } = useLanguage();
  const t = favoritesTranslations[isAmharic ? "am" : "en"].empty;

  return (
    <div className={styles.emptyContainer}>
      <div className={styles.illustrationWrapper}>
        <div className={styles.heartCircleGlow} />
        <div className={styles.heartCircle}>
          <Heart size={44} className={styles.heartIcon} strokeWidth={1.75} />
        </div>
      </div>

      <h2 className={styles.title}>{t.title}</h2>
      <p className={styles.subtitle}>{t.subtitle}</p>

      <div className={styles.buttonGroup}>
        <Link href="/search?status=FOR_SALE" className={styles.primaryBtn}>
          <Search size={18} aria-hidden="true" />
          <span>{t.btnBrowseSale}</span>
        </Link>

        <Link href="/search?status=FOR_RENT" className={styles.secondaryBtn}>
          <Key size={18} aria-hidden="true" />
          <span>{t.btnBrowseRent}</span>
        </Link>
      </div>

      <div className={styles.tipsCard}>
        <div className={styles.tipsHeader}>
          <h3 className={styles.tipsTitle}>{t.tipsTitle}</h3>
        </div>

        <ul className={styles.tipsList}>
          <li className={styles.tipItem}>
            <CheckCircle2 size={16} className={styles.checkIcon} aria-hidden="true" />
            <span>{t.tip1}</span>
          </li>
          <li className={styles.tipItem}>
            <CheckCircle2 size={16} className={styles.checkIcon} aria-hidden="true" />
            <span>{t.tip2}</span>
          </li>
          <li className={styles.tipItem}>
            <CheckCircle2 size={16} className={styles.checkIcon} aria-hidden="true" />
            <span>{t.tip3}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default FavoritesEmptyState;
