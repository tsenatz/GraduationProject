"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  TrendingDown,
  Sparkles,
  Calendar,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ArrowRight,
  BookmarkCheck,
} from "lucide-react";
import { PropertyUpdate } from "./types";
import { updatesTranslations } from "./translations";
import styles from "./UpdatesView.module.css";

interface PropertyUpdateCardProps {
  update: PropertyUpdate;
  isAmharic: boolean;
}

export function PropertyUpdateCard({ update, isAmharic }: PropertyUpdateCardProps) {
  const t = isAmharic ? updatesTranslations.am : updatesTranslations.en;

  const formatPrice = (amount: number) => {
    return amount.toLocaleString() + " ETB";
  };

  const calculateDiscount = () => {
    if (!update.oldPriceETB || update.oldPriceETB <= update.priceETB) return null;
    const diff = update.oldPriceETB - update.priceETB;
    const percent = Math.round((diff / update.oldPriceETB) * 100);
    return { diff, percent };
  };

  const discount = calculateDiscount();

  const renderBadge = () => {
    if (update.type === "price_drop") {
      return (
        <span className={styles.updateBadgePriceDrop}>
          <TrendingDown size={13} />
          <span>{t.propertyCard.priceDropBadge}</span>
        </span>
      );
    }
    if (update.type === "new_listing") {
      return (
        <span className={styles.updateBadgeNew}>
          <Sparkles size={13} />
          <span>{t.propertyCard.newListingBadge}</span>
        </span>
      );
    }
    if (update.type === "open_house") {
      return (
        <span className={styles.updateBadgeOpenHouse}>
          <Calendar size={13} />
          <span>{t.propertyCard.openHouseBadge}</span>
        </span>
      );
    }
    return null;
  };

  return (
    <article className={styles.propUpdateCard} id={`prop-update-${update.id}`}>
      {/* Property Image Container */}
      <div className={styles.propImageWrapper}>
        <img
          src={update.imageUrl}
          alt={isAmharic ? update.titleAm : update.title}
          className={styles.propImage}
          loading="lazy"
        />
        <div className={styles.propBadgeOverlay}>{renderBadge()}</div>
      </div>

      {/* Content Container */}
      <div className={styles.propContent}>
        {/* Match tag banner */}
        <div className={styles.matchTagBanner}>
          <BookmarkCheck size={13} className={styles.matchIcon} />
          <span className={styles.matchPrefix}>{t.propertyCard.matchedSearch}:</span>
          <span className={styles.matchQueryName}>{update.searchMatchTag}</span>
        </div>

        {/* Title & Location */}
        <h3 className={styles.propTitle}>
          {isAmharic ? update.titleAm || update.title : update.title}
        </h3>

        <div className={styles.propLocation}>
          <MapPin size={14} className={styles.locationPin} />
          <span>{isAmharic ? update.locationAm || update.location : update.location}</span>
        </div>

        {/* Price Row */}
        <div className={styles.priceRow}>
          <div className={styles.currentPrice}>
            {formatPrice(update.priceETB)}
            {update.status === "FOR_RENT" && (
              <span className={styles.perMonthText}>{t.propertyCard.month}</span>
            )}
          </div>

          {update.oldPriceETB && (
            <div className={styles.oldPrice}>
              <span className={styles.strikethrough}>
                {formatPrice(update.oldPriceETB)}
              </span>
              {discount && (
                <span className={styles.discountPill}>
                  -{discount.percent}% ({formatPrice(discount.diff)} off)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Open house date banner if applicable */}
        {update.openHouseDate && (
          <div className={styles.openHouseBanner}>
            <Calendar size={14} />
            <span>{update.openHouseDate}</span>
          </div>
        )}

        {/* Specs Row */}
        <div className={styles.propSpecs}>
          <div className={styles.specItem}>
            <Bed size={15} />
            <span>
              {update.bedrooms} {t.propertyCard.beds}
            </span>
          </div>
          <span className={styles.specDot}>•</span>
          <div className={styles.specItem}>
            <Bath size={15} />
            <span>
              {update.bathrooms} {t.propertyCard.baths}
            </span>
          </div>
          <span className={styles.specDot}>•</span>
          <div className={styles.specItem}>
            <Maximize2 size={15} />
            <span>
              {update.areaSqM} {t.propertyCard.sqm}
            </span>
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className={styles.propFooter}>
          <span className={styles.updatedTime}>{update.updatedAt}</span>

          <Link
            href={`/search?location=${encodeURIComponent(update.location.split(",")[0])}`}
            className={styles.viewHomeBtn}
          >
            <span>{t.propertyCard.viewHome}</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
