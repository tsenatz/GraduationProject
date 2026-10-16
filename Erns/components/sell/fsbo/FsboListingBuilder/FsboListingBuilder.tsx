"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
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
  X,
  Lock,
  Building2,
  Home,
  Landmark,
  Warehouse,
  Camera,
  Loader2,
  ArrowRight,
  Plus,
  Minus,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations } from "@/components/sell/translations";
import {
  createPropertyListingAction,
  updatePropertyListingAction,
} from "@/lib/actions/listings";
import styles from "./FsboListingBuilder.module.css";

interface FsboListingBuilderProps {
  initialSubCity?: string;
  initialAddress?: string;
  initialData?: any;
  mode?: "create" | "edit";
  propertyId?: string;
}

const PROPERTY_TYPES = [
  { id: "apartment", labelEn: "Apartment", labelAm: "አፓርታማ", icon: Building2 },
  { id: "villa", labelEn: "Villa / House", labelAm: "ቪላ / ቤት", icon: Home },
  { id: "condo", labelEn: "Condominium", labelAm: "ኮንዶሚኒየም", icon: Landmark },
  { id: "townhouse", labelEn: "Townhouse", labelAm: "ታውንሃውስ", icon: Home },
  { id: "commercial", labelEn: "Commercial", labelAm: "የንግድ ቦታ", icon: Warehouse },
];

const SAMPLE_PHOTOS = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=800&q=80",
];

export const FsboListingBuilder: React.FC<FsboListingBuilderProps> = ({
  initialSubCity = "Bole",
  initialAddress = "",
  initialData,
  mode = "create",
  propertyId,
}) => {
  const { data: session } = useSession();
  const { isAmharic } = useLanguage();
  const t = translations[isAmharic ? "am" : "en"].fsbo.builder;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionRef, setSubmissionRef] = useState(initialData?.referenceNo || "");
  const [createdPropertyId, setCreatedPropertyId] = useState(propertyId || "");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form State initialized with initialData (if in edit mode) or defaults
  const [formData, setFormData] = useState({
    subCity: initialData?.subCity || initialSubCity || "Bole",
    woreda: initialData?.woreda || "Woreda 03",
    specificArea: initialData?.specificArea || initialAddress || "Atlas, near Edna Mall",
    propertyType: initialData?.propertyType || "apartment",
    bedrooms: initialData?.bedrooms || 3,
    bathrooms: initialData?.bathrooms || 2,
    areaSqM: initialData?.areaSqM || 145,
    priceETB: initialData?.priceETB || 12500000,
    isNegotiable: initialData?.isNegotiable !== undefined ? initialData.isNegotiable : true,
    titleDeedStatus: initialData?.titleDeedStatus || "digital",
    selectedAmenities: initialData?.amenities || [
      "Water Tank / Reserve (የውሃ ታንከር)",
      "Standby Generator (ጀነሬተር)",
      "Dedicated Parking (የመኪና ማቆሚያ)",
    ],
    description: initialData?.description || "",
    ownerName: initialData?.ownerName || "",
    phone: initialData?.phone || "",
    preferredTime: initialData?.preferredTime || "anytime",
  });

  const [photos, setPhotos] = useState<string[]>(
    initialData?.photos && initialData.photos.length > 0
      ? initialData.photos
      : [SAMPLE_PHOTOS[0], SAMPLE_PHOTOS[1], SAMPLE_PHOTOS[2]]
  );

  // Prepopulate contact info if user is authenticated
  useEffect(() => {
    const userName = session?.user?.name;
    if (userName && !formData.ownerName) {
      setFormData((prev) => ({ ...prev, ownerName: userName }));
    }
  }, [session, formData.ownerName]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => {
      const exists = prev.selectedAmenities.includes(amenity);
      return {
        ...prev,
        selectedAmenities: exists
          ? prev.selectedAmenities.filter((a: string) => a !== amenity)
          : [...prev.selectedAmenities, amenity],
      };
    });
  };

  // Persistent Image Upload via /api/upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setIsUploading(true);
    setErrorMessage("");

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();

      if (data.success && data.url) {
        setPhotos((prev) => [data.url, ...prev]);
      } else {
        setErrorMessage(data.error || "Failed to upload photo");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMessage("Network error uploading photo");
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be re-selected if needed
      e.target.value = "";
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const loadSamplePhotos = () => {
    setPhotos(SAMPLE_PHOTOS);
  };

  // Stepper helper
  const adjustNumber = (field: "bedrooms" | "bathrooms" | "areaSqM", delta: number, min = 1) => {
    setFormData((prev) => {
      const current = Number(prev[field]) || min;
      const next = Math.max(min, current + delta);
      return { ...prev, [field]: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Auth gate: ensure user is signed in to save to database and manage in dashboard
    if (!session?.user) {
      setShowAuthModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "edit" && propertyId) {
        const result = await updatePropertyListingAction(propertyId, {
          subCity: formData.subCity,
          woreda: formData.woreda,
          specificArea: formData.specificArea,
          propertyType: formData.propertyType,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          areaSqM: formData.areaSqM,
          priceETB: formData.priceETB,
          isNegotiable: formData.isNegotiable,
          titleDeedStatus: formData.titleDeedStatus,
          amenities: formData.selectedAmenities,
          description: formData.description,
          ownerName: formData.ownerName || session.user.name || "Owner",
          phone: formData.phone,
          preferredTime: formData.preferredTime,
          photos,
        });

        if (result.success) {
          setSubmissionRef(initialData?.referenceNo || result.referenceNo || "");
          setCreatedPropertyId(propertyId);
          setIsSubmitted(true);
        } else {
          if (result.error === "AUTH_REQUIRED") {
            setShowAuthModal(true);
          } else {
            setErrorMessage(result.error || "Failed to update listing");
          }
        }
      } else {
        const result = await createPropertyListingAction({
          subCity: formData.subCity,
          woreda: formData.woreda,
          specificArea: formData.specificArea,
          propertyType: formData.propertyType,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          areaSqM: formData.areaSqM,
          priceETB: formData.priceETB,
          isNegotiable: formData.isNegotiable,
          titleDeedStatus: formData.titleDeedStatus,
          amenities: formData.selectedAmenities,
          description: formData.description,
          ownerName: formData.ownerName || session.user.name || "Owner",
          phone: formData.phone,
          preferredTime: formData.preferredTime,
          photos,
        });

        if (result.success) {
          setSubmissionRef(result.referenceNo || `ERN-${Math.floor(10000 + Math.random() * 90000)}`);
          setCreatedPropertyId(result.propertyId || "");
          setIsSubmitted(true);
        } else {
          if (result.error === "AUTH_REQUIRED") {
            setShowAuthModal(true);
          } else {
            setErrorMessage(result.error || "Failed to save listing");
          }
        }
      }
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMessage(
        mode === "edit"
          ? "Something went wrong while updating your listing."
          : "Something went wrong while publishing your home."
      );
    } finally {
      setIsSubmitting(false);
    }
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
          <h2 className={styles.title}>
            {mode === "edit"
              ? isAmharic
                ? "የቤትዎን መረጃ ያሻሽሉ"
                : "Edit Your Property Listing"
              : t.title}
          </h2>
          <p className={styles.subtitle}>
            {mode === "edit"
              ? isAmharic
                ? `ማጣቀሻ ቁጥር፡ ${initialData?.referenceNo || ""} - ዋጋ፣ ዝርዝር ወይም ፎቶዎችን ያሻሽሉ`
                : `Reference #${initialData?.referenceNo || ""} • Update your price, photos, or specs.`
              : t.subtitle}
          </p>
        </div>

        <div className={styles.wizardLayout}>
          {/* Form Wizard Side */}
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

            {errorMessage && (
              <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.88rem" }}>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* STEP 1: Property Type & Location */}
              {currentStep === 1 && (
                <div className={styles.stepContent}>
                  {/* Visual Property Type Grid (Per leader feedback: less words, more visual buttons) */}
                  <div style={{ marginBottom: "20px" }}>
                    <label className={styles.label} style={{ marginBottom: "8px", display: "block" }}>
                      {t.propertyTypeLabel}
                    </label>
                    <div className={styles.propertyTypesGrid}>
                      {PROPERTY_TYPES.map((pt) => {
                        const Icon = pt.icon;
                        const isSelected = formData.propertyType === pt.id;
                        return (
                          <button
                            key={pt.id}
                            type="button"
                            className={`${styles.propertyTypeCard} ${
                              isSelected ? styles.propertyTypeCardActive : ""
                            }`}
                            onClick={() => handleInputChange("propertyType", pt.id)}
                          >
                            <Icon size={24} />
                            <span>{isAmharic ? pt.labelAm : pt.labelEn}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

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
                        placeholder="e.g. Woreda 03"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t.specificAreaLabel}</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={formData.specificArea}
                        onChange={(e) => handleInputChange("specificArea", e.target.value)}
                        placeholder="e.g. Atlas, near Edna Mall"
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

              {/* STEP 2: Key Numbers & Pricing */}
              {currentStep === 2 && (
                <div className={styles.stepContent}>
                  <div className={styles.formGrid}>
                    {/* Visual Stepper for Bedrooms */}
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t.bedroomsLabel}</label>
                      <div className={styles.stepperControl}>
                        <button
                          type="button"
                          className={styles.stepperBtn}
                          disabled={formData.bedrooms <= 1}
                          onClick={() => adjustNumber("bedrooms", -1, 1)}
                        >
                          <Minus size={16} />
                        </button>
                        <span className={styles.stepperValue}>{formData.bedrooms}</span>
                        <button
                          type="button"
                          className={styles.stepperBtn}
                          onClick={() => adjustNumber("bedrooms", 1, 1)}
                        >
                          <Plus size={16} />
                        </button>
                        <span style={{ fontSize: "0.85rem", color: "#64748b", marginLeft: "4px" }}>
                          Beds
                        </span>
                      </div>
                    </div>

                    {/* Visual Stepper for Bathrooms */}
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t.bathroomsLabel}</label>
                      <div className={styles.stepperControl}>
                        <button
                          type="button"
                          className={styles.stepperBtn}
                          disabled={formData.bathrooms <= 1}
                          onClick={() => adjustNumber("bathrooms", -1, 1)}
                        >
                          <Minus size={16} />
                        </button>
                        <span className={styles.stepperValue}>{formData.bathrooms}</span>
                        <button
                          type="button"
                          className={styles.stepperBtn}
                          onClick={() => adjustNumber("bathrooms", 1, 1)}
                        >
                          <Plus size={16} />
                        </button>
                        <span style={{ fontSize: "0.85rem", color: "#64748b", marginLeft: "4px" }}>
                          Baths
                        </span>
                      </div>
                    </div>

                    {/* Area in m² */}
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t.areaLabel} (m²)</label>
                      <input
                        type="number"
                        min="20"
                        max="5000"
                        className={styles.input}
                        value={formData.areaSqM}
                        onChange={(e) => handleInputChange("areaSqM", Number(e.target.value))}
                      />
                    </div>

                    {/* Price in ETB with preset buttons */}
                    <div className={styles.formGroup}>
                      <label className={styles.label}>{t.priceLabel} (ETB)</label>
                      <input
                        type="number"
                        step="50000"
                        className={styles.input}
                        value={formData.priceETB}
                        onChange={(e) => handleInputChange("priceETB", Number(e.target.value))}
                      />
                      {/* Quick preset chips */}
                      <div className={styles.priceChipsRow}>
                        {[5000000, 8500000, 12500000, 20000000, 35000000].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            className={styles.priceChipBtn}
                            onClick={() => handleInputChange("priceETB", preset)}
                          >
                            {(preset / 1000000).toFixed(1).replace(".0", "")}M ETB
                          </button>
                        ))}
                      </div>
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

              {/* STEP 3: Amenities & Title Deed */}
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

              {/* STEP 4: Photos & Publishing */}
              {currentStep === 4 && (
                <div className={styles.stepContent}>
                  {/* Photo Dropzone with Persistent Uploads */}
                  <div className={styles.formGroupFull}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label className={styles.label}>{t.photosLabel}</label>
                      {isUploading && (
                        <span className={styles.uploadingBadge}>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Uploading to server...</span>
                        </span>
                      )}
                    </div>

                    <label className={styles.dropzone}>
                      <UploadCloud size={34} className={styles.dropzoneIcon} />
                      <p className={styles.dropzoneText}>
                        {isUploading ? "Uploading image..." : t.dropzoneText}
                      </p>
                      <p className={styles.dropzoneHint}>{t.photosHint}</p>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        disabled={isUploading}
                        onChange={handleFileUpload}
                      />
                    </label>

                    {/* Upload actions and samples */}
                    <div className={styles.photoActionsRow}>
                      <span style={{ fontSize: "0.825rem", color: "#64748b" }}>
                        {photos.length} photos ready for listing
                      </span>
                      <button
                        type="button"
                        className={styles.sampleGalleryBtn}
                        onClick={loadSamplePhotos}
                      >
                        <Camera size={14} style={{ display: "inline", marginRight: "4px" }} />
                        Use High-Res Demo Photos
                      </button>
                    </div>

                    {/* Thumbnails with delete button */}
                    <div className={styles.photoThumbnails}>
                      {photos.map((src, i) => (
                        <div key={i} className={styles.thumbnailWrapper}>
                          <img src={src} alt="Property" className={styles.thumbnailImg} />
                          <button
                            type="button"
                            className={styles.thumbnailRemoveBtn}
                            onClick={() => removePhoto(i)}
                            title="Remove photo"
                          >
                            <X size={14} />
                          </button>
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
                        placeholder="Full Name"
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

                    <button
                      type="submit"
                      className={styles.publishBtn}
                      disabled={isSubmitting || isUploading}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>
                            {mode === "edit"
                              ? isAmharic
                                ? "እየተሻሻለ ነው..."
                                : "Saving Changes..."
                              : isAmharic
                              ? "ወደ ዳታቤዝ እየገባ ነው..."
                              : "Publishing to Database..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <Tag size={18} />
                          <span>
                            {mode === "edit"
                              ? isAmharic
                                ? "ለውጦችን መዝግብ"
                                : "Save Changes"
                              : t.btnPublish}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Sticky Live Preview Card */}
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
                    {formData.ownerName || session?.user?.name || "Homeowner"}
                  </span>
                  <span className={styles.ownerPhone}>
                    <Phone size={14} />
                    <span>+251 {formData.phone || "9..."}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Gate Modal (Required to publish and manage in dashboard) */}
      {showAuthModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAuthModal(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon} style={{ background: "#eff6ff", color: "#2563eb" }}>
              <Lock size={34} />
            </div>
            <h3 className={styles.modalTitle}>Sign In to Publish</h3>
            <p className={styles.modalDesc}>
              Please sign in with your ERNS account so your property listing is securely saved to the database and can be managed from your Seller Dashboard.
            </p>
            <div className={styles.modalActions}>
              <Link
                href="/login?callbackUrl=/sell/list"
                className={styles.modalPrimaryBtn}
              >
                Sign In / Register
              </Link>
              <button
                type="button"
                className={styles.modalSecondaryBtn}
                onClick={() => setShowAuthModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Database Submission Success Modal */}
      {isSubmitted && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalIcon}>
              <CheckCircle2 size={38} />
            </div>
            <h3 className={styles.modalTitle}>
              {mode === "edit"
                ? isAmharic
                  ? "የቤትዎ መረጃ በተሳካ ሁኔታ ተሻሽሏል!"
                  : "Listing Updated Successfully!"
                : t.successTitle}
            </h3>
            <p className={styles.modalDesc}>
              {mode === "edit"
                ? isAmharic
                  ? "ሁሉም ለውጦች በዳታቤዝ ውስጥ ተመዝግበው ገበያ ላይ ወዲያውኑ ታይተዋል።"
                  : "All changes have been saved to the PostgreSQL database and updated in the marketplace."
                : isAmharic
                ? "ቤትዎ በዳታቤዝ ውስጥ ተመዝግቦ በ ERNS ገበያ ላይ ወዲያውኑ ታይቷል።"
                : "Your listing has been saved to the PostgreSQL database and published to the ERNS marketplace."}
            </p>
            <div className={styles.referenceBadge}>
              {t.successRef} {submissionRef}
            </div>

            <div className={styles.modalActions} style={{ flexDirection: "column", gap: "10px" }}>
              <Link
                href="/sell/dashboard"
                className={styles.modalPrimaryBtn}
                style={{ width: "100%", textAlign: "center" }}
              >
                <span>
                  {mode === "edit"
                    ? isAmharic
                      ? "ወደ ሻጭ ዳሽቦርድ ተመለስ"
                      : "Return to Seller Dashboard"
                    : "Go to Seller Dashboard"}
                </span>
                <ArrowRight size={16} style={{ display: "inline", marginLeft: "6px" }} />
              </Link>

              <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                <Link
                  href={`/search?query=${encodeURIComponent(formData.subCity)}`}
                  className={styles.modalSecondaryBtn}
                  style={{ flex: 1, textAlign: "center" }}
                >
                  {t.btnViewListing}
                </Link>
                {mode !== "edit" && (
                  <button
                    type="button"
                    className={styles.modalSecondaryBtn}
                    style={{ flex: 1 }}
                    onClick={resetForm}
                  >
                    {t.btnCreateAnother}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FsboListingBuilder;
