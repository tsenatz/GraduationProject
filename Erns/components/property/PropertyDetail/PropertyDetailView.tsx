"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  Share2,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Edit3,
  Layers,
  Printer,
  Copy,
  Lock,
  Sparkles,
  Eye,
  Loader2,
} from "lucide-react";
import { PropertyDetailData } from "@/lib/actions/properties";
import { useFavorites } from "@/components/providers/FavoritesProvider";
import { PricingModal } from "@/components/pricing/PricingModal";
import { unlockPropertyContactAction } from "@/lib/actions/tier";
import styles from "./PropertyDetailView.module.css";

interface PropertyDetailViewProps {
  property: PropertyDetailData;
}

export function PropertyDetailView({ property }: PropertyDetailViewProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  // Tier & Contact Unlock State
  const [isContactUnlocked, setIsContactUnlocked] = useState(
    Boolean(property.isOwner || property.isContactUnlocked)
  );
  const [revealedPhone, setRevealedPhone] = useState<string | null>(
    property.contactPhone || null
  );
  const [userCredits, setUserCredits] = useState(property.userCredits ?? 0);
  const [userTier, setUserTier] = useState<"FREE" | "STANDARD" | "PREMIUM">(
    property.userTier ?? "FREE"
  );
  const [isUnlimited, setIsUnlimited] = useState(
    Boolean(property.isUnlimitedUser)
  );
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);

  const handleUnlockContact = async () => {
    try {
      setIsUnlocking(true);
      setUnlockError(null);

      const res = await unlockPropertyContactAction(property.id);

      if (res.success && res.contactPhone) {
        setRevealedPhone(res.contactPhone);
        setIsContactUnlocked(true);
        if (res.remainingCredits !== undefined) {
          setUserCredits(res.remainingCredits);
        }
        if (res.isUnlimited) {
          setIsUnlimited(true);
        }
      } else if (res.requireUpgrade || res.error === "INSUFFICIENT_CREDITS" || res.requireSignIn) {
        setIsPricingModalOpen(true);
      } else {
        setUnlockError(res.message || "Failed to unlock contact");
      }
    } catch {
      setUnlockError("Failed to communicate with server");
    } finally {
      setIsUnlocking(false);
    }
  };

  const images =
    property.images && property.images.length > 0
      ? property.images
      : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"];

  const favorited = isFavorite(property.id);

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2600);
      }
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    }
  };

  const handleFavoriteClick = () => {
    // Map to Favorites property shape
    toggleFavorite({
      id: property.id,
      title: property.title,
      titleAm: property.titleAm || property.title,
      priceETB: property.price,
      listingType: property.listingType === "RENT" ? "rent" : "sale",
      propertyType: (property.propertyType.toLowerCase() as any) || "apartment",
      bedrooms: property.beds,
      bathrooms: property.baths,
      areaSqM: property.areaSqM,
      subCity: property.subCity,
      subCityAm: property.subCityAm || property.subCity,
      specificArea: property.specificArea || property.subCity,
      specificAreaAm: property.specificAreaAm || property.subCity,
      imageUrl: images[0],
      images,
      isVerified: true,
      dateSaved: new Date().toISOString(),
      ownerOrAgentName: property.ownerName || "Homeowner",
      ownerOrAgentPhone: property.contactPhone || "+251911234567",
      isAgentListing: false,
    });
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("en-US").format(val);
  };

  const pricePerM2 =
    property.areaSqM > 0 ? Math.round(property.price / property.areaSqM) : null;

  const isSold = property.status === "SOLD";
  const isPending = property.status === "PENDING";

  return (
    <div className={styles.pageContainer}>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className={styles.breadcrumbNav}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span>/</span>
        <Link href="/search" className={styles.breadcrumbLink}>
          Properties
        </Link>
        <span>/</span>
        <span className={styles.breadcrumbLink}>{property.subCity}</span>
        <span>/</span>
        <span className={styles.breadcrumbCurrent}>{property.title}</span>
      </nav>

      {/* Owner Control Banner (when viewed by the owner) */}
      {property.isOwner && (
        <div className={styles.ownerBanner}>
          <div className={styles.ownerBannerLeft}>
            <FileCheck2 size={20} />
            <span>You are the verified owner of this listing</span>
          </div>
          <div className={styles.ownerBannerActions}>
            <Link href={`/sell/edit/${property.id}`} className={styles.ownerEditBtn}>
              <Edit3 size={15} />
              <span>Edit Listing</span>
            </Link>
            <Link href="/sell/dashboard" className={styles.ownerDashboardBtn}>
              Seller Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* Media Photo Showcase */}
      <section className={styles.gallerySection} aria-label="Property Photos">
        <div className={styles.mainMediaWrapper}>
          <img
            src={images[activeImageIdx]}
            alt={`${property.title} - Photo ${activeImageIdx + 1}`}
            className={styles.mainImage}
          />

          {/* Status Badge */}
          <span
            className={`${styles.statusPill} ${
              isSold
                ? styles.statusSold
                : isPending
                ? styles.statusPending
                : property.listingType === "RENT"
                ? styles.statusForRent
                : styles.statusForSale
            }`}
          >
            {isSold
              ? "SOLD"
              : isPending
              ? "PENDING"
              : property.listingType === "RENT"
              ? "FOR RENT"
              : "FOR SALE"}
          </span>

          {/* Gallery Navigation Controls */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                className={`${styles.galleryNavBtn} ${styles.btnPrev}`}
                onClick={handlePrevImage}
                aria-label="Previous image"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                className={`${styles.galleryNavBtn} ${styles.btnNext}`}
                onClick={handleNextImage}
                aria-label="Next image"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          {/* Photo Counter */}
          <div className={styles.photoBadge}>
            <Layers size={14} />
            <span>
              {activeImageIdx + 1} / {images.length} Photos
            </span>
          </div>
        </div>

        {/* Thumbnail Preview Strip */}
        {images.length > 1 && (
          <div className={styles.thumbnailStrip}>
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                className={`${styles.thumbnailBtn} ${
                  activeImageIdx === idx ? styles.thumbnailBtnActive : ""
                }`}
                onClick={() => setActiveImageIdx(idx)}
                aria-label={`View photo ${idx + 1}`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className={styles.thumbnailImg} />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Main Content: 2-Column Layout */}
      <div className={styles.contentLayout}>
        {/* Left Column: Specs, Details, Amenities */}
        <div className={styles.propertyMain}>
          {/* Header Card */}
          <div className={styles.headerCard}>
            <div className={styles.priceRow}>
              <div className={styles.priceValue}>
                <span>{formatPrice(property.price)}</span>
                <span className={styles.currencyText}>ETB</span>
                {property.isNegotiable && (
                  <span className={styles.negotiableBadge}>Negotiable</span>
                )}
              </div>
              {pricePerM2 && (
                <div className={styles.pricePerM2}>
                  ~{formatPrice(pricePerM2)} ETB / m²
                </div>
              )}
            </div>

            <h1 className={styles.propertyTitle}>{property.title}</h1>

            <div className={styles.locationRow}>
              <MapPin size={18} color="var(--color-primary)" />
              <span>
                {property.subCity}
                {property.specificArea ? `, ${property.specificArea}` : ""}
                {property.woreda ? `, ${property.woreda}` : ""}, Addis Ababa, Ethiopia
              </span>
            </div>

            {/* Quick Specs Ribbon */}
            <div className={styles.specsRibbon}>
              <div className={styles.specChip}>
                <Bed size={20} className={styles.specChipIcon} />
                <div>
                  <div className={styles.specChipLabel}>Bedrooms</div>
                  <div className={styles.specChipValue}>{property.beds} Beds</div>
                </div>
              </div>

              <div className={styles.specChip}>
                <Bath size={20} className={styles.specChipIcon} />
                <div>
                  <div className={styles.specChipLabel}>Bathrooms</div>
                  <div className={styles.specChipValue}>{property.baths} Baths</div>
                </div>
              </div>

              <div className={styles.specChip}>
                <Maximize2 size={20} className={styles.specChipIcon} />
                <div>
                  <div className={styles.specChipLabel}>Area</div>
                  <div className={styles.specChipValue}>{property.areaSqM} m²</div>
                </div>
              </div>

              <div className={styles.specChip}>
                <Building2 size={20} className={styles.specChipIcon} />
                <div>
                  <div className={styles.specChipLabel}>Property Type</div>
                  <div className={styles.specChipValue}>{property.propertyType}</div>
                </div>
              </div>

              <div className={styles.specChip}>
                <FileCheck2 size={20} className={styles.specChipIcon} />
                <div>
                  <div className={styles.specChipLabel}>Title Deed</div>
                  <div className={styles.specChipValue}>{property.titleDeedStatus || "Carta"}</div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className={styles.actionsBar}>
              <button
                type="button"
                className={`${styles.actionBtn} ${favorited ? styles.actionBtnActive : ""}`}
                onClick={handleFavoriteClick}
              >
                <Heart size={16} fill={favorited ? "#4a7fa7" : "none"} color={favorited ? "#4a7fa7" : "currentColor"} />
                <span>{favorited ? "Saved in Favorites" : "Save Home"}</span>
              </button>

              <button type="button" className={styles.actionBtn} onClick={handleShare}>
                <Share2 size={16} />
                <span>Share</span>
              </button>

              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => typeof window !== "undefined" && window.print()}
              >
                <Printer size={16} />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Amenities & Features Card */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <Layers size={20} color="var(--color-primary)" />
              <h2 className={styles.sectionTitle}>Key Features & Amenities</h2>
            </div>

            <div className={styles.amenitiesGrid}>
              {property.amenities.map((amenity, idx) => (
                <div key={idx} className={styles.amenityItem}>
                  <Check size={16} className={styles.amenityCheck} />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description Narrative Card */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>About this Property</h2>
            </div>
            <p className={styles.descriptionText}>{property.description}</p>
          </div>
        </div>

        {/* Right Sticky Sidebar: Contact & Lead Box */}
        <aside className={styles.sidebarSticky}>
          <div className={styles.contactCard}>
            <div className={styles.contactHeader}>
              <div className={styles.contactAvatar}>
                {(property.ownerName || "H").charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className={styles.contactName}>{property.ownerName || "Property Owner"}</h3>
                <div className={styles.contactRole}>
                  <ShieldCheck size={14} />
                  <span>Verified Seller • Direct Contact</span>
                </div>
              </div>
            </div>

            {/* Phone Call / Contact Unlock Section */}
            {isContactUnlocked && revealedPhone ? (
              <div>
                <div className={styles.unlockedSuccessBadge}>
                  <ShieldCheck size={14} />
                  <span>Verified Owner Contact Unlocked</span>
                </div>
                <a href={`tel:${revealedPhone}`} className={styles.callDirectBtn}>
                  <Phone size={18} />
                  <span>Call {revealedPhone}</span>
                </a>
              </div>
            ) : (
              <div className={styles.lockedContactBox}>
                <div className={styles.maskedNumberRow}>
                  <Lock size={15} />
                  <span>{property.maskedContactPhone || "+251 91 ••• •••"}</span>
                </div>

                {userCredits > 0 || isUnlimited ? (
                  <button
                    type="button"
                    className={styles.unlockActionBtn}
                    onClick={handleUnlockContact}
                    disabled={isUnlocking}
                  >
                    {isUnlocking ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Eye size={16} />
                        <span>Reveal Owner Phone</span>
                        <span className={styles.creditsBadge}>
                          {isUnlimited ? "Unlimited" : `${userCredits} Left`}
                        </span>
                      </>
                    )}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className={styles.unlockActionBtn}
                      onClick={() => setIsPricingModalOpen(true)}
                    >
                      <Lock size={16} />
                      <span>Unlock Owner Phone</span>
                    </button>
                    <button
                      type="button"
                      className={styles.viewPlansLink}
                      onClick={() => setIsPricingModalOpen(true)}
                    >
                      Choose a Plan (From 290 ETB)
                    </button>
                  </>
                )}

                {unlockError && (
                  <p style={{ color: "#ef4444", fontSize: "0.8rem", margin: 0 }}>
                    {unlockError}
                  </p>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Copy Toast */}
      {copied && (
        <div className={styles.copyToast}>
          <Check size={16} color="#10b981" />
          <span>Listing link copied to clipboard!</span>
        </div>
      )}

      {/* Pricing & Contact Unlock Modal */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        currentTier={userTier}
        currentCredits={userCredits}
        isUnlimited={isUnlimited}
        onPlanSelected={(tier) => {
          setUserTier(tier);
          if (tier === "STANDARD") {
            setUserCredits(10);
            setIsUnlimited(false);
          } else if (tier === "PREMIUM") {
            setIsUnlimited(true);
            setUserCredits(999);
          } else {
            setUserCredits(0);
            setIsUnlimited(false);
          }
          setIsPricingModalOpen(false);
        }}
      />
    </div>
  );
}

export default PropertyDetailView;
