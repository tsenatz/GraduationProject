"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  ChevronDown,
  X,
  Sparkles,
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

const QUICK_TAGS = [
  { label: "📍 Bole Atlas", query: "Bole Atlas" },
  { label: "📍 Kazanchis", query: "Kazanchis" },
  { label: "📍 CMC", query: "CMC" },
  { label: "📍 Sarbet", query: "Sarbet" },
  { label: "🏢 Condos", propertyType: "Condominium" },
  { label: "🏡 Villas", propertyType: "Villa" },
];

export function Hero() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = heroTranslations[language] || heroTranslations.en;

  const [locationQuery, setLocationQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

  const searchCardRef = useRef<HTMLFormElement>(null);

  const propertyTypesList = [
    { label: t.propertyTypes.all, value: "" },
    { label: t.propertyTypes.apartment, value: "Apartment" },
    { label: t.propertyTypes.condo, value: "Condominium" },
    { label: t.propertyTypes.villa, value: "Villa" },
    { label: t.propertyTypes.townhouse, value: "Townhouse" },
    { label: t.propertyTypes.penthouse, value: "Penthouse" },
    { label: t.propertyTypes.commercial, value: "Commercial" },
  ];

  const bedroomOptionsList = [
    { label: t.beds.any, value: "" },
    { label: t.beds.studio, value: "1" },
    { label: t.beds.bed2, value: "2" },
    { label: t.beds.bed3, value: "3" },
    { label: t.beds.bed4, value: "4" },
  ];

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
    if (propertyType) {
      params.set("propertyType", propertyType);
    }
    if (bedrooms) {
      params.set("beds", bedrooms);
    }

    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ""}`);
  };

  const handleSelectLocation = (locationName: string) => {
    setLocationQuery(locationName);
    setIsSuggestionsOpen(false);
  };

  const handleQuickTagClick = (tag: {
    query?: string;
    propertyType?: string;
  }) => {
    const params = new URLSearchParams();
    if (tag.query) params.set("query", tag.query);
    if (tag.propertyType) params.set("propertyType", tag.propertyType);

    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ""}`);
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
                <Sparkles size={13} color="#D97706" />
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

        {/* Secondary Row: Clean Filter Pills & Popular Destinations */}
        <div className={styles.secondaryRow}>
          {/* Property Type Filter Pill */}
          <div className={styles.filterPillWrapper}>
            <select
              className={styles.filterSelect}
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              aria-label="Filter by property type"
            >
              {propertyTypesList.map((type) => (
                <option key={type.label} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className={styles.filterChevron} />
          </div>

          {/* Bedrooms Filter Pill */}
          <div className={styles.filterPillWrapper}>
            <select
              className={styles.filterSelect}
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              aria-label="Filter by bedrooms"
            >
              {bedroomOptionsList.map((opt) => (
                <option key={opt.label} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className={styles.filterChevron} />
          </div>

          <span className={styles.filterDividerDot} aria-hidden="true">•</span>

          <span className={styles.quickTagsLabel}>
            <Sparkles size={14} color="#FBBF24" />
            <span>{t.popularLabel}</span>
          </span>

          {QUICK_TAGS.map((tag) => (
            <button
              key={tag.label}
              type="button"
              className={styles.quickTagBtn}
              onClick={() => handleQuickTagClick(tag)}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}