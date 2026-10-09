"use client";

import React, { useEffect } from "react";
import {
  X,
  Star,
  CheckCircle2,
  Phone,
  Mail,
  Award,
  TrendingUp,
  MapPin,
  Languages,
  MessageSquareQuote,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { agentTranslations } from "../translations";
import { Agent } from "../types";
import styles from "./AgentDetailModal.module.css";

interface AgentDetailModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  onContactClick: (agent: Agent) => void;
}

export const AgentDetailModal: React.FC<AgentDetailModalProps> = ({
  agent,
  isOpen,
  onClose,
  onContactClick,
}) => {
  const { isAmharic } = useLanguage();
  const t = agentTranslations[isAmharic ? "am" : "en"].detailModal;
  const cardT = agentTranslations[isAmharic ? "am" : "en"].card;

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !agent) return null;

  const displayName = isAmharic ? agent.nameAm : agent.name;
  const displayAgency = isAmharic ? agent.agencyAm : agent.agency;
  const displayBio = isAmharic ? agent.bioAm : agent.bio;
  const displaySubCities = isAmharic ? agent.subCitiesAm : agent.subCities;
  const displayLanguages = isAmharic ? agent.languagesAm : agent.languages;
  const reviewComment = isAmharic
    ? agent.recentReview.commentAm
    : agent.recentReview.comment;

  const categoryScores = [
    {
      label: cardT.categories.localKnowledge,
      score: agent.categoryRatings.localKnowledge,
    },
    {
      label: cardT.categories.processExpertise,
      score: agent.categoryRatings.processExpertise,
    },
    {
      label: cardT.categories.responsiveness,
      score: agent.categoryRatings.responsiveness,
    },
    {
      label: cardT.categories.negotiationSkills,
      score: agent.categoryRatings.negotiationSkills,
    },
  ];

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="agent-modal-title"
    >
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 id="agent-modal-title" className={styles.modalHeaderTitle}>
            {t.title}
          </h2>
          <button
            type="button"
            className={styles.modalCloseBtn}
            onClick={onClose}
            aria-label={t.btnClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className={styles.modalBody}>
          {/* Agent Top Profile */}
          <div className={styles.agentHero}>
            <div className={styles.avatarWrapper}>
              <img
                src={agent.photoUrl}
                alt={displayName}
                className={styles.avatarImg}
              />
            </div>

            <div className={styles.heroInfo}>
              <div className={styles.nameRow}>
                <h3 className={styles.agentName}>{displayName}</h3>
                {agent.isVerified && (
                  <span className={styles.verifiedBadge}>
                    <CheckCircle2 size={13} />
                    <span>{cardT.verifiedBadge}</span>
                  </span>
                )}
              </div>

              <p className={styles.agencyTitle}>{displayAgency}</p>

              <div className={styles.ratingRow}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill={i < Math.floor(agent.rating) ? "#f59e0b" : "none"}
                      color="#f59e0b"
                    />
                  ))}
                </div>
                <span className={styles.ratingScore}>
                  {agent.rating.toFixed(1)}
                </span>
                <span className={styles.reviewsCount}>
                  ({agent.reviewCount} {cardT.reviews})
                </span>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              <Award size={18} color="var(--color-primary)" />
              {t.aboutTitle}
            </h4>
            <p className={styles.bioText}>{displayBio}</p>
          </div>

          {/* 4-Category Ratings Breakdown */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              <Star size={18} color="#f59e0b" fill="#f59e0b" />
              {t.ratingsTitle}
            </h4>
            <div className={styles.ratingsCard}>
              {categoryScores.map((cat, idx) => {
                const percent = Math.min(100, (cat.score / 5) * 100);
                return (
                  <div key={idx} className={styles.ratingItem}>
                    <div className={styles.ratingHeader}>
                      <span className={styles.ratingLabel}>{cat.label}</span>
                      <span className={styles.ratingVal}>
                        <Star size={12} fill="#f59e0b" color="#f59e0b" />
                        {cat.score.toFixed(1)}
                      </span>
                    </div>
                    <div className={styles.progressBarBg}>
                      <div
                        className={styles.progressBarFill}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Stats */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              <TrendingUp size={18} color="var(--color-primary)" />
              {t.performanceTitle}
            </h4>
            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <span className={styles.statNum}>
                  {agent.salesCountLast12Months}
                </span>
                <span className={styles.statLabel}>{cardT.stats.sales}</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>
                  {agent.activeListingsCount}
                </span>
                <span className={styles.statLabel}>{cardT.stats.listings}</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>
                  {agent.priceRangeETB.min} - {agent.priceRangeETB.max}
                </span>
                <span className={styles.statLabel}>ETB ({cardT.stats.priceRange})</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statNum}>
                  {agent.reviewCount}
                </span>
                <span className={styles.statLabel}>
                  {cardT.reviews}
                </span>
              </div>
            </div>
          </div>

          {/* Sub-Cities Served */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              <MapPin size={18} color="var(--color-primary)" />
              {t.areasTitle}
            </h4>
            <div className={styles.tagsRow}>
              {displaySubCities.map((area, idx) => (
                <span key={idx} className={styles.tagPill}>
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Languages Spoken */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              <Languages size={18} color="var(--color-primary)" />
              {t.languagesTitle}
            </h4>
            <div className={styles.tagsRow}>
              {displayLanguages.map((lang, idx) => (
                <span key={idx} className={styles.tagPill}>
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Recent Client Review Quote */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              <MessageSquareQuote size={18} color="var(--color-primary)" />
              {t.reviewTitle}
            </h4>
            <div className={styles.reviewBox}>
              <p className={styles.reviewQuote}>“{reviewComment}”</p>
              <span className={styles.reviewMeta}>
                — {agent.recentReview.author} ({agent.recentReview.subCity}) •{" "}
                {agent.recentReview.date}
              </span>
            </div>
          </div>
        </div>

        {/* Sticky Actions Footer */}
        <div className={styles.modalFooter}>
          <a
            href={`tel:+251${agent.phone}`}
            className={styles.callBtn}
            aria-label={`${t.btnCall} ${displayName}`}
          >
            <Phone size={16} />
            <span>{t.btnCall}</span>
          </a>

          <button
            type="button"
            className={styles.contactBtn}
            onClick={() => {
              onClose();
              onContactClick(agent);
            }}
          >
            <Mail size={16} />
            <span>{t.btnContact}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailModal;
