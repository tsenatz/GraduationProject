"use client";

import React, { useState } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import { useSellLanguage } from "../LanguageContext";
import { SellerGuideModal } from "./SellerGuideModal";
import styles from "./GuidesRow.module.css";

export function GuidesRow() {
  const { t } = useSellLanguage();
  const [selectedGuide, setSelectedGuide] = useState<any | null>(null);

  const handleOpenGuide = (guide: any) => {
    setSelectedGuide(guide);
  };

  const handleCloseGuide = () => {
    setSelectedGuide(null);
  };

  return (
    <>
      <section className={styles.section} aria-label="Seller guides and resources">
        <div className={styles.header}>
          <h2 className={styles.title}>{t.guides.title}</h2>
          <p className={styles.subtitle}>{t.guides.subtitle}</p>
        </div>

        <div className={styles.grid}>
          {t.guides.items.map((guide, idx) => (
            <article
              key={idx}
              className={styles.card}
              tabIndex={0}
              role="button"
              aria-label={`${t.guides.readGuideBtn || "Read"}: ${guide.title}`}
              onClick={() => handleOpenGuide(guide)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleOpenGuide(guide);
                }
              }}
            >
              <div>
                <span className={styles.badge}>
                  <BookOpen size={13} style={{ marginRight: "4px" }} aria-hidden="true" />
                  {guide.category}
                </span>
                <h3 className={styles.cardTitle}>{guide.title}</h3>
                <p className={styles.cardExcerpt}>{guide.excerpt}</p>
              </div>

              <div className={styles.readMore}>
                <span>{t.guides.readGuideBtn || "Read Full Guide"}</span>
                <ArrowRight size={15} aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Interactive Seller Guide Article Modal */}
      {selectedGuide && (
        <SellerGuideModal
          isOpen={!!selectedGuide}
          guide={selectedGuide}
          onClose={handleCloseGuide}
          labels={{
            modalCloseBtn: t.guides.modalCloseBtn || "Close Guide",
            keyTakeawaysLabel: t.guides.keyTakeawaysLabel || "Key Takeaways",
            checklistLabel: t.guides.checklistLabel || "Actionable Checklist",
            proTipLabel: t.guides.proTipLabel || "Pro Tip",
            warningLabel: t.guides.warningLabel || "Important Warning",
            ctaBoxTitle: t.guides.ctaBoxTitle || "Ready to take the next step?",
            ctaBoxDesc: t.guides.ctaBoxDesc || "Put these insights into action with ERNS verified tools.",
            ctaListBtn: t.guides.ctaListBtn || "List Your Property for Free",
            ctaAgentBtn: t.guides.ctaAgentBtn || "Connect with an Expert Agent",
          }}
        />
      )}
    </>
  );
}
