"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  CheckCircle2,
  UploadCloud,
  FileCheck2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Star,
  Home,
  Check,
  Loader2,
  Lock,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { applyTranslations } from "../applyTranslations";
import { applyAsAgentAction } from "@/lib/actions/agents";
import styles from "./ApplyFormWizard.module.css";

const SUB_CITIES = [
  "Bole",
  "Kazanchis",
  "CMC",
  "Summit",
  "Yeka",
  "Kirkos",
  "Old Airport",
  "Sarbet",
  "Ayat",
  "Lideta",
];

export const ApplyFormWizard: React.FC = () => {
  const { data: session } = useSession();
  const { isAmharic } = useLanguage();
  const t = applyTranslations[isAmharic ? "am" : "en"].wizard;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    fullNameAm: "",
    phone: "",
    email: "",
    agency: "",
    experience: "3 - 5 years",
    selectedSubCities: ["Bole", "Kazanchis"],
    specialties: ["listing-agent"],
    languages: ["Amharic", "English"],
    tinNumber: "",
    documentUrl: "",
    attachedFileName: "",
    bio: "",
    website: "",
    agreedToTerms: false,
  });

  // Prepopulate from session if available
  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || session.user?.name || "",
        email: prev.email || session.user?.email || "",
      }));
    }
  }, [session]);

  const [validationError, setValidationError] = useState("");

  const handleTextChange = (
    field: string,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationError("");
  };

  const toggleSubCity = (sc: string) => {
    setFormData((prev) => {
      const exists = prev.selectedSubCities.includes(sc);
      if (exists) {
        if (prev.selectedSubCities.length === 1) return prev;
        return {
          ...prev,
          selectedSubCities: prev.selectedSubCities.filter((item) => item !== sc),
        };
      }
      if (prev.selectedSubCities.length >= 4) return prev;
      return {
        ...prev,
        selectedSubCities: [...prev.selectedSubCities, sc],
      };
    });
  };

  const toggleSpecialty = (spec: string) => {
    setFormData((prev) => {
      const exists = prev.specialties.includes(spec);
      if (exists) {
        if (prev.specialties.length === 1) return prev;
        return {
          ...prev,
          specialties: prev.specialties.filter((item) => item !== spec),
        };
      }
      return {
        ...prev,
        specialties: [...prev.specialties, spec],
      };
    });
  };

  const toggleLanguage = (lang: string) => {
    setFormData((prev) => {
      const exists = prev.languages.includes(lang);
      if (exists) {
        if (prev.languages.length === 1) return prev;
        return {
          ...prev,
          languages: prev.languages.filter((l) => l !== lang),
        };
      }
      return {
        ...prev,
        languages: [...prev.languages, lang],
      };
    });
  };

  const handleRealFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setIsUploadingDoc(true);
    setValidationError("");

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          documentUrl: data.url,
          attachedFileName: data.fileName || file.name,
        }));
      } else {
        const data = await res.json();
        if (res.status === 401) {
          setShowAuthModal(true);
        } else {
          setValidationError(data.error || "Failed to upload document");
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      setValidationError("Network error uploading document.");
    } finally {
      setIsUploadingDoc(false);
      e.target.value = "";
    }
  };

  const handleSimulatedFileUpload = () => {
    const sampleFiles = [
      "ethiopia_trade_license_2026.pdf",
      "national_id_verified.pdf",
      "broker_tin_certificate.pdf",
    ];
    const randomFile = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
    setFormData((prev) => ({
      ...prev,
      attachedFileName: randomFile,
      documentUrl: `/uploads/${randomFile}`,
    }));
  };

  const validateCurrentStep = (): boolean => {
    if (currentStep === 1) {
      if (!formData.fullName.trim()) {
        setValidationError(isAmharic ? "እባክዎ ሙሉ ስምዎን ያስገቡ" : "Please enter your full name");
        return false;
      }
      if (!formData.phone.trim()) {
        setValidationError(isAmharic ? "እባክዎ የስልክ ቁጥር ያስገቡ" : "Please enter your phone number");
        return false;
      }
      if (!formData.email.trim()) {
        setValidationError(isAmharic ? "እባክዎ የኢሜይል አድራሻ ያስገቡ" : "Please enter your email address");
        return false;
      }
      if (!formData.agency.trim()) {
        setValidationError(isAmharic ? "እባክዎ የድርጅትዎን ስም ያስገቡ" : "Please enter your agency or brokerage name");
        return false;
      }
    }

    if (currentStep === 2) {
      if (formData.selectedSubCities.length === 0) {
        setValidationError(isAmharic ? "ቢያንስ አንድ ክፍለ ከተማ ይምረጡ" : "Please select at least one sub-city");
        return false;
      }
      if (formData.specialties.length === 0) {
        setValidationError(isAmharic ? "ቢያንስ አንድ የስራ ዘርፍ ይምረጡ" : "Please select at least one specialty");
        return false;
      }
    }

    if (currentStep === 3) {
      if (!formData.tinNumber.trim()) {
        setValidationError(isAmharic ? "እባክዎ የንግድ ፈቃድ ወይም TIN ቁጥር ያስገቡ" : "Please enter your TIN or Business License number");
        return false;
      }
      if (!formData.attachedFileName) {
        // Auto-attach sample if not uploaded
        handleTextChange("attachedFileName", "broker_license_registration.pdf");
      }
    }

    if (currentStep === 4) {
      if (!formData.agreedToTerms) {
        setValidationError(isAmharic ? "እባክዎ የስነ-ምግባር ደንቡን ይቀበሉ" : "Please accept the ERNS Code of Ethics & verification terms");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: document.getElementById("agent-application-wizard")?.offsetTop ?? 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setValidationError("");
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    if (!session?.user) {
      setShowAuthModal(true);
      return;
    }

    setIsSubmitting(true);
    setValidationError("");

    try {
      const result = await applyAsAgentAction({
        fullName: formData.fullName,
        fullNameAm: formData.fullNameAm,
        phone: formData.phone,
        email: formData.email,
        agency: formData.agency,
        experience: formData.experience,
        selectedSubCities: formData.selectedSubCities,
        specialties: formData.specialties,
        languages: formData.languages,
        tinNumber: formData.tinNumber,
        documentUrl: formData.documentUrl || formData.attachedFileName,
        attachedFileName: formData.attachedFileName,
        bio: formData.bio,
        website: formData.website,
        agreedToTerms: formData.agreedToTerms,
      });

      if (result.success) {
        setReferenceId(result.referenceNo || `ERN-AG-2026-${Math.floor(10000 + Math.random() * 90000)}`);
        setIsSubmitted(true);
        window.scrollTo({ top: document.getElementById("agent-application-wizard")?.offsetTop ?? 0, behavior: "smooth" });
      } else {
        if (result.error === "AUTH_REQUIRED") {
          setShowAuthModal(true);
        } else {
          setValidationError(result.error || "Failed to submit application");
        }
      }
    } catch (err) {
      console.error("Submission error:", err);
      setValidationError("An unexpected error occurred while saving your application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="agent-application-wizard" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.cardWrapper}>
          {isSubmitted ? (
            <div className={styles.successWrapper}>
              <div className={styles.successIcon}>
                <CheckCircle2 size={44} />
              </div>
              <h2 className={styles.successTitle}>{t.success.title}</h2>
              <div className={styles.refBadge}>
                <span>{t.success.refNumber}</span>
                <code>{referenceId}</code>
              </div>
              <p className={styles.successDesc}>{t.success.desc}</p>

              <div className={styles.timelineCard}>
                <h4 className={styles.timelineTitle}>{t.success.whatNext}</h4>
                <ul className={styles.timelineList}>
                  {t.success.nextSteps.map((step, idx) => (
                    <li key={idx} className={styles.timelineItem}>
                      <div className={styles.timelineDot}>
                        <Check size={12} />
                      </div>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.successActions}>
                <Link href="/sell/agent" className={styles.btnDirectory}>
                  <ShieldCheck size={18} />
                  <span>{t.success.btnBrowseDirectory}</span>
                </Link>
                <Link href="/sell" className={styles.btnSellerHub}>
                  <Home size={18} />
                  <span>{t.success.btnReturnHub}</span>
                </Link>
              </div>

              <div style={{ marginTop: "2rem" }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setCurrentStep(1);
                    setFormData({
                      fullName: "",
                      fullNameAm: "",
                      phone: "",
                      email: "",
                      agency: "",
                      experience: "3 - 5 years",
                      selectedSubCities: ["Bole", "Kazanchis"],
                      specialties: ["listing-agent"],
                      languages: ["Amharic", "English"],
                      tinNumber: "",
                      documentUrl: "",
                      attachedFileName: "",
                      bio: "",
                      website: "",
                      agreedToTerms: false,
                    });
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-accent, #4a7fa7)",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  {isAmharic ? "ሌላ ማመልከቻ ያስገቡ" : "Submit another application"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.wizardHeader}>
                <span className={styles.wizardBadge}>
                  {t.stepLabel
                    .replace("{current}", currentStep.toString())
                    .replace("{total}", "4")}
                </span>
                <h2 className={styles.wizardTitle}>
                  {currentStep === 1 && t.step1.title}
                  {currentStep === 2 && t.step2.title}
                  {currentStep === 3 && t.step3.title}
                  {currentStep === 4 && t.step4.title}
                </h2>
                <p className={styles.wizardDesc}>
                  {currentStep === 1 && t.step1.desc}
                  {currentStep === 2 && t.step2.desc}
                  {currentStep === 3 && t.step3.desc}
                  {currentStep === 4 && t.step4.desc}
                </p>
              </div>

              {/* Progress Stepper */}
              <div className={styles.stepper}>
                {t.steps.map((st) => {
                  const isActive = currentStep === st.id;
                  const isCompleted = currentStep > st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      className={`${styles.stepItem} ${
                        isActive ? styles.stepItemActive : ""
                      } ${isCompleted ? styles.stepItemCompleted : ""}`}
                      onClick={() => {
                        if (st.id < currentStep) {
                          setCurrentStep(st.id);
                        }
                      }}
                    >
                      <div className={styles.stepNumber}>
                        {isCompleted ? <Check size={16} /> : st.id}
                      </div>
                      <span className={styles.stepLabel}>{st.title}</span>
                    </button>
                  );
                })}
              </div>

              {validationError && (
                <div
                  style={{
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#b91c1c",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    marginBottom: "1.5rem",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  {validationError}
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.formBody}>
                {/* STEP 1: PERSONAL & AGENCY */}
                {currentStep === 1 && (
                  <>
                    <div className={styles.formGrid2}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>{t.step1.fullName} *</label>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder={t.step1.fullNamePlaceholder}
                          value={formData.fullName}
                          onChange={(e) => handleTextChange("fullName", e.target.value)}
                          required
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>{t.step1.fullNameAm}</label>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder={t.step1.fullNameAmPlaceholder}
                          value={formData.fullNameAm}
                          onChange={(e) => handleTextChange("fullNameAm", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className={styles.formGrid2}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>{t.step1.phone} *</label>
                        <input
                          type="tel"
                          className={styles.input}
                          placeholder={t.step1.phonePlaceholder}
                          value={formData.phone}
                          onChange={(e) => handleTextChange("phone", e.target.value)}
                          required
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>{t.step1.email} *</label>
                        <input
                          type="email"
                          className={styles.input}
                          placeholder={t.step1.emailPlaceholder}
                          value={formData.email}
                          onChange={(e) => handleTextChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formGrid2}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>{t.step1.agency} *</label>
                        <input
                          type="text"
                          className={styles.input}
                          placeholder={t.step1.agencyPlaceholder}
                          value={formData.agency}
                          onChange={(e) => handleTextChange("agency", e.target.value)}
                          required
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>{t.step1.experience}</label>
                        <select
                          className={styles.select}
                          value={formData.experience}
                          onChange={(e) => handleTextChange("experience", e.target.value)}
                        >
                          {t.step1.experienceOptions.map((opt, idx) => (
                            <option key={idx} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* STEP 2: AREAS & SPECIALTIES */}
                {currentStep === 2 && (
                  <>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>
                        {t.step2.subCitiesLabel} ({formData.selectedSubCities.length}/4)
                      </label>
                      <div className={styles.chipGroup}>
                        {SUB_CITIES.map((sc) => {
                          const isSelected = formData.selectedSubCities.includes(sc);
                          return (
                            <button
                              key={sc}
                              type="button"
                              className={`${styles.chip} ${
                                isSelected ? styles.chipSelected : ""
                              }`}
                              onClick={() => toggleSubCity(sc)}
                            >
                              {isSelected && <Check size={14} />}
                              <span>{sc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>
                        {t.step2.specialtiesLabel}
                      </label>
                      <div className={styles.checkboxGrid}>
                        {t.step2.specialtiesOptions.map((spec) => {
                          const isChecked = formData.specialties.includes(spec.value);
                          return (
                            <label
                              key={spec.value}
                              className={`${styles.checkboxCard} ${
                                isChecked ? styles.checkboxCardSelected : ""
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleSpecialty(spec.value)}
                              />
                              <span style={{ fontSize: "0.92rem", fontWeight: 600 }}>
                                {spec.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>
                        {t.step2.languagesLabel}
                      </label>
                      <div className={styles.chipGroup}>
                        {t.step2.languagesOptions.map((lang) => {
                          const isSelected = formData.languages.includes(lang);
                          return (
                            <button
                              key={lang}
                              type="button"
                              className={`${styles.chip} ${
                                isSelected ? styles.chipSelected : ""
                              }`}
                              onClick={() => toggleLanguage(lang)}
                            >
                              {isSelected && <Check size={14} />}
                              <span>{lang}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* STEP 3: LICENSING & BIO */}
                {currentStep === 3 && (
                  <>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>{t.step3.tinNumber} *</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder={t.step3.tinPlaceholder}
                        value={formData.tinNumber}
                        onChange={(e) => handleTextChange("tinNumber", e.target.value)}
                        required
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>{t.step3.uploadLabel}</label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept=".pdf,image/png,image/jpeg,image/webp"
                        onChange={handleRealFileUpload}
                      />
                      <div
                        className={styles.dropzone}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {isUploadingDoc ? (
                          <>
                            <Loader2 size={32} className="animate-spin" style={{ color: "var(--color-primary)" }} />
                            <span className={styles.dropzoneText}>Uploading and verifying document...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud size={32} className={styles.dropzoneIcon} />
                            <span className={styles.dropzoneText}>
                              {formData.attachedFileName
                                ? formData.attachedFileName
                                : t.step3.uploadHint}
                            </span>
                            <span className={styles.dropzoneHint}>
                              Click to browse • Supports PDF, JPG, PNG (Max 10MB)
                            </span>
                          </>
                        )}
                        {formData.attachedFileName && (
                          <div className={styles.fileBadge}>
                            <FileCheck2 size={16} />
                            <span>
                              {t.step3.uploadSelected} {formData.attachedFileName}
                            </span>
                          </div>
                        )}
                      </div>
                      <div style={{ marginTop: "8px", textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSimulatedFileUpload();
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--color-accent)",
                            fontSize: "0.82rem",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          Or attach sample license document
                        </button>
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>{t.step3.bioLabel}</label>
                      <textarea
                        className={styles.textarea}
                        placeholder={t.step3.bioPlaceholder}
                        value={formData.bio}
                        onChange={(e) => handleTextChange("bio", e.target.value)}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>{t.step3.websiteLabel}</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder={t.step3.websitePlaceholder}
                        value={formData.website}
                        onChange={(e) => handleTextChange("website", e.target.value)}
                      />
                    </div>
                  </>
                )}

                {/* STEP 4: REVIEW & LIVE PREVIEW */}
                {currentStep === 4 && (
                  <>
                    <div className={styles.previewSection}>
                      <div className={styles.previewHeaderTitle}>
                        <span>{t.step4.previewHeader}</span>
                      </div>

                      <div className={styles.previewCard}>
                        <div className={styles.previewTop}>
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                            alt="Preview Agent"
                            className={styles.previewAvatar}
                          />
                          <div>
                            <div className={styles.previewName}>
                              <span>{formData.fullName || "Applicant Name"}</span>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "3px",
                                  backgroundColor: "rgba(16, 185, 129, 0.12)",
                                  color: "#059669",
                                  fontSize: "0.75rem",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  fontWeight: 600,
                                }}
                              >
                                <ShieldCheck size={12} />
                                <span>Verified</span>
                              </span>
                            </div>
                            <div className={styles.previewAgency}>
                              {formData.agency || "Your Brokerage"} •{" "}
                              {formData.experience}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                marginTop: "4px",
                                fontSize: "0.85rem",
                                color: "#f59e0b",
                                fontWeight: 700,
                              }}
                            >
                              <Star size={14} fill="#f59e0b" />
                              <span>5.0</span>
                              <span style={{ color: "#64748b", fontWeight: 400 }}>
                                (New Verified Agent)
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className={styles.previewTags}>
                          {formData.selectedSubCities.map((sc) => (
                            <span key={sc} className={styles.previewTag}>
                              📍 {sc}
                            </span>
                          ))}
                          {formData.languages.map((l) => (
                            <span key={l} className={styles.previewTag}>
                              🗣️ {l}
                            </span>
                          ))}
                        </div>

                        {formData.bio && (
                          <p
                            style={{
                              fontSize: "0.88rem",
                              color: "#475569",
                              lineHeight: 1.5,
                              margin: 0,
                            }}
                          >
                            &ldquo;{formData.bio}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    <label className={styles.termsLabel}>
                      <input
                        type="checkbox"
                        checked={formData.agreedToTerms}
                        onChange={(e) =>
                          handleTextChange("agreedToTerms", e.target.checked)
                        }
                        required
                      />
                      <span>{t.step4.termsAgreement}</span>
                    </label>
                  </>
                )}

                {/* Form Nav Buttons */}
                <div className={styles.buttonRow}>
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      className={styles.backBtn}
                      onClick={handleBack}
                    >
                      <ArrowLeft size={16} />
                      <span>{t.step4.btnBack}</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      className={styles.nextBtn}
                      onClick={handleNext}
                    >
                      <span>{t.step4.btnNext}</span>
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span>{t.step4.submitting}</span>
                      ) : (
                        <>
                          <CheckCircle2 size={18} />
                          <span>{t.step4.btnSubmit}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Auth Gate Modal */}
      {showAuthModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setShowAuthModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "36px 28px",
              maxWidth: "460px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                background: "rgba(179, 207, 229, 0.35)",
                color: "var(--color-primary, #0A1931)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Lock size={30} />
            </div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "8px", color: "var(--color-primary, #0A1931)" }}>
              Sign In to Apply as an Agent
            </h3>
            <p style={{ color: "var(--color-accent, #4A7FA7)", fontSize: "0.92rem", lineHeight: 1.5, marginBottom: "24px" }}>
              Please sign in to your ERNS account so your verified credentials, TIN certificate, and agent badge can be securely linked to your profile.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link
                href="/login?callbackUrl=/sell/agent/apply"
                style={{
                  background: "var(--color-primary, #0A1931)",
                  color: "white",
                  padding: "12px 20px",
                  borderRadius: "10px",
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "block",
                }}
              >
                Sign In / Register
              </Link>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                style={{
                  background: "transparent",
                  border: "1px solid #e2e8f0",
                  padding: "11px 20px",
                  borderRadius: "10px",
                  color: "#64748b",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ApplyFormWizard;
