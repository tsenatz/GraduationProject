"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  CheckCircle,
  Phone,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Property } from "../types";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { favoritesTranslations } from "../translations";
import styles from "./PropertyCard.module.css";

interface PropertyCardProps {
  property: Property;
  onViewDetails?: (property: Property) => void;
}

export function PropertyCard({ property, onViewDetails }: PropertyCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isAmharic } = useLanguage();
  const t = favoritesTranslations[isAmharic ? "am" : "en"].card;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showPhone, setShowPhone] = useState(false);

  const favorited = isFavorite(property.id);

  const images = property.images && property.images.length > 0 ? property.images : [property.imageUrl];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property);
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat(isAmharic ? "am-ET" : "en-US").format(val);
  };

  const displayTitle = isAmharic ? property.titleAm : property.title;
  const displaySubCity = isAmharic ? property.subCityAm : property.subCity;
  const displayArea = isAmharic ? property.specificAreaAm : property.specificArea;

  return (
    <article className={styles.cardContainer} aria-label={displayTitle}>
      {/* Image Carousel & Floating Badges */}
      <div className={styles.imageContainer}>
        <Image
          src={images[activeImageIdx]}
          alt={displayTitle}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.propertyImage}
          priority={false}
        />

        <div className={styles.imageOverlayGradient} />

        {/* Top Badges */}
        <div className={styles.topBadgesRow}>
          <span
            className={`${styles.listingBadge} ${
              property.listingType === "rent" ? styles.badgeRent : styles.badgeSale
            }`}
          >
            {property.listingType === "rent" ? t.forRentBadge : t.forSaleBadge}
          </span>

          {property.isVerified && (
            <span className={styles.verifiedBadge}>
              <CheckCircle size={13} aria-hidden="true" />
              <span>{t.verifiedBadge}</span>
            </span>
          )}
        </div>

        {/* Interactive Favorite Heart Button */}
        <button
          type="button"
          onClick={handleHeartClick}
          className={`${styles.heartBtn} ${favorited ? styles.heartBtnActive : ""}`}
          title={favorited ? t.removeFavoriteTooltip : t.addFavoriteTooltip}
          aria-label={favorited ? t.removeFavoriteTooltip : t.addFavoriteTooltip}
        >
          <Heart
            size={20}
            className={styles.heartIcon}
            fill={favorited ? "#4a7fa7" : "rgba(0, 0, 0, 0.4)"}
            color={favorited ? "#4a7fa7" : "#ffffff"}
          />
        </button>

        {/* Image Carousel Navigation */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.carouselArrow} ${styles.arrowPrev}`}
              onClick={handlePrevImage}
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className={`${styles.carouselArrow} ${styles.arrowNext}`}
              onClick={handleNextImage}
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>

            {/* Dots */}
            <div className={styles.dotsContainer}>
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`${styles.dot} ${idx === activeImageIdx ? styles.dotActive : ""}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Property Details Body */}
      <div className={styles.contentBody}>
        {/* Price Row */}
        <div className={styles.priceRow}>
          <div className={styles.priceContainer}>
            <span className={styles.priceValue}>{formatPrice(property.priceETB)}</span>
            <span className={styles.currency}>
              ETB {property.listingType === "rent" ? t.perMonth : ""}
            </span>
          </div>

          <span className={styles.propertyTypeTag}>{property.propertyType}</span>
        </div>

        {/* Specs (Bed, Bath, SqM) */}
        <div className={styles.specsRow}>
          <div className={styles.specItem}>
            <Bed size={16} className={styles.specIcon} aria-hidden="true" />
            <span>
              <strong>{property.bedrooms}</strong> {t.beds}
            </span>
          </div>
          <span className={styles.specDivider}>•</span>
          <div className={styles.specItem}>
            <Bath size={16} className={styles.specIcon} aria-hidden="true" />
            <span>
              <strong>{property.bathrooms}</strong> {t.baths}
            </span>
          </div>
          <span className={styles.specDivider}>•</span>
          <div className={styles.specItem}>
            <Maximize2 size={15} className={styles.specIcon} aria-hidden="true" />
            <span>
              <strong>{property.areaSqM}</strong> {t.sqM}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className={styles.locationRow}>
          <MapPin size={15} className={styles.pinIcon} aria-hidden="true" />
          <span className={styles.locationText}>
            <strong>{displaySubCity}</strong>, {displayArea}
          </span>
        </div>

        {/* Title */}
        <h3
          className={styles.propertyTitle}
          onClick={() => onViewDetails?.(property)}
          style={{ cursor: onViewDetails ? "pointer" : "default" }}
          tabIndex={onViewDetails ? 0 : undefined}
          onKeyDown={(e) => {
            if (onViewDetails && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              onViewDetails(property);
            }
          }}
        >
          {displayTitle}
        </h3>

        {/* Footer Actions */}
        <div className={styles.cardFooter}>
          <div className={styles.agentTag}>
            <span className={styles.agentName}>
              {property.ownerOrAgentName}
            </span>
          </div>

          <div className={styles.cardButtonsGroup}>
            {showPhone ? (
              <a
                href={`tel:${property.ownerOrAgentPhone}`}
                className={styles.phoneRevealedBtn}
              >
                <Phone size={14} />
                <span>{property.ownerOrAgentPhone}</span>
              </a>
            ) : (
              <button
                type="button"
                className={styles.contactBtn}
                onClick={() => setShowPhone(true)}
              >
                <Phone size={14} />
                <span>{t.contactBtn}</span>
              </button>
            )}

            <button
              type="button"
              className={styles.detailsBtn}
              onClick={() => onViewDetails?.(property)}
            >
              <span>{t.viewDetailsBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;
