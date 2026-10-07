export type ListingType = "sale" | "rent";
export type PropertyType = "apartment" | "condo" | "villa" | "townhouse" | "penthouse" | "commercial";
export type PropertyStatus = "active" | "pending" | "sold";

export interface Property {
  id: string;
  title: string;
  titleAm: string;
  priceETB: number;
  listingType: ListingType;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  areaSqM: number;
  subCity: string;
  subCityAm: string;
  woreda?: string;
  specificArea: string;
  specificAreaAm: string;
  imageUrl: string;
  images: string[];
  isVerified: boolean;
  isFeatured?: boolean;
  dateSaved: string; // ISO string
  ownerOrAgentName: string;
  ownerOrAgentPhone: string;
  isAgentListing: boolean;
  description?: string;
  descriptionAm?: string;
  amenities?: string[];
  amenitiesAm?: string[];
  yearBuilt?: number;
  titleDeedStatus?: string;
  titleDeedStatusAm?: string;
}

export type SortOption = "newest" | "price-asc" | "price-desc" | "area-desc";
export type FilterTab = "all" | "sale" | "rent";
