"use client";

import React from "react";
import Link from "next/link";
import { MessageSquare, Home, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { inboxTranslations } from "../translations";
import styles from "./InboxEmptyState.module.css";

export const InboxEmptyState: React.FC = () => {
  const { isAmharic } = useLanguage();
  const t = inboxTranslations[isAmharic ? "am" : "en"].chatThread;

  return (
    <div className={styles.emptyContainer}>
      <div className={styles.iconCircle}>
        <MessageSquare size={38} className={styles.mainIcon} />
        <span className={styles.sparkleDot}>
          <Sparkles size={14} />
        </span>
      </div>

      <h3 className={styles.title}>{t.emptyThreadSelect}</h3>
      <p className={styles.desc}>{t.emptyThreadSelectDesc}</p>

      <div className={styles.hintsCard}>
        <div className={styles.hintItem}>
          <span className={styles.hintBullet}>1</span>
          <span>Click any conversation on the left to chat with verified agents or sellers</span>
        </div>
        <div className={styles.hintItem}>
          <span className={styles.hintBullet}>2</span>
          <span>Request in-person tours with automatic date & time scheduling</span>
        </div>
        <div className={styles.hintItem}>
          <span className={styles.hintBullet}>3</span>
          <span>Directly review and negotiate verified Ethiopian digital Libre / Carta</span>
        </div>
      </div>

      <Link href="/search" className={styles.browseBtn}>
        <Home size={16} />
        <span>Browse Available Properties in Addis Ababa</span>
      </Link>
    </div>
  );
};

export default InboxEmptyState;
