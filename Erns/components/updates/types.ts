export type NotificationFrequency = 'instant' | 'daily' | 'weekly' | 'never';

export type UpdatesTab = 'searches' | 'feed' | 'price_drops';

export type UpdateType = 'new_listing' | 'price_drop' | 'open_house' | 'status_change';

export interface SavedSearch {
  id: string;
  title: string;
  titleAm: string;
  status: 'FOR_SALE' | 'FOR_RENT';
  location: string;
  locationAm: string;
  propertyType?: string;
  propertyTypeAm?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: string;
  frequency: NotificationFrequency;
  newMatchesCount: number;
  lastChecked: string;
  createdAt: string;
}

export interface PropertyUpdate {
  id: string;
  propertyId: string;
  type: UpdateType;
  title: string;
  titleAm: string;
  location: string;
  locationAm: string;
  priceETB: number;
  oldPriceETB?: number;
  status: 'FOR_SALE' | 'FOR_RENT';
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  areaSqM: number;
  imageUrl: string;
  updatedAt: string;
  searchMatchTag: string;
  openHouseDate?: string;
}
