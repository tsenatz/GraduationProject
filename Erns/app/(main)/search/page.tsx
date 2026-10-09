"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import useSWR from "swr";
import type { Property } from "@/app/generated/prisma";
import { Heart, Search as SearchIcon } from "lucide-react";
import PropertyMap from "@/components/PropertyMap";
import BedsBathsFilter from "@/components/BedsBathsFilter";
import styles from "./Search.module.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function isPointInPolygon(point: {lat: number, lng: number}, polygon: {lat: number, lng: number}[]) {
  let isInside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat, yi = polygon[i].lng;
    const xj = polygon[j].lat, yj = polygon[j].lng;
    
    const intersect = ((yi > point.lng) !== (yj > point.lng))
        && (point.lat < (xj - xi) * (point.lng - yi) / (yj - yi) + xi);
    if (intersect) isInside = !isInside;
  }
  return isInside;
}

function SearchPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [polygonCoords, setPolygonCoords] = useState<{lat: number, lng: number}[] | null>(null);

  // Read state from URL
  const searchQuery = searchParams.get("query") || "";
  const status = searchParams.get("status") || "Any";
  const minPrice = searchParams.get("minPrice") || "";
  const beds = searchParams.get("beds") || "Any";
  const baths = searchParams.get("baths") || "Any";
  const exactMatchBeds = searchParams.get("exactMatchBeds") === "true";
  
  // Construct API URL
  const apiQueryString = searchParams.toString();
  const apiUrl = `/api/properties/search${apiQueryString ? `?${apiQueryString}` : ""}`;

  // Fetch properties data
  const { data: properties, isLoading } = useSWR<Property[]>(apiUrl, fetcher);
  const propertiesList = Array.isArray(properties) ? properties : [];
  
  const displayedProperties = polygonCoords 
    ? propertiesList.filter(p => isPointInPolygon({lat: p.latitude, lng: p.longitude}, polygonCoords)) 
    : propertiesList;

  const [searchValue, setSearchValue] = useState(searchQuery);

  const handleSearchSubmit = () => {
    updateQueryString("query", searchValue);
  };

  const updateQueryString = (key: string, val: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (!val || val === "Any") current.delete(key);
    else current.set(key, val);
    router.replace(`${pathname}?${current.toString()}`, { scroll: false });
  };

  const handleBedsBathsApply = (newBeds: string, newBaths: string, newExactMatch: boolean) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (newBeds === "Any") current.delete("beds");
    else current.set("beds", newBeds);
    
    if (newBaths === "Any") current.delete("baths");
    else current.set("baths", newBaths);
    
    if (newExactMatch && newBeds !== "Any") current.set("exactMatchBeds", "true");
    else current.delete("exactMatchBeds");

    router.replace(`${pathname}?${current.toString()}`, { scroll: false });
  };

  const handleBoundsChange = (bounds: { neLat: number; neLng: number; swLat: number; swLng: number }) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("neLat", bounds.neLat.toString());
    current.set("neLng", bounds.neLng.toString());
    current.set("swLat", bounds.swLat.toString());
    current.set("swLng", bounds.swLng.toString());
    router.replace(`${pathname}?${current.toString()}`, { scroll: false });
  };

  return (
    <div className={styles.pageContainer}>
      {/* Top Filter Bar */}
      <div className={styles.filtersBar}>
        <div className={styles.searchWrapper}>
          <div className={styles.searchIconWrapper}>
             <SearchIcon size={18} className={styles.searchIcon} />
          </div>
          <input 
            type="text" 
            placeholder="Address, neighborhood, or zip"
            className={styles.searchInput}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit();
              }
            }}
          />
        </div>
        
        <select 
          className={styles.filterPill}
          value={status}
          onChange={(e) => updateQueryString("status", e.target.value)}
        >
          <option value="Any">For sale</option>
          <option value="FOR_SALE">For Sale</option>
          <option value="FOR_RENT">For Rent</option>
        </select>

        <select 
          className={styles.filterPill}
          value={minPrice}
          onChange={(e) => updateQueryString("minPrice", e.target.value)}
        >
          <option value="">Price</option>
          <option value="100000">$100k+</option>
          <option value="200000">$200k+</option>
          <option value="300000">$300k+</option>
          <option value="500000">$500k+</option>
        </select>
        
        <BedsBathsFilter 
          initialBeds={beds}
          initialBaths={baths}
          initialExactMatch={exactMatchBeds}
          onApply={handleBedsBathsApply}
        />
        
        <select className={styles.filterPill}>
          <option value="">Property type</option>
        </select>

        <button className={styles.filterButton}>
          <span className="font-semibold">Filters</span>
        </button>

        <div className="ml-auto flex items-center space-x-2">
           <button className={styles.saveSearchButton}>Save search</button>
        </div>
      </div>

      {/* Main Split Content */}
      <div className={styles.contentContainer}>
        {/* Left Map Section */}
        <div className={styles.mapSection}>
          <PropertyMap 
            properties={displayedProperties}
            onBoundsChange={handleBoundsChange}
            hoveredPropertyId={hoveredPropertyId}
            onPolygonChange={setPolygonCoords}
          />
        </div>

        {/* Right List Section */}
        <div className={styles.listSection}>
          <div className={styles.listHeader}>
            <h1 className={styles.listTitle}>
              {searchQuery ? `${searchQuery} Real Estate & Homes` : 'Real Estate & Homes For Sale'}
            </h1>
            <div className={styles.listSubheader}>
              <span className={styles.resultsCount}>
                {isLoading ? "Loading..." : `${displayedProperties.length} results`}
              </span>
              <span className={styles.sortDropdown}>Sort: Homes for You ⌄</span>
            </div>
          </div>

          <div className={styles.propertyGrid}>
            {displayedProperties.map((property) => (
              <div 
                key={property.id} 
                className={styles.propertyCard}
                onMouseEnter={() => setHoveredPropertyId(property.id)}
                onMouseLeave={() => setHoveredPropertyId(null)}
              >
                <div className={styles.cardImageWrapper}>
                  {property.images && property.images.length > 0 ? (
                     <img src={property.images[0]} alt={property.title} className={styles.cardImage} />
                  ) : (
                    <div className={styles.cardImagePlaceholder}>No Image</div>
                  )}
                  {/* Badges and Icons */}
                  <div className={styles.cardBadge}>Open: Sat 1-3pm</div>
                  <button className={styles.heartBtn}><Heart size={20} fill="rgba(0,0,0,0.4)" color="white" /></button>
                </div>
                
                <div className={styles.cardContent}>
                  <div className={styles.cardPrice}>
                    ${property.price.toLocaleString()}
                  </div>
                  <div className={styles.cardSpecs}>
                    <strong>{property.beds}</strong> bds <span className="mx-1">|</span> 
                    <strong>{property.baths}</strong> ba <span className="mx-1">|</span> 
                    <strong>{property.sqft.toLocaleString()}</strong> sqft 
                    <span className="mx-1">-</span> 
                    {property.propertyType || "House for sale"}
                  </div>
                  <div className={styles.cardAddress}>
                    {property.address}, {property.city}, {property.state} {property.zipCode}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isLoading && displayedProperties.length === 0 && (
            <div style={{ textAlign: "center", marginTop: "40px", color: "var(--text-muted)" }}>
              No properties found in this area matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <SearchPageContent />
  );
}
