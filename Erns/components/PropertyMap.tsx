"use client";

import { Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import type { Property } from "@/app/generated/prisma";
import styles from "./PropertyMap.module.css";
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface PropertyMapProps {
  properties: Property[];
  onBoundsChange: (bounds: { neLat: number; neLng: number; swLat: number; swLng: number }) => void;
  hoveredPropertyId: string | null;
}

export default function PropertyMap({ properties, onBoundsChange, hoveredPropertyId }: PropertyMapProps) {
  const searchParams = useSearchParams();
  const map = useMap();
  
  // Format price to K/M
  const formatPrice = (price: number) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`;
    return `$${price}`;
  };

  // Recenter map if lat/lng are provided in URL (from autocomplete)
  useEffect(() => {
    if (map) {
      const lat = searchParams.get('lat');
      const lng = searchParams.get('lng');
      if (lat && lng) {
        map.panTo({ lat: parseFloat(lat), lng: parseFloat(lng) });
        map.setZoom(12);
      }
    }
  }, [map, searchParams]);

  return (
    <div className={styles.mapContainer}>
      <Map
        defaultCenter={{ lat: 32.7767, lng: -96.7970 }} // Dallas TX as default, similar to Zillow inspo
        defaultZoom={11}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID"} 
        onBoundsChanged={(e) => {
           const bounds = e.detail.bounds;
           if (bounds) {
             onBoundsChange({
               neLat: bounds.north,
               neLng: bounds.east,
               swLat: bounds.south,
               swLng: bounds.west
             });
           }
        }}
        disableDefaultUI={false}
      >
        {properties.map((property) => {
          const isHovered = hoveredPropertyId === property.id;
          
          return (
            <AdvancedMarker 
              key={property.id} 
              position={{ lat: property.latitude, lng: property.longitude }}
              zIndex={isHovered ? 100 : 1}
            >
              <div 
                className={`${styles.marker} ${isHovered ? styles.markerHovered : styles.markerNormal}`}
              >
                {formatPrice(property.price)}
              </div>
            </AdvancedMarker>
          );
        })}
      </Map>
    </div>
  );
}
