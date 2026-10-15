"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  X,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { heroTranslations } from "./translations";
import styles from "./Hero.module.css";

interface LocationSuggestion {
  name: string;
  subCity: string;
}

const POPULAR_LOCATIONS: LocationSuggestion[] = [
  { name: "Bole Atlas", subCity: "Bole" },
  { name: "Kazanchis", subCity: "Kirkos" },
  { name: "CMC & Summit", subCity: "Yeka" },
  { name: "Sarbet", subCity: "Nifas Silk-Lafto" },
  { name: "Bisrate Gabriel", subCity: "Lafto" },
  { name: "Piassa & Arat Kilo", subCity: "Arada" },
  { name: "Meskel Flower", subCity: "Kirkos" },
  { name: "Ayat Zone 3", subCity: "Yeka" },
];

export function Hero() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = heroTranslations[language] || heroTranslations.en;

  const [locationQuery, setLocationQuery] = useState("");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

  const searchCardRef = useRef<HTMLFormElement>(null);

  // Close suggestions popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchCardRef.current &&
        !searchCardRef.current.contains(event.target as Node)
      ) {
        setIsSuggestionsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSuggestionsOpen(false);

    const params = new URLSearchParams();
    if (locationQuery.trim()) {
      params.set("query", locationQuery.trim());
    }

    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ""}`);
  };

  const handleSelectLocation = (locationName: string) => {
    setLocationQuery(locationName);
    setIsSuggestionsOpen(false);
  };

  // Filter suggestions based on typed text
  const filteredSuggestions = locationQuery.trim()
    ? POPULAR_LOCATIONS.filter(
        (loc) =>
          loc.name.toLowerCase().includes(locationQuery.toLowerCase()) ||
          loc.subCity.toLowerCase().includes(locationQuery.toLowerCase())
      )
    : POPULAR_LOCATIONS;

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

        {/* Spacious, Grand Omni-Search Bar */}
        <form
          ref={searchCardRef}
          role="search"
          onSubmit={handleSearchSubmit}
          className={styles.searchBarCard}
        >
          <div className={styles.searchIconWrapper} aria-hidden="true">
            <MapPin size={22} />
          </div>

          <input
            type="text"
            className={styles.mainSearchInput}
            placeholder={t.searchPlaceholder}
            value={locationQuery}
            onChange={(e) => {
              setLocationQuery(e.target.value);
              setIsSuggestionsOpen(true);
            }}
            onFocus={() => setIsSuggestionsOpen(true)}
            aria-label="Search address or neighborhood"
            autoComplete="off"
          />

          {locationQuery && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => setLocationQuery("")}
              aria-label="Clear search input"
            >
              <X size={16} />
            </button>
          )}

          <button
            type="submit"
            className={styles.searchSubmitBtn}
            aria-label="Search properties"
          >
            <Search size={18} strokeWidth={2.5} />
            <span>{t.searchBtn}</span>
          </button>

          {/* Popular Neighborhoods Auto-Suggest Dropdown */}
          {isSuggestionsOpen && (
            <div className={styles.suggestionsPopover}>
              <div className={styles.suggestionsHeader}>
                <span>Popular in Addis Ababa</span>
              </div>
              <div className={styles.suggestionsList}>
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((loc) => (
                    <div
                      key={loc.name}
                      className={styles.suggestionItem}
                      onMouseDown={() => handleSelectLocation(loc.name)}
                    >
                      <div className={styles.suggestionLeft}>
                        <MapPin size={15} className={styles.suggestionIcon} />
                        <span className={styles.suggestionName}>
                          {loc.name}
                        </span>
                      </div>
                      <span className={styles.suggestionSubCity}>
                        {loc.subCity}
                      </span>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      padding: "0.5rem 0.75rem",
                      fontSize: "0.88rem",
                      color: "#64748B",
                    }}
                  >
                    Press Enter to search for &ldquo;{locationQuery}&rdquo;
                  </div>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}