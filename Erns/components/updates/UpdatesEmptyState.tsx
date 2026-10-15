"use client";

import React from "react";
import Link from "next/link";
import { Bookmark, Sparkles, TrendingDown, Plus, Search } from "lucide-react";
import { UpdatesTab } from "./types";
import { updatesTranslations } from "./translations";
import styles from "./UpdatesView.module.css";

interface UpdatesEmptyStateProps {
  activeTab: UpdatesTab;
  onCreateSearch: () => void;
  isAmharic: boolean;
}

export function UpdatesEmptyState({
  activeTab,
  onCreateSearch,
  isAmharic,
}: UpdatesEmptyStateProps) {
  const t = isAmharic ? updatesTranslations.am : updatesTranslations.en;

  if (activeTab === "searches") {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIconCircle}>
          <Bookmark size={36} className={styles.emptyMainIcon} />
        </div>
        <h3 className={styles.emptyTitle}>{t.emptyState.searchesTitle}</h3>
        <p className={styles.emptySubtitle}>{t.emptyState.searchesSubtitle}</p>
        <div className={styles.emptyActions}>
          <button
            type="button"
            className={styles.emptyPrimaryBtn}
            onClick={onCreateSearch}
          >
            <Plus size={18} />
            <span>{t.emptyState.createCta}</span>
          </button>
          <Link href="/search" className={styles.emptySecondaryBtn}>
            <Search size={16} />
            <span>{t.emptyState.exploreCta}</span>
          </Link>
        </div>
      </div>
    );
  }

  if (activeTab === "feed") {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIconCircle}>
          <Sparkles size={36} className={styles.emptyMainIcon} />
        </div>
        <h3 className={styles.emptyTitle}>{t.emptyState.feedTitle}</h3>
        <p className={styles.emptySubtitle}>{t.emptyState.feedSubtitle}</p>
        <div className={styles.emptyActions}>
          <Link href="/search" className={styles.emptyPrimaryBtn}>
            <Search size={18} />
            <span>{t.emptyState.exploreCta}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.emptyContainer}>
      <div className={styles.emptyIconCircle}>
        <TrendingDown size={36} className={styles.emptyMainIcon} />
      </div>
      <h3 className={styles.emptyTitle}>{t.emptyState.priceDropsTitle}</h3>
      <p className={styles.emptySubtitle}>{t.emptyState.priceDropsSubtitle}</p>
      <div className={styles.emptyActions}>
        <Link href="/search" className={styles.emptyPrimaryBtn}>
          <Search size={18} />
          <span>{t.emptyState.exploreCta}</span>
        </Link>
      </div>
    </div>
  );
}
