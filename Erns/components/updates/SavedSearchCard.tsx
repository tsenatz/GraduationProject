"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  MapPin,
  Tag,
  Home,
  Bed,
  ArrowUpRight,
  Trash2,
  Clock,
  Check,
  Share2,
} from "lucide-react";
import { SavedSearch, NotificationFrequency } from "./types";
import { updatesTranslations } from "./translations";
import styles from "./UpdatesView.module.css";

interface SavedSearchCardProps {
  search: SavedSearch;
  onUpdateFrequency: (id: string, frequency: NotificationFrequency) => void;
  onDelete: (id: string) => void;
  onShare: (search: SavedSearch) => void;
  isAmharic: boolean;
}

export function SavedSearchCard({
  search,
  onUpdateFrequency,
  onDelete,
  onShare,
  isAmharic,
}: SavedSearchCardProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const t = isAmharic ? updatesTranslations.am : updatesTranslations.en;

  const formatPrice = (amount?: number) => {
    if (!amount) return "";
    if (amount >= 1000000) {
      return `${(amount / 1000000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M ETB`;
    }
    return `${amount.toLocaleString()} ETB`;
  };

  const getPriceRangeText = () => {
    if (search.minPrice && search.maxPrice) {
      return `${formatPrice(search.minPrice)} - ${formatPrice(search.maxPrice)}`;
    }
    if (search.minPrice) {
      return `From ${formatPrice(search.minPrice)}`;
    }
    if (search.maxPrice) {
      return `Up to ${formatPrice(search.maxPrice)}`;
    }
    return isAmharic ? "ማንኛውም ዋጋ" : "Any price";
  };

  const frequencyOptions: { value: NotificationFrequency; label: string }[] = [
    { value: "instant", label: t.searchCard.freqInstant },
    { value: "daily", label: t.searchCard.freqDaily },
    { value: "weekly", label: t.searchCard.freqWeekly },
    { value: "never", label: t.searchCard.freqNever },
  ];

  // Build the search query link to /search
  const searchUrl = `/search?location=${encodeURIComponent(search.location)}&status=${search.status}${
    search.minPrice ? `&minPrice=${search.minPrice}` : ""
  }${search.maxPrice ? `&maxPrice=${search.maxPrice}` : ""}${
    search.beds ? `&beds=${encodeURIComponent(search.beds)}` : ""
  }`;

  return (
    <article className={styles.searchCard} id={`search-card-${search.id}`}>
      {/* Top Bar: Title, Status Badge, New Matches */}
      <div className={styles.cardHeader}>
        <div className={styles.cardTitleGroup}>
          <div className={styles.titleWithBadge}>
            <h2 className={styles.searchTitle}>
              {isAmharic ? search.titleAm || search.title : search.title}
            </h2>
            <span
              className={`${styles.statusBadge} ${
                search.status === "FOR_SALE"
                  ? styles.statusForSale
                  : styles.statusForRent
              }`}
            >
              {search.status === "FOR_SALE"
                ? t.searchCard.forSale
                : t.searchCard.forRent}
            </span>
          </div>

          <div className={styles.searchMetaRow}>
            <span className={styles.metaItem}>
              <Clock size={13} />
              <span>
                {t.searchCard.lastChecked} {search.lastChecked}
              </span>
            </span>
          </div>
        </div>

        {search.newMatchesCount > 0 && (
          <div className={styles.newMatchesBadge}>
            <span className={styles.pulseDot} />
            <span className={styles.matchesCount}>
              {search.newMatchesCount} {t.searchCard.newMatches}
            </span>
          </div>
        )}
      </div>

      {/* Filter Chips */}
      <div className={styles.filterChipsList}>
        <div className={styles.filterChip} title={t.searchCard.location}>
          <MapPin size={13} className={styles.chipIcon} />
          <span>{isAmharic ? search.locationAm || search.location : search.location}</span>
        </div>

        <div className={styles.filterChip} title={t.searchCard.price}>
          <Tag size={13} className={styles.chipIcon} />
          <span>{getPriceRangeText()}</span>
        </div>

        {search.propertyType && (
          <div className={styles.filterChip} title={t.searchCard.type}>
            <Home size={13} className={styles.chipIcon} />
            <span>
              {isAmharic ? search.propertyTypeAm || search.propertyType : search.propertyType}
            </span>
          </div>
        )}

        {search.beds && search.beds !== "Any" && (
          <div className={styles.filterChip} title={t.searchCard.beds}>
            <Bed size={13} className={styles.chipIcon} />
            <span>
              {search.beds} {t.searchCard.beds}
            </span>
          </div>
        )}
      </div>

      {/* Footer Controls: Frequency Dropdown + Actions */}
      <div className={styles.cardFooter}>
        <div className={styles.frequencyPicker}>
          <label
            htmlFor={`freq-select-${search.id}`}
            className={styles.frequencyLabel}
          >
            <Bell size={14} className={styles.bellIcon} />
            <span>{t.searchCard.frequency}:</span>
          </label>
          <div className={styles.selectWrapper}>
            <select
              id={`freq-select-${search.id}`}
              className={styles.frequencySelect}
              value={search.frequency}
              onChange={(e) =>
                onUpdateFrequency(search.id, e.target.value as NotificationFrequency)
              }
            >
              {frequencyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.actionsGroup}>
          <button
            type="button"
            className={styles.iconActionBtn}
            onClick={() => onShare(search)}
            title={isAmharic ? "አጋራ" : "Share Search Link"}
            aria-label="Share search criteria"
          >
            <Share2 size={16} />
          </button>

          {!isConfirmingDelete ? (
            <button
              type="button"
              className={styles.iconActionBtnDanger}
              onClick={() => setIsConfirmingDelete(true)}
              title={t.searchCard.delete}
              aria-label="Delete saved search"
            >
              <Trash2 size={16} />
            </button>
          ) : (
            <div className={styles.deleteConfirmBox}>
              <span className={styles.confirmPrompt}>
                {isAmharic ? "ይሰረዝ?" : "Delete?"}
              </span>
              <button
                type="button"
                className={styles.confirmBtnYes}
                onClick={() => onDelete(search.id)}
              >
                <Check size={14} />
              </button>
              <button
                type="button"
                className={styles.confirmBtnCancel}
                onClick={() => setIsConfirmingDelete(false)}
              >
                ✕
              </button>
            </div>
          )}

          <Link href={searchUrl} className={styles.viewResultsBtn}>
            <span>{t.searchCard.viewResults}</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
