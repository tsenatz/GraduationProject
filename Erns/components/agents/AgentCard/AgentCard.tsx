"use client";

import React from "react";
import { Star, MapPin, Phone, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { agentTranslations } from "../translations";
import { Agent } from "../types";
import styles from "./AgentCard.module.css";

interface AgentCardProps {
  agent: Agent;
  onContactClick: (agent: Agent) => void;
  onViewProfileClick: (agent: Agent) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  onContactClick,
  onViewProfileClick,
}) => {
  const { isAmharic } = useLanguage();
  const t = agentTranslations[isAmharic ? "am" : "en"].card;

  const displayName = isAmharic ? agent.nameAm : agent.name;
  const displayAgency = isAmharic ? agent.agencyAm : agent.agency;
  const subCitiesList = isAmharic ? agent.subCitiesAm : agent.subCities;
  const primaryLocation = subCitiesList.length > 0 ? `${subCitiesList[0]}, Addis Ababa` : "Addis Ababa, ET";

  // Build tags combining sub-cities & specialty
  const allTags = [...subCitiesList];
  const visibleTags = allTags.slice(0, 3);
  const remainingCount = allTags.length - visibleTags.length;

  return (
    <div className={styles.card}>
      {/* 1. Header: Avatar + Name & Agency */}
      <div className={styles.headerRow}>
        <div className={styles.avatarWrapper}>
          <img src={agent.photoUrl} alt={displayName} className={styles.avatarImg} />
          {agent.isVerified && (
            <span className={styles.avatarVerifiedIcon} title={t.verifiedBadge}>
              <CheckCircle2 size={13} />
            </span>
          )}
        </div>

        <div className={styles.headerInfo}>
          <div className={styles.nameRow}>
            <h3 className={styles.name}>{displayName}</h3>
          </div>
          <p className={styles.agency}>{displayAgency}</p>
        </div>
      </div>

      {/* 2. Rating Badge + Location */}
      <div className={styles.metaRow}>
        <div className={styles.ratingBadge}>
          <Star size={13} fill="#f59e0b" color="#f59e0b" />
          <span className={styles.ratingNumber}>{agent.rating.toFixed(1)}</span>
        </div>

        <div className={styles.location}>
          <MapPin size={14} className={styles.locationIcon} />
          <span>{primaryLocation}</span>
        </div>
      </div>

      {/* 3. Experience & Performance Stats */}
      <div className={styles.statsInfo}>
        <div className={styles.statLine}>
          <span className={styles.statBold}>{agent.salesCountLast12Months}</span>{" "}
          <span>{t.stats.sales}</span>
        </div>
        <div className={styles.statLine}>
          <span className={styles.statBold}>{agent.activeListingsCount}</span>{" "}
          <span>{t.stats.listings}</span>
          <span className={styles.statDot}>•</span>
          <span>{agent.reviewCount} {t.reviews}</span>
        </div>
      </div>

      {/* 4. Tags / Pills (Sub-cities & categories) */}
      <div className={styles.tagsRow}>
        {visibleTags.map((tag, idx) => (
          <span key={idx} className={styles.tagPill}>
            {tag}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className={`${styles.tagPill} ${styles.tagPillCount}`}>
            +{remainingCount}
          </span>
        )}
      </div>

      {/* 5. Footer: Price Range + Action Buttons */}
      <div className={styles.footerRow}>
        <div className={styles.priceCol}>
          <span className={styles.priceAmount}>
            {agent.priceRangeETB.min} - {agent.priceRangeETB.max} ETB
          </span>
          <span className={styles.priceLabel}>{t.priceRangeLabel}</span>
        </div>

        <div className={styles.actions}>
          <a
            href={`tel:+251${agent.phone}`}
            className={styles.callIconBtn}
            title={t.btnCall}
            aria-label={t.btnCall}
          >
            <Phone size={15} />
          </a>
          <button
            type="button"
            className={styles.bookBtn}
            onClick={() => onContactClick(agent)}
          >
            {t.btnBook}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
