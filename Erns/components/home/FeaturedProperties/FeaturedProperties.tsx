"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Compass, Heart } from "lucide-react";
import { Property } from "@/components/favorites/types";
import { PropertyCard } from "@/components/favorites/PropertyCard";
import { PropertyDetailModal } from "@/components/favorites/PropertyDetailModal";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import { FEATURED_PROPERTIES } from "./featuredData";
import { featuredTranslations } from "./translations";
import styles from "./FeaturedProperties.module.css";

type TabType = "all" | "sale" | "rent" | "villas";

export function FeaturedProperties() {
  const { isAmharic } = useLanguage();
  const { favorites } = useFavorites();
  const t = featuredTranslations[isAmharic ? "am" : "en"];

  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Filter properties based on active tab
  const filteredProperties = FEATURED_PROPERTIES.filter((prop) => {
    if (activeTab === "all") return true;
    if (activeTab === "sale") return prop.listingType === "sale";
    if (activeTab === "rent") return prop.listingType === "rent";
    if (activeTab === "villas") {
      return prop.propertyType === "villa" || prop.propertyType === "penthouse";
    }
    return true;
  });

  const getTabCount = (tab: TabType) => {
    if (tab === "all") return FEATURED_PROPERTIES.length;
    if (tab === "sale") return FEATURED_PROPERTIES.filter((p) => p.listingType === "sale").length;
    if (tab === "rent") return FEATURED_PROPERTIES.filter((p) => p.listingType === "rent").length;
    if (tab === "villas") {
      return FEATURED_PROPERTIES.filter((p) => p.propertyType === "villa" || p.propertyType === "penthouse").length;
    }
    return 0;
  };

  return (
    <section className={styles.section} aria-label="Featured Properties in Addis Ababa">
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.headerRow}>
          <div className={styles.headerLeft}>
            <div className={styles.eyebrowBadge}>
              <span>{t.eyebrow}</span>
            </div>
            <h2 className={styles.title}>{t.title}</h2>
            <p className={styles.subtitle}>{t.subtitle}</p>
          </div>

          <Link href="/search" className={styles.viewAllTopBtn}>
            <span>{t.viewAllBtn}</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {/* Filter Tabs Bar */}
        <div className={styles.tabsBar}>
          <div className={styles.tabsList} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "all"}
              className={`${styles.tabBtn} ${activeTab === "all" ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab("all")}
            >
              <span>{t.tabs.all}</span>
              <span className={styles.tabCount}>{getTabCount("all")}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "sale"}
              className={`${styles.tabBtn} ${activeTab === "sale" ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab("sale")}
            >
              <span>{t.tabs.sale}</span>
              <span className={styles.tabCount}>{getTabCount("sale")}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "rent"}
              className={`${styles.tabBtn} ${activeTab === "rent" ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab("rent")}
            >
              <span>{t.tabs.rent}</span>
              <span className={styles.tabCount}>{getTabCount("rent")}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "villas"}
              className={`${styles.tabBtn} ${activeTab === "villas" ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab("villas")}
            >
              <span>{t.tabs.villas}</span>
              <span className={styles.tabCount}>{getTabCount("villas")}</span>
            </button>
          </div>

          <span className={styles.resultsMeta}>
            {filteredProperties.length} {t.filterCount}
          </span>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className={styles.grid}>
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={(prop) => setSelectedProperty(prop)}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>{t.empty}</p>
          </div>
        )}

        {/* Smart Personalized Recommendations Banner */}
        <div className={styles.aiRecommendationBanner}>
          <div className={styles.aiBannerContent}>
            <div className={styles.aiIconWrapper}>
              <Compass size={24} aria-hidden="true" />
            </div>
            <div>
              <h3 className={styles.aiBannerTitle}>{t.aiBannerTitle}</h3>
              <p className={styles.aiBannerDesc}>
                {favorites.length > 0
                  ? isAmharic
                    ? `እርስዎ በጠበቋቸው ${favorites.length} ቤቶች ላይ ተመስርቶ በቦሌ፣ ካዛንቺስ እና ሳርቤት የሚገኙ ተመሳሳይ ቤቶች ተዘጋጅተውሎታል።`
                    : `Based on your ${favorites.length} saved ${favorites.length === 1 ? "property" : "properties"}, we've curated matching homes in Bole, Kirkos, and Yeka.`
                  : t.aiBannerDesc}
              </p>
            </div>
          </div>

          <div className={styles.aiBannerAction}>
            <Link href="/favorites" className={styles.aiBannerBtn}>
              <Heart size={16} aria-hidden="true" />
              <span>{t.aiBannerBtn}</span>
            </Link>
          </div>
        </div>

        {/* Bottom Explore Button */}
        <div className={styles.bottomActionWrapper}>
          <Link href="/search" className={styles.exploreMoreBtn}>
            <span>{t.exploreMore}</span>
          </Link>
        </div>
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </section>
  );
}

export default FeaturedProperties;
