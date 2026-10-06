"use client";

import React from "react";
import { Star, CheckCircle2, Mail, ExternalLink, TrendingUp, Home } from "lucide-react";
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
  const displayAreas = subCitiesList.slice(0, 3).join(", ");

  const salesText = t.salesHighlight
    ? t.salesHighlight.replace("{count}", agent.salesCountLast12Months.toString())
    : `${agent.salesCountLast12Months} sales (12 mo)`;

  const listingsText = t.listingsHighlight
    ? t.listingsHighlight.replace("{count}", agent.activeListingsCount.toString())
    : `${agent.activeListingsCount} listings`;

  return (
    <article className={styles.card}>
      {/* Top Header: Avatar + Verified Badge */}
      <div className={styles.topSection}>
        <div
          className={styles.avatarWrapper}
          onClick={() => onViewProfileClick(agent)}
          title={displayName}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onViewProfileClick(agent);
            }
          }}
        >
          <img
            src={agent.photoUrl}
            alt={displayName}
            className={styles.avatarImg}
          />
        </div>

        <div className={styles.nameSection}>
          <button
            type="button"
            className={styles.nameButton}
            onClick={() => onViewProfileClick(agent)}
          >
            <h3 className={styles.name}>{displayName}</h3>
          </button>

          {agent.isVerified && (
            <span className={styles.verifiedBadge}>
              <CheckCircle2 size={12} />
              <span>{t.verifiedBadge}</span>
            </span>
          )}
        </div>

        <p className={styles.agencyLocation}>
          <span className={styles.agencyName}>{displayAgency}</span>
          <span className={styles.areasText}>{displayAreas}</span>
        </p>
      </div>

      {/* Middle Section: Ratings & Key Highlight Chips */}
      <div className={styles.middleSection}>
        <div className={styles.ratingRow}>
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(agent.rating) ? "#f59e0b" : "none"}
                color="#f59e0b"
              />
            ))}
          </div>
          <span className={styles.ratingNumber}>
            {agent.rating.toFixed(1)}
          </span>
          <button
            type="button"
            className={styles.reviewCountBtn}
            onClick={() => onViewProfileClick(agent)}
            title="View reviews and full ratings"
          >
            ({agent.reviewCount} {t.reviews})
          </button>
        </div>

        <div className={styles.chipsRow}>
          <span className={styles.chip}>
            <TrendingUp size={12} color="var(--color-primary)" />
            <span>{salesText}</span>
          </span>
          <span className={styles.chip}>
            <Home size={12} color="var(--color-primary)" />
            <span>{listingsText}</span>
          </span>
        </div>
      </div>

      {/* Bottom Actions: View More & Contact Agent Side by Side */}
      <div className={styles.actionsRow}>
        <button
          type="button"
          className={styles.viewMoreBtn}
          onClick={() => onViewProfileClick(agent)}
        >
          <span>{t.btnViewMore || "View More"}</span>
          <ExternalLink size={13} />
        </button>

        <button
          type="button"
          className={styles.contactBtn}
          onClick={() => onContactClick(agent)}
        >
          <Mail size={14} />
          <span>{t.btnContact}</span>
        </button>
      </div>
    </article>
  );
};

export default AgentCard;
