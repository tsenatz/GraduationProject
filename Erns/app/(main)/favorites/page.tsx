"use client";

import React, { useState, useMemo } from "react";
import {
  FavoritesHeader,
  FavoritesFilterBar,
  FavoritesList,
  FavoritesEmptyState,
  PropertyDetailModal,
  FilterTab,
  SortOption,
  Property,
} from "@/components/favorites";
import { useFavorites } from "@/components/providers/FavoritesProvider";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const counts = useMemo(() => {
    return {
      all: favorites.length,
      sale: favorites.filter((p) => p.listingType === "sale").length,
      rent: favorites.filter((p) => p.listingType === "rent").length,
    };
  }, [favorites]);

  const filteredAndSortedProperties = useMemo(() => {
    // 1. Filter by Tab
    let result = [...favorites];
    if (activeTab === "sale") {
      result = result.filter((p) => p.listingType === "sale");
    } else if (activeTab === "rent") {
      result = result.filter((p) => p.listingType === "rent");
    }

    // 2. Sort
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.dateSaved).getTime() - new Date(a.dateSaved).getTime();
      }
      if (sortBy === "price-asc") {
        return a.priceETB - b.priceETB;
      }
      if (sortBy === "price-desc") {
        return b.priceETB - a.priceETB;
      }
      if (sortBy === "area-desc") {
        return b.areaSqM - a.areaSqM;
      }
      return 0;
    });

    return result;
  }, [favorites, activeTab, sortBy]);

  return (
    <main
      style={{
        width: "100%",
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "var(--bg-color, #f8fafd)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <FavoritesHeader />

      {favorites.length === 0 ? (
        <FavoritesEmptyState />
      ) : (
        <>
          <FavoritesFilterBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            sortBy={sortBy}
            onSortChange={setSortBy}
            counts={counts}
          />

          <FavoritesList
            properties={filteredAndSortedProperties}
            onSelectProperty={(property) => setSelectedProperty(property)}
          />

          {selectedProperty && (
            <PropertyDetailModal
              property={selectedProperty}
              onClose={() => setSelectedProperty(null)}
            />
          )}
        </>
      )}
    </main>
  );
}
