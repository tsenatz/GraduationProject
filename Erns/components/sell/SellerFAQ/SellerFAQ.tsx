"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useSellLanguage } from "../LanguageContext";
import styles from "./SellerFAQ.module.css";

export function SellerFAQ() {
  const { t } = useSellLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.section} aria-label="Frequently asked questions">
      <div className={styles.header}>
        <h2 className={styles.title}>{t.faq.title}</h2>
        <p className={styles.subtitle}>{t.faq.subtitle}</p>
      </div>

      <div className={styles.faqList}>
        {t.faq.items.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}
            >
              <button
                type="button"
                className={styles.questionButton}
                onClick={() => toggleFaq(index)}
                aria-expanded={isOpen}
              >
                <span className={styles.questionText}>{faq.q}</span>
                <ChevronDown
                  size={20}
                  className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                  aria-hidden="true"
                />
              </button>

              {isOpen && (
                <div className={styles.answerWrapper}>
                  <p style={{ margin: 0 }}>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
