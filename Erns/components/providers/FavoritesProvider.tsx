"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Property } from "@/components/favorites/types";
import { INITIAL_FAVORITE_PROPERTIES } from "@/components/favorites/mockProperties";
import {
  getUserFavoritesAction,
  toggleFavoriteAction,
  removeFavoriteAction,
  syncLocalFavoritesAction,
} from "@/lib/actions/favorites";

const STORAGE_KEY = "erns_saved_favorite_homes";

interface FavoritesContextType {
  favorites: Property[];
  favoriteIds: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (property: Property) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
  count: number;
  isDbSynced: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDbSynced, setIsDbSynced] = useState(false);
  const hasSyncedDbRef = useRef(false);

  // 1. Initial Load: Read from LocalStorage immediately for instant client response
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
      // Seed with initial realistic samples for guest users
      setFavorites(INITIAL_FAVORITE_PROPERTIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FAVORITE_PROPERTIES));
    } catch {
      setFavorites(INITIAL_FAVORITE_PROPERTIES);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Database Sync: When an authenticated user session is detected, fetch or merge DB favorites
  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id || hasSyncedDbRef.current) {
      return;
    }

    let isMounted = true;
    hasSyncedDbRef.current = true;

    async function syncWithDatabase() {
      try {
        const currentLocal = (() => {
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? (JSON.parse(raw) as Property[]) : [];
          } catch {
            return [];
          }
        })();

        // Fetch DB favorites
        const res = await getUserFavoritesAction();

        if (res.success && res.favorites) {
          if (res.favorites.length > 0) {
            if (isMounted) {
              setFavorites(res.favorites);
              setIsDbSynced(true);
            }
          } else if (currentLocal.length > 0) {
            // First time logged in with local guest favorites: sync up to DB!
            const syncRes = await syncLocalFavoritesAction(currentLocal);
            if (syncRes.success && syncRes.favorites && isMounted) {
              setFavorites(syncRes.favorites);
              setIsDbSynced(true);
            }
          }
        }
      } catch (err) {
        console.warn("Database favorites sync error (falling back to client storage):", err);
      }
    }

    syncWithDatabase();

    return () => {
      isMounted = false;
    };
  }, [session, status]);

  // 3. Keep LocalStorage synchronized whenever favorites change
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

  /**
   * Toggle favorite:
   * - Optimistically updates UI state and localStorage immediately.
   * - If user is authenticated, persists to PostgreSQL DB in background.
   */
  const toggleFavorite = (property: Property) => {
    const exists = favorites.some((p) => p.id === property.id);

    // Optimistic update
    setFavorites((prev) => {
      if (exists) {
        return prev.filter((p) => p.id !== property.id);
      } else {
        return [{ ...property, dateSaved: new Date().toISOString() }, ...prev];
      }
    });

    // Background Database Sync if authenticated
    if (session?.user?.id) {
      toggleFavoriteAction(property).catch((err) => {
        console.warn("Failed to toggle favorite in database:", err);
      });
    }
  };

  /**
   * Remove favorite:
   * - Optimistically updates UI state.
   * - If user is authenticated, deletes from PostgreSQL DB.
   */
  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((p) => p.id !== id));

    if (session?.user?.id) {
      removeFavoriteAction(id).catch((err) => {
        console.warn("Failed to remove favorite in database:", err);
      });
    }
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
        isDbSynced,
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
