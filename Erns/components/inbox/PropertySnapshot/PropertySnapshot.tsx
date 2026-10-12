"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Maximize2, MapPin, ExternalLink, Tag } from "lucide-react";
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

  const displayTitle = (isAmharic && property.titleAm) ? property.titleAm : property.title;
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat(isAmharic ? "am-ET" : "en-US").format(val);
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <Image
          src={property.imageUrl}
          alt={displayTitle}
          fill
          sizes="90px"
          className={styles.image}
        />
        <span className={`${styles.typeBadge} ${property.listingType === "rent" ? styles.typeRent : styles.typeSale}`}>
          {property.listingType === "rent" ? (isAmharic ? "ኪራይ" : "For Rent") : (isAmharic ? "ሽያጭ" : "For Sale")}
        </span>
      </div>

      <div className={styles.content}>
        <div className={styles.topRow}>
          <div className={styles.priceRow}>
            <span className={styles.price}>{formatPrice(property.priceETB)}</span>
            <span className={styles.currency}>ETB</span>
            {property.listingType === "rent" && (
              <span className={styles.period}>{isAmharic ? "/በወር" : "/mo"}</span>
            )}
          </div>
          {property.referenceNo && (
            <span className={styles.refBadge}>Ref #{property.referenceNo}</span>
          )}
        </div>

        <h4 className={styles.title}>{displayTitle}</h4>

        <div className={styles.location}>
          <MapPin size={13} className={styles.locationIcon} />
          <span>
            {property.subCity}
            {property.specificArea ? `, ${property.specificArea}` : ""}, Addis Ababa
          </span>
        </div>

        <div className={styles.specsRow}>
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
        </div>
      </div>

      <div className={styles.actionCol}>
        <Link
          href={`/property/${property.id}`}
          target="_blank"
          className={styles.viewListingBtn}
          title={t.viewListing}
        >
          <span>{t.viewListing}</span>
          <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
};

export default PropertySnapshot;
