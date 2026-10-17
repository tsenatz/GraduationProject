"use client";

import React, { useState } from "react";
import { ShieldCheck, MapPin, Building, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations } from "@/components/sell/translations";
import styles from "./FsboHero.module.css";

interface FsboHeroProps {
  onLocationSelect?: (subCity: string, address: string) => void;
}

export const FsboHero: React.FC<FsboHeroProps> = ({ onLocationSelect }) => {
  const { isAmharic } = useLanguage();
  const t = translations[isAmharic ? "am" : "en"].fsbo.hero;
  const builderT = translations[isAmharic ? "am" : "en"].fsbo.builder;

  const [selectedSubCity, setSelectedSubCity] = useState("");
  const [addressInput, setAddressInput] = useState("");

  const handleStartListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLocationSelect) {
      onLocationSelect(selectedSubCity, addressInput);
    }
    const builderElement = document.getElementById("fsbo-builder");
    if (builderElement) {
      builderElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroBackgroundPattern} />
      <div className={styles.heroGlow} />

      <div className={styles.heroContent}>
        <div className={styles.badge}>
          <ShieldCheck size={16} />
          <span>{t.badge}</span>
        </div>

        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.subtitle}>{t.subtitle}</p>

        <form className={styles.searchBarCard} onSubmit={handleStartListing}>
          <div className={styles.inputGroup}>
            <Building size={18} className={styles.inputIcon} />
            <select
              className={styles.selectInput}
              value={selectedSubCity}
              onChange={(e) => setSelectedSubCity(e.target.value)}
              aria-label={t.subCityPlaceholder}
            >
              <option value="">{t.subCityPlaceholder}</option>
              {builderT.subCities.map((subCity, idx) => (
                <option key={idx} value={subCity}>
                  {subCity}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <MapPin size={18} className={styles.inputIcon} />
            <input
              type="text"
              className={styles.textInput}
              placeholder={t.addressPlaceholder}
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              aria-label={t.addressPlaceholder}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            <span>{t.btnStart}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className={styles.statsRow}>
          {t.stats.map((stat, idx) => (
            <div key={idx} className={styles.statItem}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FsboHero;
