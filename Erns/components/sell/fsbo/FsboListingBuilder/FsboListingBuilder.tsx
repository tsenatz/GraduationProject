"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bed,
  Bath,
  Maximize2,
  Check,
  ChevronRight,
  ChevronLeft,
  UploadCloud,
  FileCheck2,
  MapPin,
  Phone,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations } from "@/components/sell/translations";
import styles from "./FsboListingBuilder.module.css";

interface FsboListingBuilderProps {
  initialSubCity?: string;
  initialAddress?: string;
}

export const FsboListingBuilder: React.FC<FsboListingBuilderProps> = ({
  initialSubCity = "Bole",
  initialAddress = "",
}) => {
  const { isAmharic } = useLanguage();
  const t = translations[isAmharic ? "am" : "en"].fsbo.builder;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionRef, setSubmissionRef] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    subCity: initialSubCity || "Bole",
    woreda: "Woreda 03",
    specificArea: initialAddress || "Atlas, near Edna Mall",
    propertyType: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    areaSqM: 145,
    priceETB: 12500000,
    isNegotiable: true,
    titleDeedStatus: "digital",
    selectedAmenities: [
      "Water Tank / Reserve (የውሃ ታንከር)",
      "Standby Generator (ጀነሬተር)",
      "Dedicated Parking (የመኪና ማቆሚያ)",
    ],
    description: "",
    ownerName: "Abebe Bekele",
    phone: "911234567",
    preferredTime: "anytime",
  });

  const [photos, setPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80",
  ]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => {
      const exists = prev.selectedAmenities.includes(amenity);
      return {
        ...prev,
        selectedAmenities: exists
          ? prev.selectedAmenities.filter((a) => a !== amenity)
          : [...prev.selectedAmenities, amenity],
      };
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newUrl = URL.createObjectURL(e.target.files[0]);
      setPhotos((prev) => [newUrl, ...prev]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomRef = Math.floor(1000 + Math.random() * 9000).toString();
    setSubmissionRef(randomRef);
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat(isAmharic ? "am-ET" : "en-US").format(val);
  };

  const getStepButtonClass = (stepIndex: number) => {
    if (currentStep === stepIndex) return `${styles.stepButton} ${styles.stepButtonActive}`;
    if (currentStep > stepIndex) return `${styles.stepButton} ${styles.stepButtonCompleted}`;
    return styles.stepButton;
  };

  return (
    <section id="fsbo-builder" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t.title}</h2>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </div>

        <div className={styles.wizardLayout}>
          {/* Form Side */}
          <div className={styles.formCard}>
            <div className={styles.stepper}>
              <button
                type="button"
                className={getStepButtonClass(1)}
                onClick={() => setCurrentStep(1)}
              >
                <div className={styles.stepIndicator}>
                  {currentStep > 1 ? <Check size={16} /> : "1"}
                </div>
                <span className={styles.stepTitle}>{t.step1}</span>
              </button>

              <button
                type="button"
                className={getStepButtonClass(2)}
                onClick={() => setCurrentStep(2)}
              >
                <div className={styles.stepIndicator}>
                  {currentStep > 2 ? <Check size={16} /> : "2"}
                </div>
                <span className={styles.stepTitle}>{t.step2}</span>
              </button>

              <button
                type="button"
                className={getStepButtonClass(3)}
                onClick={() => setCurrentStep(3)}
              >
                <div className={styles.stepIndicator}>
                  {currentStep > 3 ? <Check size={16} /> : "3"}
                </div>
                <span className={styles.stepTitle}>{t.step3}</span>
              </button>

              <button
                type="button"
                className={getStepButtonClass(4)}
                onClick={() => setCurrentStep(4)}
              >
                <div className={styles.stepIndicator}>4</div>
                <span className={styles.stepTitle}>{t.step4}</span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Location & Property Type */}
              {currentStep === 1 && (
                <div className={styles.stepContent}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t.cityLabel}</label>
                      <input
                        type="text"
                        className={styles.input}
                        value="Addis Ababa (አዲስ አበባ)"
                        disabled
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t.subCityLabel}</label>
                      <select
                        className={styles.input}
                        value={formData.subCity}
                        onChange={(e) => handleInputChange("subCity", e.target.value)}
                      >
                        {t.subCities.map((sub, idx) => (
                          <option key={idx} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t.woredaLabel}</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={formData.woreda}
                        onChange={(e) => handleInputChange("woreda", e.target.value)}
                        placeholder="e.g. Woreda 03 / Kebele 12"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t.propertyTypeLabel}</label>
                      <select
                        className={styles.input}
                        value={formData.propertyType}
                        onChange={(e) => handleInputChange("propertyType", e.target.value)}
                      >
                        <option value="apartment">{t.propertyTypes.apartment}</option>
                        <option value="condo">{t.propertyTypes.condo}</option>
                        <option value="villa">{t.propertyTypes.villa}</option>
                        <option value="townhouse">{t.propertyTypes.townhouse}</option>
                        <option value="penthouse">{t.propertyTypes.penthouse}</option>
                        <option value="commercial">{t.propertyTypes.commercial}</option>
                      </select>
                    </div>

                    <div className={styles.formGroupFull}>
                      <label className={styles.label}>{t.specificAreaLabel}</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={formData.specificArea}
                        onChange={(e) => handleInputChange("specificArea", e.target.value)}
                        placeholder="e.g. Atlas, near Edna Mall / CMC Michael"
                      />
                    </div>
                  </div>

                  <div className={styles.buttonRow}>
                    <button
                      type="button"
                      className={styles.nextBtn}
                      onClick={() => setCurrentStep(2)}
                    >
                      <span>{t.btnNext}</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Specs & Price */}
              {currentStep === 2 && (
                <div className={styles.stepContent}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t.bedroomsLabel}</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        className={styles.input}
                        value={formData.bedrooms}
                        onChange={(e) => handleInputChange("bedrooms", Number(e.target.value))}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t.bathroomsLabel}</label>
                      <input
                        type="number"
                        min="1"
                        max="15"
                        className={styles.input}
                        value={formData.bathrooms}
                        onChange={(e) => handleInputChange("bathrooms", Number(e.target.value))}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t.areaLabel}</label>
                      <input
                        type="number"
                        min="20"
                        max="5000"
                        className={styles.input}
                        value={formData.areaSqM}
                        onChange={(e) => handleInputChange("areaSqM", Number(e.target.value))}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t.priceLabel}</label>
                      <input
                        type="number"
                        step="50000"
                        className={styles.input}
                        value={formData.priceETB}
                        onChange={(e) => handleInputChange("priceETB", Number(e.target.value))}
                      />
                    </div>

                    <div className={styles.formGroupFull}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          checked={formData.isNegotiable}
                          onChange={(e) => handleInputChange("isNegotiable", e.target.checked)}
                        />
                        <span>{t.priceNegotiableLabel}</span>
                      </label>
                    </div>
                  </div>

                  <div className={styles.buttonRow}>
                    <button
                      type="button"
                      className={styles.backBtn}
                      onClick={() => setCurrentStep(1)}
                    >
                      <ChevronLeft size={16} />
                      <span>{t.btnPrev}</span>
                    </button>
                    <button
                      type="button"
                      className={styles.nextBtn}
                      onClick={() => setCurrentStep(3)}
                    >
                      <span>{t.btnNext}</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Amenities & Title Status */}
              {currentStep === 3 && (
                <div className={styles.stepContent}>
                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>{t.titleDeedLabel}</label>
                    <select
                      className={styles.input}
                      value={formData.titleDeedStatus}
                      onChange={(e) => handleInputChange("titleDeedStatus", e.target.value)}
                    >
                      <option value="digital">{t.titleDeedOptions.digital}</option>
                      <option value="paper">{t.titleDeedOptions.paper}</option>
                      <option value="lease">{t.titleDeedOptions.lease}</option>
                      <option value="processing">{t.titleDeedOptions.processing}</option>
                    </select>
                  </div>

                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>{t.amenitiesLabel}</label>
                    <div className={styles.amenitiesGrid}>
                      {t.amenitiesList.map((amenity, idx) => {
                        const isChecked = formData.selectedAmenities.includes(amenity);
                        return (
                          <div
                            key={idx}
                            className={`${styles.amenityItem} ${
                              isChecked ? styles.amenityItemSelected : ""
                            }`}
                            onClick={() => toggleAmenity(amenity)}
                          >
                            <input
                              type="checkbox"
                              className={styles.checkbox}
                              checked={isChecked}
                              readOnly
                            />
                            <span>{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className={styles.buttonRow}>
                    <button
                      type="button"
                      className={styles.backBtn}
                      onClick={() => setCurrentStep(2)}
                    >
                      <ChevronLeft size={16} />
                      <span>{t.btnPrev}</span>
                    </button>
                    <button
                      type="button"
                      className={styles.nextBtn}
                      onClick={() => setCurrentStep(4)}
                    >
                      <span>{t.btnNext}</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Photos, Description & Contact */}
              {currentStep === 4 && (
                <div className={styles.stepContent}>
                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>{t.photosLabel}</label>
                    <label className={styles.dropzone}>
                      <UploadCloud size={32} className={styles.dropzoneIcon} />
                      <p className={styles.dropzoneText}>{t.dropzoneText}</p>
                      <p className={styles.dropzoneHint}>{t.photosHint}</p>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleFileUpload}
                      />
                    </label>

                    <div className={styles.photoThumbnails}>
                      {photos.map((src, i) => (
                        <div key={i} className={styles.thumbnailWrapper}>
                          <img src={src} alt="property upload" className={styles.thumbnailImg} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>{t.descLabel}</label>
                    <textarea
                      className={styles.textarea}
                      placeholder={t.descPlaceholder}
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t.ownerNameLabel}</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={formData.ownerName}
                        onChange={(e) => handleInputChange("ownerName", e.target.value)}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t.phoneLabel}</label>
                      <input
                        type="tel"
                        className={styles.input}
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="911234567"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.buttonRow}>
                    <button
                      type="button"
                      className={styles.backBtn}
                      onClick={() => setCurrentStep(3)}
                    >
                      <ChevronLeft size={16} />
                      <span>{t.btnPrev}</span>
                    </button>
                    <button type="submit" className={styles.publishBtn}>
                      <Tag size={18} />
                      <span>{t.btnPublish}</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Live Preview Card */}
          <div className={styles.previewStickyWrapper}>
            <div className={styles.previewCard}>
              <div className={styles.previewHeader}>
                <span className={styles.previewBadge}>{t.previewTitle}</span>
                <span style={{ fontSize: "0.8rem", color: "#b3cfe5" }}>ERNS Verified FSBO</span>
              </div>

              <div className={styles.previewImageContainer}>
                {photos[0] && (
                  <img
                    src={photos[0]}
                    alt="Preview"
                    className={styles.previewImage}
                  />
                )}
                <div className={styles.previewImageBadge}>
                  {t.propertyTypes[formData.propertyType as keyof typeof t.propertyTypes] ||
                    formData.propertyType}
                </div>
                <div className={styles.zeroCommissionBadge}>0% Commission</div>
              </div>

              <div className={styles.previewBody}>
                <div>
                  <h3 className={styles.previewPrice}>
                    {formatPrice(formData.priceETB)} ETB
                    {formData.isNegotiable && (
                      <span className={styles.negotiableTag}>
                        ({isAmharic ? "ድርድር" : "Neg."})
                      </span>
                    )}
                  </h3>
                  <p className={styles.previewLocation}>
                    <MapPin size={16} color="var(--color-accent)" />
                    <span>
                      {formData.subCity}, {formData.specificArea || "Addis Ababa"}
                    </span>
                  </p>
                </div>

                <div className={styles.previewSpecs}>
                  <div className={styles.specItem}>
                    <Bed size={16} color="var(--color-accent)" />
                    <span>{formData.bedrooms} Beds</span>
                  </div>
                  <div className={styles.specItem}>
                    <Bath size={16} color="var(--color-accent)" />
                    <span>{formData.bathrooms} Baths</span>
                  </div>
                  <div className={styles.specItem}>
                    <Maximize2 size={16} color="var(--color-accent)" />
                    <span>{formData.areaSqM} m²</span>
                  </div>
                </div>

                <div className={styles.previewTitleDeed}>
                  <FileCheck2 size={15} />
                  <span>
                    {
                      t.titleDeedOptions[
                        formData.titleDeedStatus as keyof typeof t.titleDeedOptions
                      ]
                    }
                  </span>
                </div>

                <div className={styles.previewOwnerInfo}>
                  <span className={styles.ownerName}>
                    {isAmharic ? "ባለቤት፡ " : "Owner: "}
                    {formData.ownerName || "Homeowner"}
                  </span>
                  <span className={styles.ownerPhone}>
                    <Phone size={14} />
                    <span>+251 {formData.phone}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {isSubmitted && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalIcon}>
              <CheckCircle2 size={38} />
            </div>
            <h3 className={styles.modalTitle}>{t.successTitle}</h3>
            <p className={styles.modalDesc}>{t.successDesc}</p>
            <div className={styles.referenceBadge}>
              {t.successRef}2026-{submissionRef}
            </div>
            <div className={styles.modalActions}>
              <Link href="/search?status=FOR_SALE" className={styles.modalPrimaryBtn}>
                {t.btnViewListing}
              </Link>
              <button
                type="button"
                className={styles.modalSecondaryBtn}
                onClick={resetForm}
              >
                {t.btnCreateAnother}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FsboListingBuilder;
