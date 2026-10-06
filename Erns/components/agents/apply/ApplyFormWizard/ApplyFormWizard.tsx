"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  UploadCloud,
  FileCheck2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Star,
  Sparkles,
  Home,
  Check,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { applyTranslations } from "../applyTranslations";
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
  const { isAmharic } = useLanguage();
  const t = applyTranslations[isAmharic ? "am" : "en"].wizard;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");

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
    attachedFileName: "",
    bio: "",
    website: "",
    agreedToTerms: false,
  });

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

  const handleSimulatedFileUpload = () => {
    const sampleFiles = [
      "ethiopia_trade_license_2026.pdf",
      "national_id_verified.pdf",
      "broker_tin_certificate.pdf",
    ];
    const randomFile = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
    handleTextChange("attachedFileName", randomFile);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedRef = `ERN-AG-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      setReferenceId(generatedRef);
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: document.getElementById("agent-application-wizard")?.offsetTop ?? 0, behavior: "smooth" });
    }, 1200);
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
                      <div
                        className={styles.dropzone}
                        onClick={handleSimulatedFileUpload}
                      >
                        <UploadCloud size={32} className={styles.dropzoneIcon} />
                        <span className={styles.dropzoneText}>
                          {formData.attachedFileName
                            ? formData.attachedFileName
                            : t.step3.uploadHint}
                        </span>
                        <span className={styles.dropzoneHint}>
                          Supports PDF, JPG, PNG (Max 10MB)
                        </span>
                        {formData.attachedFileName && (
                          <div className={styles.fileBadge}>
                            <FileCheck2 size={16} />
                            <span>
                              {t.step3.uploadSelected} {formData.attachedFileName}
                            </span>
                          </div>
                        )}
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
                        <Sparkles size={16} />
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
    </section>
  );
};

export default ApplyFormWizard;
