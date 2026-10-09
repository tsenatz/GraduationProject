"use client";

import type { Property } from "@/app/generated/prisma";
import styles from "./PropertyMap.module.css";

interface PropertyMapProps {
  properties: Property[];
  onBoundsChange: (bounds: { neLat: number; neLng: number; swLat: number; swLng: number }) => void;
  hoveredPropertyId: string | null;
  onPolygonChange?: (polygon: {lat: number, lng: number}[] | null) => void;
}

export default function PropertyMap({ properties, onBoundsChange, hoveredPropertyId, onPolygonChange }: PropertyMapProps) {

  return (
    <div className={styles.mapContainer}>
      <p style={{ padding: '20px', textAlign: 'center' }}>Map implementation will go here (OpenTiles)</p>
    </div>
  );
}
