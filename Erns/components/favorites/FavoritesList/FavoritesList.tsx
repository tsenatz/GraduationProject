"use client";

import React from "react";
import { Property } from "../types";
import { PropertyCard } from "../PropertyCard";
import styles from "./FavoritesList.module.css";

interface FavoritesListProps {
  properties: Property[];
  onSelectProperty?: (property: Property) => void;
}

export function FavoritesList({ properties, onSelectProperty }: FavoritesListProps) {
  return (
    <section className={styles.listSection} aria-label="Favorite homes grid">
      <div className={styles.gridContainer}>
        {properties.map((prop) => (
          <PropertyCard
            key={prop.id}
            property={prop}
            onViewDetails={onSelectProperty}
          />
        ))}
      </div>
    </section>
  );
}

export default FavoritesList;
