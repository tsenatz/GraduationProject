export interface AgentReview {
  id: string;
  author: string;
  date: string;
  rating: number;
  subCity: string;
  comment: string;
  commentAm: string;
}

export interface AgentCategoryRatings {
  localKnowledge: number;
  processExpertise: number;
  responsiveness: number;
  negotiationSkills: number;
}

export interface Agent {
  id: string;
  name: string;
  nameAm: string;
  agency: string;
  agencyAm: string;
  photoUrl: string;
  isVerified: boolean;
  specialty: "listing-agent" | "buyers-agent" | "relocation" | "commercial";
  specialties: string[];
  rating: number;
  reviewCount: number;
  categoryRatings: AgentCategoryRatings;
  salesCountLast12Months: number;
  activeListingsCount: number;
  priceRangeETB: {
    min: string;
    max: string;
  };
  subCities: string[];
  subCitiesAm: string[];
  languages: string[];
  languagesAm: string[];
  bio: string;
  bioAm: string;
  phone: string;
  recentReview: AgentReview;
}

export interface AgentFilterState {
  searchQuery: string;
  selectedSubCity: string;
  specialty: string;
  minRating: number;
  selectedLanguage: string;
  sortBy: "rating" | "sales" | "listings" | "reviews";
}
