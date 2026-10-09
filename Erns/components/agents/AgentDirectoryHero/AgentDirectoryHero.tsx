"use client";

import React from "react";
import Link from "next/link";
import { Search, ShieldCheck, Award } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { agentTranslations } from "../translations";
import styles from "./AgentDirectoryHero.module.css";

interface AgentDirectoryHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeSpecialty: string;
  onSpecialtyChange: (specialty: string) => void;
}

export const AgentDirectoryHero: React.FC<AgentDirectoryHeroProps> = ({
  searchQuery,
  onSearchChange,
  activeSpecialty,
  onSpecialtyChange,
}) => {
  const { isAmharic } = useLanguage();
  const t = agentTranslations[isAmharic ? "am" : "en"].hero;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const resultsElement = document.getElementById("agent-directory-results");
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.badge}>
          <Award size={16} />
          <span>{t.badge}</span>
        </div>

        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>

        <form className={styles.searchCard} onSubmit={handleSearchSubmit}>
          <div className={styles.searchIconWrapper}>
            <Search size={20} />
          </div>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label={t.searchPlaceholder}
          />
          <button type="submit" className={styles.searchBtn}>
            <span>{isAmharic ? "ፈልግ" : "Search"}</span>
          </button>
        </form>

        <div className={styles.tabsRow}>
          <button
            type="button"
            className={`${styles.tabBtn} ${
              activeSpecialty === "listing-agent" ? styles.tabBtnActive : ""
            }`}
            onClick={() => onSpecialtyChange("listing-agent")}
          >
            {t.specialtyTabs.listingAgent}
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${
              activeSpecialty === "buyers-agent" ? styles.tabBtnActive : ""
            }`}
            onClick={() => onSpecialtyChange("buyers-agent")}
          >
            {t.specialtyTabs.buyersAgent}
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${
              activeSpecialty === "relocation" ? styles.tabBtnActive : ""
            }`}
            onClick={() => onSpecialtyChange("relocation")}
          >
            {t.specialtyTabs.relocation}
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${
              activeSpecialty === "commercial" ? styles.tabBtnActive : ""
            }`}
            onClick={() => onSpecialtyChange("commercial")}
          >
            {t.specialtyTabs.commercial}
          </button>
        </div>

        <div className={styles.verifiedRibbon}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <ShieldCheck size={16} color="#10b981" />
            <span>{t.verifiedCount}</span>
          </div>
          <span style={{ opacity: 0.4 }}>•</span>
          <Link
            href="/sell/agent/apply"
            style={{
              color: "var(--color-bg-warm, #b3cfe5)",
              textDecoration: "underline",
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            {isAmharic ? "ወኪል ነዎት? እዚህ ያመልክቱ" : "Are you an agent? Apply to join"}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AgentDirectoryHero;
