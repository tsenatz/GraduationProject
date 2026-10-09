"use client";

import React, { useState } from "react";
import { Heart, Share2, Trash2, Check, Sparkles } from "lucide-react";
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
      // Fallback
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
              <Heart size={14} className={styles.badgeIcon} fill="#e11d48" color="#e11d48" />
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
                  <Check size={16} color="#10b981" />
                  <span style={{ color: "#10b981" }}>{t.linkCopied}</span>
                </>
              ) : (
                <>
                  <Share2 size={16} />
                  <span>{t.shareList}</span>
                </>
              )}
            </button>

            {showClearConfirm ? (
              <div className={styles.confirmBox}>
                <span className={styles.confirmText}>{t.clearConfirm}</span>
                <div className={styles.confirmBtns}>
                  <button
                    type="button"
                    className={styles.confirmYes}
                    onClick={handleClear}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={styles.confirmNo}
                    onClick={() => setShowClearConfirm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => setShowClearConfirm(true)}
                title={t.clearAll}
              >
                <Trash2 size={15} />
                <span>{t.clearAll}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default FavoritesHeader;
