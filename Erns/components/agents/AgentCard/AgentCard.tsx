"use client";

import React from "react";
import { Star, ShieldCheck, Phone, Mail, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { agentTranslations } from "../translations";
import { Agent } from "../types";
import styles from "./AgentCard.module.css";

interface AgentCardProps {
  agent: Agent;
  onContactClick: (agent: Agent) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onContactClick }) => {
  const { isAmharic } = useLanguage();
  const t = agentTranslations[isAmharic ? "am" : "en"].card;

  const displayName = isAmharic ? agent.nameAm : agent.name;
  const displayAgency = isAmharic ? agent.agencyAm : agent.agency;
  const displayBio = isAmharic ? agent.bioAm : agent.bio;
  const displaySubCities = isAmharic ? agent.subCitiesAm.join(", ") : agent.subCities.join(", ");
  const reviewComment = isAmharic ? agent.recentReview.commentAm : agent.recentReview.comment;

  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <div className={styles.avatarWrapper}>
          <img src={agent.photoUrl} alt={displayName} className={styles.avatarImg} />
        </div>

        <div className={styles.agentInfo}>
          <div className={styles.nameRow}>
            <h3 className={styles.name}>{displayName}</h3>
            {agent.isVerified && (
              <span className={styles.verifiedBadge}>
                <CheckCircle2 size={14} />
                <span>{t.verifiedBadge}</span>
              </span>
            )}
          </div>

          <p className={styles.agency}>{displayAgency}</p>

          <div className={styles.ratingRow}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.floor(agent.rating) ? "#f59e0b" : "none"}
                />
              ))}
            </div>
            <span className={styles.ratingNumber}>{agent.rating.toFixed(1)}</span>
            <span className={styles.reviewCount}>
              ({agent.reviewCount} {t.reviews})
            </span>
          </div>
        </div>

        <div className={styles.actionsTop}>
          <button
            type="button"
            className={styles.contactBtn}
            onClick={() => onContactClick(agent)}
          >
            <Mail size={16} />
            <span>{t.btnContact}</span>
          </button>
          <a href={`tel:+251${agent.phone}`} className={styles.callBtn}>
            <Phone size={16} />
            <span>{t.btnCall}</span>
          </a>
        </div>
      </div>

      {/* 4-Category Ratings (Zillow Signature) */}
      <div className={styles.categoriesGrid}>
        <div className={styles.categoryItem}>
          <span className={styles.categoryLabel}>{t.categories.localKnowledge}</span>
          <span className={styles.categoryScore}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            {agent.categoryRatings.localKnowledge.toFixed(1)}
          </span>
        </div>

        <div className={styles.categoryItem}>
          <span className={styles.categoryLabel}>{t.categories.processExpertise}</span>
          <span className={styles.categoryScore}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            {agent.categoryRatings.processExpertise.toFixed(1)}
          </span>
        </div>

        <div className={styles.categoryItem}>
          <span className={styles.categoryLabel}>{t.categories.responsiveness}</span>
          <span className={styles.categoryScore}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            {agent.categoryRatings.responsiveness.toFixed(1)}
          </span>
        </div>

        <div className={styles.categoryItem}>
          <span className={styles.categoryLabel}>{t.categories.negotiationSkills}</span>
          <span className={styles.categoryScore}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            {agent.categoryRatings.negotiationSkills.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Performance Stats Ribbon */}
      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{agent.salesCountLast12Months}</span>
          <span className={styles.statLabel}>{t.stats.sales}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{agent.activeListingsCount}</span>
          <span className={styles.statLabel}>{t.stats.listings}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>
            {agent.priceRangeETB.min} - {agent.priceRangeETB.max} ETB
          </span>
          <span className={styles.statLabel}>{t.stats.priceRange}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{displaySubCities}</span>
          <span className={styles.statLabel}>{t.stats.areas}</span>
        </div>
      </div>

      <p className={styles.bio}>{displayBio}</p>

      {/* Recent Client Review Snippet */}
      <div className={styles.reviewSnippet}>
        <p className={styles.reviewQuote}>“{reviewComment}”</p>
        <span className={styles.reviewMeta}>
          — {agent.recentReview.author} ({agent.recentReview.subCity}) •{" "}
          {agent.recentReview.date}
        </span>
      </div>
    </div>
  );
};

export default AgentCard;
