"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Building,
  MapPin,
  Clock,
  Calendar,
  Compass,
  Percent,
  UserCheck,
  Zap,
  CheckCircle2,
  RotateCcw,
  Home,
  Briefcase,
} from "lucide-react";
import { useSellLanguage } from "../LanguageContext";
import styles from "./SellerCTA.module.css";

interface SellingPathQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SellingPathQuizModal({
  isOpen,
  onClose,
}: SellingPathQuizModalProps) {
  const { t } = useSellLanguage();
  const quizT = t.cta.quiz;

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [subCity, setSubCity] = useState("Bole");
  const [specificArea, setSpecificArea] = useState("");
  const [propertyType, setPropertyType] = useState("apartment");
  const [timeline, setTimeline] = useState("standard"); // 'immediate' | 'standard' | 'flexible'
  const [priority, setPriority] = useState("service"); // 'proceeds' | 'service' | 'speed'

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setTimeline("standard");
    setPriority("service");
  };

  // Determine Recommendation
  // 1. If priority is speed or timeline is immediate without proceeds priority -> Express Cash / Investor
  // 2. If priority is proceeds -> FSBO
  // 3. Otherwise -> Verified Agent
  let recommendationType: "express" | "fsbo" | "agent" = "agent";
  if (priority === "speed" || (timeline === "immediate" && priority !== "proceeds")) {
    recommendationType = "express";
  } else if (priority === "proceeds") {
    recommendationType = "fsbo";
  } else {
    recommendationType = "agent";
  }

  const locationName = [subCity, specificArea.trim()].filter(Boolean).join(", ") || subCity;
  const locationQuery = [
    subCity ? `subCity=${encodeURIComponent(subCity)}` : "",
    specificArea.trim() ? `address=${encodeURIComponent(specificArea.trim())}` : "",
  ].filter(Boolean).join("&");

  const agentLink = locationQuery ? `/sell/agent?${locationQuery}` : "/sell/agent";
  const fsboLink = locationQuery ? `/sell/list?${locationQuery}` : "/sell/list";

  const progressPercent = (currentStep / 4) * 100;

  return (
    <div className={styles.quizBackdrop} onClick={onClose}>
      <div
        className={styles.quizModal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-modal-title"
      >
        {/* Header & Progress */}
        <div className={styles.quizHeader}>
          <div className={styles.quizHeaderTop}>
            <span className={styles.stepIndicator}>
              {quizT.stepIndicator.replace("{step}", currentStep.toString())}
            </span>
            <button
              type="button"
              className={styles.quizCloseBtn}
              onClick={onClose}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <div className={styles.progressBarWrapper}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Property Type & Location */}
        {currentStep === 1 && (
          <div className={styles.quizBody}>
            <div className={styles.stepTitleBox}>
              <h3 id="quiz-modal-title" className={styles.stepTitle}>
                {quizT.step1Title}
              </h3>
              <p className={styles.stepSubtitle}>{quizT.step1Subtitle}</p>
            </div>

            <div className={styles.stepForm}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  <Building size={16} aria-hidden="true" />
                  {quizT.subCityLabel}
                </label>
                <select
                  className={styles.selectField}
                  value={subCity}
                  onChange={(e) => setSubCity(e.target.value)}
                >
                  {t.fsbo.builder.subCities.map((item, idx) => (
                    <option key={idx} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  <MapPin size={16} aria-hidden="true" />
                  {quizT.areaLabel}
                </label>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder={quizT.areaPlaceholder}
                  value={specificArea}
                  onChange={(e) => setSpecificArea(e.target.value)}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  <Home size={16} aria-hidden="true" />
                  {quizT.typeLabel}
                </label>
                <div className={styles.typePillsGrid}>
                  {Object.entries(t.fsbo.builder.propertyTypes).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      className={`${styles.typePill} ${
                        propertyType === key ? styles.typePillActive : ""
                      }`}
                      onClick={() => setPropertyType(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.stepFooter}>
              <button
                type="button"
                className={styles.btnNext}
                onClick={handleNext}
              >
                <span>{quizT.btnNext}</span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Expected Timeline */}
        {currentStep === 2 && (
          <div className={styles.quizBody}>
            <div className={styles.stepTitleBox}>
              <h3 className={styles.stepTitle}>{quizT.step2Title}</h3>
              <p className={styles.stepSubtitle}>{quizT.step2Subtitle}</p>
            </div>

            <div className={styles.cardsStack}>
              <button
                type="button"
                className={`${styles.choiceCard} ${
                  timeline === "immediate" ? styles.choiceCardActive : ""
                }`}
                onClick={() => setTimeline("immediate")}
              >
                <div className={styles.choiceIconWrapper}>
                  <Zap size={22} />
                </div>
                <div className={styles.choiceText}>
                  <strong>{quizT.timeline1Title}</strong>
                  <span>{quizT.timeline1Desc}</span>
                </div>
              </button>

              <button
                type="button"
                className={`${styles.choiceCard} ${
                  timeline === "standard" ? styles.choiceCardActive : ""
                }`}
                onClick={() => setTimeline("standard")}
              >
                <div className={styles.choiceIconWrapper}>
                  <Calendar size={22} />
                </div>
                <div className={styles.choiceText}>
                  <strong>{quizT.timeline2Title}</strong>
                  <span>{quizT.timeline2Desc}</span>
                </div>
              </button>

              <button
                type="button"
                className={`${styles.choiceCard} ${
                  timeline === "flexible" ? styles.choiceCardActive : ""
                }`}
                onClick={() => setTimeline("flexible")}
              >
                <div className={styles.choiceIconWrapper}>
                  <Compass size={22} />
                </div>
                <div className={styles.choiceText}>
                  <strong>{quizT.timeline3Title}</strong>
                  <span>{quizT.timeline3Desc}</span>
                </div>
              </button>
            </div>

            <div className={styles.stepFooter}>
              <button
                type="button"
                className={styles.btnBack}
                onClick={handleBack}
              >
                <ArrowLeft size={18} aria-hidden="true" />
                <span>{quizT.btnBack}</span>
              </button>
              <button
                type="button"
                className={styles.btnNext}
                onClick={handleNext}
              >
                <span>{quizT.btnNext}</span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Priorities */}
        {currentStep === 3 && (
          <div className={styles.quizBody}>
            <div className={styles.stepTitleBox}>
              <h3 className={styles.stepTitle}>{quizT.step3Title}</h3>
              <p className={styles.stepSubtitle}>{quizT.step3Subtitle}</p>
            </div>

            <div className={styles.cardsStack}>
              <button
                type="button"
                className={`${styles.choiceCard} ${
                  priority === "proceeds" ? styles.choiceCardActive : ""
                }`}
                onClick={() => setPriority("proceeds")}
              >
                <div className={styles.choiceIconWrapper}>
                  <Percent size={22} />
                </div>
                <div className={styles.choiceText}>
                  <strong>{quizT.priority1Title}</strong>
                  <span>{quizT.priority1Desc}</span>
                </div>
              </button>

              <button
                type="button"
                className={`${styles.choiceCard} ${
                  priority === "service" ? styles.choiceCardActive : ""
                }`}
                onClick={() => setPriority("service")}
              >
                <div className={styles.choiceIconWrapper}>
                  <UserCheck size={22} />
                </div>
                <div className={styles.choiceText}>
                  <strong>{quizT.priority2Title}</strong>
                  <span>{quizT.priority2Desc}</span>
                </div>
              </button>

              <button
                type="button"
                className={`${styles.choiceCard} ${
                  priority === "speed" ? styles.choiceCardActive : ""
                }`}
                onClick={() => setPriority("speed")}
              >
                <div className={styles.choiceIconWrapper}>
                  <Clock size={22} />
                </div>
                <div className={styles.choiceText}>
                  <strong>{quizT.priority3Title}</strong>
                  <span>{quizT.priority3Desc}</span>
                </div>
              </button>
            </div>

            <div className={styles.stepFooter}>
              <button
                type="button"
                className={styles.btnBack}
                onClick={handleBack}
              >
                <ArrowLeft size={18} aria-hidden="true" />
                <span>{quizT.btnBack}</span>
              </button>
              <button
                type="button"
                className={styles.btnNext}
                onClick={handleNext}
              >
                <span>{quizT.btnSeeResult}</span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Result & Recommendation */}
        {currentStep === 4 && (
          <div className={styles.quizBody}>
            <div className={styles.recommendationContainer}>
              <span className={styles.recommendationTag}>
                <CheckCircle2 size={15} aria-hidden="true" />
                {quizT.resultTag}
              </span>

              {/* Case 1: Agent Match */}
              {recommendationType === "agent" && (
                <div className={styles.recommendationCard}>
                  <div className={styles.recommendationHeader}>
                    <div className={styles.recIconAgent}>
                      <UserCheck size={28} />
                    </div>
                    <div>
                      <h4 className={styles.recommendationTitle}>
                        {quizT.agentMatchTitle}
                      </h4>
                      <p className={styles.recommendationDesc}>
                        {quizT.agentMatchDesc.replace("{location}", locationName)}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={agentLink}
                    className={styles.recPrimaryBtn}
                    onClick={onClose}
                  >
                    <span>
                      {quizT.agentMatchBtn.replace("{location}", locationName)}
                    </span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </div>
              )}

              {/* Case 2: FSBO Match */}
              {recommendationType === "fsbo" && (
                <div className={`${styles.recommendationCard} ${styles.recCardFsbo}`}>
                  <div className={styles.recommendationHeader}>
                    <div className={styles.recIconFsbo}>
                      <Home size={28} />
                    </div>
                    <div>
                      <h4 className={styles.recommendationTitle}>
                        {quizT.fsboMatchTitle}
                      </h4>
                      <p className={styles.recommendationDesc}>
                        {quizT.fsboMatchDesc}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={fsboLink}
                    className={`${styles.recPrimaryBtn} ${styles.recBtnFsbo}`}
                    onClick={onClose}
                  >
                    <span>{quizT.fsboMatchBtn}</span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </div>
              )}

              {/* Case 3: Express Investor Cash Sale */}
              {recommendationType === "express" && (
                <div className={`${styles.recommendationCard} ${styles.recCardExpress}`}>
                  <div className={styles.recommendationHeader}>
                    <div className={styles.recIconExpress}>
                      <Zap size={28} />
                    </div>
                    <div>
                      <h4 className={styles.recommendationTitle}>
                        {quizT.expressMatchTitle}
                      </h4>
                      <p className={styles.recommendationDesc}>
                        {quizT.expressMatchDesc}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/sell/agent?specialty=listing-agent&priority=express&${locationQuery}`}
                    className={`${styles.recPrimaryBtn} ${styles.recBtnExpress}`}
                    onClick={onClose}
                  >
                    <span>{quizT.expressMatchBtn}</span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </div>
              )}

              {/* Secondary Alternatives & Retake */}
              <div className={styles.recAlternatives}>
                <span className={styles.altLabel}>{quizT.otherOptions}</span>
                <div className={styles.altLinks}>
                  <Link
                    href={fsboLink}
                    className={styles.altLink}
                    onClick={onClose}
                  >
                    <Home size={15} />
                    <span>{t.cta.btnListDirect}</span>
                  </Link>
                  <span className={styles.altDivider}>•</span>
                  <Link
                    href={agentLink}
                    className={styles.altLink}
                    onClick={onClose}
                  >
                    <Briefcase size={15} />
                    <span>{t.cta.btnAgentDirect}</span>
                  </Link>
                </div>
              </div>

              <div className={styles.retakeWrapper}>
                <button
                  type="button"
                  className={styles.btnRetake}
                  onClick={handleReset}
                >
                  <RotateCcw size={15} />
                  <span>{quizT.btnRetake}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SellingPathQuizModal;
