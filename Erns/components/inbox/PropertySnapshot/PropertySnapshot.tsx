"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  ExternalLink,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { PropertySnapshot as PropertySnapshotType } from "../types";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { inboxTranslations } from "../translations";
import styles from "./PropertySnapshot.module.css";

interface PropertySnapshotProps {
  property: PropertySnapshotType;
}

export const PropertySnapshot: React.FC<PropertySnapshotProps> = ({ property }) => {
  const { isAmharic } = useLanguage();
  const t = inboxTranslations[isAmharic ? "am" : "en"].chatThread;
  const [isExpanded, setIsExpanded] = useState(false);

  const displayTitle =
    isAmharic && property.titleAm ? property.titleAm : property.title;
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat(isAmharic ? "am-ET" : "en-US").format(val);
  };

  return (
    <div className={styles.container}>
      {/* 1. Slim Compact Bar (~48px height) */}
      <div className={styles.compactBar}>
        <div className={styles.leftCol}>
          <div className={styles.imageWrapper}>
            <Image
              src={property.imageUrl}
              alt={displayTitle}
              fill
              sizes="44px"
              className={styles.image}
            />
            <span
              className={`${styles.typeBadgeMini} ${
                property.listingType === "rent"
                  ? styles.typeRent
                  : styles.typeSale
              }`}
            >
              {property.listingType === "rent"
                ? isAmharic
                  ? "ኪራይ"
                  : "Rent"
                : isAmharic
                ? "ሽያጭ"
                : "Sale"}
            </span>
          </div>

          <div className={styles.titleArea}>
            <div className={styles.titleRow}>
              <h4 className={styles.title}>{displayTitle}</h4>
              {property.isUserListing && (
                <span className={styles.yourListingTag}>
                  {property.listingType === "rent"
                    ? t.yourRentalTag
                    : t.yourListingTag}
                </span>
              )}
            </div>
            <div className={styles.location}>
              <MapPin size={11} className={styles.locationIcon} />
              <span>
                {property.subCity}
                {property.specificArea ? `, ${property.specificArea}` : ""}, Addis Ababa
              </span>
            </div>
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.priceWrapper}>
            <span className={styles.price}>{formatPrice(property.priceETB)}</span>
            <span className={styles.currency}>ETB</span>
            {property.listingType === "rent" && (
              <span className={styles.period}>{isAmharic ? "/ወር" : "/mo"}</span>
            )}
          </div>

          <div className={styles.actionBtns}>
            {property.isUserListing ? (
              <Link
                href={
                  property.managementUrl ||
                  (property.listingType === "rent"
                    ? "/rentalmanager/dashboard"
                    : "/sell/dashboard")
                }
                className={styles.manageListingBtn}
                title={t.manageListing}
              >
                <Settings size={13} />
                <span>{t.manageListing}</span>
              </Link>
            ) : (
              <Link
                href={`/property/${property.id}`}
                target="_blank"
                className={styles.viewListingBtn}
                title={t.viewListing}
              >
                <span>{t.viewListing}</span>
                <ExternalLink size={12} />
              </Link>
            )}

            <button
              type="button"
              className={styles.expandBtn}
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Collapse property specs" : "Expand property specs"}
              aria-label={isExpanded ? "Collapse specs" : "Expand specs"}
            >
              {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Optional Expandable Specs Row */}
      {isExpanded && (
        <div className={styles.expandedSpecs}>
          <div className={styles.specsList}>
            <span className={styles.spec}>
              <Bed size={13} /> {property.bedrooms} {isAmharic ? "መኝታ" : "Beds"}
            </span>
            <span className={styles.specDivider}>•</span>
            <span className={styles.spec}>
              <Bath size={13} /> {property.bathrooms} {isAmharic ? "መታጠቢያ" : "Baths"}
            </span>
            <span className={styles.specDivider}>•</span>
            <span className={styles.spec}>
              <Maximize2 size={13} /> {property.areaSqM} m²
            </span>
            <span className={styles.specDivider}>•</span>
            <span className={styles.spec}>{property.propertyType}</span>
          </div>

          {property.referenceNo && (
            <span className={styles.refBadge}>Ref #{property.referenceNo}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertySnapshot;
