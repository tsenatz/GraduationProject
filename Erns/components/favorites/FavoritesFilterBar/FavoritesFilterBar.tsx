"use client";

import React from "react";
import { ArrowUpDown, Filter } from "lucide-react";
import { FilterTab, SortOption } from "../types";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { favoritesTranslations } from "../translations";
import styles from "./FavoritesFilterBar.module.css";

interface FavoritesFilterBarProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  counts: {
    all: number;
    sale: number;
    rent: number;
  };
}

export function FavoritesFilterBar({
  activeTab,
  onTabChange,
  sortBy,
  onSortChange,
  counts,
}: FavoritesFilterBarProps) {
  const { isAmharic } = useLanguage();
  const t = favoritesTranslations[isAmharic ? "am" : "en"].filter;

  return (
    <div className={styles.filterBarContainer}>
      <div className={styles.filterBarContent}>
        {/* Filter Tabs */}
        <div className={styles.tabsList} role="tablist" aria-label="Listing type filters">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "all"}
            className={`${styles.tabBtn} ${activeTab === "all" ? styles.tabBtnActive : ""}`}
            onClick={() => onTabChange("all")}
          >
            <span>{t.all}</span>
            <span className={styles.tabBadge}>{counts.all}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "sale"}
            className={`${styles.tabBtn} ${activeTab === "sale" ? styles.tabBtnActive : ""}`}
            onClick={() => onTabChange("sale")}
          >
            <span>{t.forSale}</span>
            <span className={styles.tabBadge}>{counts.sale}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "rent"}
            className={`${styles.tabBtn} ${activeTab === "rent" ? styles.tabBtnActive : ""}`}
            onClick={() => onTabChange("rent")}
          >
            <span>{t.forRent}</span>
            <span className={styles.tabBadge}>{counts.rent}</span>
          </button>
        </div>

        {/* Sort Select */}
        <div className={styles.sortContainer}>
          <label className={styles.sortLabel} htmlFor="favorites-sort-select">
            <ArrowUpDown size={15} aria-hidden="true" />
            <span>{t.sortBy}:</span>
          </label>
          <select
            id="favorites-sort-select"
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
          >
            <option value="newest">{t.sortNewest}</option>
            <option value="price-asc">{t.sortPriceAsc}</option>
            <option value="price-desc">{t.sortPriceDesc}</option>
            <option value="area-desc">{t.sortAreaDesc}</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default FavoritesFilterBar;
