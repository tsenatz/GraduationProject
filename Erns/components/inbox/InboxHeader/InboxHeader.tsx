"use client";

import React from "react";
import {
  Search,
  Mail,
  Calendar,
  Archive,
  ShoppingBag,
  Key,
  Tag,
  Building2,
  Bell,
} from "lucide-react";
import { InboxFolder } from "../types";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { inboxTranslations } from "../translations";
import styles from "./InboxHeader.module.css";

interface InboxHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFolder: InboxFolder;
  onFolderChange: (folder: InboxFolder) => void;
  folderCounts: {
    all: number;
    buying: number;
    renting: number;
    selling: number;
    landlord: number;
    tours: number;
    unread: number;
    archived: number;
  };
}

export const InboxHeader: React.FC<InboxHeaderProps> = ({
  searchQuery,
  onSearchChange,
  activeFolder,
  onFolderChange,
  folderCounts,
}) => {
  const { isAmharic } = useLanguage();
  const t = inboxTranslations[isAmharic ? "am" : "en"];

  const tabs: {
    id: InboxFolder;
    label: string;
    count: number;
    icon: React.FC<{ size?: number }>;
  }[] = [
    { id: "all", label: t.folders.all, count: folderCounts.all, icon: Mail },
    { id: "buying", label: t.folders.buying, count: folderCounts.buying, icon: ShoppingBag },
    { id: "renting", label: t.folders.renting, count: folderCounts.renting, icon: Key },
    { id: "selling", label: t.folders.selling, count: folderCounts.selling, icon: Tag },
    { id: "landlord", label: t.folders.landlord, count: folderCounts.landlord, icon: Building2 },
    { id: "tours", label: t.folders.tours, count: folderCounts.tours, icon: Calendar },
    { id: "unread", label: t.folders.unread, count: folderCounts.unread, icon: Bell },
    { id: "archived", label: t.folders.archived, count: folderCounts.archived, icon: Archive },
  ];

  return (
    <div className={styles.headerContainer}>
      <div className={styles.titleRow}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>{t.title}</h1>
          <span className={styles.badge}>{folderCounts.all}</span>
        </div>
        <p className={styles.subtitle}>{t.subtitle}</p>
      </div>

      {/* Zillow Style Search Input */}
      <div className={styles.searchWrapper}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label={t.searchPlaceholder}
        />
        {searchQuery && (
          <button
            type="button"
            className={styles.clearSearchBtn}
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* Horizontal Folders Tab Navigation */}
      <div className={styles.tabsRow} role="tablist">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeFolder === tab.id;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              className={`${styles.tabBtn} ${isActive ? styles.tabBtnActive : ""}`}
              onClick={() => onFolderChange(tab.id)}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              <span
                className={`${styles.countBadge} ${
                  isActive ? styles.countBadgeActive : ""
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
