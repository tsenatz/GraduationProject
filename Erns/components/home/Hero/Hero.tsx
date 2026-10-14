"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/ui/SearchBar";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { heroTranslations } from "./translations";
import styles from "./Hero.module.css";

export function Hero() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = heroTranslations[language] || heroTranslations.en;

  const [activeTab, setActiveTab] = useState<"FOR_SALE" | "FOR_RENT" | "SELL">("FOR_SALE");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (value: string) => {
    const q = value.trim();

    if (activeTab === "SELL") {
      router.push(q ? `/sell?address=${encodeURIComponent(q)}` : "/sell");
    } else {
      router.push(
        q
          ? `/search?query=${encodeURIComponent(q)}&status=${activeTab}`
          : `/search?status=${activeTab}`
      );
    }
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case "FOR_RENT":
        return t.placeholders.rent;
      case "SELL":
        return t.placeholders.sell;
      case "FOR_SALE":
      default:
        return t.placeholders.buy;
    }
  };

  return (
    <div className={styles.heroContainer}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>
          <span>{t.titleLine1}</span>
          <br />
          <span>{t.titleLine2}</span>
        </h1>
        <p className={styles.subtitle}>{t.subtitle}</p>
        
        {/* Navigation Tabs: Buy | Rent | Sell */}
        <div className={styles.tabs} role="tablist">
          <button 
            type="button"
            role="tab"
            aria-selected={activeTab === "FOR_SALE"}
            className={`${styles.tabBtn} ${activeTab === "FOR_SALE" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("FOR_SALE")}
          >
            {t.tabs.buy}
          </button>
          <button 
            type="button"
            role="tab"
            aria-selected={activeTab === "FOR_RENT"}
            className={`${styles.tabBtn} ${activeTab === "FOR_RENT" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("FOR_RENT")}
          >
            {t.tabs.rent}
          </button>
          <button 
            type="button"
            role="tab"
            aria-selected={activeTab === "SELL"}
            className={`${styles.tabBtn} ${activeTab === "SELL" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("SELL")}
          >
            {t.tabs.sell}
          </button>
        </div>

        {/* Search Input with Interactive Submit Magnifier */}
        <SearchBar
          placeholder={getPlaceholder()}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSubmit={handleSearchSubmit}
          wrapperClassName={styles.searchWrapper}
          inputClassName={styles.searchInput}
          iconClassName={styles.searchIcon}
        />
      </div>
    </div>
  );
}