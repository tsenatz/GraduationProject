"use client";

import { useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import useSWR from "swr";
import type { Property } from "@/app/generated/prisma";
import dynamic from "next/dynamic";
import { Heart, Search as SearchIcon, MapPin, List } from "lucide-react";
import BedsBathsFilter from "@/components/BedsBathsFilter";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import PropertyDetailModal from "@/components/favorites/PropertyDetailModal/PropertyDetailModal";
import styles from "./Search.module.css";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f6fafd",
        color: "var(--color-primary)",
        fontWeight: 600,
      }}
    >
      Loading map...
    </div>
  ),
});

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
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"map" | "list">("map");
  const [polygonCoords, setPolygonCoords] = useState<{lat: number, lng: number}[] | null>(null);

  const { toggleFavorite, isFavorite } = useFavorites();
  const [detailProperty, setDetailProperty] = useState<any>(null);

  const mapToDetailProperty = (property: Property) => ({
      id: property.id,
      title: property.title,
      titleAm: property.title,
      priceETB: property.price,
      listingType: property.status === "FOR_RENT" ? "rent" : "sale",
      imageUrl: property.images && property.images.length > 0 ? property.images[0] : "",
      images: property.images,
      subCity: property.city,
      subCityAm: property.city,
      specificArea: property.address,
      specificAreaAm: property.address,
      bedrooms: property.beds,
      bathrooms: property.baths,
      areaSqM: property.sqft * 0.092903,
      propertyType: property.propertyType,
      ownerOrAgentName: "Contact Agent",
      ownerOrAgentPhone: "+251900000000",
      isVerified: true,
      description: property.description || "No description provided.",
  });

  // Read state from URL
  const searchQuery = searchParams.get("query") || "";
  const status = searchParams.get("status") || "Any";
  const minPrice = searchParams.get("minPrice") || "";
  const beds = searchParams.get("beds") || "Any";
  const baths = searchParams.get("baths") || "Any";
  const exactMatchBeds = searchParams.get("exactMatchBeds") === "true";
  const propertyType = searchParams.get("propertyType") || "";
  
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  
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

  const handleBoundsChange = useCallback(() => {
    // Disabled to prevent map refresh on zoom. Map bounds filtering can be added later as a manual "Search this area" button.
  }, []);

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
          <option value="Any">Select Type</option>
          <option value="FOR_SALE">For Sale</option>
          <option value="FOR_RENT">For Rent</option>
        </select>

        {status === "FOR_RENT" ? (
          <select 
            className={styles.filterPill}
            value={minPrice}
            onChange={(e) => updateQueryString("minPrice", e.target.value)}
          >
            <option value="">Rent (Monthly)</option>
            <option value="15000">15,000+ ETB/mo</option>
            <option value="30000">30,000+ ETB/mo</option>
            <option value="50000">50,000+ ETB/mo</option>
            <option value="80000">80,000+ ETB/mo</option>
            <option value="120000">120,000+ ETB/mo</option>
          </select>
        ) : (
          <select 
            className={styles.filterPill}
            value={minPrice}
            onChange={(e) => updateQueryString("minPrice", e.target.value)}
          >
            <option value="">Price (ETB)</option>
            <option value="3000000">3M+ ETB</option>
            <option value="5000000">5M+ ETB</option>
            <option value="10000000">10M+ ETB</option>
            <option value="20000000">20M+ ETB</option>
            <option value="35000000">35M+ ETB</option>
          </select>
        )}
        
        <BedsBathsFilter 
          initialBeds={beds}
          initialBaths={baths}
          initialExactMatch={exactMatchBeds}
          onApply={handleBedsBathsApply}
        />
        
        <select 
          className={styles.filterPill} 
          value={propertyType} 
          onChange={(e) => updateQueryString("propertyType", e.target.value)}
        >
          <option value="">Property type</option>
          <option value="Apartment">Apartment</option>
          <option value="Condominium">Condominium</option>
          <option value="Studio">Studio</option>
          <option value="Villa">Villa</option>
          <option value="House">House</option>
          <option value="Commercial">Commercial</option>
          <option value="Land">Land</option>
        </select>

        <div className="ml-auto flex items-center space-x-2">
           <button className={styles.saveSearchButton} onClick={() => setIsSaveModalOpen(true)}>Save search</button>
        </div>
      </div>

      {/* Main Split Content */}
      <div className={styles.contentContainer}>
        {/* Left Map Section */}
        <div className={`${styles.mapSection} ${mobileTab === "list" ? styles.mapSectionHidden : ""}`} style={{ position: "relative" }}>
          <div style={{ position: 'absolute', top: '15px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
            <button 
              onClick={() => router.push('/search')}
              style={{
                background: 'white',
                border: '1px solid #ccc',
                padding: '8px 16px',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                color: '#333'
              }}
            >
              Reset Search
            </button>
          </div>
          <PropertyMap 
            properties={displayedProperties}
            onBoundsChange={handleBoundsChange}
            hoveredPropertyId={hoveredPropertyId}
            selectedPropertyId={selectedPropertyId}
            onSelectProperty={(property) => setSelectedPropertyId(property ? property.id : null)}
            onPolygonChange={setPolygonCoords}
            onViewListing={(property) => setDetailProperty(mapToDetailProperty(property as any))}
          />
        </div>

        {/* Right List Section */}
        <div className={`${styles.listSection} ${mobileTab === "map" ? styles.listSectionHidden : ""}`}>
          <div className={styles.listHeader}>
            <h1 className={styles.listTitle}>
              {searchQuery ? `Properties in ${searchQuery}` : 'Real Estate & Homes For Sale'}
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
                id={`property-${property.id}`}
                className={`${styles.propertyCard} ${selectedPropertyId === property.id ? styles.propertyCardSelected : ""}`}
                onMouseEnter={() => setHoveredPropertyId(property.id)}
                onMouseLeave={() => setHoveredPropertyId(null)}
                onClick={() => {
                  setSelectedPropertyId(property.id);
                  setHoveredPropertyId(property.id);
                }}
              >
                <div className={styles.cardImageWrapper}>
                  {property.images && property.images.length > 0 ? (
                     <img src={property.images[0]} alt={property.title} className={styles.cardImage} />
                  ) : (
                    <div className={styles.cardImagePlaceholder}>No Image</div>
                  )}
                  {/* Badges and Icons */}
                  <div className={styles.cardBadge}>
                    {property.status === "FOR_RENT" ? "For Rent" : "For Sale"}
                  </div>
                  <button 
                    className={styles.heartBtn} 
                    aria-label="Save favorite"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(mapToDetailProperty(property) as any);
                    }}
                  >
                    <Heart size={20} fill={isFavorite(property.id) ? "#e11d48" : "rgba(0,0,0,0.4)"} color={isFavorite(property.id) ? "#e11d48" : "white"} />
                  </button>
                </div>
                
                <div className={styles.cardContent}>
                  <div className={styles.cardPrice}>
                    ETB {property.price.toLocaleString()}
                    {property.status === "FOR_RENT" && (
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted, #64748B)", marginLeft: "4px" }}>
                        / mo
                      </span>
                    )}
                  </div>
                  <div className={styles.cardSpecs}>
                    <strong>{property.beds}</strong> bds <span className="mx-1">|</span> 
                    <strong>{property.baths}</strong> ba <span className="mx-1">|</span> 
                    <strong>{property.sqft.toLocaleString()}</strong> sqft 
                    <span className="mx-1">-</span> 
                    {property.propertyType || (property.status === "FOR_RENT" ? "Rental unit" : "House for sale")}
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

      {/* Floating Mobile Toggle (Map / List) */}
      <div className={styles.mobileToggleBar}>
        <button
          type="button"
          className={`${styles.mobileToggleBtn} ${mobileTab === "map" ? styles.mobileToggleBtnActive : ""}`}
          onClick={() => setMobileTab("map")}
          aria-label="Show Map"
        >
          <MapPin size={15} />
          <span>Map</span>
        </button>
        <button
          type="button"
          className={`${styles.mobileToggleBtn} ${mobileTab === "list" ? styles.mobileToggleBtnActive : ""}`}
          onClick={() => setMobileTab("list")}
          aria-label="Show List"
        >
          <List size={15} />
          <span>List ({displayedProperties.length})</span>
        </button>
      </div>

      {/* Save Search Modal */}
      {isSaveModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {/* ... Modal content ... */}
          <div style={{
            background: 'white', borderRadius: '12px', width: '90%', maxWidth: '400px', overflow: 'hidden'
          }}>
            <div style={{
              background: '#e6f4ea', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#137333', fontWeight: 'bold' }}>
                <span style={{ background: '#1e8e3e', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✓</span>
                Search saved! <span style={{ color: '#1a73e8', cursor: 'pointer', marginLeft: '8px' }}>Copy Link</span>
              </div>
              <button onClick={() => setIsSaveModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>✕</button>
            </div>
            
            <div style={{ padding: '20px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: 'black' }}>Name your search</label>
              <input 
                type="text" 
                defaultValue={`${status !== "Any" ? (status === "FOR_RENT" ? "For Rent" : "For Sale") : "Properties"} near ${searchQuery || "Ethiopia"}`}
                style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px', fontSize: '16px', color: 'black' }}
              />
              
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: 'black' }}>Frequency</label>
              <select style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '24px', fontSize: '16px', backgroundColor: 'white', color: 'black' }}>
                <option>Instant</option>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Never</option>
              </select>

              <button 
                onClick={() => setIsSaveModalOpen(false)}
                style={{ width: '100%', padding: '14px', background: '#0a3bd9', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Property Detail Modal */}
      {detailProperty && (
        <PropertyDetailModal 
          property={detailProperty} 
          onClose={() => setDetailProperty(null)} 
        />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className={styles.pageContainer}><p style={{ padding: "40px", textAlign: "center", color: "var(--color-accent)" }}>Loading search...</p></div>}>
      <SearchPageContent />
    </Suspense>
  );
}
