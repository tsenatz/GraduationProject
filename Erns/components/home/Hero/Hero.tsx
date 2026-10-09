"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/ui/SearchBar";
import styles from "./Hero.module.css";

export function Hero() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("FOR_SALE");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (value: string) => {
    if (!value) return;
    router.push(`/search?query=${encodeURIComponent(value)}&status=${activeTab}`);
  };

  return (
    <div className={styles.heroContainer}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>
          <span>Rentals. Homes.</span>
          <br />
          <span>Agents. Loans.</span>
        </h1>
        <p className={styles.subtitle}>Discover your perfect place with ERNS.</p>
        
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabBtn} ${activeTab === "FOR_SALE" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("FOR_SALE")}
          >
            Buy
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === "FOR_RENT" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("FOR_RENT")}
          >
            Rent
          </button>
        </div>

        <SearchBar
          placeholder="Enter an address"
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