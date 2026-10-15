"use client";

import React from "react";
import { Bell, Bookmark, TrendingDown, Plus, Sparkles } from "lucide-react";
import { UpdatesTab } from "./types";
import { updatesTranslations } from "./translations";
import styles from "./UpdatesView.module.css";

interface UpdatesHeaderProps {
  activeTab: UpdatesTab;
  onTabChange: (tab: UpdatesTab) => void;
  searchesCount: number;
  feedCount: number;
  priceDropsCount: number;
  onOpenCreateModal: () => void;
  isAmharic: boolean;
}

export function UpdatesHeader({
  activeTab,
  onTabChange,
  searchesCount,
  feedCount,
  priceDropsCount,
  onOpenCreateModal,
  isAmharic,
}: UpdatesHeaderProps) {
  const t = isAmharic ? updatesTranslations.am : updatesTranslations.en;

  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <div className={styles.headerTitleArea}>
          <div className={styles.headerBadge}>
            <Bell className={styles.badgeIcon} size={14} />
            <span>{t.header.badge}</span>
          </div>
          <h1 className={styles.headerTitle}>{t.header.title}</h1>
          <p className={styles.headerSubtitle}>{t.header.subtitle}</p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.newSearchBtn}
            onClick={onOpenCreateModal}
            id="btn-save-new-search"
          >
            <Plus size={18} />
            <span>{t.header.newSearchBtn}</span>
          </button>
        </div>
      </div>

      <div className={styles.tabsNav} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "searches"}
          className={`${styles.tabBtn} ${activeTab === "searches" ? styles.tabBtnActive : ""}`}
          onClick={() => onTabChange("searches")}
          id="tab-saved-searches"
        >
          <Bookmark size={16} />
          <span>{t.tabs.searches}</span>
          <span className={styles.tabCountBadge}>{searchesCount}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "feed"}
          className={`${styles.tabBtn} ${activeTab === "feed" ? styles.tabBtnActive : ""}`}
          onClick={() => onTabChange("feed")}
          id="tab-property-updates"
        >
          <Sparkles size={16} />
          <span>{t.tabs.feed}</span>
          <span className={styles.tabCountBadge}>{feedCount}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "price_drops"}
          className={`${styles.tabBtn} ${activeTab === "price_drops" ? styles.tabBtnActive : ""}`}
          onClick={() => onTabChange("price_drops")}
          id="tab-price-drops"
        >
          <TrendingDown size={16} />
          <span>{t.tabs.priceDrops}</span>
          <span className={styles.tabCountBadge}>{priceDropsCount}</span>
        </button>
      </div>
    </header>
  );
}
