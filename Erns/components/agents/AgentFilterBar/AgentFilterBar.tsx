"use client";

import React from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { agentTranslations } from "../translations";
import { AgentFilterState } from "../types";
import styles from "./AgentFilterBar.module.css";

interface AgentFilterBarProps {
  filters: AgentFilterState;
  onFilterChange: (key: keyof AgentFilterState, value: any) => void;
  onClearFilters: () => void;
  resultsCount: number;
}

export const AgentFilterBar: React.FC<AgentFilterBarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  resultsCount,
}) => {
  const { isAmharic } = useLanguage();
  const t = agentTranslations[isAmharic ? "am" : "en"].filterBar;

  const subCities = [
    { en: "All Sub-Cities", am: "ሁሉም ክፍለ ከተሞች", value: "" },
    { en: "Bole", am: "ቦሌ", value: "Bole" },
    { en: "Kazanchis", am: "ካዛንቺስ", value: "Kazanchis" },
    { en: "CMC", am: "ሲኤምሲ", value: "CMC" },
    { en: "Summit", am: "ሰሚት", value: "Summit" },
    { en: "Yeka", am: "የካ", value: "Yeka" },
    { en: "Kirkos", am: "ቂርቆስ", value: "Kirkos" },
    { en: "Old Airport", am: "ኦልድ ኤርፖርት", value: "Old Airport" },
    { en: "Sarbet", am: "ሳርቤት", value: "Sarbet" },
    { en: "Ayat", am: "አያት", value: "Ayat" },
  ];

  const languages = [
    { en: "All Languages", am: "ሁሉም ቋንቋዎች", value: "" },
    { en: "Amharic", am: "አማርኛ", value: "Amharic" },
    { en: "English", am: "እንግሊዝኛ", value: "English" },
    { en: "Afaan Oromoo", am: "አፋን ኦሮሞ", value: "Afaan Oromoo" },
    { en: "Tigrinya", am: "ትግርኛ", value: "Tigrinya" },
  ];

  const hasActiveFilters =
    Boolean(filters.searchQuery) ||
    Boolean(filters.selectedSubCity) ||
    filters.minRating > 0 ||
    Boolean(filters.selectedLanguage);

  return (
    <div id="agent-directory-results" className={styles.filterSection}>
      <div className={styles.container}>
        <div className={styles.controlsRow}>
          <div className={styles.dropdownGroup}>
            <select
              className={styles.select}
              value={filters.selectedSubCity}
              onChange={(e) => onFilterChange("selectedSubCity", e.target.value)}
              aria-label={t.allSubCities}
            >
              {subCities.map((sc, idx) => (
                <option key={idx} value={sc.value}>
                  {isAmharic ? sc.am : sc.en}
                </option>
              ))}
            </select>

            <select
              className={styles.select}
              value={filters.minRating}
              onChange={(e) => onFilterChange("minRating", Number(e.target.value))}
              aria-label={t.allRatings}
            >
              <option value="0">{t.allRatings}</option>
              <option value="4.5">{t.rating45}</option>
              <option value="4.8">{t.rating48}</option>
            </select>

            <select
              className={styles.select}
              value={filters.selectedLanguage}
              onChange={(e) => onFilterChange("selectedLanguage", e.target.value)}
              aria-label={t.allLanguages}
            >
              {languages.map((lang, idx) => (
                <option key={idx} value={lang.value}>
                  {isAmharic ? lang.am : lang.en}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.sortGroup}>
            <span className={styles.sortLabel}>{t.sortBy}:</span>
            <select
              className={styles.select}
              value={filters.sortBy}
              onChange={(e) => onFilterChange("sortBy", e.target.value)}
              aria-label={t.sortBy}
            >
              <option value="rating">{t.sortRating}</option>
              <option value="sales">{t.sortSales}</option>
              <option value="listings">{t.sortListings}</option>
            </select>
          </div>
        </div>

        <div className={styles.metaRow}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span className={styles.resultsCount}>
              {t.resultsCount.replace("{count}", resultsCount.toString())}
            </span>
            {Boolean(filters.searchQuery.trim()) && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "rgba(74, 127, 167, 0.12)",
                  color: "var(--color-primary)",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                <span>&ldquo;{filters.searchQuery.trim()}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => onFilterChange("searchQuery", "")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#64748b",
                    padding: 0,
                    fontSize: "0.85rem",
                    lineHeight: 1,
                  }}
                  title="Clear search"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={onClearFilters}
            >
              {t.clearFilters}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentFilterBar;
