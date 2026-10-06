"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, UserCheck2, FileBadge, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { agentTranslations } from "../translations";
import styles from "./WhyVerifiedAgent.module.css";

const icons = [TrendingUp, UserCheck2, FileBadge];

export const WhyVerifiedAgent: React.FC = () => {
  const { isAmharic } = useLanguage();
  const t = agentTranslations[isAmharic ? "am" : "en"].whyVerified;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t.title}</h2>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </div>

        <div className={styles.grid}>
          {t.cards.map((card, idx) => {
            const IconComp = icons[idx % icons.length];
            return (
              <div key={idx} className={styles.card}>
                <div className={styles.iconWrapper}>
                  <IconComp size={26} />
                </div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.desc}</p>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link
            href="/sell/agent/apply"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--color-primary, #0a1931)",
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "1px solid var(--color-accent, #4a7fa7)",
              backgroundColor: "rgba(74, 127, 167, 0.05)",
              transition: "all 0.2s ease",
            }}
          >
            <span>
              {isAmharic
                ? "የተረጋገጠ ወኪል ለመሆን ማመልከት ይፈልጋሉ? መስፈርቶችን ይመልከቱ"
                : "Want to become a verified agent? Review requirements & apply"}
            </span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyVerifiedAgent;
