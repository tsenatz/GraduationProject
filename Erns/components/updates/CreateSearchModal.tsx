"use client";

import React, { useState, useEffect } from "react";
import { X, Search, Bell, MapPin, Tag } from "lucide-react";
import { NotificationFrequency, SavedSearch } from "./types";
import { updatesTranslations } from "./translations";
import styles from "./UpdatesView.module.css";

interface CreateSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSearch: Omit<SavedSearch, "id" | "newMatchesCount" | "lastChecked" | "createdAt">) => void;
  isAmharic: boolean;
}

const QUICK_LOCATIONS = [
  { en: "Bole", am: "ቦሌ" },
  { en: "CMC", am: "ሲኤምሲ" },
  { en: "Sarbet", am: "ሳርቤት" },
  { en: "Kazanchis", am: "ካዛንቺስ" },
  { en: "Old Airport", am: "ኦልድ ኤርፖርት" },
  { en: "Ayat", am: "አያት" },
];

export function CreateSearchModal({
  isOpen,
  onClose,
  onSave,
  isAmharic,
}: CreateSearchModalProps) {
  const t = isAmharic ? updatesTranslations.am : updatesTranslations.en;

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Bole, Addis Ababa");
  const [status, setStatus] = useState<"FOR_SALE" | "FOR_RENT">("FOR_SALE");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [beds, setBeds] = useState("3+");
  const [frequency, setFrequency] = useState<NotificationFrequency>("instant");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t.modal.nameRequired);
      return;
    }

    onSave({
      title: title.trim(),
      titleAm: title.trim(),
      status,
      location,
      locationAm: location,
      propertyType,
      propertyTypeAm: propertyType,
      minPrice,
      maxPrice,
      beds,
      frequency,
    });

    // Reset & close
    setTitle("");
    setError("");
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderIcon}>
            <Bell size={20} />
          </div>
          <div className={styles.modalHeaderText}>
            <h3 className={styles.modalTitle}>{t.modal.createTitle}</h3>
            <p className={styles.modalSubtitle}>{t.modal.createSubtitle}</p>
          </div>
          <button
            type="button"
            className={styles.modalCloseBtn}
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {/* Title */}
          <div className={styles.formField}>
            <label className={styles.fieldLabel} htmlFor="search-title">
              {t.modal.nameLabel} <span className={styles.requiredAsterisk}>*</span>
            </label>
            <input
              id="search-title"
              type="text"
              className={`${styles.fieldInput} ${error ? styles.inputError : ""}`}
              placeholder={t.modal.namePlaceholder}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              autoFocus
            />
            {error && <span className={styles.errorText}>{error}</span>}
          </div>

          {/* Listing Type: For Sale vs For Rent */}
          <div className={styles.formField}>
            <label className={styles.fieldLabel}>{t.modal.listingTypeLabel}</label>
            <div className={styles.radioGroup}>
              <button
                type="button"
                className={`${styles.radioOption} ${
                  status === "FOR_SALE" ? styles.radioOptionActive : ""
                }`}
                onClick={() => setStatus("FOR_SALE")}
              >
                {t.modal.forSale}
              </button>
              <button
                type="button"
                className={`${styles.radioOption} ${
                  status === "FOR_RENT" ? styles.radioOptionActive : ""
                }`}
                onClick={() => setStatus("FOR_RENT")}
              >
                {t.modal.forRent}
              </button>
            </div>
          </div>

          {/* Location with Quick Selection */}
          <div className={styles.formField}>
            <label className={styles.fieldLabel} htmlFor="search-location">
              {t.modal.locationLabel}
            </label>
            <div className={styles.inputWithIcon}>
              <MapPin size={16} className={styles.inputPrefixIcon} />
              <input
                id="search-location"
                type="text"
                className={styles.fieldInputIcon}
                placeholder={t.modal.locationPlaceholder}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            {/* Quick Pills */}
            <div className={styles.quickLocations}>
              {QUICK_LOCATIONS.map((loc) => (
                <button
                  key={loc.en}
                  type="button"
                  className={`${styles.quickLocPill} ${
                    location.includes(loc.en) ? styles.quickLocPillActive : ""
                  }`}
                  onClick={() => setLocation(`${loc.en}, Addis Ababa`)}
                >
                  {isAmharic ? loc.am : loc.en}
                </button>
              ))}
            </div>
          </div>

          {/* Property Type & Bedrooms */}
          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel} htmlFor="property-type">
                {t.modal.propertyTypeLabel}
              </label>
              <select
                id="property-type"
                className={styles.fieldSelect}
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="Apartment">{t.modal.apartment}</option>
                <option value="Villa / House">{t.modal.villa}</option>
                <option value="Townhouse">{t.modal.townhouse}</option>
                <option value="Commercial">{t.modal.commercial}</option>
                <option value="Penthouse">{t.modal.penthouse}</option>
              </select>
            </div>

            <div className={styles.formCol}>
              <label className={styles.fieldLabel} htmlFor="bedrooms-count">
                {t.modal.bedroomsLabel}
              </label>
              <select
                id="bedrooms-count"
                className={styles.fieldSelect}
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
              >
                <option value="Any">{t.modal.anyBeds}</option>
                <option value="1+">1+ Beds</option>
                <option value="2+">2+ Beds</option>
                <option value="3+">3+ Beds</option>
                <option value="4+">4+ Beds</option>
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel} htmlFor="min-price">
                {t.modal.minPriceLabel}
              </label>
              <input
                id="min-price"
                type="number"
                step="50000"
                className={styles.fieldInput}
                placeholder="e.g. 5,000,000"
                value={minPrice !== undefined ? minPrice : ""}
                onChange={(e) =>
                  setMinPrice(e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>

            <div className={styles.formCol}>
              <label className={styles.fieldLabel} htmlFor="max-price">
                {t.modal.maxPriceLabel}
              </label>
              <input
                id="max-price"
                type="number"
                step="50000"
                className={styles.fieldInput}
                placeholder="e.g. 35,000,000"
                value={maxPrice !== undefined ? maxPrice : ""}
                onChange={(e) =>
                  setMaxPrice(e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>
          </div>

          {/* Alert Frequency */}
          <div className={styles.formField}>
            <label className={styles.fieldLabel}>{t.modal.frequencyLabel}</label>
            <div className={styles.frequencyCards}>
              <label
                className={`${styles.freqCard} ${
                  frequency === "instant" ? styles.freqCardActive : ""
                }`}
              >
                <input
                  type="radio"
                  name="modal-freq"
                  value="instant"
                  checked={frequency === "instant"}
                  onChange={() => setFrequency("instant")}
                  className={styles.hiddenRadio}
                />
                <div className={styles.freqCardContent}>
                  <div className={styles.freqCardTitle}>
                    {t.searchCard.freqInstant}
                  </div>
                  <div className={styles.freqCardDesc}>
                    {t.modal.freqInstantDesc}
                  </div>
                </div>
              </label>

              <label
                className={`${styles.freqCard} ${
                  frequency === "daily" ? styles.freqCardActive : ""
                }`}
              >
                <input
                  type="radio"
                  name="modal-freq"
                  value="daily"
                  checked={frequency === "daily"}
                  onChange={() => setFrequency("daily")}
                  className={styles.hiddenRadio}
                />
                <div className={styles.freqCardContent}>
                  <div className={styles.freqCardTitle}>
                    {t.searchCard.freqDaily}
                  </div>
                  <div className={styles.freqCardDesc}>
                    {t.modal.freqDailyDesc}
                  </div>
                </div>
              </label>

              <label
                className={`${styles.freqCard} ${
                  frequency === "never" ? styles.freqCardActive : ""
                }`}
              >
                <input
                  type="radio"
                  name="modal-freq"
                  value="never"
                  checked={frequency === "never"}
                  onChange={() => setFrequency("never")}
                  className={styles.hiddenRadio}
                />
                <div className={styles.freqCardContent}>
                  <div className={styles.freqCardTitle}>
                    {t.searchCard.freqNever}
                  </div>
                  <div className={styles.freqCardDesc}>
                    {t.modal.freqNeverDesc}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.modalCancelBtn}
              onClick={onClose}
            >
              {t.modal.cancel}
            </button>
            <button type="submit" className={styles.modalSubmitBtn}>
              {t.modal.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
