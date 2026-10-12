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
  Compass,
  Home,
} from "lucide-react";
import { MainPerspective, SubFolder } from "../types";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { inboxTranslations } from "../translations";
import styles from "./InboxHeader.module.css";

interface InboxHeaderProps {
  activePerspective: MainPerspective;
  onPerspectiveChange: (p: MainPerspective) => void;
  perspectiveCounts: {
    buying_renting: number;
    selling_hosting: number;
  };
  activeFolder: SubFolder;
  onFolderChange: (folder: SubFolder) => void;
  folderCounts: {
    all: number;
    sale: number;
    rent: number;
    tours: number;
    unread: number;
    archived: number;
  };
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const InboxHeader: React.FC<InboxHeaderProps> = ({
  activePerspective,
  onPerspectiveChange,
  perspectiveCounts,
  activeFolder,
  onFolderChange,
  folderCounts,
  searchQuery,
  onSearchChange,
}) => {
  const { isAmharic } = useLanguage();
  const t = inboxTranslations[isAmharic ? "am" : "en"];
  const currentPerspectiveConfig = t.perspectives[activePerspective];

  const tabs: {
    id: SubFolder;
    label: string;
    count: number;
    icon: React.FC<{ size?: number }>;
  }[] = [
    {
      id: "all",
      label: currentPerspectiveConfig.tabs.all,
      count: folderCounts.all,
      icon: Mail,
    },
    {
      id: "sale",
      label: currentPerspectiveConfig.tabs.sale,
      count: folderCounts.sale,
      icon: activePerspective === "buying_renting" ? ShoppingBag : Tag,
    },
    {
      id: "rent",
      label: currentPerspectiveConfig.tabs.rent,
      count: folderCounts.rent,
      icon: activePerspective === "buying_renting" ? Key : Building2,
    },
    {
      id: "tours",
      label: currentPerspectiveConfig.tabs.tours,
      count: folderCounts.tours,
      icon: Calendar,
    },
    {
      id: "unread",
      label: currentPerspectiveConfig.tabs.unread,
      count: folderCounts.unread,
      icon: Bell,
    },
    {
      id: "archived",
      label: currentPerspectiveConfig.tabs.archived,
      count: folderCounts.archived,
      icon: Archive,
    },
  ];

  return (
    <div className={styles.headerContainer}>
      {/* 1. Top Perspective Segmented Switch (Airbnb/Zillow Style) */}
      <div className={styles.perspectiveSwitchWrapper}>
        <div className={styles.perspectiveSwitch} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activePerspective === "buying_renting"}
            className={`${styles.perspectiveBtn} ${
              activePerspective === "buying_renting"
                ? styles.perspectiveBtnActive
                : ""
            }`}
            onClick={() => onPerspectiveChange("buying_renting")}
          >
            <Compass size={17} />
            <span>{t.perspectives.buying_renting.title}</span>
            <span className={styles.perspectiveCount}>
              {perspectiveCounts.buying_renting}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activePerspective === "selling_hosting"}
            className={`${styles.perspectiveBtn} ${
              activePerspective === "selling_hosting"
                ? styles.perspectiveBtnActive
                : ""
            }`}
            onClick={() => onPerspectiveChange("selling_hosting")}
          >
            <Building2 size={17} />
            <span>{t.perspectives.selling_hosting.title}</span>
            <span className={styles.perspectiveCount}>
              {perspectiveCounts.selling_hosting}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Context Explanation Banner */}
      <div className={styles.contextBanner}>
        <p className={styles.contextSubtitle}>
          {currentPerspectiveConfig.subtitle}
        </p>
      </div>

      {/* 3. Search Bar */}
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

      {/* 4. Sub-folder Navigation Tabs */}
      <div className={styles.tabsRow} role="tablist">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeFolder === tab.id;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              className={`${styles.tabBtn} ${
                isActive ? styles.tabBtnActive : ""
              }`}
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

export default InboxHeader;
