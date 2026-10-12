"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Building2, MapPin, DollarSign, Sparkles, Check, Plus } from "lucide-react";
import {
  createRentalPropertyAction,
  RentalPropertyInput,
  RentalPropertyRecord,
} from "@/lib/actions/rentals";
import styles from "./AddRentalPropertyModal.module.css";

const SUB_CITIES = [
  "Bole",
  "Kirkos",
  "Yeka",
  "Lideta",
  "Arada",
  "Gullele",
  "Nifas Silk-Lafto",
  "Akaky Kaliti",
  "Kolfe Keranio",
  "Addis Ketema",
];

const PROPERTY_TYPES = [
  { id: "Apartment", label: "Apartment" },
  { id: "Condominium", label: "Condominium" },
  { id: "Villa", label: "Villa / House" },
  { id: "Townhouse", label: "Townhouse" },
  { id: "Penthouse", label: "Penthouse" },
];

const PRESET_PHOTOS = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80",
];

const AMENITY_OPTIONS = [
  "Standby Generator",
  "Water Tank Reservoir",
  "24/7 Compound Security",
  "Dedicated Parking",
  "Elevator Access",
  "High Speed WiFi",
  "Balcony City View",
  "Modern Fitted Kitchen",
  "Water Heater (Geyser)",
];

interface AddRentalPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyAdded: (newProp: RentalPropertyRecord) => void;
}

export const AddRentalPropertyModal: React.FC<AddRentalPropertyModalProps> = ({
  isOpen,
  onClose,
  onPropertyAdded,
}) => {
  const [title, setTitle] = useState("");
  const [subCity, setSubCity] = useState("Bole");
  const [specificArea, setSpecificArea] = useState("");
  const [woreda, setWoreda] = useState("");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [areaSqM, setAreaSqM] = useState(120);
  const [furnishedStatus, setFurnishedStatus] = useState<
    "unfurnished" | "semi_furnished" | "fully_furnished"
  >("fully_furnished");
  const [priceETB, setPriceETB] = useState<number>(45000);
  const [depositETB, setDepositETB] = useState<number>(90000);
  const [leaseTerm, setLeaseTerm] = useState("12_months");
  const [selectedPhoto, setSelectedPhoto] = useState(PRESET_PHOTOS[0]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "Standby Generator",
    "Water Tank Reservoir",
    "24/7 Compound Security",
  ]);
  const [contactPhone, setContactPhone] = useState("+251 91 123 4567");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handlePriceChange = (val: number) => {
    setPriceETB(val);
    setDepositETB(val * 2); // Default to 2 months deposit
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const chosenImage = customPhotoUrl.trim() || selectedPhoto;

    const payload: RentalPropertyInput = {
      title:
        title.trim() ||
        `${bedrooms}-Bedroom ${propertyType} for Rent in ${subCity}`,
      subCity,
      specificArea: specificArea.trim() || subCity,
      woreda: woreda.trim() || "01",
      propertyType,
      bedrooms,
      bathrooms,
      areaSqM,
      furnishedStatus,
      priceETB,
      depositETB,
      leaseTerm,
      amenities: selectedAmenities,
      images: [chosenImage],
      contactPhone,
      description:
        description.trim() ||
        `Spacious ${bedrooms}-bedroom ${propertyType.toLowerCase()} available for rent in ${subCity}. Move-in ready with backup generator and security.`,
      status: "FOR_RENT",
    };

    try {
      const res = await createRentalPropertyAction(payload);
      if (res.success && res.property) {
        onPropertyAdded(res.property);
        onClose();
      } else {
        alert(res.error || "Failed to add property");
      }
    } catch (err) {
      console.error("Error creating rental:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleBlock}>
            <h3 className={styles.modalTitle}>Add a Rental Property</h3>
            <span className={styles.modalSubtitle}>
              List a new home, flat, or unit on ERNS Rental Manager
            </span>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.formContent}>
          {/* Section 1: Property Location & Title */}
          <div className={styles.sectionGroup}>
            <span className={styles.sectionTitle}>
              <MapPin size={16} /> 1. Location & Identification
            </span>

            <div className={styles.formGroup}>
              <label className={styles.label}>Listing Title</label>
              <input
                type="text"
                className={styles.input}
                placeholder="e.g. Modern 2-Bedroom Furnished Apartment in Bole"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className={styles.row3}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Sub-City *</label>
                <select
                  className={styles.select}
                  value={subCity}
                  onChange={(e) => setSubCity(e.target.value)}
                  required
                >
                  {SUB_CITIES.map((sc) => (
                    <option key={sc} value={sc}>
                      {sc}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Specific Area / Landmark</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Atlas, near Edna Mall"
                  value={specificArea}
                  onChange={(e) => setSpecificArea(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Woreda</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. 03"
                  value={woreda}
                  onChange={(e) => setWoreda(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Property Type & Specs */}
          <div className={styles.sectionGroup}>
            <span className={styles.sectionTitle}>
              <Building2 size={16} /> 2. Unit Specifications
            </span>

            <div className={styles.row2}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Property Type</label>
                <select
                  className={styles.select}
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  {PROPERTY_TYPES.map((pt) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Furnishing Status</label>
                <select
                  className={styles.select}
                  value={furnishedStatus}
                  onChange={(e) => setFurnishedStatus(e.target.value as any)}
                >
                  <option value="fully_furnished">Fully Furnished</option>
                  <option value="semi_furnished">Semi-Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>
            </div>

            <div className={styles.row3}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Bedrooms</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  className={styles.input}
                  value={bedrooms}
                  onChange={(e) => setBedrooms(parseInt(e.target.value) || 1)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Bathrooms</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  step={0.5}
                  className={styles.input}
                  value={bathrooms}
                  onChange={(e) => setBathrooms(parseFloat(e.target.value) || 1)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Area (m²)</label>
                <input
                  type="number"
                  min={20}
                  max={2000}
                  className={styles.input}
                  value={areaSqM}
                  onChange={(e) => setAreaSqM(parseInt(e.target.value) || 50)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Monthly Rent & Security Deposit */}
          <div className={styles.sectionGroup}>
            <span className={styles.sectionTitle}>
              <DollarSign size={16} /> 3. Rental Pricing & Lease Terms
            </span>

            <div className={styles.row3}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Monthly Rent (ETB) *</label>
                <input
                  type="number"
                  step={1000}
                  min={1000}
                  className={styles.input}
                  value={priceETB}
                  onChange={(e) => handlePriceChange(parseInt(e.target.value) || 0)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Security Deposit (ETB)</label>
                <input
                  type="number"
                  step={1000}
                  min={0}
                  className={styles.input}
                  value={depositETB}
                  onChange={(e) => setDepositETB(parseInt(e.target.value) || 0)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Lease Duration</label>
                <select
                  className={styles.select}
                  value={leaseTerm}
                  onChange={(e) => setLeaseTerm(e.target.value)}
                >
                  <option value="12_months">1 Year (12 Months)</option>
                  <option value="6_months">6 Months</option>
                  <option value="flexible">Flexible / Month-to-Month</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Amenities */}
          <div className={styles.sectionGroup}>
            <span className={styles.sectionTitle}>
              <Sparkles size={16} /> 4. Building Amenities & Utilities
            </span>
            <div className={styles.amenityGrid}>
              {AMENITY_OPTIONS.map((amenity) => {
                const isActive = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    className={`${styles.amenityCheckbox} ${
                      isActive ? styles.amenityCheckboxActive : ""
                    }`}
                    onClick={() => toggleAmenity(amenity)}
                  >
                    <Check size={14} color={isActive ? "#0A1931" : "#94a3b8"} />
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Photos */}
          <div className={styles.sectionGroup}>
            <span className={styles.sectionTitle}>
              📸 5. Property Photos
            </span>
            <span style={{ fontSize: "0.78rem", color: "#64748B" }}>
              Select a cover photo or provide a custom image URL:
            </span>
            <div className={styles.photoOptions}>
              {PRESET_PHOTOS.map((photo, i) => (
                <div
                  key={i}
                  className={`${styles.photoOptionThumb} ${
                    selectedPhoto === photo && !customPhotoUrl
                      ? styles.photoOptionThumbSelected
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedPhoto(photo);
                    setCustomPhotoUrl("");
                  }}
                >
                  <Image src={photo} alt={`Photo option ${i}`} fill className={styles.photoImg} />
                </div>
              ))}
            </div>

            <div className={styles.formGroup} style={{ marginTop: "6px" }}>
              <label className={styles.label}>Custom Photo URL (optional)</label>
              <input
                type="url"
                className={styles.input}
                placeholder="https://images.unsplash.com/..."
                value={customPhotoUrl}
                onChange={(e) => setCustomPhotoUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Section 6: Description & Contact */}
          <div className={styles.sectionGroup}>
            <div className={styles.row2}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Landlord Contact Phone</label>
                <input
                  type="tel"
                  className={styles.input}
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                  className={styles.textarea}
                  rows={2}
                  placeholder="Additional unit highlights, neighborhood notes, water schedule..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              <Plus size={16} />
              <span>{isSubmitting ? "Publishing..." : "Publish Rental Property"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
