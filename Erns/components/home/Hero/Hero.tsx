"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Building2,
  Bed,
  X,
  Sparkles,
} from "lucide-react";
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

const PROPERTY_TYPES = [
  { label: "All Property Types", value: "" },
  { label: "Apartment", value: "Apartment" },
  { label: "Condominium", value: "Condominium" },
  { label: "Villa / House", value: "Villa" },
  { label: "Townhouse", value: "Townhouse" },
  { label: "Penthouse", value: "Penthouse" },
  { label: "Commercial", value: "Commercial" },
];

const BEDROOM_OPTIONS = [
  { label: "Any Bedrooms", value: "" },
  { label: "Studio / 1 Bed", value: "1" },
  { label: "2 Bedrooms", value: "2" },
  { label: "3 Bedrooms", value: "3" },
  { label: "4+ Bedrooms", value: "4" },
];

const QUICK_TAGS = [
  { label: "📍 Bole Atlas", query: "Bole Atlas" },
  { label: "📍 Kazanchis", query: "Kazanchis" },
  { label: "📍 CMC", query: "CMC" },
  { label: "📍 Sarbet", query: "Sarbet" },
  { label: "🏢 Condominiums", propertyType: "Condominium" },
  { label: "🏡 Luxury Villas", propertyType: "Villa" },
];

export function Hero() {
  const router = useRouter();
  const [locationQuery, setLocationQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

  const locationSegmentRef = useRef<HTMLDivElement>(null);

  // Close suggestions popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        locationSegmentRef.current &&
        !locationSegmentRef.current.contains(event.target as Node)
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
          <span>Rentals. Homes.</span>
          <br />
          <span>Agents. Loans.</span>
        </h1>
        <p className={styles.subtitle}>
          Discover apartments, condominiums, and luxury homes across Addis Ababa with ERNS.
        </p>

        {/* Unified Modern Multi-Segment Search Console */}
        <form
          role="search"
          onSubmit={handleSearchSubmit}
          className={styles.searchConsole}
        >
          {/* 1. Location & Sub-City Segment */}
          <div
            ref={locationSegmentRef}
            className={`${styles.segment} ${styles.locationSegment}`}
          >
            <div className={styles.segmentHeader}>
              <MapPin size={13} color="#4A7FA7" />
              <span>Location</span>
            </div>
            <div className={styles.locationInputRow}>
              <input
                type="text"
                className={styles.locationInput}
                placeholder="Neighborhood or Sub-City (e.g. Bole)..."
                value={locationQuery}
                onChange={(e) => {
                  setLocationQuery(e.target.value);
                  setIsSuggestionsOpen(true);
                }}
                onFocus={() => setIsSuggestionsOpen(true)}
                aria-label="Search by neighborhood or sub-city"
                autoComplete="off"
              />
              {locationQuery && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={() => setLocationQuery("")}
                  aria-label="Clear location input"
                >
                  <X size={15} />
                </button>
              )}
            </div>

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
                          <MapPin size={14} className={styles.suggestionIcon} />
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
          </div>

          <div className={styles.divider} />

          {/* 2. Property Type Segment */}
          <div className={`${styles.segment} ${styles.typeSegment}`}>
            <div className={styles.segmentHeader}>
              <Building2 size={13} color="#4A7FA7" />
              <span>Property Type</span>
            </div>
            <select
              className={styles.selectInput}
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              aria-label="Select property type"
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type.label} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.divider} />

          {/* 3. Bedrooms Segment */}
          <div className={`${styles.segment} ${styles.bedsSegment}`}>
            <div className={styles.segmentHeader}>
              <Bed size={13} color="#4A7FA7" />
              <span>Bedrooms</span>
            </div>
            <select
              className={styles.selectInput}
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              aria-label="Select number of bedrooms"
            >
              {BEDROOM_OPTIONS.map((opt) => (
                <option key={opt.label} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Prominent Search Action Button */}
          <button
            type="submit"
            className={styles.searchActionBtn}
            aria-label="Search real estate listings"
          >
            <Search size={18} strokeWidth={2.5} />
            <span>Search</span>
          </button>
        </form>

        {/* Quick Trending Neighborhood Chips */}
        <div className={styles.quickTagsWrapper}>
          <span className={styles.quickTagsLabel}>
            <Sparkles size={14} color="#FBBF24" />
            <span>Popular:</span>
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