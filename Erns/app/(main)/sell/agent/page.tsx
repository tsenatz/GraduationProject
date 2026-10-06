"use client";

import React, { useState, useMemo } from "react";
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
      if (filters.specialty && agent.specialty !== filters.specialty) {
        return false;
      }

      // Search query filter (matches agent name, agency, sub-cities, or bio)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName =
          agent.name.toLowerCase().includes(query) ||
          agent.nameAm.includes(query);
        const matchesAgency =
          agent.agency.toLowerCase().includes(query) ||
          agent.agencyAm.includes(query);
        const matchesSubCity =
          agent.subCities.some((sc) => sc.toLowerCase().includes(query)) ||
          agent.subCitiesAm.some((sc) => sc.includes(query));

        if (!matchesName && !matchesAgency && !matchesSubCity) {
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
