"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  X,
  Building2,
  MapPin,
  DollarSign,
  Utensils,
  Check,
  Plus,
  Bed,
  Bath,
  Maximize2,
  Phone,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  ShieldCheck,
  Zap,
  Droplets,
  Car,
  Wifi,
  Eye,
} from "lucide-react";
import {
  createRentalPropertyAction,
  updateRentalPropertyAction,
  RentalPropertyInput,
  RentalPropertyRecord,
} from "@/lib/actions/rentals";
import styles from "./AddRentalPropertyModal.module.css";

const SUB_CITIES = [
  { en: "Bole", am: "ቦሌ", avgMin: 45000, avgMax: 80000 },
  { en: "Kirkos", am: "ቂርቆስ", avgMin: 50000, avgMax: 95000 },
  { en: "Yeka", am: "የካ", avgMin: 30000, avgMax: 55000 },
  { en: "Lideta", am: "ልደታ", avgMin: 25000, avgMax: 45000 },
  { en: "Arada", am: "አራዳ", avgMin: 28000, avgMax: 50000 },
  { en: "Gullele", am: "ጉለሌ", avgMin: 22000, avgMax: 40000 },
  { en: "Nifas Silk-Lafto", am: "ንፋስ ስልክ ላፍቶ", avgMin: 28000, avgMax: 55000 },
  { en: "Akaky Kaliti", am: "አቃቂ ቃሊቲ", avgMin: 18000, avgMax: 32000 },
  { en: "Kolfe Keranio", am: "ኮልፌ ቀራኒዮ", avgMin: 20000, avgMax: 35000 },
  { en: "Addis Ketema", am: "አዲስ ከተማ", avgMin: 25000, avgMax: 42000 },
];

const PROPERTY_TYPES = [
  { id: "Apartment", label: "Apartment", icon: Building2 },
  { id: "Condominium", label: "Condominium", icon: Building2 },
  { id: "Villa", label: "Villa / House", icon: Building2 },
  { id: "Townhouse", label: "Townhouse", icon: Building2 },
  { id: "Penthouse", label: "Penthouse", icon: Building2 },
];

const PRESET_PHOTOS = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80",
];

const AMENITY_OPTIONS = [
  { id: "Standby Generator", label: "Standby Generator (ጄኔሬተር)", icon: Zap },
  { id: "Water Tank Reservoir", label: "Water Reservoir Tank (የውሃ ታንከር)", icon: Droplets },
  { id: "24/7 Compound Security", label: "24/7 Compound Security (የጥበቃ)", icon: ShieldCheck },
  { id: "Dedicated Parking", label: "Dedicated Parking (የመኪና ማቆሚያ)", icon: Car },
  { id: "Elevator Access", label: "Elevator Access (ሊፍት)", icon: Building2 },
  { id: "High Speed WiFi", label: "High Speed WiFi", icon: Wifi },
  { id: "Balcony City View", label: "Balcony with City View", icon: Eye },
  { id: "Modern Fitted Kitchen", label: "Modern Fitted Kitchen", icon: Utensils },
  { id: "Water Heater (Geyser)", label: "Water Heater / Geyser", icon: Droplets },
];

interface AddRentalPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyAdded?: (newProp: RentalPropertyRecord) => void;
  onPropertyUpdated?: (updatedProp: RentalPropertyRecord) => void;
  initialData?: RentalPropertyRecord | null;
}

export const AddRentalPropertyModal: React.FC<AddRentalPropertyModalProps> = ({
  isOpen,
  onClose,
  onPropertyAdded,
  onPropertyUpdated,
  initialData,
}) => {
  const isEditMode = Boolean(initialData);

  // Stepper state (1 to 4)
  const [currentStep, setCurrentStep] = useState(1);

  // Form Fields
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

  // Sync initialData when editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSubCity(initialData.subCity || "Bole");
      setSpecificArea(initialData.specificArea || "");
      setWoreda(initialData.woreda || "");
      setPropertyType(initialData.propertyType || "Apartment");
      setBedrooms(initialData.bedrooms || 2);
      setBathrooms(initialData.bathrooms || 2);
      setAreaSqM(initialData.areaSqM || 120);
      setFurnishedStatus(
        (initialData.furnishedStatus as any) || "fully_furnished"
      );
      setPriceETB(initialData.priceETB || 45000);
      setDepositETB(initialData.depositETB || 90000);
      setLeaseTerm(initialData.leaseTerm || "12_months");
      setSelectedAmenities(initialData.amenities || []);
      if (initialData.images && initialData.images.length > 0) {
        if (PRESET_PHOTOS.includes(initialData.images[0])) {
          setSelectedPhoto(initialData.images[0]);
          setCustomPhotoUrl("");
        } else {
          setCustomPhotoUrl(initialData.images[0]);
        }
      }
      setDescription(initialData.description || "");
    } else {
      // Reset defaults
      setCurrentStep(1);
      setTitle("");
      setSubCity("Bole");
      setSpecificArea("");
      setWoreda("");
      setPropertyType("Apartment");
      setBedrooms(2);
      setBathrooms(2);
      setAreaSqM(120);
      setFurnishedStatus("fully_furnished");
      setPriceETB(45000);
      setDepositETB(90000);
      setLeaseTerm("12_months");
      setSelectedPhoto(PRESET_PHOTOS[0]);
      setCustomPhotoUrl("");
      setSelectedAmenities([
        "Standby Generator",
        "Water Tank Reservoir",
        "24/7 Compound Security",
      ]);
      setDescription("");
    }
  }, [initialData, isOpen]);

  // Market Insight benchmark calculation
  const marketInsight = useMemo(() => {
    const sc = SUB_CITIES.find((c) => c.en === subCity);
    if (!sc) return null;
    const bedMultiplier = bedrooms <= 1 ? 0.75 : bedrooms >= 3 ? 1.4 : 1.0;
    const estMin = Math.round(sc.avgMin * bedMultiplier);
    const estMax = Math.round(sc.avgMax * bedMultiplier);
    return {
      subCityEn: sc.en,
      subCityAm: sc.am,
      estMin,
      estMax,
    };
  }, [subCity, bedrooms]);

  if (!isOpen) return null;

  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handlePriceChange = (val: number) => {
    setPriceETB(val);
    if (!initialData) {
      setDepositETB(val * 2); // Auto 2 months for new
    }
  };

  const setDepositMonths = (months: number) => {
    setDepositETB(priceETB * months);
  };

  const chosenImage = customPhotoUrl.trim() || selectedPhoto;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedTitle =
      title.trim() ||
      `${bedrooms}-Bedroom ${propertyType} for Rent in ${subCity}`;

    const payload: RentalPropertyInput = {
      title: generatedTitle,
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
        `Spacious ${bedrooms}-bedroom ${propertyType.toLowerCase()} available for rent in ${subCity}. Move-in ready with backup generator and water tank security.`,
      status: initialData ? initialData.status : "FOR_RENT",
    };

    try {
      if (isEditMode && initialData) {
        const res = await updateRentalPropertyAction(initialData.id, payload);
        if (res.success && res.property) {
          if (onPropertyUpdated) onPropertyUpdated(res.property);
          onClose();
        } else {
          alert(res.error || "Failed to update property");
        }
      } else {
        const res = await createRentalPropertyAction(payload);
        if (res.success && res.property) {
          if (onPropertyAdded) onPropertyAdded(res.property);
          onClose();
        } else {
          alert(res.error || "Failed to add property");
        }
      }
    } catch (err) {
      console.error("Error saving rental:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleBlock}>
            <h3 className={styles.modalTitle}>
              {isEditMode ? "Edit Rental Property" : "Add a Rental Property"}
            </h3>
            <span className={styles.modalSubtitle}>
              {isEditMode
                ? "Update pricing, specifications, or media for this unit"
                : "Post a new residential rental unit to your ERNS portfolio"}
            </span>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Stepper Tabs Bar */}
        <div className={styles.stepperBar}>
          <button
            type="button"
            className={`${styles.stepTab} ${currentStep === 1 ? styles.stepTabActive : ""} ${
              currentStep > 1 ? styles.stepTabCompleted : ""
            }`}
            onClick={() => setCurrentStep(1)}
          >
            <span className={styles.stepNum}>1</span>
            <span className={styles.stepLabel}>Location & Type</span>
          </button>

          <button
            type="button"
            className={`${styles.stepTab} ${currentStep === 2 ? styles.stepTabActive : ""} ${
              currentStep > 2 ? styles.stepTabCompleted : ""
            }`}
            onClick={() => setCurrentStep(2)}
          >
            <span className={styles.stepNum}>2</span>
            <span className={styles.stepLabel}>Specs & Price</span>
          </button>

          <button
            type="button"
            className={`${styles.stepTab} ${currentStep === 3 ? styles.stepTabActive : ""} ${
              currentStep > 3 ? styles.stepTabCompleted : ""
            }`}
            onClick={() => setCurrentStep(3)}
          >
            <span className={styles.stepNum}>3</span>
            <span className={styles.stepLabel}>Amenities & Details</span>
          </button>

          <button
            type="button"
            className={`${styles.stepTab} ${currentStep === 4 ? styles.stepTabActive : ""}`}
            onClick={() => setCurrentStep(4)}
          >
            <span className={styles.stepNum}>4</span>
            <span className={styles.stepLabel}>Photos & Preview</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className={styles.formContent}>
          {/* STEP 1: Location & Property Type */}
          {currentStep === 1 && (
            <div className={styles.stepSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionBadge}>Step 1 of 4</span>
                <h4 className={styles.sectionHeading}>Where is the property located?</h4>
              </div>

              {/* Property Type Picker */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Property Category</label>
                <div className={styles.typeGrid}>
                  {PROPERTY_TYPES.map((pt) => {
                    const isSelected = propertyType === pt.id;
                    const Icon = pt.icon;
                    return (
                      <button
                        key={pt.id}
                        type="button"
                        className={`${styles.typeCard} ${isSelected ? styles.typeCardSelected : ""}`}
                        onClick={() => setPropertyType(pt.id)}
                      >
                        <Icon size={20} color={isSelected ? "#0A1931" : "#4A7FA7"} />
                        <span>{pt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Listing Title (Optional)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder={`e.g. Spacious ${bedrooms}-Bed ${propertyType} in ${subCity}`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Sub-City, Landmark, Woreda */}
              <div className={styles.row3}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Sub-City (ክፍለ ከተማ) *</label>
                  <select
                    className={styles.select}
                    value={subCity}
                    onChange={(e) => setSubCity(e.target.value)}
                    required
                  >
                    {SUB_CITIES.map((sc) => (
                      <option key={sc.en} value={sc.en}>
                        {sc.en} ({sc.am})
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Area / Landmark</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Atlas, Edna Mall, Kazanchis"
                    value={specificArea}
                    onChange={(e) => setSpecificArea(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Woreda / Kebele</label>
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
          )}

          {/* STEP 2: Specs & Pricing */}
          {currentStep === 2 && (
            <div className={styles.stepSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionBadge}>Step 2 of 4</span>
                <h4 className={styles.sectionHeading}>Unit Specifications & Rental Terms</h4>
              </div>

              {/* Specs: Beds, Baths, Area */}
              <div className={styles.row3}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Bedrooms</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
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
                    max={12}
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
                    min={15}
                    max={3000}
                    className={styles.input}
                    value={areaSqM}
                    onChange={(e) => setAreaSqM(parseInt(e.target.value) || 50)}
                    required
                  />
                </div>
              </div>

              <div className={styles.row2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Furnishing Status</label>
                  <select
                    className={styles.select}
                    value={furnishedStatus}
                    onChange={(e) => setFurnishedStatus(e.target.value as any)}
                  >
                    <option value="fully_furnished">Fully Furnished (የተሟላ እቃ)</option>
                    <option value="semi_furnished">Semi-Furnished (ከፊል እቃ)</option>
                    <option value="unfurnished">Unfurnished (ያልተሟላ እቃ)</option>
                  </select>
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

              {/* Zillow Rent Guidance Insight Banner */}
              {marketInsight && (
                <div className={styles.insightBox}>
                  <div className={styles.insightIcon}>
                    <Lightbulb size={20} color="#0A1931" />
                  </div>
                  <div className={styles.insightText}>
                    <span className={styles.insightTitle}>
                      ERNS Rental Market Benchmark ({marketInsight.subCityEn} / {marketInsight.subCityAm})
                    </span>
                    <span className={styles.insightDesc}>
                      Similar {bedrooms}-bedroom units in this area typically rent for{" "}
                      <strong>
                        {new Intl.NumberFormat("en-US").format(marketInsight.estMin)} –{" "}
                        {new Intl.NumberFormat("en-US").format(marketInsight.estMax)} ETB/mo
                      </strong>.
                    </span>
                  </div>
                </div>
              )}

              {/* Monthly Rent & Security Deposit */}
              <div className={styles.row2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Monthly Rent (ETB) *</label>
                  <div className={styles.inputAffixWrapper}>
                    <input
                      type="number"
                      step={1000}
                      min={1000}
                      className={styles.input}
                      value={priceETB}
                      onChange={(e) => handlePriceChange(parseInt(e.target.value) || 0)}
                      required
                    />
                    <span className={styles.affix}>ETB/mo</span>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label className={styles.label}>Security Deposit (ETB)</label>
                    <div className={styles.depositPresets}>
                      <button
                        type="button"
                        className={styles.presetBtn}
                        onClick={() => setDepositMonths(1)}
                      >
                        1 Mo
                      </button>
                      <button
                        type="button"
                        className={styles.presetBtn}
                        onClick={() => setDepositMonths(2)}
                      >
                        2 Mo
                      </button>
                      <button
                        type="button"
                        className={styles.presetBtn}
                        onClick={() => setDepositMonths(3)}
                      >
                        3 Mo
                      </button>
                    </div>
                  </div>
                  <div className={styles.inputAffixWrapper}>
                    <input
                      type="number"
                      step={1000}
                      min={0}
                      className={styles.input}
                      value={depositETB}
                      onChange={(e) => setDepositETB(parseInt(e.target.value) || 0)}
                    />
                    <span className={styles.affix}>ETB</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Amenities & Description */}
          {currentStep === 3 && (
            <div className={styles.stepSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionBadge}>Step 3 of 4</span>
                <h4 className={styles.sectionHeading}>Building Amenities & Highlights</h4>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Check Included Amenities & Utilities</label>
                <div className={styles.amenityGrid}>
                  {AMENITY_OPTIONS.map((item) => {
                    const isActive = selectedAmenities.includes(item.id);
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`${styles.amenityCard} ${
                          isActive ? styles.amenityCardActive : ""
                        }`}
                        onClick={() => toggleAmenity(item.id)}
                      >
                        <div className={styles.amenityIconBox}>
                          <Icon size={16} />
                        </div>
                        <span className={styles.amenityText}>{item.label}</span>
                        {isActive && <Check size={16} className={styles.checkIcon} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Detailed Description</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  placeholder="Mention neighborhood perks, backup water schedule, nearby supermarkets, or diplomatic proximity..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 4: Photos, Contact & Live Preview */}
          {currentStep === 4 && (
            <div className={styles.stepSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionBadge}>Step 4 of 4</span>
                <h4 className={styles.sectionHeading}>Cover Photo & Live Preview</h4>
              </div>

              {/* Photo Selector */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Select Listing Cover Photo</label>
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
                      <Image src={photo} alt={`Photo ${i}`} fill className={styles.photoImg} />
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.row2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Or Custom Photo URL</label>
                  <input
                    type="url"
                    className={styles.input}
                    placeholder="https://images.unsplash.com/..."
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Landlord Phone Contact *</label>
                  <input
                    type="tel"
                    className={styles.input}
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Real-Time Live Listing Preview Box (Matching ERNS standard) */}
              <div className={styles.previewContainer}>
                <span className={styles.previewTag}>Live Listing Preview</span>
                <div className={styles.previewCard}>
                  <div className={styles.previewImageCol}>
                    <Image
                      src={chosenImage}
                      alt="Listing preview"
                      fill
                      className={styles.previewImg}
                    />
                    <span className={styles.previewBadge}>
                      {propertyType} • {subCity}
                    </span>
                  </div>

                  <div className={styles.previewDetails}>
                    <div className={styles.previewPriceRow}>
                      <span className={styles.previewPrice}>
                        {new Intl.NumberFormat("en-US").format(priceETB)} ETB
                        <span className={styles.previewPerMo}> / month</span>
                      </span>
                      <span className={styles.previewDeposit}>
                        Deposit: {new Intl.NumberFormat("en-US").format(depositETB)} ETB
                      </span>
                    </div>

                    <h5 className={styles.previewTitle}>
                      {title.trim() || `${bedrooms}-Bedroom ${propertyType} for Rent in ${subCity}`}
                    </h5>

                    <p className={styles.previewAddress}>
                      <MapPin size={14} style={{ display: "inline", marginRight: "4px" }} />
                      {specificArea ? `${specificArea}, ` : ""}{subCity}, Addis Ababa
                    </p>

                    <div className={styles.previewSpecs}>
                      <span><Bed size={14} /> {bedrooms} Beds</span>
                      <span><Bath size={14} /> {bathrooms} Baths</span>
                      <span><Maximize2 size={14} /> {areaSqM} m²</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Footer Controls */}
          <div className={styles.modalFooter}>
            {currentStep > 1 ? (
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            ) : (
              <button type="button" className={styles.cancelBtn} onClick={onClose}>
                Cancel
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                className={styles.nextBtn}
                onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
              >
                <span>Next Step</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                <Plus size={16} />
                <span>
                  {isSubmitting
                    ? isEditMode
                      ? "Saving..."
                      : "Publishing..."
                    : isEditMode
                    ? "Save Changes"
                    : "Publish Rental Property"}
                </span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
