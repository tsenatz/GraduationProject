"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  BookOpen,
  Clock,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  CheckSquare2,
  Share2,
  Check,
  ArrowRight,
} from "lucide-react";
import styles from "./SellerGuideModal.module.css";

export interface GuideArticleSection {
  heading: string;
  paragraphs: string[];
  callout?: {
    type: "tip" | "warning";
    title: string;
    message: string;
  };
  bullets?: string[];
}

export interface GuideArticle {
  id: string;
  category: string;
  readTime: string;
  title: string;
  excerpt: string;
  keyTakeaways: string[];
  sections: GuideArticleSection[];
  checklist?: string[];
  conclusion?: string;
}

export interface SellerGuideModalProps {
  guide: GuideArticle | null;
  isOpen: boolean;
  onClose: () => void;
  labels: {
    modalCloseBtn: string;
    keyTakeawaysLabel: string;
    checklistLabel: string;
    proTipLabel: string;
    warningLabel: string;
    ctaBoxTitle: string;
    ctaBoxDesc: string;
    ctaListBtn: string;
    ctaAgentBtn: string;
  };
}

export function SellerGuideModal({
  guide,
  isOpen,
  onClose,
  labels,
}: SellerGuideModalProps) {
  const [copied, setCopied] = useState(false);

  // Close on Escape key press
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

  if (!isOpen || !guide) return null;

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
      }
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div
        className={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-article-title"
      >
        {/* Top Sticky Bar */}
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <span className={styles.categoryBadge}>
              <BookOpen size={13} aria-hidden="true" />
              <span>{guide.category}</span>
            </span>

            <span className={styles.readTimePill}>
              <Clock size={12} aria-hidden="true" />
              <span>{guide.readTime}</span>
            </span>
          </div>

          <div className={styles.topBarRight}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={handleShare}
              title="Share article link"
              aria-label="Share article"
            >
              {copied ? <Check size={16} color="#10b981" /> : <Share2 size={16} />}
            </button>

            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label={labels.modalCloseBtn}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className={styles.scrollContent}>
          {/* Article Header */}
          <header className={styles.articleHeader}>
            <h1 id="guide-article-title" className={styles.articleTitle}>
              {guide.title}
            </h1>
            <p className={styles.articleExcerpt}>{guide.excerpt}</p>
          </header>

          {/* Key Takeaways Box */}
          {guide.keyTakeaways && guide.keyTakeaways.length > 0 && (
            <div className={styles.takeawaysBox}>
              <h2 className={styles.takeawaysHeading}>
                <CheckCircle2 size={18} aria-hidden="true" />
                <span>{labels.keyTakeawaysLabel}</span>
              </h2>
              <ul className={styles.takeawaysList}>
                {guide.keyTakeaways.map((item, idx) => (
                  <li key={idx} className={styles.takeawayItem}>
                    <CheckCircle2 size={16} className={styles.checkIcon} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Body Sections */}
          <div className={styles.sectionsContainer}>
            {guide.sections.map((section, sIdx) => (
              <section key={sIdx} className={styles.sectionBlock}>
                <h2 className={styles.sectionHeading}>{section.heading}</h2>

                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className={styles.paragraph}>
                    {p}
                  </p>
                ))}

                {/* Optional Callout (Tip or Warning) */}
                {section.callout && (
                  <div
                    className={
                      section.callout.type === "warning"
                        ? styles.calloutWarning
                        : styles.calloutTip
                    }
                  >
                    <div className={styles.calloutIcon}>
                      {section.callout.type === "warning" ? (
                        <AlertTriangle size={18} aria-hidden="true" />
                      ) : (
                        <Lightbulb size={18} aria-hidden="true" />
                      )}
                    </div>
                    <div className={styles.calloutContent}>
                      <h3 className={styles.calloutTitle}>
                        {section.callout.title}
                      </h3>
                      <p className={styles.calloutMessage}>
                        {section.callout.message}
                      </p>
                    </div>
                  </div>
                )}

                {/* Optional Bullets */}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className={styles.bulletsList}>
                    {section.bullets.map((b, bIdx) => (
                      <li key={bIdx} className={styles.bulletItem}>
                        <span className={styles.bulletDot} aria-hidden="true" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Actionable Checklist */}
          {guide.checklist && guide.checklist.length > 0 && (
            <div className={styles.checklistCard}>
              <h3 className={styles.checklistTitle}>
                <CheckSquare2 size={18} color="#0a1931" aria-hidden="true" />
                <span>{labels.checklistLabel}</span>
              </h3>
              <ul className={styles.checklistItems}>
                {guide.checklist.map((item, cIdx) => (
                  <li key={cIdx} className={styles.checklistItem}>
                    <CheckCircle2 size={16} className={styles.checklistCheckIcon} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Conclusion */}
          {guide.conclusion && (
            <div className={styles.conclusionBox}>
              <p style={{ margin: 0 }}>{guide.conclusion}</p>
            </div>
          )}

          {/* Next Steps CTA Card */}
          <div className={styles.ctaBox}>
            <h3 className={styles.ctaTitle}>{labels.ctaBoxTitle}</h3>
            <p className={styles.ctaDesc}>{labels.ctaBoxDesc}</p>
            <div className={styles.ctaButtons}>
              <Link href="/sell/list" className={styles.ctaPrimaryBtn} onClick={onClose}>
                <span>{labels.ctaListBtn}</span>
                <ArrowRight size={15} />
              </Link>
              <Link href="/sell/agent" className={styles.ctaSecondaryBtn} onClick={onClose}>
                <span>{labels.ctaAgentBtn}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerGuideModal;
