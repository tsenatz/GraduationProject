"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  MapPin,
  Building,
  ArrowRight,
  ArrowDown,
  UserCheck,
  Home,
  X,
} from "lucide-react";
import { useSellLanguage } from "../LanguageContext";
import styles from "./SellHero.module.css";

export function SellHero() {
  const { t } = useSellLanguage();

  const [selectedSubCity, setSelectedSubCity] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleScrollToOptions = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("selling-options");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubCity || addressInput.trim()) {
      setIsModalOpen(true);
    } else {
      // If empty, smoothly scroll to selling options
      const target = document.getElementById("selling-options");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Build target query strings for navigation
  const locationParam = selectedSubCity ? `subCity=${encodeURIComponent(selectedSubCity)}` : "";
  const addressParam = addressInput.trim() ? `address=${encodeURIComponent(addressInput.trim())}` : "";
  const queryParams = [locationParam, addressParam].filter(Boolean).join("&");

  const agentHref = queryParams ? `/sell/agent?${queryParams}` : "/sell/agent";
  const fsboHref = queryParams ? `/sell/list?${queryParams}` : "/sell/list";

  const displayLocation =
    [selectedSubCity, addressInput.trim()].filter(Boolean).join(", ") ||
    t.hero.search.modalDefaultLocation;

  return (
    <section className={styles.heroContainer} aria-label="Sell your home banner">
      <Image
        src="/sell_hero_bg.jpg"
        alt="Luxury residential real estate in Addis Ababa"
        fill
        priority
        className={styles.heroImage}
      />
      <div className={styles.heroOverlay} />

      <div className={styles.heroContent}>
        <div className={styles.badge}>
          <ShieldCheck size={16} aria-hidden="true" />
          <span>{t.hero.badge}</span>
        </div>

        <h1 className={styles.title}>{t.hero.title}</h1>
        <p className={styles.subtitle}>{t.hero.subtitle}</p>

        {/* Zillow-Style Address Search Bar */}
        <form className={styles.searchCard} onSubmit={handleSearchSubmit}>
          <div className={styles.inputGroup}>
            <Building size={18} className={styles.inputIcon} aria-hidden="true" />
            <select
              className={styles.selectInput}
              value={selectedSubCity}
              onChange={(e) => setSelectedSubCity(e.target.value)}
              aria-label={t.hero.search.subCityPlaceholder}
            >
              <option value="">{t.hero.search.subCityPlaceholder}</option>
              {t.fsbo.builder.subCities.map((subCity, idx) => (
                <option key={idx} value={subCity}>
                  {subCity}
                </option>
              ))}
            </select>
          </div>

          <div className={`${styles.inputGroup} ${styles.addressInputGroup}`}>
            <MapPin size={18} className={styles.inputIcon} aria-hidden="true" />
            <input
              type="text"
              className={styles.textInput}
              placeholder={t.hero.search.addressPlaceholder}
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              aria-label={t.hero.search.addressPlaceholder}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            <span>{t.hero.search.btnStart}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </form>

        {/* Streamlined Direct Sub-Actions (Eliminates Redundant Giant Pill Buttons) */}
        <div className={styles.heroSubActions}>
          <span className={styles.heroSubPrompt}>{t.cta.orBrowse}</span>
          <Link href="/sell/list" className={styles.heroSubLink}>
            <Home size={15} aria-hidden="true" />
            <span>{t.sellingOptions.card2.title}</span>
          </Link>
          <span className={styles.heroSubDot}>•</span>
          <Link href="/sell/agent" className={styles.heroSubLink}>
            <UserCheck size={15} aria-hidden="true" />
            <span>{t.sellingOptions.card1.title}</span>
          </Link>
          <span className={styles.heroSubDot}>•</span>
          <Link href="/sell/dashboard" className={styles.heroSubLink}>
            <span>Seller Dashboard →</span>
          </Link>
        </div>
      </div>

      {/* Location-Tailored Selling Options Modal */}
      {isModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsModalOpen(false)}>
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="location-modal-title"
          >
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.modalLocationBadge}>
                  <MapPin size={14} aria-hidden="true" />
                  {displayLocation}
                </span>
                <h2 id="location-modal-title" className={styles.modalTitle}>
                  {t.hero.search.modalTitle} {displayLocation}
                </h2>
                <p className={styles.modalSubtitle}>
                  {t.hero.search.modalSubtitle} <strong>{displayLocation}</strong>
                </p>
              </div>

              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsModalOpen(false)}
                aria-label={t.hero.search.modalClose}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalOptionsGrid}>
              {/* Option 1: Agent */}
              <Link
                href={agentHref}
                className={styles.modalOptionCard}
                onClick={() => setIsModalOpen(false)}
              >
                <div className={styles.modalOptionTag}>
                  {t.hero.search.optionAgentBadge}
                </div>
                <div className={styles.modalOptionIconWrapper}>
                  <UserCheck size={24} aria-hidden="true" />
                </div>
                <h3 className={styles.modalOptionTitle}>
                  {t.hero.search.optionAgentTitle}
                </h3>
                <p className={styles.modalOptionDesc}>
                  {t.hero.search.optionAgentDesc}
                </p>
                <span className={styles.modalOptionBtn}>
                  <span>{t.hero.search.optionAgentBtn}</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>

              {/* Option 2: FSBO */}
              <Link
                href={fsboHref}
                className={`${styles.modalOptionCard} ${styles.modalOptionCardFsbo}`}
                onClick={() => setIsModalOpen(false)}
              >
                <div className={`${styles.modalOptionTag} ${styles.modalOptionTagFsbo}`}>
                  {t.hero.search.optionFsboBadge}
                </div>
                <div className={`${styles.modalOptionIconWrapper} ${styles.modalOptionIconFsbo}`}>
                  <Home size={24} aria-hidden="true" />
                </div>
                <h3 className={styles.modalOptionTitle}>
                  {t.hero.search.optionFsboTitle}
                </h3>
                <p className={styles.modalOptionDesc}>
                  {t.hero.search.optionFsboDesc}
                </p>
                <span className={`${styles.modalOptionBtn} ${styles.modalOptionBtnFsbo}`}>
                  <span>{t.hero.search.optionFsboBtn}</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default SellHero;
