"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import { useSellLanguage } from "../LanguageContext";
import styles from "./GuidesRow.module.css";

export function GuidesRow() {
  const { t } = useSellLanguage();

  return (
    <section className={styles.section} aria-label="Seller guides and resources">
      <div className={styles.header}>
        <h2 className={styles.title}>{t.guides.title}</h2>
        <p className={styles.subtitle}>{t.guides.subtitle}</p>
      </div>

      <div className={styles.grid}>
        {t.guides.items.map((guide, idx) => (
          <article key={idx} className={styles.card}>
            <div>
              <span className={styles.badge}>
                <BookOpen size={13} style={{ marginRight: "4px" }} aria-hidden="true" />
                {guide.category}
              </span>
              <h3 className={styles.cardTitle}>{guide.title}</h3>
              <p className={styles.cardExcerpt}>{guide.excerpt}</p>
            </div>

            <div className={styles.readMore}>
              <span>{t.guides.comingSoon}</span>
              <ArrowRight size={15} aria-hidden="true" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
