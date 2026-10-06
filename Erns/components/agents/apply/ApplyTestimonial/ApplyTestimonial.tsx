"use client";

import React from "react";
import { Star, TrendingUp } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { applyTranslations } from "../applyTranslations";
import styles from "./ApplyTestimonial.module.css";

export const ApplyTestimonial: React.FC = () => {
  const { isAmharic } = useLanguage();
  const t = applyTranslations[isAmharic ? "am" : "en"].testimonial;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.quoteIcon}>“</div>
          <p className={styles.quote}>“{t.quote}”</p>

          <div className={styles.authorRow}>
            <div className={styles.authorInfo}>
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                alt={t.author}
                className={styles.avatar}
              />
              <div>
                <h4 className={styles.name}>{t.author}</h4>
                <p className={styles.agency}>{t.agency}</p>
              </div>
            </div>

            <div className={styles.metrics}>
              <div className={styles.metricBadge}>
                <TrendingUp size={14} color="#10b981" />
                <span>{t.salesMetric}</span>
              </div>
              <div className={styles.metricBadge}>
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <span>{t.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplyTestimonial;
