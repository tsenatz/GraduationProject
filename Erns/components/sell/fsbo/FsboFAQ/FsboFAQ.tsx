"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations } from "@/components/sell/translations";
import styles from "./FsboFAQ.module.css";

export const FsboFAQ: React.FC = () => {
  const { isAmharic } = useLanguage();
  const t = translations[isAmharic ? "am" : "en"].fsbo.faq;

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t.title}</h2>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </div>

        <div className={styles.accordionList}>
          {t.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`${styles.accordionItem} ${
                  isOpen ? styles.accordionItemOpen : ""
                }`}
              >
                <button
                  type="button"
                  className={styles.accordionTrigger}
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                >
                  <h3 className={styles.question}>{item.q}</h3>
                  <div
                    className={`${styles.iconWrapper} ${
                      isOpen ? styles.iconWrapperOpen : ""
                    }`}
                  >
                    <ChevronDown size={20} />
                  </div>
                </button>

                {isOpen && (
                  <div className={styles.accordionContent}>
                    <p className={styles.answer}>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FsboFAQ;
