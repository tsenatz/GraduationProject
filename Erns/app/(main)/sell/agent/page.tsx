"use client";

import React, { useState, useMemo } from "react";
import {
  AgentDirectoryHero,
  AgentFilterBar,
  AgentList,
  AgentContactModal,
  AgentDetailModal,
  WhyVerifiedAgent,
  AgentDirectoryFAQ,
  AgentDirectoryCTA,
  MOCK_AGENTS,
  Agent,
  AgentFilterState,
} from "@/components/agents";

export default function FindListingAgentPage() {
  const [filters, setFilters] = useState<AgentFilterState>({
    searchQuery: "",
    selectedSubCity: "",
    specialty: "listing-agent",
    minRating: 0,
    selectedLanguage: "",
    sortBy: "rating",
  });

  const [selectedAgentForContact, setSelectedAgentForContact] =
    useState<Agent | null>(null);
  const [selectedAgentForDetail, setSelectedAgentForDetail] =
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
        onViewProfileClick={(agent) => setSelectedAgentForDetail(agent)}
        onResetFilters={handleClearFilters}
      />

      <WhyVerifiedAgent />
      <AgentDirectoryFAQ />
      <AgentDirectoryCTA />

      {selectedAgentForDetail && (
        <AgentDetailModal
          agent={selectedAgentForDetail}
          isOpen={Boolean(selectedAgentForDetail)}
          onClose={() => setSelectedAgentForDetail(null)}
          onContactClick={(agent) => {
            setSelectedAgentForDetail(null);
            setSelectedAgentForContact(agent);
          }}
        />
      )}

      {selectedAgentForContact && (
        <AgentContactModal
          agent={selectedAgentForContact}
          onClose={() => setSelectedAgentForContact(null)}
        />
      )}
    </main>
  );
}
