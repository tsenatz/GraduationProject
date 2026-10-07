"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  AgentDirectoryHero,
  AgentFilterBar,
  AgentList,
  AgentContactModal,
  WhyVerifiedAgent,
  AgentDirectoryFAQ,
  AgentDirectoryCTA,
  MOCK_AGENTS,
  Agent,
  AgentFilterState,
} from "@/components/agents";

function FindListingAgentContent() {
  const searchParams = useSearchParams();
  const urlSubCity = searchParams.get("subCity") || "";
  const urlSearch = searchParams.get("address") || searchParams.get("search") || "";

  const [filters, setFilters] = useState<AgentFilterState>({
    searchQuery: urlSearch,
    selectedSubCity: urlSubCity,
    specialty: "listing-agent",
    minRating: 0,
    selectedLanguage: "",
    sortBy: "rating",
  });

  useEffect(() => {
    const subCity = searchParams.get("subCity");
    const search = searchParams.get("address") || searchParams.get("search");
    if (subCity || search) {
      setFilters((prev) => ({
        ...prev,
        ...(subCity !== null ? { selectedSubCity: subCity } : {}),
        ...(search !== null ? { searchQuery: search } : {}),
      }));
    }
  }, [searchParams]);

  const [selectedAgentForContact, setSelectedAgentForContact] =
    useState<Agent | null>(null);

  const handleFilterChange = (key: keyof AgentFilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: "",
      selectedSubCity: "",
      specialty: "listing-agent",
      minRating: 0,
      selectedLanguage: "",
      sortBy: "rating",
    });
  };

  // Filter and sort agents client-side
  const filteredAgents = useMemo(() => {
    return MOCK_AGENTS.filter((agent) => {
      // Specialty filter
      const rawQuery = filters.searchQuery.trim().toLowerCase();
      if (filters.specialty) {
        const hasSpecialty =
          agent.specialties?.includes(filters.specialty) ||
          agent.specialty === filters.specialty;
        // If a direct search query is typed, don't block by specialty tab
        if (!hasSpecialty && !rawQuery) {
          return false;
        }
      }

      // Search query filter (matches agent name, agency, sub-cities, bio, languages)
      if (rawQuery) {
        const terms = rawQuery.split(/\s+/).filter(Boolean);
        const searchableText = [
          agent.name,
          agent.nameAm,
          agent.agency,
          agent.agencyAm,
          agent.bio,
          agent.bioAm,
          ...agent.subCities,
          ...agent.subCitiesAm,
          ...agent.languages,
          ...agent.languagesAm,
        ]
          .join(" ")
          .toLowerCase();

        const allTermsMatch = terms.every((term) =>
          searchableText.includes(term)
        );

        if (!allTermsMatch) {
          return false;
        }
      }

      // Sub-city dropdown filter
      if (filters.selectedSubCity) {
        const hasSubCity =
          agent.subCities.includes(filters.selectedSubCity) ||
          agent.subCitiesAm.includes(filters.selectedSubCity);
        if (!hasSubCity) return false;
      }

      // Rating filter
      if (filters.minRating > 0 && agent.rating < filters.minRating) {
        return false;
      }

      // Language filter
      if (filters.selectedLanguage) {
        const hasLanguage =
          agent.languages.includes(filters.selectedLanguage) ||
          agent.languagesAm.includes(filters.selectedLanguage);
        if (!hasLanguage) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "rating") {
        return b.rating - a.rating || b.reviewCount - a.reviewCount;
      }
      if (filters.sortBy === "sales") {
        return b.salesCountLast12Months - a.salesCountLast12Months;
      }
      if (filters.sortBy === "listings") {
        return b.activeListingsCount - a.activeListingsCount;
      }
      return 0;
    });
  }, [filters]);

  return (
    <main
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "var(--bg-color, #f6fafd)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AgentDirectoryHero
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => handleFilterChange("searchQuery", q)}
        activeSpecialty={filters.specialty}
        onSpecialtyChange={(spec) => handleFilterChange("specialty", spec)}
      />

      <AgentFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        resultsCount={filteredAgents.length}
      />

      <AgentList
        agents={filteredAgents}
        onContactClick={(agent) => setSelectedAgentForContact(agent)}
        onResetFilters={handleClearFilters}
      />

      <WhyVerifiedAgent />
      <AgentDirectoryFAQ />
      <AgentDirectoryCTA />

      {selectedAgentForContact && (
        <AgentContactModal
          agent={selectedAgentForContact}
          onClose={() => setSelectedAgentForContact(null)}
        />
      )}
    </main>
  );
}

export default function FindListingAgentPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
      <FindListingAgentContent />
    </Suspense>
  );
}
