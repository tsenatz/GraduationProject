"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import {
  NotificationFrequency,
  UpdatesTab,
  SavedSearch,
  PropertyUpdate,
} from "./types";
import { INITIAL_SAVED_SEARCHES, INITIAL_PROPERTY_UPDATES } from "./mockUpdates";
import { updatesTranslations } from "./translations";
import { UpdatesHeader } from "./UpdatesHeader";
import { SavedSearchCard } from "./SavedSearchCard";
import { PropertyUpdateCard } from "./PropertyUpdateCard";
import { UpdatesEmptyState } from "./UpdatesEmptyState";
import { CreateSearchModal } from "./CreateSearchModal";
import styles from "./UpdatesView.module.css";

const STORAGE_KEY = "erns_saved_searches";

export function UpdatesView() {
  const { isAmharic } = useLanguage();
  const t = isAmharic ? updatesTranslations.am : updatesTranslations.en;

  const [activeTab, setActiveTab] = useState<UpdatesTab>("searches");
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(
    INITIAL_SAVED_SEARCHES
  );
  const [propertyUpdates, setPropertyUpdates] = useState<PropertyUpdate[]>(
    INITIAL_PROPERTY_UPDATES
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Read tab parameter from URL on client mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab") as UpdatesTab | null;
      if (tab === "feed" || tab === "price_drops" || tab === "searches") {
        setActiveTab(tab);
      }
    } catch {
      // Ignore
    }
  }, []);

  // Initialize from localStorage or fallback
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedSearches(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to load saved searches from localStorage", e);
    }
    // Fallback to initial
    setSavedSearches(INITIAL_SAVED_SEARCHES);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAVED_SEARCHES));
    } catch (e) {
      // Ignore
    }
  }, []);

  // Sync to localStorage
  const persistSearches = (searches: SavedSearch[]) => {
    setSavedSearches(searches);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
    } catch (e) {
      console.warn("Failed to persist saved searches", e);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleUpdateFrequency = (
    id: string,
    frequency: NotificationFrequency
  ) => {
    const updated = savedSearches.map((s) =>
      s.id === id ? { ...s, frequency } : s
    );
    persistSearches(updated);

    const freqLabels: Record<NotificationFrequency, string> = {
      instant: t.searchCard.freqInstant,
      daily: t.searchCard.freqDaily,
      weekly: t.searchCard.freqWeekly,
      never: t.searchCard.freqNever,
    };
    showToast(t.toasts.freqUpdated.replace("{freq}", freqLabels[frequency]));
  };

  const handleDeleteSearch = (id: string) => {
    const filtered = savedSearches.filter((s) => s.id !== id);
    persistSearches(filtered);
    showToast(t.toasts.searchDeleted);
  };

  const handleCreateSearch = (
    data: Omit<SavedSearch, "id" | "newMatchesCount" | "lastChecked" | "createdAt">
  ) => {
    const newSearch: SavedSearch = {
      ...data,
      id: "search-" + Date.now(),
      newMatchesCount: Math.floor(Math.random() * 3) + 1,
      lastChecked: isAmharic ? "አሁን" : "Just now",
      createdAt: new Date().toISOString().split("T")[0],
    };
    const updated = [newSearch, ...savedSearches];
    persistSearches(updated);
    showToast(t.toasts.searchSaved);
  };

  const handleShareSearch = (search: SavedSearch) => {
    const url = `${window.location.origin}/search?location=${encodeURIComponent(
      search.location
    )}&status=${search.status}`;
    navigator.clipboard.writeText(url);
    showToast(t.toasts.linkCopied);
  };

  const priceDropUpdates = propertyUpdates.filter(
    (u) => u.type === "price_drop"
  );

  return (
    <div className={styles.container}>
      <UpdatesHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchesCount={savedSearches.length}
        feedCount={propertyUpdates.length}
        priceDropsCount={priceDropUpdates.length}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        isAmharic={isAmharic}
      />

      <main className={styles.contentArea}>
        {/* TAB 1: SAVED SEARCHES */}
        {activeTab === "searches" && (
          <>
            {savedSearches.length === 0 ? (
              <UpdatesEmptyState
                activeTab="searches"
                onCreateSearch={() => setIsCreateModalOpen(true)}
                isAmharic={isAmharic}
              />
            ) : (
              savedSearches.map((search) => (
                <SavedSearchCard
                  key={search.id}
                  search={search}
                  onUpdateFrequency={handleUpdateFrequency}
                  onDelete={handleDeleteSearch}
                  onShare={handleShareSearch}
                  isAmharic={isAmharic}
                />
              ))
            )}
          </>
        )}

        {/* TAB 2: PROPERTY UPDATES STREAM */}
        {activeTab === "feed" && (
          <>
            {propertyUpdates.length === 0 ? (
              <UpdatesEmptyState
                activeTab="feed"
                onCreateSearch={() => setIsCreateModalOpen(true)}
                isAmharic={isAmharic}
              />
            ) : (
              propertyUpdates.map((update) => (
                <PropertyUpdateCard
                  key={update.id}
                  update={update}
                  isAmharic={isAmharic}
                />
              ))
            )}
          </>
        )}

        {/* TAB 3: PRICE DROPS */}
        {activeTab === "price_drops" && (
          <>
            {priceDropUpdates.length === 0 ? (
              <UpdatesEmptyState
                activeTab="price_drops"
                onCreateSearch={() => setIsCreateModalOpen(true)}
                isAmharic={isAmharic}
              />
            ) : (
              priceDropUpdates.map((update) => (
                <PropertyUpdateCard
                  key={update.id}
                  update={update}
                  isAmharic={isAmharic}
                />
              ))
            )}
          </>
        )}
      </main>

      {/* Save Search Modal */}
      <CreateSearchModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateSearch}
        isAmharic={isAmharic}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className={styles.toastBanner} role="status">
          <CheckCircle2 size={18} className={styles.toastCheckIcon} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
