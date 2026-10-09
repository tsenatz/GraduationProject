"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Property } from "@/components/favorites/types";
import { INITIAL_FAVORITE_PROPERTIES } from "@/components/favorites/mockProperties";

const STORAGE_KEY = "erns_saved_favorite_homes";

interface FavoritesContextType {
  favorites: Property[];
  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (property: Property) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
  count: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
          setIsLoaded(true);
          return;
        }
      }
      // First-time seed with realistic sample favorites
      setFavorites(INITIAL_FAVORITE_PROPERTIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FAVORITE_PROPERTIES));
    } catch {
      setFavorites(INITIAL_FAVORITE_PROPERTIES);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage whenever favorites change (after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites to localStorage", e);
    }
  }, [favorites, isLoaded]);

  const favoriteIds = favorites.map((p) => p.id);

  const isFavorite = (id: string) => {
    return favoriteIds.includes(id);
  };

  const toggleFavorite = (property: Property) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === property.id);
      if (exists) {
        return prev.filter((p) => p.id !== property.id);
      } else {
        return [{ ...property, dateSaved: new Date().toISOString() }, ...prev];
      }
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((p) => p.id !== id));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        clearFavorites,
        count: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
