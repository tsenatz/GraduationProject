"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Heart,
  Share2,
  Check,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  FileCheck2,
  MapPin,
  Phone,
  Send,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building,
} from "lucide-react";
import { Property } from "../types";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { favoritesTranslations } from "../translations";
import styles from "./PropertyDetailModal.module.css";

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
}

export function PropertyDetailModal({
  property,
  onClose,
}: PropertyDetailModalProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isAmharic } = useLanguage();
  const t = favoritesTranslations[isAmharic ? "am" : "en"].modal;
  const cardT = favoritesTranslations[isAmharic ? "am" : "en"].card;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryNote, setInquiryNote] = useState("");
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  if (!property) return null;

  const favorited = isFavorite(property.id);
  const images = property.images && property.images.length > 0 ? property.images : [property.imageUrl];

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
      }
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat(isAmharic ? "am-ET" : "en-US").format(val);
  };

  const pricePerM2 =
    property.areaSqM > 0
      ? Math.round(property.priceETB / property.areaSqM)
      : null;

  const displayTitle = isAmharic ? property.titleAm : property.title;
  const displaySubCity = isAmharic ? property.subCityAm : property.subCity;
  const displayArea = isAmharic ? property.specificAreaAm : property.specificArea;
  const displayDesc = isAmharic && property.descriptionAm ? property.descriptionAm : property.description;
  const displayAmenities = isAmharic && property.amenitiesAm ? property.amenitiesAm : property.amenities;
  const displayDeed = isAmharic && property.titleDeedStatusAm ? property.titleDeedStatusAm : property.titleDeedStatus;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div
        className={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="property-detail-title"
      >
        {/* Top Sticky Header Bar */}
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <span
              className={`${styles.listingBadge} ${
                property.listingType === "rent" ? styles.badgeRent : styles.badgeSale
              }`}
            >
              {property.listingType === "rent" ? cardT.forRentBadge : cardT.forSaleBadge}
            </span>

            {property.isVerified && (
              <span className={styles.verifiedBadge}>
                <ShieldCheck size={14} aria-hidden="true" />
                <span>{cardT.verifiedBadge}</span>
              </span>
            )}
          </div>

          <div className={styles.topBarRight}>
            <button
              type="button"
              className={`${styles.iconActionBtn} ${favorited ? styles.heartActive : ""}`}
              onClick={() => toggleFavorite(property)}
              title={favorited ? cardT.removeFavoriteTooltip : cardT.addFavoriteTooltip}
            >
              <Heart
                size={18}
                fill={favorited ? "#e11d48" : "none"}
                color={favorited ? "#e11d48" : "currentColor"}
              />
            </button>

            <button
              type="button"
              className={styles.iconActionBtn}
              onClick={handleShare}
              title="Share property"
            >
              {copied ? <Check size={18} color="#10b981" /> : <Share2 size={18} />}
            </button>

            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label={t.close}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className={styles.scrollContent}>
          {/* Main Photo Gallery */}
          <div className={styles.galleryWrapper}>
            <div className={styles.heroImageContainer}>
              <Image
                src={images[activeImageIdx]}
                alt={displayTitle}
                fill
                priority
                className={styles.heroImage}
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className={`${styles.navArrow} ${styles.navArrowLeft}`}
                    onClick={() =>
                      setActiveImageIdx((prev) =>
                        prev > 0 ? prev - 1 : images.length - 1
                      )
                    }
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    className={`${styles.navArrow} ${styles.navArrowRight}`}
                    onClick={() =>
                      setActiveImageIdx((prev) =>
                        prev < images.length - 1 ? prev + 1 : 0
                      )
                    }
                    aria-label="Next photo"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className={styles.thumbnailStrip}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`${styles.thumbBtn} ${
                      idx === activeImageIdx ? styles.thumbBtnActive : ""
                    }`}
                    onClick={() => setActiveImageIdx(idx)}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className={styles.thumbImage}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Key Header */}
          <div className={styles.headerSection}>
            <div className={styles.pricingBox}>
              <div className={styles.priceNumber}>
                {formatPrice(property.priceETB)}
                <span className={styles.currencyTag}>
                  ETB {property.listingType === "rent" ? cardT.perMonth : ""}
                </span>
              </div>

              {pricePerM2 && property.listingType === "sale" && (
                <span className={styles.pricePerM2}>
                  ≈ {formatPrice(pricePerM2)} ETB / m²
                </span>
              )}
            </div>

            <h2 id="property-detail-title" className={styles.propertyTitle}>
              {displayTitle}
            </h2>

            <div className={styles.locationRow}>
              <MapPin size={16} className={styles.pinIcon} aria-hidden="true" />
              <span>
                <strong>{displaySubCity}</strong>, {displayArea}
                {property.woreda ? ` (${property.woreda})` : ""}, Addis Ababa
              </span>
            </div>
          </div>

          {/* Key Specs Grid */}
          <div className={styles.keyStatsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIconWrapper}>
                <Bed size={20} />
              </div>
              <div>
                <span className={styles.statNumber}>{property.bedrooms}</span>
                <span className={styles.statLabel}>{cardT.beds}</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconWrapper}>
                <Bath size={20} />
              </div>
              <div>
                <span className={styles.statNumber}>{property.bathrooms}</span>
                <span className={styles.statLabel}>{cardT.baths}</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconWrapper}>
                <Maximize2 size={20} />
              </div>
              <div>
                <span className={styles.statNumber}>{property.areaSqM}</span>
                <span className={styles.statLabel}>{cardT.sqM}</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconWrapper}>
                <Building size={20} />
              </div>
              <div>
                <span className={styles.statNumber} style={{ textTransform: "capitalize" }}>
                  {property.propertyType}
                </span>
                <span className={styles.statLabel}>{t.type}</span>
              </div>
            </div>

            {property.yearBuilt && (
              <div className={styles.statCard}>
                <div className={styles.statIconWrapper}>
                  <Calendar size={20} />
                </div>
                <div>
                  <span className={styles.statNumber}>{property.yearBuilt}</span>
                  <span className={styles.statLabel}>{t.yearBuilt}</span>
                </div>
              </div>
            )}

            {displayDeed && (
              <div className={styles.statCard}>
                <div className={styles.statIconWrapper}>
                  <FileCheck2 size={20} />
                </div>
                <div>
                  <span className={styles.statNumber} style={{ fontSize: "0.88rem" }}>
                    {displayDeed}
                  </span>
                  <span className={styles.statLabel}>{t.titleDeed}</span>
                </div>
              </div>
            )}
          </div>

          {/* Overview Description */}
          {displayDesc && (
            <div className={styles.detailSection}>
              <h3 className={styles.sectionHeading}>{t.overview}</h3>
              <p className={styles.descriptionParagraph}>{displayDesc}</p>
            </div>
          )}

          {/* Amenities & Features */}
          {displayAmenities && displayAmenities.length > 0 && (
            <div className={styles.detailSection}>
              <h3 className={styles.sectionHeading}>{t.amenities}</h3>
              <div className={styles.amenitiesGrid}>
                {displayAmenities.map((amenity, idx) => (
                  <div key={idx} className={styles.amenityItem}>
                    <CheckCircle2 size={16} className={styles.amenityCheck} aria-hidden="true" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Representative Card */}
          <div className={styles.contactCardSection}>
            <h3 className={styles.sectionHeading}>{t.contactTitle}</h3>

            <div className={styles.representativeInfo}>
              <div className={styles.repAvatar}>
                {property.ownerOrAgentName.charAt(0)}
              </div>
              <div>
                <h4 className={styles.repName}>{property.ownerOrAgentName}</h4>
                <span className={styles.repType}>
                  {property.isAgentListing ? cardT.agentBadge : cardT.ownerBadge}
                </span>
              </div>
            </div>

            {/* Viewing Request Form */}
            {inquirySubmitted ? (
              <div className={styles.inquirySuccessBox}>
                <CheckCircle2 size={24} color="#10b981" />
                <p>{t.inquirySuccess}</p>
              </div>
            ) : (
              <form className={styles.inquiryForm} onSubmit={handleInquirySubmit}>
                <div className={styles.inquiryFieldsRow}>
                  <input
                    type="text"
                    required
                    className={styles.inquiryInput}
                    placeholder={t.inquiryName}
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                  />
                  <input
                    type="tel"
                    required
                    className={styles.inquiryInput}
                    placeholder={t.inquiryPhone}
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                  />
                </div>

                <textarea
                  className={styles.inquiryTextarea}
                  rows={3}
                  placeholder={t.inquiryPlaceholder}
                  value={inquiryNote}
                  onChange={(e) => setInquiryNote(e.target.value)}
                />

                <button type="submit" className={styles.inquirySubmitBtn}>
                  <Send size={15} />
                  <span>{t.inquirySubmit}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetailModal;
