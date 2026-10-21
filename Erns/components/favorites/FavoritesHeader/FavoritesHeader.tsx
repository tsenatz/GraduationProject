"use client";

import React, { useState } from "react";
import { Bookmark, Share2, Trash2, Check } from "lucide-react";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { favoritesTranslations } from "../translations";
import styles from "./FavoritesHeader.module.css";

export function FavoritesHeader() {
  const { count, clearFavorites } = useFavorites();
  const { isAmharic } = useLanguage();
  const t = favoritesTranslations[isAmharic ? "am" : "en"].header;

  const [copied, setCopied] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
      }
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleClear = () => {
    clearFavorites();
    setShowClearConfirm(false);
  };

  const countLabel =
    count === 1
      ? t.savedCountSingle
      : t.savedCount.replace("{count}", count.toString());

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <div className={styles.titleArea}>
          <div className={styles.badgeRow}>
            <span className={styles.badge}>
              <Bookmark size={13} className={styles.badgeIcon} />
              <span>{t.badge}</span>
            </span>

            <span className={styles.countPill}>{countLabel}</span>
          </div>

          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </div>

        {count > 0 && (
          <div className={styles.actionsArea}>
            <button
              type="button"
              className={styles.shareBtn}
              onClick={handleShare}
              title={t.shareList}
            >
              {copied ? (
                <>
                  <Check size={16} className={styles.checkIcon} />
                  <span>{t.linkCopied}</span>
                </>
              ) : (
                <>
                  <Share2 size={16} />
                  <span>{t.shareList}</span>
                </>
              )}
            </button>

            {!showClearConfirm ? (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => setShowClearConfirm(true)}
                title={t.clearAll}
              >
                <Trash2 size={15} />
                <span>{t.clearAll}</span>
              </button>
            ) : (
              <div className={styles.confirmBox} role="alert">
                <span className={styles.confirmText}>{t.clearConfirm}</span>
                <div className={styles.confirmBtns}>
                  <button
                    type="button"
                    className={styles.confirmYes}
                    onClick={handleClear}
                  >
                    {isAmharic ? "አዎ፣ አስወግድ" : "Yes, Clear"}
                  </button>
                  <button
                    type="button"
                    className={styles.confirmNo}
                    onClick={() => setShowClearConfirm(false)}
                  >
                    {isAmharic ? "ይቅር" : "Cancel"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default FavoritesHeader;
